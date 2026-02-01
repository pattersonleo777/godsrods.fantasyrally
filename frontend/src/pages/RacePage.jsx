import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame, races } from '../context/GameContext';

function RacePage() {
  const { raceId } = useParams();
  const navigate = useNavigate();
  const { completeRace, getCarStats, equippedCar } = useGame();

  const [gameState, setGameState] = useState('ready'); // ready, countdown, racing, finished
  const [countdown, setCountdown] = useState(3);
  const [progress, setProgress] = useState(0);
  const [opponentProgress, setOpponentProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [raceTime, setRaceTime] = useState(0);
  const [earnings, setEarnings] = useState(0);

  const race = races.find(r => r.id === parseInt(raceId));
  const stats = getCarStats();

  useEffect(() => {
    if (gameState === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'countdown' && countdown === 0) {
      setGameState('racing');
    }
  }, [gameState, countdown]);

  useEffect(() => {
    if (gameState === 'racing' && progress < 100 && opponentProgress < 100) {
      const timer = setTimeout(() => {
        const playerSpeed = (stats.speed + stats.acceleration) / 180 + Math.random() * 0.5;
        const opponentSpeed = race.requiredSpeed / 90 + Math.random() * 0.6;

        setProgress(prev => Math.min(prev + playerSpeed * 1.8, 100));
        setOpponentProgress(prev => Math.min(prev + opponentSpeed * 1.8, 100));
        setRaceTime(prev => prev + 50);
      }, 50);
      return () => clearTimeout(timer);
    } else if (gameState === 'racing' && (progress >= 100 || opponentProgress >= 100)) {
      const won = progress >= opponentProgress;
      setResult(won);
      const prize = completeRace(race, won, raceTime);
      setEarnings(prize);
      setGameState('finished');
    }
  }, [gameState, progress, opponentProgress]);

  const startRace = () => {
    setGameState('countdown');
    setCountdown(3);
    setProgress(0);
    setOpponentProgress(0);
    setResult(null);
    setRaceTime(0);
  };

  if (!race) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-4xl font-header text-red-500 mb-4">Race Not Found</h1>
        <button onClick={() => navigate('/races')} className="btn-primary">
          Back to Races
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-header neon-text mb-2">{race.name}</h1>
      <p className="text-gray-400 mb-8">{race.description}</p>

      {/* Ready State */}
      {gameState === 'ready' && (
        <div className="card text-center py-12">
          <h2 className="text-3xl font-header mb-4">READY TO RACE?</h2>
          <div className="flex justify-center gap-8 mb-6 text-sm">
            <div>
              <span className="text-gray-400">Difficulty:</span>
              <span className="ml-2 font-bold">{race.difficulty}</span>
            </div>
            <div>
              <span className="text-gray-400">Prize:</span>
              <span className="ml-2 font-bold text-yellow-400">${race.prize.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-400">Your Car:</span>
              <span className="ml-2 font-bold text-cyan-400">{equippedCar?.name}</span>
            </div>
          </div>
          <button
            onClick={startRace}
            className="btn-primary text-xl px-12 py-4"
          >
            START RACE
          </button>
        </div>
      )}

      {/* Countdown */}
      {gameState === 'countdown' && (
        <div className="card text-center py-20">
          <div className={`text-9xl font-header transition-all ${
            countdown === 0 ? 'text-green-500 scale-150' : 'text-yellow-500'
          }`}>
            {countdown === 0 ? 'GO!' : countdown}
          </div>
        </div>
      )}

      {/* Racing */}
      {gameState === 'racing' && (
        <div className="space-y-6">
          <div className="card">
            <div className="text-center mb-4 text-2xl font-header text-gray-400">
              {(raceTime / 1000).toFixed(2)}s
            </div>

            {/* Player Progress */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="font-bold text-cyan-400 flex items-center gap-2">
                  🏎️ YOU ({equippedCar?.name})
                </span>
                <span className="text-sm">{progress.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-8 overflow-hidden relative">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-8 rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 transition-all duration-100 text-2xl"
                  style={{ left: `${Math.min(progress, 95)}%` }}
                >
                  🏎️
                </div>
              </div>
            </div>

            {/* Opponent Progress */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-bold text-red-400 flex items-center gap-2">
                  🏎️ OPPONENT
                </span>
                <span className="text-sm">{opponentProgress.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-8 overflow-hidden relative">
                <div
                  className="bg-gradient-to-r from-red-500 to-orange-500 h-8 rounded-full transition-all duration-100"
                  style={{ width: `${opponentProgress}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 transition-all duration-100 text-2xl"
                  style={{ left: `${Math.min(opponentProgress, 95)}%` }}
                >
                  🏎️
                </div>
              </div>
            </div>
          </div>

          {/* Race Track Visual */}
          <div className="card bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 h-4 rounded-full overflow-hidden">
            <div className="h-full flex">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="flex-1 border-r border-dashed border-white/20" />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Finished */}
      {gameState === 'finished' && (
        <div className={`card text-center py-12 ${
          result ? 'bg-gradient-to-br from-green-500/20 to-emerald-600/20' : 'bg-gradient-to-br from-red-500/20 to-rose-600/20'
        }`}>
          <div className="text-6xl mb-4">
            {result ? '🏆' : '😞'}
          </div>
          <h2 className={`text-4xl font-header mb-4 ${result ? 'text-green-400' : 'text-red-400'}`}>
            {result ? 'VICTORY!' : 'DEFEAT'}
          </h2>
          <div className="text-2xl mb-2">
            Time: <span className="font-bold">{(raceTime / 1000).toFixed(2)}s</span>
          </div>
          <div className="text-3xl font-bold text-yellow-400 mb-8">
            +${earnings.toLocaleString()}
          </div>
          <div className="flex gap-4 justify-center">
            <button onClick={startRace} className="btn-primary px-8 py-3">
              RACE AGAIN
            </button>
            <button
              onClick={() => navigate('/races')}
              className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded font-bold transition"
            >
              BACK TO RACES
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RacePage;
