import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Zap, Wrench, Trophy, ShoppingCart } from 'lucide-react';
import { useGame } from '../context/GameContext';
import StatBar from '../components/StatBar';

function HomePage() {
  const { money, equippedCar, getCarStats, playerStats } = useGame();
  const stats = getCarStats();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-header neon-text mb-8 text-center">
        DRAG RACING UNDERGROUND
      </h1>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-yellow-500/20 to-orange-600/20 border-yellow-500/30">
          <h2 className="text-lg font-header text-yellow-400 mb-2">BALANCE</h2>
          <p className="text-4xl font-bold text-yellow-300">${money.toLocaleString()}</p>
        </div>

        <div className="card bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border-cyan-500/30">
          <h2 className="text-lg font-header text-cyan-400 mb-2">CURRENT RIDE</h2>
          <p className="text-2xl font-bold">{equippedCar?.name || 'No car equipped'}</p>
        </div>

        <div className="card bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-green-500/30">
          <h2 className="text-lg font-header text-green-400 mb-2">WIN RATE</h2>
          <p className="text-4xl font-bold text-green-300">
            {playerStats.totalRaces > 0
              ? `${Math.round((playerStats.wins / playerStats.totalRaces) * 100)}%`
              : '0%'}
          </p>
          <p className="text-sm text-gray-400">{playerStats.wins}W / {playerStats.losses}L</p>
        </div>
      </div>

      {/* Car Performance */}
      <div className="card mb-8">
        <h2 className="text-xl font-header text-cyan-400 mb-6">CAR PERFORMANCE</h2>
        <div className="space-y-4">
          <StatBar label="SPEED" value={stats.speed} max={150} color="bg-red-500" />
          <StatBar label="ACCELERATION" value={stats.acceleration} max={150} color="bg-blue-500" />
          <StatBar label="HANDLING" value={stats.handling} max={150} color="bg-green-500" />
        </div>
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Overall Rating</span>
            <span className="font-bold text-cyan-400">
              {Math.round((stats.speed + stats.acceleration + stats.handling) / 3)}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <QuickLink to="/races" icon={<Zap size={24} />} title="Race Now" color="from-red-500 to-orange-500" />
        <QuickLink to="/garage" icon={<Car size={24} />} title="Garage" color="from-blue-500 to-cyan-500" />
        <QuickLink to="/upgrades" icon={<Wrench size={24} />} title="Upgrades" color="from-purple-500 to-pink-500" />
        <QuickLink to="/shop" icon={<ShoppingCart size={24} />} title="Shop" color="from-green-500 to-emerald-500" />
        <QuickLink to="/leaderboard" icon={<Trophy size={24} />} title="Rankings" color="from-yellow-500 to-amber-500" />
      </div>
    </div>
  );
}

function QuickLink({ to, icon, title, color }) {
  return (
    <Link
      to={to}
      className={`card bg-gradient-to-br ${color} bg-opacity-20 hover:scale-105 transition-transform text-center py-6`}
    >
      <div className="flex justify-center mb-2">{icon}</div>
      <h3 className="font-bold">{title}</h3>
    </Link>
  );
}

export default HomePage;
