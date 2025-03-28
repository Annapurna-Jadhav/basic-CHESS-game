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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchGames();
    setupSocketListeners();
    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchGames = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5000/api/games');
      console.log('Fetched games:', response.data);
      setGames(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching games:', error);
      setError('Failed to fetch games. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const setupSocketListeners = () => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socket.on('moveMade', (updatedGame) => {
      console.log('Move made:', updatedGame);
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
      setIsLoading(true);
      console.log('Creating game with players:', { whitePlayer, blackPlayer });
      const response = await axios.post('http://localhost:5000/api/games', {
        whitePlayer,
        blackPlayer
      });
      console.log('Game created:', response.data);
      setGames([...games, response.data]);
      setCurrentGame(response.data);
      setError(null);
    } catch (error) {
      console.error('Error creating game:', error);
      setError(error.response?.data?.message || 'Failed to create game. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinGame = (game) => {
    console.log('Joining game:', game);
    setCurrentGame(game);
    setError(null);
  };

  const handleMove = async (from, to) => {
    if (!currentGame) return;

    try {
      setIsLoading(true);
      console.log('Making move:', { from, to });
      const response = await axios.post(`http://localhost:5000/api/games/${currentGame._id}/move`, {
        from,
        to
      });
      console.log('Move successful:', response.data);
      setCurrentGame(response.data);
      setError(null);
    } catch (error) {
      console.error('Error making move:', error);
      setError(error.response?.data?.message || 'Failed to make move. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear all games? This action cannot be undone.')) {
      return;
    }

    try {
      setIsLoading(true);
      await axios.delete('http://localhost:5000/api/games/clear');
      setGames([]);
      setCurrentGame(null);
      setError(null);
    } catch (error) {
      console.error('Error clearing history:', error);
      setError('Failed to clear game history. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-amber-900">Chess Game</h1>
          {games.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Clear History
            </button>
          )}
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {isLoading && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
            Loading...
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