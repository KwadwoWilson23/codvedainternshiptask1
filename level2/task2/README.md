# Level 2 – Task 2: Authentication & Authorization

An Express API with **signup / login**, **bcrypt** password hashing, **JWT** stored in **HTTP-only cookies**, and **role-based access control** (`user` vs `admin`).

## Features
- `POST /auth/signup` – register a new account (password hashed with bcrypt).
- `POST /auth/login` – authenticate and receive a JWT (set as an HTTP-only cookie).
- `POST /auth/logout` – clear the auth cookie.
- `GET /auth/me` – return the current authenticated user (protected).
- `GET /users`, `GET /users/:id`, `PUT /users/:id` – authenticated routes (any logged-in user).
- `DELETE /users/:id` – **admin only**.
- JWT is also accepted via `Authorization: Bearer <token>` header for tools like Postman.

## Project Structure
```
task2/
├── server.js
├── package.json
├── .env.example
├── models/User.js
├── controllers/
│   ├── authController.js
│   └── userController.js
├── routes/
│   ├── auth.js
│   └── users.js
└── middleware/
    ├── auth.js
    ├── authorize.js
    └── errorHandler.js
```

## Setup

```powershell
cd level2/task2
npm install
Copy-Item .env.example .env
code .env
```

Fill in the values:
```
PORT=5001
MONGODB_URI=<your Atlas connection string>
JWT_SECRET=<long random string, e.g. generated with: node -e "console.log(require('crypto').randomBytes(48).toString('hex'))">
JWT_EXPIRES_IN=1d
NODE_ENV=development
```

## Run
```powershell
npm run dev
```
Server runs at http://localhost:5001.

## How to Test

### Sign up an admin
```powershell
Invoke-RestMethod -Uri http://localhost:5001/auth/signup -Method Post `
  -ContentType "application/json" -SessionVariable session `
  -Body '{"name":"Admin","email":"admin@codveda.com","password":"adminpass123","role":"admin"}'
```

### Sign up a regular user
```powershell
Invoke-RestMethod -Uri http://localhost:5001/auth/signup -Method Post `
  -ContentType "application/json" -SessionVariable session `
  -Body '{"name":"Reg","email":"reg@codveda.com","password":"regpass123"}'
```

### Log in (saves the JWT cookie in $session)
```powershell
Invoke-RestMethod -Uri http://localhost:5001/auth/login -Method Post `
  -ContentType "application/json" -WebSession $session `
  -Body '{"email":"admin@codveda.com","password":"adminpass123"}'
```

### Access a protected route
```powershell
Invoke-RestMethod -Uri http://localhost:5001/users -WebSession $session
```

### Try DELETE as a regular user → 403 Forbidden
After logging in as `reg@codveda.com`:
```powershell
Invoke-RestMethod -Uri http://localhost:5001/users/<some-id> -Method Delete -WebSession $session
```

### Without a token → 401 Unauthorized
```powershell
Invoke-RestMethod -Uri http://localhost:5001/users
```

## Status Codes
- `200` OK · `201` Created
- `400` Bad request / validation
- `401` Authentication required / invalid token
- `403` Forbidden (insufficient role)
- `404` Not found
- `409` Email already in use
