# Level 2 – Task 1: Frontend with React (Vite)

A React rewrite of the Level 1 Task 3 frontend, scaffolded with **Vite**. Uses functional components, `useState`, `useEffect`, and `useCallback`, with **loading and error states** on every API call.

## Features
- Reusable components: `UserCard`, `UserForm`, `UserList`.
- Full CRUD against the Level 1 Task 2 REST API.
- Loading and error states throughout.
- Fully responsive layout (single column on mobile, two columns on desktop).
- API base URL configurable via `.env`.

## Project Structure
```
task1/
├── package.json
├── vite.config.js
├── index.html
├── .env.example
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── App.css
    ├── index.css
    ├── api.js
    └── components/
        ├── UserCard.jsx
        ├── UserForm.jsx
        └── UserList.jsx
```

## Setup

1. Install dependencies:
   ```powershell
   cd level2/task1
   npm install
   ```
2. (Optional) Configure API base URL:
   ```powershell
   Copy-Item .env.example .env
   ```
   Edit `.env` if your API runs on a different host/port. Default: `http://localhost:5000`.

## Run

Start the dev server (Vite):
```powershell
npm run dev
```
App will be available at http://localhost:5173.

### Prerequisite
The Level 1 Task 2 API must be running on port 5000:
```powershell
cd ../../level1/task2
npm run dev
```

## Build for Production

```powershell
npm run build
npm run preview
```

## How to Test
1. Start the Level 1 Task 2 backend.
2. Run `npm run dev` here.
3. Open http://localhost:5173.
4. Add, edit, refresh, and delete users — each action shows a loading state, and errors appear inline.
