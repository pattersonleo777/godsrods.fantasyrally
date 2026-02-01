import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Lock, Trophy } from 'lucide-react';
import { useGame, races } from '../context/GameContext';

function RacesPage() {
  const navigate = useNavigate();
  const { getCarStats, equippedCar } = useGame();
  const stats = getCarStats();

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'Hard': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'Expert': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'Legend': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-header neon-text mb-8">RACE SELECT</h1>

      {!equippedCar && (
        <div className="card bg-red-500/10 border-red-500/50 mb-6">
          <p className="text-red-400">You need to equip a car before racing. Visit your garage first.</p>
        </div>
      )}

      <div className="space-y-4">
        {races.map(race => {
          const canRace = stats.speed >= race.requiredSpeed;

          return (
            <div
              key={race.id}
              className={`card transition-all ${
                !canRace ? 'opacity-60' : 'hover:border-cyan-500/50'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold">{race.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getDifficultyColor(race.difficulty)}`}>
                      {race.difficulty.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-400 mb-2">{race.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className={`flex items-center gap-1 ${canRace ? 'text-green-400' : 'text-red-400'}`}>
                      {canRace ? <Zap size={16} /> : <Lock size={16} />}
                      Required Speed: {race.requiredSpeed}
                    </span>
                    <span className="text-gray-500">|</span>
                    <span className="text-gray-400">Your Speed: {stats.speed}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2 text-yellow-400">
                    <Trophy size={20} />
                    <span className="text-2xl font-bold">${race.prize.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={() => navigate(`/race/${race.id}`)}
                    disabled={!canRace || !equippedCar}
                    className={`px-6 py-3 rounded font-bold transition-all ${
                      canRace && equippedCar
                        ? 'btn-primary'
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {!equippedCar ? 'NO CAR' : canRace ? 'START RACE' : 'LOCKED'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RacesPage;
