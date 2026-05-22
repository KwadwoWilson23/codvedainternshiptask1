# Level 2 – Task 3: Database Integration

A MongoDB integration project using **Mongoose** with two related models (**User** and **Product**), schema-level **validation**, **indexes**, and a fully validated CRUD API.

## Features
- `User` and `Product` Mongoose models with a **one-to-many relationship** (a user owns many products).
- Indexes on `User.email` (unique), `User.name`, `Product.name`, and `Product.owner` for fast lookups.
- Schema-level validation: required fields, email format, min/max lengths, non-negative numbers.
- Population: `GET /users/:id` includes the user's products via a virtual; `GET /products` populates the owner name and email.
- Proper HTTP status codes with friendly validation error messages.

## Project Structure
```
task3/
├── server.js
├── package.json
├── .env.example
├── models/
│   ├── User.js
│   └── Product.js
├── controllers/
│   ├── userController.js
│   └── productController.js
├── routes/
│   ├── users.js
│   └── products.js
└── middleware/
    └── errorHandler.js
```

## Setup

```powershell
cd level2/task3
npm install
Copy-Item .env.example .env
code .env
```
Replace `MONGODB_URI` with your real Atlas connection string. Default `PORT=5002`.

## Run
```powershell
npm run dev
```
Server runs at http://localhost:5002.

## API Endpoints

### Users
| Method | Path             | Description                              |
|--------|------------------|------------------------------------------|
| GET    | `/users`         | List users (populates each user's products) |
| GET    | `/users/:id`     | Get one user with products               |
| POST   | `/users`         | Create user                              |
| PUT    | `/users/:id`     | Update user                              |
| DELETE | `/users/:id`     | Delete user                              |

### Products
| Method | Path                | Description                                |
|--------|---------------------|--------------------------------------------|
| GET    | `/products`         | List products (populates owner name/email) |
| GET    | `/products/:id`     | Get one product                            |
| POST   | `/products`         | Create product (requires `owner` user id)  |
| PUT    | `/products/:id`     | Update product                             |
| DELETE | `/products/:id`     | Delete product                             |

## How to Test

```powershell
# Create a user
$user = Invoke-RestMethod -Uri http://localhost:5002/users -Method Post -ContentType "application/json" `
  -Body '{"name":"Ada","email":"ada@example.com","age":36}'

# Create a product owned by that user
Invoke-RestMethod -Uri http://localhost:5002/products -Method Post -ContentType "application/json" `
  -Body (@{name="Notebook"; price=12.5; stock=20; owner=$user._id} | ConvertTo-Json)

# Fetch the user with their products
Invoke-RestMethod -Uri "http://localhost:5002/users/$($user._id)"
```

### Validation examples (each returns 400)
```powershell
Invoke-RestMethod -Uri http://localhost:5002/users -Method Post -ContentType "application/json" -Body '{"name":"A","email":"bad"}'
Invoke-RestMethod -Uri http://localhost:5002/products -Method Post -ContentType "application/json" -Body '{"name":"X","price":-5,"owner":"000000000000000000000000"}'
```
