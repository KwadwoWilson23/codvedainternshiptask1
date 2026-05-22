# Level 3 – Task 2: Real-Time Chat with WebSockets

A real-time chat application built with **Express** + **Socket.io**. Users join with a username, send messages, see who is online, and watch typing indicators in real time.

## Features
- Join the chat with a username (no signup required).
- Real-time message broadcasting to all connected clients.
- **Online users list** in the sidebar, updates as users connect/disconnect.
- **Typing indicator** that shows when other users are typing.
- System messages when users join or leave.
- Single static frontend served from the same Express server (HTML/CSS/JS, no build step).

## Project Structure
```
task2/
├── server.js
├── package.json
└── public/
    ├── index.html
    ├── styles.css
    └── script.js
```

## Setup

```powershell
cd level3/task2
npm install
```

## Run

```powershell
npm run dev
```
Server runs at http://localhost:5004.

## How to Test

1. Open http://localhost:5004 in a browser.
2. Enter a username (e.g. `Ada`) and click **Join**.
3. Open the **same URL** in a different browser (or incognito window) and join as a different user (e.g. `Alan`).
4. Send messages back and forth — they appear instantly in both windows.
5. Start typing in one window — you'll see a typing indicator in the other.
6. Close one window — the other gets a system message that the user left, and the online list updates.

## Socket Events

### Client → Server
| Event           | Payload              | Description                       |
|-----------------|----------------------|-----------------------------------|
| `user:join`     | `username` (string)  | Announce that you've joined       |
| `message:send`  | `text` (string)      | Send a chat message               |
| `typing`        | `isTyping` (boolean) | Notify others you are typing      |

### Server → Client
| Event           | Payload                                            | Description                          |
|-----------------|----------------------------------------------------|--------------------------------------|
| `message:new`   | `{ id, username, text, at }`                       | A new chat message                   |
| `system`        | `{ text }`                                         | A system notice (join/leave)         |
| `users:online`  | `string[]`                                         | Current list of online usernames     |
| `typing`        | `{ username, isTyping }`                           | Someone started/stopped typing       |

## Notes
- The Socket.io client script is automatically served by the Socket.io server at `/socket.io/socket.io.js` — no separate install on the frontend.
- Messages are not persisted — closing the server clears history. For persistence, swap in MongoDB by saving each message on `message:send` and emitting recent history on `user:join`.
