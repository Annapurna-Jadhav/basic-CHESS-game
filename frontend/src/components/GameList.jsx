const GameList = ({ games, onJoinGame }) => {
  if (!games || games.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-amber-900 mb-4">Available Games</h2>
        <p className="text-gray-600">No games available. Create a new game to start playing!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-amber-900 mb-4">Available Games</h2>
      <div className="space-y-4">
        {games.map((game) => (
          <div
            key={game._id}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => onJoinGame(game)}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {game.whitePlayer} vs {game.blackPlayer}
                </p>
                <p className="text-sm text-gray-600">
                  Status: <span className="font-medium">{game.status}</span>
                </p>
              </div>
              <div className="text-sm text-gray-500">
                {game.currentTurn === 'white' ? 'White to move' : 'Black to move'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameList; 