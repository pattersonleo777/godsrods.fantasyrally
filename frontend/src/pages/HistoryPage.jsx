import React from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { Trophy, XCircle, Clock, Car } from 'lucide-react';

function HistoryPage() {
  const { raceHistory } = useGame();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTime = (ms) => {
    return (ms / 1000).toFixed(2) + 's';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-header neon-text mb-8">RACE HISTORY</h1>

      {raceHistory.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">🏁</div>
          <p className="text-xl text-gray-400 mb-4">No races completed yet</p>
          <p className="text-gray-500 mb-6">Hit the track to start building your history!</p>
          <Link to="/races" className="btn-primary inline-block">
            START RACING
          </Link>
        </div>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card text-center">
              <div className="text-3xl font-bold text-cyan-400">{raceHistory.length}</div>
              <div className="text-sm text-gray-400">Total Races</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-green-400">
                {raceHistory.filter(r => r.won).length}
              </div>
              <div className="text-sm text-gray-400">Wins</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-red-400">
                {raceHistory.filter(r => !r.won).length}
              </div>
              <div className="text-sm text-gray-400">Losses</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-yellow-400">
                ${raceHistory.reduce((sum, r) => sum + r.earnings, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Total Earned</div>
            </div>
          </div>

          {/* Race List */}
          <div className="space-y-4">
            {raceHistory.map((race, idx) => (
              <div
                key={idx}
                className={`card flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  race.won
                    ? 'border-green-500/30 bg-green-500/5'
                    : 'border-red-500/30 bg-red-500/5'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${
                    race.won ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}>
                    {race.won ? (
                      <Trophy size={24} className="text-green-400" />
                    ) : (
                      <XCircle size={24} className="text-red-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{race.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {formatDate(race.date)}
                      </span>
                      {race.carUsed && (
                        <span className="flex items-center gap-1">
                          <Car size={14} />
                          {race.carUsed}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className={`text-xs ${race.won ? 'text-green-400' : 'text-red-400'}`}>
                      {race.won ? 'VICTORY' : 'DEFEAT'}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                      race.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                      race.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      race.difficulty === 'Hard' ? 'bg-orange-500/20 text-orange-400' :
                      race.difficulty === 'Expert' ? 'bg-red-500/20 text-red-400' :
                      'bg-purple-500/20 text-purple-400'
                    }`}>
                      {race.difficulty}
                    </div>
                  </div>

                  {race.raceTime && (
                    <div className="text-center">
                      <div className="text-xs text-gray-400">TIME</div>
                      <div className="font-mono font-bold">{formatTime(race.raceTime)}</div>
                    </div>
                  )}

                  <div className="text-right">
                    <div className="text-xs text-gray-400">EARNED</div>
                    <div className="font-bold text-yellow-400 text-xl">
                      +${race.earnings.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default HistoryPage;
