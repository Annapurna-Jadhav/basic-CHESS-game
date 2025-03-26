import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  whitePlayer: {
    type: String,
    required: true
  },
  blackPlayer: {
    type: String,
    required: true
  },
  board: {
    type: Map,
    of: String,
    default: () => {
      const initialBoard = new Map();
      // Set up initial board position
      const initialPosition = {
        'a1': 'wR', 'b1': 'wN', 'c1': 'wB', 'd1': 'wQ', 'e1': 'wK', 'f1': 'wB', 'g1': 'wN', 'h1': 'wR',
        'a2': 'wP', 'b2': 'wP', 'c2': 'wP', 'd2': 'wP', 'e2': 'wP', 'f2': 'wP', 'g2': 'wP', 'h2': 'wP',
        'a7': 'bP', 'b7': 'bP', 'c7': 'bP', 'd7': 'bP', 'e7': 'bP', 'f7': 'bP', 'g7': 'bP', 'h7': 'bP',
        'a8': 'bR', 'b8': 'bN', 'c8': 'bB', 'd8': 'bQ', 'e8': 'bK', 'f8': 'bB', 'g8': 'bN', 'h8': 'bR'
      };
      Object.entries(initialPosition).forEach(([key, value]) => {
        initialBoard.set(key, value);
      });
      return initialBoard;
    }
  },
  currentTurn: {
    type: String,
    enum: ['white', 'black'],
    default: 'white'
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'draw'],
    default: 'active'
  },
  winner: {
    type: String,
    enum: ['white', 'black', null],
    default: null
  },
  moves: [{
    from: String,
    to: String,
    piece: String,
    player: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Convert Map to Object for JSON serialization
gameSchema.methods.toJSON = function() {
  const obj = this.toObject();
  obj.board = Object.fromEntries(this.board);
  return obj;
};

// Convert Object to Map when creating/updating
gameSchema.pre('save', function(next) {
  if (this.isModified('board') && !(this.board instanceof Map)) {
    this.board = new Map(Object.entries(this.board));
  }
  next();
});

const Game = mongoose.model('Game', gameSchema);

export default Game; 