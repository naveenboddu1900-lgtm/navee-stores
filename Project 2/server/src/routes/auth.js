import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { User } from "../models.js";
import {
  HttpError,
  authenticate,
  signToken,
  validate,
} from "../middleware.js";

const router = Router();

const credentialsSchema = z.object({
  email: z.string().email().transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(100),
});

router.post(
  "/register",
  validate(
    credentialsSchema.extend({
      name: z.string().trim().min(2).max(80),
    }),
  ),
  async (req, res, next) => {
    try {
      const { name, email, password } = req.validated;
      if (await User.exists({ email })) {
        throw new HttpError(409, "An account with that email already exists");
      }
      const user = await User.create({
        name,
        email,
        passwordHash: await bcrypt.hash(password, 12),
      });
      res.status(201).json({
        token: signToken(user.id),
        user: serializeUser(user),
      });
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  "/login",
  validate(credentialsSchema),
  async (req, res, next) => {
    try {
      const { email, password } = req.validated;
      const user = await User.findOne({ email }).select("+passwordHash");
      if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        throw new HttpError(401, "Email or password is incorrect");
      }
      res.json({ token: signToken(user.id), user: serializeUser(user) });
    } catch (error) {
      next(error);
    }
  },
);

router.get("/me", authenticate, (req, res) => {
  res.json({ user: serializeUser(req.user) });
});

function serializeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarColor: user.avatarColor,
  };
}

export default router;
