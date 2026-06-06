import jwt from "jsonwebtoken";
import { config } from "./config.js";
import { Board, User, Workspace } from "./models.js";

export function configureSockets(io) {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      const payload = jwt.verify(token, config.jwtSecret);
      const user = await User.findById(payload.sub);
      if (!user) throw new Error("Unauthorized");
      socket.user = user;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("board:join", async (boardId, acknowledge = () => {}) => {
      try {
        const board = await Board.findById(boardId);
        if (!board) throw new Error("Board not found");
        const allowed = await Workspace.exists({
          _id: board.workspace,
          "members.user": socket.user._id,
        });
        if (!allowed) throw new Error("Board access denied");
        await socket.join(`board:${boardId}`);
        acknowledge({ ok: true });
      } catch (error) {
        acknowledge({ ok: false, message: error.message });
      }
    });

    socket.on("board:leave", (boardId) => {
      socket.leave(`board:${boardId}`);
    });
  });
}
