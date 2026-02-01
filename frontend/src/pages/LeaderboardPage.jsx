import React from 'react';
import { useGame } from '../context/GameContext';
import { Trophy, Medal, Award } from 'lucide-react';

function LeaderboardPage() {
  const { leaderboard, playerStats } = useGame();

  // Add player to leaderboard for display
  const fullLeaderboard = [
    ...leaderboard,
    { name: 'You', wins: playerStats.wins, totalEarnings: playerStats.totalEarnings, isPlayer: true }
  ].sort((a, b) => b.totalEarnings - a.totalEarnings);

  const getRankIcon = (index) => {
    switch (index) {
      case 0: return <Trophy size={24} className="text-yellow-400" />;
      case 1: return <Medal size={24} className="text-gray-300" />;
      case 2: return <Award size={24} className="text-amber-600" />;
      default: return <span className="w-6 text-center font-bold text-gray-500">#{index + 1}</span>;
    }
  };

  const getRankBg = (index) => {
    switch (index) {
      case 0: return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/50';
      case 1: return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/50';
      case 2: return 'bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-600/50';
      default: return '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-header neon-text mb-8">GLOBAL LEADERBOARD</h1>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {fullLeaderboard.slice(0, 3).map((player, idx) => {
          const positions = [1, 0, 2]; // Order: 2nd, 1st, 3rd for visual
          const actualIdx = positions[idx];
          const actualPlayer = fullLeaderboard[actualIdx];

          return (
            <div
              key={actualIdx}
              className={`card text-center ${getRankBg(actualIdx)} ${
                idx === 1 ? 'transform -translate-y-4' : ''
              } ${actualPlayer?.isPlayer ? 'ring-2 ring-cyan-400' : ''}`}
            >
              <div className="flex justify-center mb-2">
                {getRankIcon(actualIdx)}
              </div>
              <h3 className={`font-bold text-lg mb-1 ${actualPlayer?.isPlayer ? 'text-cyan-400' : ''}`}>
                {actualPlayer?.name}
              </h3>
              <div className="text-yellow-400 font-bold">
                ${actualPlayer?.totalEarnings.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">
                {actualPlayer?.wins} wins
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Rankings Table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="p-4 text-left font-header text-gray-400">RANK</th>
              <th className="p-4 text-left font-header text-gray-400">PLAYER</th>
              <th className="p-4 text-right font-header text-gray-400">WINS</th>
              <th className="p-4 text-right font-header text-gray-400">EARNINGS</th>
            </tr>
          </thead>
          <tbody>
            {fullLeaderboard.map((player, idx) => (
              <tr
                key={idx}
                className={`border-b border-white/5 transition-colors ${
                  player.isPlayer ? 'bg-cyan-500/10' : 'hover:bg-white/5'
                } ${getRankBg(idx)}`}
              >
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {getRankIcon(idx)}
                  </div>
                </td>
                <td className={`p-4 font-semibold ${player.isPlayer ? 'text-cyan-400' : ''}`}>
                  {player.name}
                  {player.isPlayer && (
                    <span className="ml-2 text-xs bg-cyan-500/20 px-2 py-1 rounded">
                      YOU
                    </span>
                  )}
                </td>
                <td className="p-4 text-right">{player.wins}</td>
                <td className="p-4 text-right font-semibold text-yellow-400">
                  ${player.totalEarnings.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LeaderboardPage;
