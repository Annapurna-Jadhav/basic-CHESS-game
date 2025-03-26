import { useState } from 'react';

const NewGame = ({ onCreateGame }) => {
  const [whitePlayer, setWhitePlayer] = useState('');
  const [blackPlayer, setBlackPlayer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (whitePlayer.trim() && blackPlayer.trim()) {
      onCreateGame(whitePlayer.trim(), blackPlayer.trim());
      setWhitePlayer('');
      setBlackPlayer('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-amber-900 mb-4">Create New Game</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="whitePlayer" className="block text-sm font-medium text-gray-700 mb-1">
            White Player Name
          </label>
          <input
            type="text"
            id="whitePlayer"
            value={whitePlayer}
            onChange={(e) => setWhitePlayer(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Enter white player name"
            required
          />
        </div>
        <div>
          <label htmlFor="blackPlayer" className="block text-sm font-medium text-gray-700 mb-1">
            Black Player Name
          </label>
          <input
            type="text"
            id="blackPlayer"
            value={blackPlayer}
            onChange={(e) => setBlackPlayer(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Enter black player name"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-amber-900 text-white py-2 px-4 rounded-md hover:bg-amber-800 transition-colors"
        >
          Create Game
        </button>
      </form>
    </div>
  );
};

export default NewGame; 