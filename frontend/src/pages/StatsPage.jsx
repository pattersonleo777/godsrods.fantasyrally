import React from 'react';
import { useGame } from '../context/GameContext';
import { Trophy, Target, DollarSign, Clock, Car, Zap, TrendingUp } from 'lucide-react';

function StatsPage() {
  const { playerStats, cars, upgrades, raceHistory, money } = useGame();

  const ownedCars = cars.filter(c => c.owned);
  const ownedUpgrades = upgrades.filter(u => u.owned);
  const winRate = playerStats.totalRaces > 0
    ? Math.round((playerStats.wins / playerStats.totalRaces) * 100)
    : 0;

  const formatTime = (ms) => {
    if (!ms) return 'N/A';
    return (ms / 1000).toFixed(2) + 's';
  };

  const statCards = [
    { icon: <Trophy size={24} />, label: 'Total Wins', value: playerStats.wins, color: 'text-green-400' },
    { icon: <Target size={24} />, label: 'Total Races', value: playerStats.totalRaces, color: 'text-cyan-400' },
    { icon: <TrendingUp size={24} />, label: 'Win Rate', value: `${winRate}%`, color: 'text-yellow-400' },
    { icon: <DollarSign size={24} />, label: 'Total Earnings', value: `$${playerStats.totalEarnings.toLocaleString()}`, color: 'text-yellow-400' },
    { icon: <Clock size={24} />, label: 'Best Time', value: formatTime(playerStats.fastestTime), color: 'text-purple-400' },
    { icon: <Car size={24} />, label: 'Cars Owned', value: `${ownedCars.length}/${cars.length}`, color: 'text-blue-400' },
    { icon: <Zap size={24} />, label: 'Upgrades', value: `${ownedUpgrades.length}/${upgrades.length}`, color: 'text-orange-400' },
    { icon: <DollarSign size={24} />, label: 'Current Balance', value: `$${money.toLocaleString()}`, color: 'text-green-400' },
  ];

  // Calculate race distribution by difficulty
  const racesByDifficulty = raceHistory.reduce((acc, race) => {
    acc[race.difficulty] = acc[race.difficulty] || { total: 0, wins: 0 };
    acc[race.difficulty].total++;
    if (race.won) acc[race.difficulty].wins++;
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-header neon-text mb-8">PLAYER STATISTICS</h1>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, idx) => (
          <div key={idx} className="card text-center hover:scale-105 transition-transform">
            <div className={`flex justify-center mb-2 ${stat.color}`}>
              {stat.icon}
            </div>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Performance by Difficulty */}
      <div className="card mb-8">
        <h2 className="font-header text-xl text-cyan-400 mb-6">PERFORMANCE BY DIFFICULTY</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {['Easy', 'Medium', 'Hard', 'Expert', 'Legend'].map(difficulty => {
            const data = racesByDifficulty[difficulty] || { total: 0, wins: 0 };
            const rate = data.total > 0 ? Math.round((data.wins / data.total) * 100) : 0;

            const colorClasses = {
              'Easy': 'text-green-400 border-green-500/50',
              'Medium': 'text-yellow-400 border-yellow-500/50',
              'Hard': 'text-orange-400 border-orange-500/50',
              'Expert': 'text-red-400 border-red-500/50',
              'Legend': 'text-purple-400 border-purple-500/50',
            };

            return (
              <div key={difficulty} className={`text-center p-4 rounded-lg border ${colorClasses[difficulty]} bg-white/5`}>
                <div className={`font-bold text-sm ${colorClasses[difficulty].split(' ')[0]}`}>
                  {difficulty.toUpperCase()}
                </div>
                <div className="text-3xl font-bold mt-2">{rate}%</div>
                <div className="text-xs text-gray-400 mt-1">
                  {data.wins}W / {data.total - data.wins}L
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Garage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-header text-xl text-cyan-400 mb-4">GARAGE COLLECTION</h2>
          <div className="space-y-3">
            {cars.map(car => (
              <div
                key={car.id}
                className={`flex justify-between items-center p-3 rounded-lg ${
                  car.owned ? 'bg-green-500/10 border border-green-500/30' : 'bg-gray-800/50'
                }`}
              >
                <span className={car.owned ? 'text-white' : 'text-gray-500'}>{car.name}</span>
                <span className={car.owned ? 'text-green-400' : 'text-gray-500'}>
                  {car.owned ? 'Owned' : `$${car.price.toLocaleString()}`}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="font-header text-xl text-cyan-400 mb-4">UPGRADES INSTALLED</h2>
          <div className="space-y-3">
            {upgrades.map(upgrade => (
              <div
                key={upgrade.id}
                className={`flex justify-between items-center p-3 rounded-lg ${
                  upgrade.owned ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-gray-800/50'
                }`}
              >
                <div>
                  <span className={upgrade.owned ? 'text-white' : 'text-gray-500'}>{upgrade.name}</span>
                  <span className={`ml-2 text-xs ${
                    upgrade.type === 'speed' ? 'text-red-400' :
                    upgrade.type === 'acceleration' ? 'text-blue-400' :
                    'text-green-400'
                  }`}>
                    +{upgrade.bonus}
                  </span>
                </div>
                <span className={upgrade.owned ? 'text-blue-400' : 'text-gray-500'}>
                  {upgrade.owned ? 'Installed' : `$${upgrade.price.toLocaleString()}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsPage;
