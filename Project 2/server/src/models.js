import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true, select: false },
    avatarColor: { type: String, default: "#6d5dfc" },
  },
  { timestamps: true },
);

const workspaceSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: "", maxlength: 500 },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        role: {
          type: String,
          enum: ["owner", "admin", "member"],
          default: "member",
        },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

const invitationSchema = new Schema(
  {
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    email: { type: String, required: true, lowercase: true, trim: true },
    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
    },
    token: { type: String, required: true, unique: true },
    invitedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    expiresAt: { type: Date, required: true },
    acceptedAt: Date,
  },
  { timestamps: true },
);

const boardSchema = new Schema(
  {
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, default: "", maxlength: 500 },
    color: { type: String, default: "#6d5dfc" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

const listSchema = new Schema(
  {
    board: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 80 },
    order: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
);

const cardSchema = new Schema(
  {
    board: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      required: true,
      index: true,
    },
    list: {
      type: Schema.Types.ObjectId,
      ref: "List",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, default: "", maxlength: 5000 },
    order: { type: Number, required: true, default: 0 },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    labels: [{ type: String, trim: true, maxlength: 30 }],
    dueDate: Date,
    assignee: { type: Schema.Types.ObjectId, ref: "User", default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

listSchema.index({ board: 1, order: 1 });
cardSchema.index({ list: 1, order: 1 });
invitationSchema.index({ workspace: 1, email: 1, acceptedAt: 1 });

export const User = model("User", userSchema);
export const Workspace = model("Workspace", workspaceSchema);
export const Invitation = model("Invitation", invitationSchema);
export const Board = model("Board", boardSchema);
export const List = model("List", listSchema);
export const Card = model("Card", cardSchema);
