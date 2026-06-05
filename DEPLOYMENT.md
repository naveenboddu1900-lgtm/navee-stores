# NAVEE Stores Deployment

## Backend on Render

1. Push this project to GitHub.
2. Create a Render Web Service from the repository.
3. Use:
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`
4. Add environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLIENT_URL`
   - `PORT=5000`

## Frontend on Vercel

1. Create a Vercel project from the same repository.
2. Use:
   - Root directory: `frontend`
   - Build command: `npm run build`
   - Output directory: `dist`
3. Add:
   - `VITE_API_URL=https://your-backend-domain/api`

## Local Production Check

```powershell
cd "C:\Users\BODDU\Projects\NAVEE Stores\frontend"
cmd /c npm run build

cd "C:\Users\BODDU\Projects\NAVEE Stores\backend"
cmd /c npm start
```

## Local Development Check

```powershell
cd "C:\Users\BODDU\Projects\NAVEE Stores"
cmd /c npm run dev
```

Open `http://localhost:5173`. The frontend proxies `/api` to `http://127.0.0.1:5000`, and the dev starter waits for backend health before launching the frontend.

## Notes

Without `MONGO_URI`, the backend runs demo data in memory. For real deployment, use MongoDB Atlas.
