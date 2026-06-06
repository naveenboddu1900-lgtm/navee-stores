# CollabSpace

A production-shaped real-time collaborative workspace covering the Week 1 and
Week 2 project scope, with the Socket.IO synchronization foundation included.

## Included

- React 19 and Vite frontend with responsive workspace navigation
- JWT registration/login and protected API requests
- Workspace creation, settings API, memberships, and invitation tokens
- Boards, lists, and cards with full CRUD APIs
- Optimistic drag-and-drop between Kanban lists
- Card details: description, priority, labels, assignee, and due date
- Authenticated Socket.IO board rooms and live mutation broadcasts
- MongoDB models and indexes with Mongoose
- Helmet, CORS, Zod request validation, and centralized errors

## Run locally

1. Copy `.env.example` to `.env`.
2. Start a local MongoDB instance or set `MONGODB_URI` to MongoDB Atlas.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Add sample data:

   ```bash
   npm run seed
   ```

5. Start both applications:

   ```bash
   npm run dev
   ```

Open `http://localhost:5173`. The seeded login is:

- Email: `demo@collabspace.dev`
- Password: `password123`

## API overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET|POST /api/workspaces`
- `GET|PATCH /api/workspaces/:workspaceId`
- `POST /api/workspaces/:workspaceId/invitations`
- `POST /api/workspaces/invitations/:token/accept`
- `POST /api/workspaces/:workspaceId/boards`
- `GET /api/boards/:boardId`
- `POST|PATCH|DELETE /api/boards/:boardId/lists`
- `POST|PATCH|DELETE /api/boards/:boardId/cards`
- `PUT /api/boards/:boardId/reorder`

## Production notes

For deployment, use separate frontend and backend services. Set the frontend
environment variables to the public API and Socket.IO URL, set `CLIENT_URL` on
the backend to the deployed frontend origin, and use a strong `JWT_SECRET`.
MongoDB Atlas works without code changes.
