import Game from '../models/Game.js';

// Create a new game
export const createGame = async (req, res) => {
  try {
    console.log('Creating new game with data:', req.body);
    const { whitePlayer, blackPlayer } = req.body;

    if (!whitePlayer || !blackPlayer) {
      console.log('Missing player names');
      return res.status(400).json({ 
        message: 'Both white and black player names are required' 
      });
    }

    const game = new Game({
      whitePlayer: whitePlayer.trim(),
      blackPlayer: blackPlayer.trim()
    });

    console.log('Saving game to database...');
    const savedGame = await game.save();
    console.log('Game saved successfully:', savedGame);
    
    res.status(201).json(savedGame);
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).json({ 
      message: 'Failed to create game',
      error: error.message 
    });
  }
};

// Clear all games
export const clearHistory = async (req, res) => {
  try {
    console.log('Clearing all games...');
    await Game.deleteMany({});
    console.log('All games cleared successfully');
    res.json({ message: 'All games cleared successfully' });
  } catch (error) {
    console.error('Error clearing games:', error);
    res.status(500).json({ 
      message: 'Failed to clear games',
      error: error.message 
    });
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