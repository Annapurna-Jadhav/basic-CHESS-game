import { useState, useEffect } from 'react';

const GameBoard = ({ game, onMove }) => {
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [boardState, setBoardState] = useState({});

  useEffect(() => {
    if (game && game.board) {
      setBoardState(game.board);
    } else {
      setBoardState(getInitialBoardState());
    }
  }, [game]);

  const getInitialBoardState = () => {
    return {
      'a1': 'wR', 'b1': 'wN', 'c1': 'wB', 'd1': 'wQ', 'e1': 'wK', 'f1': 'wB', 'g1': 'wN', 'h1': 'wR',
      'a2': 'wP', 'b2': 'wP', 'c2': 'wP', 'd2': 'wP', 'e2': 'wP', 'f2': 'wP', 'g2': 'wP', 'h2': 'wP',
      'a7': 'bP', 'b7': 'bP', 'c7': 'bP', 'd7': 'bP', 'e7': 'bP', 'f7': 'bP', 'g7': 'bP', 'h7': 'bP',
      'a8': 'bR', 'b8': 'bN', 'c8': 'bB', 'd8': 'bQ', 'e8': 'bK', 'f8': 'bB', 'g8': 'bN', 'h8': 'bR'
    };
  };

  const renderSquare = (i) => {
    const row = Math.floor(i / 8);
    const col = i % 8;
    const position = `${String.fromCharCode(97 + col)}${8 - row}`;
    const piece = boardState[position];
    const isSelected = selectedPiece === position;
    const isValidMove = validMoves.includes(position);
    const isBlackSquare = (row + col) % 2 === 1;

    return (
      <div
        key={i}
        className={`w-16 h-16 flex items-center justify-center cursor-pointer
          ${isBlackSquare ? 'bg-amber-900' : 'bg-amber-100'}
          ${isSelected ? 'ring-4 ring-yellow-400' : ''}
          ${isValidMove ? 'ring-2 ring-blue-400' : ''}
          hover:opacity-80 transition-opacity
          relative`}
        onClick={() => handleSquareClick(position, piece)}
      >
        {/* Add pattern overlay */}
        <div className={`absolute inset-0 opacity-10
          ${isBlackSquare ? 'bg-white' : 'bg-black'}`} />
        
        {/* Add border to each square */}
        <div className="absolute inset-0 border border-amber-800 opacity-20" />
        
        {piece && (
          <span className={`text-4xl relative z-10
            ${piece.startsWith('w') ? 'text-white drop-shadow-lg' : 'text-black drop-shadow-lg'}`}>
            {getPieceSymbol(piece)}
          </span>
        )}
      </div>
    );
  };

  const getPieceSymbol = (piece) => {
    const symbols = {
      'wK': '♔', 'wQ': '♕', 'wR': '♖', 'wB': '♗', 'wN': '♘', 'wP': '♙',
      'bK': '♚', 'bQ': '♛', 'bR': '♜', 'bB': '♝', 'bN': '♞', 'bP': '♟'
    };
    return symbols[piece] || '';
  };

  const calculateValidMoves = (position, piece) => {
    const moves = [];
    const [file, rank] = position.split('');
    const fileIndex = file.charCodeAt(0) - 97;
    const rankIndex = 8 - parseInt(rank);
    const isWhite = piece.startsWith('w');

    // Pawn movement
    if (piece.endsWith('P')) {
      const direction = isWhite ? -1 : 1;
      const nextRank = rankIndex + direction;
      
      // Forward move
      if (nextRank >= 0 && nextRank < 8) {
        const nextPosition = `${file}${8 - nextRank}`;
        if (!boardState[nextPosition]) {
          moves.push(nextPosition);
        }
      }

      // First move can be 2 squares
      if ((isWhite && rankIndex === 6) || (!isWhite && rankIndex === 1)) {
        const twoSquaresAhead = `${file}${8 - (rankIndex + 2 * direction)}`;
        if (!boardState[twoSquaresAhead]) {
          moves.push(twoSquaresAhead);
        }
      }

      // Diagonal captures
      const captureFiles = [fileIndex - 1, fileIndex + 1];
      captureFiles.forEach(captureFile => {
        if (captureFile >= 0 && captureFile < 8) {
          const capturePosition = `${String.fromCharCode(97 + captureFile)}${8 - nextRank}`;
          const targetPiece = boardState[capturePosition];
          if (targetPiece && targetPiece.startsWith(isWhite ? 'b' : 'w')) {
            moves.push(capturePosition);
          }
        }
      });
    }

    // Rook movement
    if (piece.endsWith('R')) {
      const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
      directions.forEach(([dx, dy]) => {
        let x = fileIndex + dx;
        let y = rankIndex + dy;
        while (x >= 0 && x < 8 && y >= 0 && y < 8) {
          const targetPosition = `${String.fromCharCode(97 + x)}${8 - y}`;
          const targetPiece = boardState[targetPosition];
          if (!targetPiece) {
            moves.push(targetPosition);
          } else {
            if (targetPiece.startsWith(isWhite ? 'b' : 'w')) {
              moves.push(targetPosition);
            }
            break;
          }
          x += dx;
          y += dy;
        }
      });
    }

    // Bishop movement
    if (piece.endsWith('B')) {
      const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
      directions.forEach(([dx, dy]) => {
        let x = fileIndex + dx;
        let y = rankIndex + dy;
        while (x >= 0 && x < 8 && y >= 0 && y < 8) {
          const targetPosition = `${String.fromCharCode(97 + x)}${8 - y}`;
          const targetPiece = boardState[targetPosition];
          if (!targetPiece) {
            moves.push(targetPosition);
          } else {
            if (targetPiece.startsWith(isWhite ? 'b' : 'w')) {
              moves.push(targetPosition);
            }
            break;
          }
          x += dx;
          y += dy;
        }
      });
    }

    // Queen movement (combination of Rook and Bishop)
    if (piece.endsWith('Q')) {
      const directions = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];
      directions.forEach(([dx, dy]) => {
        let x = fileIndex + dx;
        let y = rankIndex + dy;
        while (x >= 0 && x < 8 && y >= 0 && y < 8) {
          const targetPosition = `${String.fromCharCode(97 + x)}${8 - y}`;
          const targetPiece = boardState[targetPosition];
          if (!targetPiece) {
            moves.push(targetPosition);
          } else {
            if (targetPiece.startsWith(isWhite ? 'b' : 'w')) {
              moves.push(targetPosition);
            }
            break;
          }
          x += dx;
          y += dy;
        }
      });
    }

    // King movement
    if (piece.endsWith('K')) {
      const directions = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];
      directions.forEach(([dx, dy]) => {
        const x = fileIndex + dx;
        const y = rankIndex + dy;
        if (x >= 0 && x < 8 && y >= 0 && y < 8) {
          const targetPosition = `${String.fromCharCode(97 + x)}${8 - y}`;
          const targetPiece = boardState[targetPosition];
          if (!targetPiece || targetPiece.startsWith(isWhite ? 'b' : 'w')) {
            moves.push(targetPosition);
          }
        }
      });
    }

    // Knight movement
    if (piece.endsWith('N')) {
      const moves = [
        [2, 1], [2, -1], [-2, 1], [-2, -1],
        [1, 2], [1, -2], [-1, 2], [-1, -2]
      ];
      moves.forEach(([dx, dy]) => {
        const x = fileIndex + dx;
        const y = rankIndex + dy;
        if (x >= 0 && x < 8 && y >= 0 && y < 8) {
          const targetPosition = `${String.fromCharCode(97 + x)}${8 - y}`;
          const targetPiece = boardState[targetPosition];
          if (!targetPiece || targetPiece.startsWith(isWhite ? 'b' : 'w')) {
            moves.push(targetPosition);
          }
        }
      });
    }

    return moves;
  };

  const handleSquareClick = (position, piece) => {
    if (!piece) {
      if (selectedPiece && validMoves.includes(position)) {
        onMove(selectedPiece, position);
        setSelectedPiece(null);
        setValidMoves([]);
      }
      return;
    }

    if (isPieceOwner(piece)) {
      setSelectedPiece(position);
      const moves = calculateValidMoves(position, piece);
      setValidMoves(moves);
    } else {
      setSelectedPiece(null);
      setValidMoves([]);
    }
  };

  const isPieceOwner = (piece) => {
    const isWhite = piece.startsWith('w');
    return (isWhite && game.currentTurn === 'white') ||
           (!isWhite && game.currentTurn === 'black');
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-xl font-bold mb-4 text-amber-900">
        {game.currentTurn === 'white' ? 'White to move' : 'Black to move'}
      </div>
      <div className="grid grid-cols-8 gap-0 border-4 border-amber-900 shadow-lg">
        {Array(64).fill(null).map((_, i) => renderSquare(i))}
      </div>
    </div>
  );
};

export default GameBoard; 