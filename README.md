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

6. Start the backend server:
```bash
cd backend
npm run dev
```

7. Start the frontend development server:
```bash
cd frontend
npm run dev
```

8. Open your browser and navigate to `http://localhost:5173`

## How to Play

1. Create a new game by entering names for both players
2. The game will start with white pieces
3. Click on a piece to select it
4. Valid moves will be highlighted
5. Click on a highlighted square to move the piece
6. Players take turns moving pieces
7. The game continues until checkmate or draw

## Technologies Used

- Frontend:
  - React
  - Tailwind CSS
  - Socket.IO Client
  - Axios

- Backend:
  - Node.js
  - Express
  - MongoDB
  - Mongoose
  - Socket.IO
  - CORS

## API Endpoints

- `POST /api/games` - Create a new game
- `GET /api/games` - Get all games
- `GET /api/games/:id` - Get a specific game
- `POST /api/games/:id/move` - Make a move in a game

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Chess piece Unicode characters
- Tailwind CSS for styling
- Socket.IO for real-time communication 