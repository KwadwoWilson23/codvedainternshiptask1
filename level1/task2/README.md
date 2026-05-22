# Level 1 – Task 2: Simple REST API

A fully working REST API providing CRUD operations on a `users` resource, built with **Express.js** and **MongoDB** (via **Mongoose**).

## Features
- Full CRUD: `GET /users`, `GET /users/:id`, `POST /users`, `PUT /users/:id`, `DELETE /users/:id`
- MongoDB persistence via Mongoose
- Proper HTTP status codes (200, 201, 400, 404, 409, 500)
- Centralized error handling middleware
- CORS enabled for the Level 1 Task 3 frontend
- Environment configuration via `.env`

## Project Structure
```
task2/
├── server.js
├── package.json
├── .env.example
├── models/
│   └── User.js
├── controllers/
│   └── userController.js
├── routes/
│   └── users.js
└── middleware/
    └── errorHandler.js
```

## Setup

1. Install dependencies:
   ```powershell
   cd level1/task2
   npm install
   ```
2. Copy the example env file and fill in your MongoDB Atlas connection string:
   ```powershell
   Copy-Item .env.example .env
   ```
   Open `.env` and replace the placeholder URI.

## Run

Development (auto-reload):
```powershell
npm run dev
```
Production:
```powershell
npm start
```
The server starts on `http://localhost:5000`.

## API Reference

Base URL: `http://localhost:5000`

| Method | Endpoint       | Description           | Body                                  |
|--------|----------------|-----------------------|---------------------------------------|
| GET    | `/users`       | List all users        | –                                     |
| GET    | `/users/:id`   | Get a single user     | –                                     |
| POST   | `/users`       | Create a user         | `{ "name": "Ada", "email": "a@b.c" }` |
| PUT    | `/users/:id`   | Update an existing user | `{ "name": "New", "age": 30 }`      |
| DELETE | `/users/:id`   | Delete a user         | –                                     |

### Sample response (GET /users/:id)
```json
{
  "_id": "65f...",
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "age": 36,
  "createdAt": "2026-05-22T10:00:00.000Z",
  "updatedAt": "2026-05-22T10:00:00.000Z"
}
```

### Status codes
| Code | Meaning                                  |
|------|------------------------------------------|
| 200  | OK                                       |
| 201  | Created                                  |
| 400  | Bad request / validation / invalid id    |
| 404  | Not found                                |
| 409  | Conflict (duplicate email)               |
| 500  | Internal server error                    |

## Testing

### Using curl
```powershell
curl http://localhost:5000/users
curl -X POST http://localhost:5000/users -H "Content-Type: application/json" -d '{"name":"Ada","email":"ada@example.com","age":36}'
curl -X PUT http://localhost:5000/users/<id> -H "Content-Type: application/json" -d '{"age":37}'
curl -X DELETE http://localhost:5000/users/<id>
```

### Using Postman / Thunder Client
1. Import the endpoints above as a collection.
2. Set the base URL to `http://localhost:5000`.
3. Try each route in order: POST → GET all → GET by id → PUT → DELETE.
