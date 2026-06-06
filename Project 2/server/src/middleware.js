import jwt from "jsonwebtoken";
import { ZodError } from "zod";
import { config } from "./config.js";
import { User, Workspace, Board } from "./models.js";

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function signToken(userId) {
  return jwt.sign({ sub: userId }, config.jwtSecret, { expiresIn: "7d" });
}

export async function authenticate(req, _res, next) {
  try {
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
    if (!token) throw new HttpError(401, "Authentication required");
    const payload = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(payload.sub);
    if (!user) throw new HttpError(401, "Account no longer exists");
    req.user = user;
    next();
  } catch (error) {
    next(
      error instanceof HttpError
        ? error
        : new HttpError(401, "Invalid or expired token"),
    );
  }
}

export async function requireWorkspaceMember(req, _res, next) {
  try {
    const workspaceId = req.params.workspaceId || req.body.workspaceId;
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      "members.user": req.user._id,
    });
    if (!workspace) throw new HttpError(403, "Workspace access denied");
    req.workspace = workspace;
    next();
  } catch (error) {
    next(error);
  }
}

export async function loadBoardForMember(req, _res, next) {
  try {
    const boardId = req.params.boardId;
    const board = await Board.findById(boardId);
    if (!board) throw new HttpError(404, "Board not found");
    const workspace = await Workspace.findOne({
      _id: board.workspace,
      "members.user": req.user._id,
    });
    if (!workspace) throw new HttpError(403, "Board access denied");
    req.board = board;
    req.workspace = workspace;
    next();
  } catch (error) {
    next(error);
  }
}

export function validate(schema) {
  return (req, _res, next) => {
    try {
      req.validated = schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function notFound(_req, _res, next) {
  next(new HttpError(404, "Route not found"));
}

export function errorHandler(error, _req, res, _next) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed",
      issues: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  if (error?.code === 11000) {
    return res.status(409).json({ message: "That value is already in use" });
  }

  const status = error.status || 500;
  if (status === 500) console.error(error);
  return res
    .status(status)
    .json({ message: status === 500 ? "Internal server error" : error.message });
}
