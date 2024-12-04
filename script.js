document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('chessboard');
    const pieces = {
        'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
        'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
    };

    const initialBoard = [
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
    ];

    let selectedPiece = null;
    let selectedPosition = null;

    function createBoard() {
        board.innerHTML = '';
        initialBoard.forEach((row, rowIndex) => {
            const tr = document.createElement('tr');
            row.forEach((cell, cellIndex) => {
                const td = document.createElement('td');
                td.textContent = pieces[cell] || '';
                td.dataset.row = rowIndex;
                td.dataset.col = cellIndex;
                td.addEventListener('click', () => handleCellClick(rowIndex, cellIndex));
                tr.appendChild(td);
            });
            board.appendChild(tr);
        });
    }

    function handleCellClick(row, col) {
        const cell = initialBoard[row][col];
        if (selectedPiece) {
            // Move the piece
            initialBoard[selectedPosition.row][selectedPosition.col] = '';
            initialBoard[row][col] = selectedPiece;
            selectedPiece = null;
            selectedPosition = null;
            createBoard();
        } else if (cell) {
            // Select the piece
            selectedPiece = cell;
            selectedPosition = { row, col };
        }
    }

    createBoard();
});
