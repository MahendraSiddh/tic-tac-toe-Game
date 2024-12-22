import React, { useState, useEffect } from 'react';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isUserTurn, setIsUserTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!isUserTurn && !gameOver) {
      const timeoutId = setTimeout(makeComputerMove, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [isUserTurn, gameOver]);

  const checkWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const isBoardFull = (squares) => {
    return squares.every((square) => square !== null);
  };

  const handleClick = (index) => {
    if (board[index] || !isUserTurn || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsUserTurn(false);

    const winner = checkWinner(newBoard);
    if (winner) {
      setWinner(winner);
      setGameOver(true);
    } else if (isBoardFull(newBoard)) {
      setGameOver(true);
    }
  };

  const makeComputerMove = () => {
    const newBoard = [...board];
    const bestMove = findBestMove(newBoard);
    newBoard[bestMove] = 'O';
    setBoard(newBoard);
    setIsUserTurn(true);

    const winner = checkWinner(newBoard);
    if (winner) {
      setWinner(winner);
      setGameOver(true);
    } else if (isBoardFull(newBoard)) {
      setGameOver(true);
    }
  };

  const findBestMove = (squares) => {
    let bestScore = -Infinity;
    let bestMove;

    for (let i = 0; i < 9; i++) {
      if (squares[i] === null) {
        squares[i] = 'O';
        let score = minimax(squares, 0, false);
        squares[i] = null;
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    return bestMove;
  };

  const minimax = (squares, depth, isMaximizing) => {
    const winner = checkWinner(squares);
    if (winner === 'X') return -10 + depth;
    if (winner === 'O') return 10 - depth;
    if (isBoardFull(squares)) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (squares[i] === null) {
          squares[i] = 'O';
          let score = minimax(squares, depth + 1, false);
          squares[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (squares[i] === null) {
          squares[i] = 'X';
          let score = minimax(squares, depth + 1, true);
          squares[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsUserTurn(true);
    setWinner(null);
    setGameOver(false);
  };

  const renderSquare = (index) => {
    return (
      <button
        className="w-20 h-20 bg-white border border-gray-300 text-4xl font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={() => handleClick(index)}
      >
        {board[index]}
      </button>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Tic Tac Toe</h1>
      <div className="mb-4">
        {gameOver ? (
          <p className="text-xl font-semibold text-gray-700">
            {winner ? `Winner: ${winner}` : "It's a draw!"}
          </p>
        ) : (
          <p className="text-xl font-semibold text-gray-700">
            {isUserTurn ? "Your turn (X)" : "Computer's turn (O)"}
          </p>
        )}
      </div>
      <div className="grid grid-cols-3 gap-2 mb-8">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => renderSquare(index))}
      </div>
      <button
        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={resetGame}
      >
        Reset Game
      </button>
    </div>
  );
};

export default TicTacToe;