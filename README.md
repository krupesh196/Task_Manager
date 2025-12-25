# Task_Manager

# start frontend
cd client
npm run dev

# start backend
cd server
npm start

## Local development (recommended)

1. Copy example env files and fill in secrets:

 - `server/.env.example` -> `server/.env`
 - `client/.env.example` -> `client/.env`

2. Start the backend (in one terminal):

```powershell
cd "C:\Users\User\OneDrive\Desktop\Task Manager\server"
npm install
npm run start
```

3. Start the frontend (in another terminal):

```powershell
cd "C:\Users\User\OneDrive\Desktop\Task Manager\client"
npm install
npm run dev -- --host
```

4. Open the app in your browser:
 - Frontend: http://localhost:3000/ (or the URL printed by Vite)
 - Backend API: http://localhost:8800/

## Troubleshooting

- If the frontend cannot reach the backend, ensure `VITE_APP_BASE_URL` in `client/.env` matches your backend URL (e.g., `http://localhost:8800`).
- If you see CORS errors, confirm the backend `server/index.js` `cors.origin` includes your frontend origin used by Vite (check `localhost` port).
- For database errors, ensure `MONGODB_URL` in `server/.env` is valid and the database is accessible from your network.
- If Vite shows a large bundle warning, consider lazy-loading heavy components or configuring `build.rollupOptions.output.manualChunks`.

## Netlify (production) notes

- The repo includes `netlify.toml` which builds the `client` subfolder and publishes `dist`.
- To set build-time environment variables (for production builds) go to the Netlify site settings → Build & deploy → Environment and add the `VITE_` variables (or use the Netlify CLI/API).
- Example production env vars to set on Netlify:

```
VITE_APP_BASE_URL=https://krupesh-task-manager-server.onrender.com
VITE_APP_FIREBASE_API_KEY=<your_firebase_api_key>
```

- After changing environment variables in Netlify, trigger a new deploy from the Netlify UI or push a new commit to this repository.

