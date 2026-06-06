import { Router } from "express";
import { z } from "zod";
import { Board, Card, List } from "../models.js";
import {
  HttpError,
  authenticate,
  loadBoardForMember,
  validate,
} from "../middleware.js";

const router = Router();
router.use(authenticate);

const listSchema = z.object({
  title: z.string().trim().min(1).max(80),
});

const cardSchema = z.object({
  listId: z.string().min(1),
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(5000).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  labels: z.array(z.string().trim().max(30)).max(8).optional(),
  dueDate: z.string().datetime().nullable().optional(),
  assignee: z.string().nullable().optional(),
});

router.get("/:boardId", loadBoardForMember, async (req, res, next) => {
  try {
    const [lists, cards] = await Promise.all([
      List.find({ board: req.board._id }).sort({ order: 1 }),
      Card.find({ board: req.board._id })
        .populate("assignee", "name email avatarColor")
        .sort({ order: 1 }),
    ]);
    res.json({ board: req.board, lists, cards });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/:boardId/lists",
  loadBoardForMember,
  validate(listSchema),
  async (req, res, next) => {
    try {
      const count = await List.countDocuments({ board: req.board._id });
      const list = await List.create({
        board: req.board._id,
        title: req.validated.title,
        order: count,
      });
      emit(req, "list:created", { list });
      res.status(201).json({ list });
    } catch (error) {
      next(error);
    }
  },
);

router.patch(
  "/:boardId/lists/:listId",
  loadBoardForMember,
  validate(listSchema.partial()),
  async (req, res, next) => {
    try {
      const list = await List.findOneAndUpdate(
        { _id: req.params.listId, board: req.board._id },
        req.validated,
        { new: true },
      );
      if (!list) throw new HttpError(404, "List not found");
      emit(req, "list:updated", { list });
      res.json({ list });
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  "/:boardId/lists/:listId",
  loadBoardForMember,
  async (req, res, next) => {
    try {
      const list = await List.findOneAndDelete({
        _id: req.params.listId,
        board: req.board._id,
      });
      if (!list) throw new HttpError(404, "List not found");
      await Card.deleteMany({ list: list._id });
      emit(req, "list:deleted", { listId: list.id });
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  "/:boardId/cards",
  loadBoardForMember,
  validate(cardSchema),
  async (req, res, next) => {
    try {
      const list = await List.findOne({
        _id: req.validated.listId,
        board: req.board._id,
      });
      if (!list) throw new HttpError(404, "List not found");
      const count = await Card.countDocuments({ list: list._id });
      const card = await Card.create({
        ...req.validated,
        list: list._id,
        board: req.board._id,
        order: count,
        createdBy: req.user._id,
      });
      await card.populate("assignee", "name email avatarColor");
      emit(req, "card:created", { card });
      res.status(201).json({ card });
    } catch (error) {
      next(error);
    }
  },
);

router.patch(
  "/:boardId/cards/:cardId",
  loadBoardForMember,
  validate(cardSchema.partial().omit({ listId: true })),
  async (req, res, next) => {
    try {
      const card = await Card.findOneAndUpdate(
        { _id: req.params.cardId, board: req.board._id },
        req.validated,
        { new: true, runValidators: true },
      ).populate("assignee", "name email avatarColor");
      if (!card) throw new HttpError(404, "Card not found");
      emit(req, "card:updated", { card });
      res.json({ card });
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  "/:boardId/cards/:cardId",
  loadBoardForMember,
  async (req, res, next) => {
    try {
      const card = await Card.findOneAndDelete({
        _id: req.params.cardId,
        board: req.board._id,
      });
      if (!card) throw new HttpError(404, "Card not found");
      emit(req, "card:deleted", { cardId: card.id });
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  },
);

router.put(
  "/:boardId/reorder",
  loadBoardForMember,
  validate(
    z.object({
      lists: z
        .array(
          z.object({
            id: z.string(),
            order: z.number().int().nonnegative(),
          }),
        )
        .optional(),
      cards: z
        .array(
          z.object({
            id: z.string(),
            listId: z.string(),
            order: z.number().int().nonnegative(),
          }),
        )
        .optional(),
    }),
  ),
  async (req, res, next) => {
    try {
      const { lists = [], cards = [] } = req.validated;
      await Promise.all([
        lists.length
          ? List.bulkWrite(
              lists.map((list) => ({
                updateOne: {
                  filter: { _id: list.id, board: req.board._id },
                  update: { order: list.order },
                },
              })),
            )
          : Promise.resolve(),
        cards.length
          ? Card.bulkWrite(
              cards.map((card) => ({
                updateOne: {
                  filter: { _id: card.id, board: req.board._id },
                  update: { list: card.listId, order: card.order },
                },
              })),
            )
          : Promise.resolve(),
      ]);
      const payload = { lists, cards, actorId: req.user.id };
      emit(req, "board:reordered", payload);
      res.json(payload);
    } catch (error) {
      next(error);
    }
  },
);

function emit(req, event, payload) {
  req.app.get("io")?.to(`board:${req.board.id}`).emit(event, payload);
}

export default router;
