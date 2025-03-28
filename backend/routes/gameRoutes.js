import express from 'express';
import { createGame, getAllGames, getGame, makeMove, clearHistory } from '../controllers/gameController.js';

const router = express.Router();

// Create a new game
router.post('/', createGame);

// Get all games
router.get('/', getAllGames);

// Get a specific game
router.get('/:id', getGame);

// Make a move
router.post('/:id/move', makeMove);

// Clear all games
router.delete('/clear', clearHistory);

export default router; 