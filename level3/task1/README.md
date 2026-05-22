# Level 3 – Task 1: Full-Stack MERN Application

A complete **MERN** (MongoDB, Express, React, Node.js) application: user authentication with JWT plus a per-user product management dashboard.

## Features
- **Backend**: Express REST API with JWT authentication (HTTP-only cookies), bcrypt password hashing, MongoDB persistence via Mongoose, protected product routes.
- **Frontend**: React (Vite) with **React Router** for navigation (Login, Sign up, Dashboard), auth context, and protected routes.
- **Products are scoped per user**: each authenticated user only sees and manages their own products.
- Loading and error states on every API call.

## Project Structure
```
task1/
├── server/                 Express API
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   ├── models/             User.js, Product.js
│   ├── controllers/        authController.js, productController.js
│   ├── routes/             auth.js, products.js
│   └── middleware/         auth.js, errorHandler.js
└── client/                 React + Vite frontend
    ├── index.html
    ├── vite.config.js
    ├── package.json
    ├── .env.example
    └── src/
        ├── main.jsx
        ├── App.jsx / App.css / index.css
        ├── api.js
        ├── AuthContext.jsx
        ├── components/     Navbar.jsx, ProtectedRoute.jsx
        └── pages/          Login.jsx, Signup.jsx, Dashboard.jsx
```

## Setup

### 1. Backend
```powershell
cd level3/task1/server
npm install
Copy-Item .env.example .env
code .env
```
Fill in your Atlas URI and a JWT secret:
```
PORT=5003
MONGODB_URI=<your atlas connection string>
JWT_SECRET=<long random string>
JWT_EXPIRES_IN=1d
CLIENT_ORIGIN=http://localhost:5174
NODE_ENV=development
```

Generate a JWT secret quickly:
```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Run the backend:
```powershell
npm run dev
```
API at http://localhost:5003.

### 2. Frontend
```powershell
cd ../client
npm install
Copy-Item .env.example .env
npm run dev
```
App at http://localhost:5174.

## How to Use

1. Open http://localhost:5174.
2. Click **Sign up** and create an account. You'll be redirected to the dashboard.
3. Add products with name, description, price, and stock.
4. Edit or delete products from the grid.
5. Log out from the navbar. Log back in to see your products persist.

Open a second browser (or incognito), sign up as a different user — you'll see they have a completely separate product list.

## API Reference (Backend)

| Method | Endpoint                | Auth      | Description                  |
|--------|-------------------------|-----------|------------------------------|
| POST   | `/api/auth/signup`      | Public    | Create account, returns JWT  |
| POST   | `/api/auth/login`       | Public    | Log in, returns JWT          |
| POST   | `/api/auth/logout`      | Public    | Clear auth cookie            |
| GET    | `/api/auth/me`          | Required  | Get current user             |
| GET    | `/api/products`         | Required  | List **your** products       |
| GET    | `/api/products/:id`     | Required  | Get one of your products     |
| POST   | `/api/products`         | Required  | Create a product             |
| PUT    | `/api/products/:id`     | Required  | Update a product             |
| DELETE | `/api/products/:id`     | Required  | Delete a product             |

## Deployment Notes

### Backend (e.g. Render or Railway)
1. Push the `server/` folder (or this whole repo) to GitHub.
2. Create a new Web Service, point it at the `server/` directory.
3. Build command: `npm install`; start command: `npm start`.
4. Set environment variables:
   - `MONGODB_URI` – production Atlas URI
   - `JWT_SECRET` – different, long random string
   - `JWT_EXPIRES_IN=1d`
   - `CLIENT_ORIGIN` – your deployed frontend URL
   - `NODE_ENV=production`
5. Atlas → Network Access → allow the platform's IP (or `0.0.0.0/0`).

### Frontend (e.g. Vercel or Netlify)
1. Build command: `npm run build`; output: `dist/`.
2. Set `VITE_API_BASE` env var to your deployed backend, e.g. `https://your-api.onrender.com/api`.
3. Add the frontend URL as `CLIENT_ORIGIN` in the backend so CORS allows it.

## Status Codes
- `200` OK · `201` Created
- `400` Bad request / validation
- `401` Authentication required
- `403` Forbidden
- `404` Not found
- `409` Email already in use
