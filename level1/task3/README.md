# Level 1 – Task 3: Frontend with HTML, CSS, and JavaScript

A static, fully responsive web frontend that consumes the **Level 1 Task 2 REST API** to display, create, edit, and delete users — using **vanilla HTML, CSS, and JavaScript** (no frameworks).

## Features
- Lists all users from `GET /users` in a responsive card grid.
- Creates a user via `POST /users`.
- Edits an existing user via `PUT /users/:id`.
- Deletes a user via `DELETE /users/:id`.
- Loading and error states shown inline.
- Fully responsive (single column on mobile, two-column on desktop).
- Uses the native **Fetch API**, no external libraries.

## Project Structure
```
task3/
├── index.html
├── styles.css
├── script.js
└── README.md
```

## Setup

This is a static site — no build step or npm install required.

### Prerequisite
The Level 1 Task 2 API must be running locally:

```powershell
cd ../task2
npm install
npm run dev
```

Confirm it responds at `http://localhost:5000/users`.

## Run

Open `index.html` directly in a browser, **or** serve it with a simple static server (recommended to avoid CORS edge cases):

Using Python:
```powershell
cd level1/task3
python -m http.server 5500
```
Then open http://localhost:5500.

Or use the VS Code **Live Server** extension and right-click `index.html` → *Open with Live Server*.

## Configuration

The API base URL is set at the top of `script.js`:
```js
const API_BASE = 'http://localhost:5000';
```
Change it if the backend runs on a different host or port.

## How to Test

1. Start the Task 2 backend (above).
2. Open this page in the browser.
3. **Create** – fill in name, email, optional age, click *Create*. The new user appears in the grid.
4. **Read** – the grid lists all users; click *Refresh* to re-fetch.
5. **Update** – click *Edit* on a card, change values, click *Update*.
6. **Delete** – click *Delete* on a card and confirm.

If the backend is down, the page shows an inline error message — that's the loading/error state in action.
