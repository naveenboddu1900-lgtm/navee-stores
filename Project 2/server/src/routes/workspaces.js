import { randomBytes } from "node:crypto";
import { Router } from "express";
import { z } from "zod";
import { Board, Invitation, Workspace } from "../models.js";
import {
  HttpError,
  authenticate,
  requireWorkspaceMember,
  validate,
} from "../middleware.js";

const router = Router();
router.use(authenticate);

const workspaceSchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().max(500).optional().default(""),
});

router.get("/", async (req, res, next) => {
  try {
    const workspaces = await Workspace.find({ "members.user": req.user._id })
      .populate("members.user", "name email avatarColor")
      .sort({ updatedAt: -1 });
    res.json({ workspaces });
  } catch (error) {
    next(error);
  }
});

router.post("/", validate(workspaceSchema), async (req, res, next) => {
  try {
    const slugBase = req.validated.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const workspace = await Workspace.create({
      ...req.validated,
      slug: `${slugBase}-${randomBytes(3).toString("hex")}`,
      owner: req.user._id,
      members: [{ user: req.user._id, role: "owner" }],
    });
    const board = await Board.create({
      workspace: workspace._id,
      name: "Product Sprint",
      description: "Plan, prioritize, and ship the next iteration.",
      createdBy: req.user._id,
    });
    res.status(201).json({ workspace, board });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:workspaceId",
  requireWorkspaceMember,
  async (req, res, next) => {
    try {
      await req.workspace.populate("members.user", "name email avatarColor");
      const boards = await Board.find({ workspace: req.workspace._id }).sort({
        updatedAt: -1,
      });
      res.json({ workspace: req.workspace, boards });
    } catch (error) {
      next(error);
    }
  },
);

router.patch(
  "/:workspaceId",
  requireWorkspaceMember,
  validate(workspaceSchema.partial()),
  async (req, res, next) => {
    try {
      const membership = req.workspace.members.find(
        (member) => member.user.toString() === req.user.id,
      );
      if (!["owner", "admin"].includes(membership.role)) {
        throw new HttpError(403, "Admin access required");
      }
      Object.assign(req.workspace, req.validated);
      await req.workspace.save();
      res.json({ workspace: req.workspace });
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  "/:workspaceId/boards",
  requireWorkspaceMember,
  validate(
    z.object({
      name: z.string().trim().min(1).max(100),
      description: z.string().trim().max(500).optional().default(""),
    }),
  ),
  async (req, res, next) => {
    try {
      const board = await Board.create({
        ...req.validated,
        workspace: req.workspace._id,
        createdBy: req.user._id,
      });
      res.status(201).json({ board });
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  "/:workspaceId/invitations",
  requireWorkspaceMember,
  validate(
    z.object({
      email: z.string().email().transform((value) => value.toLowerCase()),
      role: z.enum(["admin", "member"]).default("member"),
    }),
  ),
  async (req, res, next) => {
    try {
      const membership = req.workspace.members.find(
        (member) => member.user.toString() === req.user.id,
      );
      if (!["owner", "admin"].includes(membership.role)) {
        throw new HttpError(403, "Admin access required");
      }
      const invitation = await Invitation.create({
        workspace: req.workspace._id,
        email: req.validated.email,
        role: req.validated.role,
        token: randomBytes(24).toString("hex"),
        invitedBy: req.user._id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      res.status(201).json({
        invitation: {
          id: invitation.id,
          email: invitation.email,
          role: invitation.role,
          token: invitation.token,
          expiresAt: invitation.expiresAt,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  "/invitations/:token/accept",
  async (req, res, next) => {
    try {
      const invitation = await Invitation.findOne({
        token: req.params.token,
        acceptedAt: null,
        expiresAt: { $gt: new Date() },
      });
      if (!invitation) throw new HttpError(404, "Invitation is invalid or expired");
      if (invitation.email !== req.user.email) {
        throw new HttpError(403, "This invitation belongs to another email");
      }
      await Workspace.updateOne(
        { _id: invitation.workspace, "members.user": { $ne: req.user._id } },
        {
          $push: {
            members: { user: req.user._id, role: invitation.role },
          },
        },
      );
      invitation.acceptedAt = new Date();
      await invitation.save();
      res.json({ workspaceId: invitation.workspace });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
