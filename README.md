# Chess Game

A real-time multiplayer chess game built with React, Node.js, Express, MongoDB, and Socket.IO.

## Features

- Real-time multiplayer gameplay
- Beautiful and responsive UI with Tailwind CSS
- Turn-based gameplay
- Valid move validation
- Game state persistence
- Real-time updates using Socket.IO
- MongoDB database integration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Project Structure

```
basic-CHESS-game/
├── frontend/           # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── GameBoard.jsx
│   │   │   ├── GameList.jsx
│   │   │   └── NewGame.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── backend/           # Node.js backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
└── README.md
```

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd basic-CHESS-game
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Create a `.env` file in the backend directory:
```
MONGODB_URI=mongodb://localhost:27017/chess-game
PORT=5000
```

4. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

5. Start MongoDB:
```bash
mongod
```

