import { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import GameBoard from './components/GameBoard';
import GameList from './components/GameList';
import NewGame from './components/NewGame';

const socket = io('http://localhost:5000');

function App() {
  const [games, setGames] = useState([]);
  const [currentGame, setCurrentGame] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGames();
    setupSocketListeners();
    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchGames = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/games');
      setGames(response.data);
    } catch (error) {
      console.error('Error fetching games:', error);
      setError('Failed to fetch games. Please try again later.');
    }
  };

  const setupSocketListeners = () => {
    socket.on('moveMade', (updatedGame) => {
      setGames(games.map(game => 
        game._id === updatedGame._id ? updatedGame : game
      ));
      if (currentGame?._id === updatedGame._id) {
        setCurrentGame(updatedGame);
      }
    });
  };

  const handleCreateGame = async (whitePlayer, blackPlayer) => {
    try {
      const response = await axios.post('http://localhost:5000/api/games', {
        whitePlayer,
        blackPlayer
      });
      setGames([...games, response.data]);
      setCurrentGame(response.data);
      setError(null);
    } catch (error) {
      console.error('Error creating game:', error);
      setError('Failed to create game. Please try again.');
    }
  };

  const handleJoinGame = (game) => {
    setCurrentGame(game);
    setError(null);
  };

  const handleMove = async (from, to) => {
    if (!currentGame) return;

    try {
      const response = await axios.post(`http://localhost:5000/api/games/${currentGame._id}/move`, {
        from,
        to
      });
      setCurrentGame(response.data);
      setError(null);
    } catch (error) {
      console.error('Error making move:', error);
      setError('Failed to make move. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-amber-900">Chess Game</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {!currentGame ? (
          <div className="space-y-8">
            <NewGame onCreateGame={handleCreateGame} />
            <GameList games={games} onJoinGame={handleJoinGame} />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-700">
                {currentGame.whitePlayer} vs {currentGame.blackPlayer}
              </h2>
            </div>
            <GameBoard game={currentGame} onMove={handleMove} />
            <button
              onClick={() => setCurrentGame(null)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Leave Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App; 