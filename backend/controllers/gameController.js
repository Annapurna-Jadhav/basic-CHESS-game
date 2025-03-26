import Game from '../models/Game.js';

// Create a new game
export const createGame = async (req, res) => {
  try {
    const { whitePlayer, blackPlayer } = req.body;
    const game = new Game({
      whitePlayer,
      blackPlayer
    });
    await game.save();
    res.status(201).json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all games
export const getAllGames = async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific game
export const getGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Make a move
export const makeMove = async (req, res) => {
  try {
    const { from, to } = req.body;
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    if (game.status !== 'active') {
      return res.status(400).json({ message: 'Game is not active' });
    }

    // Get the piece at the starting position
    const piece = game.board.get(from);
    if (!piece) {
      return res.status(400).json({ message: 'No piece at starting position' });
    }

    // Check if it's the correct player's turn
    const isWhitePiece = piece.startsWith('w');
    if ((isWhitePiece && game.currentTurn !== 'white') ||
        (!isWhitePiece && game.currentTurn !== 'black')) {
      return res.status(400).json({ message: 'Not your turn' });
    }

    // Move the piece
    game.board.set(to, piece);
    game.board.delete(from);

    // Record the move
    game.moves.push({
      from,
      to,
      piece,
      player: game.currentTurn
    });

    // Switch turns
    game.currentTurn = game.currentTurn === 'white' ? 'black' : 'white';

    // Save the updated game
    await game.save();

    // Emit the move to all connected clients
    req.app.get('io').emit('moveMade', game);

    res.json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 