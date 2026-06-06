import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDatabase } from "./db.js";
import { Board, Card, List, User, Workspace } from "./models.js";

async function seed() {
  await connectDatabase();
  await Promise.all([
    Card.deleteMany({}),
    List.deleteMany({}),
    Board.deleteMany({}),
    Workspace.deleteMany({}),
    User.deleteMany({ email: "demo@collabspace.dev" }),
  ]);

  const user = await User.create({
    name: "Alex Morgan",
    email: "demo@collabspace.dev",
    passwordHash: await bcrypt.hash("password123", 12),
    avatarColor: "#6d5dfc",
  });
  const workspace = await Workspace.create({
    name: "Northstar Product",
    slug: "northstar-product",
    description: "A focused home for the product and engineering team.",
    owner: user._id,
    members: [{ user: user._id, role: "owner" }],
  });
  const board = await Board.create({
    workspace: workspace._id,
    name: "Website Redesign",
    description: "June product sprint",
    createdBy: user._id,
  });
  const lists = await List.insertMany(
    ["Backlog", "In progress", "Review", "Done"].map((title, order) => ({
      board: board._id,
      title,
      order,
    })),
  );
  const samples = [
    {
      list: 0,
      title: "Map the onboarding journey",
      priority: "high",
      labels: ["Research", "UX"],
    },
    {
      list: 0,
      title: "Define analytics events",
      priority: "medium",
      labels: ["Data"],
    },
    {
      list: 1,
      title: "Build responsive dashboard shell",
      priority: "urgent",
      labels: ["Frontend"],
    },
    {
      list: 1,
      title: "Create workspace API",
      priority: "high",
      labels: ["Backend"],
    },
    {
      list: 2,
      title: "Review empty states and error copy",
      priority: "low",
      labels: ["Content"],
    },
    {
      list: 3,
      title: "Agree on sprint outcomes",
      priority: "medium",
      labels: ["Planning"],
    },
  ];
  await Card.insertMany(
    samples.map((sample, order) => ({
      board: board._id,
      list: lists[sample.list]._id,
      title: sample.title,
      priority: sample.priority,
      labels: sample.labels,
      order,
      createdBy: user._id,
      assignee: user._id,
    })),
  );
  console.log("Seed complete: demo@collabspace.dev / password123");
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
