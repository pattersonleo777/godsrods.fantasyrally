import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Zap, Gauge, Settings } from 'lucide-react';

function UpgradesPage() {
  const { upgrades, buyUpgrade, money, getCarStats } = useGame();
  const [message, setMessage] = useState({ text: '', type: '' });
  const stats = getCarStats();

  const handleBuy = (upgradeId) => {
    if (buyUpgrade(upgradeId)) {
      setMessage({ text: 'Upgrade purchased successfully!', type: 'success' });
    } else {
      setMessage({ text: 'Not enough money or already owned!', type: 'error' });
    }
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'speed': return <Zap size={20} className="text-red-400" />;
      case 'acceleration': return <Gauge size={20} className="text-blue-400" />;
      case 'handling': return <Settings size={20} className="text-green-400" />;
      default: return null;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'speed': return 'border-red-500/50 bg-red-500/10';
      case 'acceleration': return 'border-blue-500/50 bg-blue-500/10';
      case 'handling': return 'border-green-500/50 bg-green-500/10';
      default: return '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-header neon-text mb-8">PERFORMANCE UPGRADES</h1>

      {/* Current Stats */}
      <div className="card mb-8">
        <h2 className="font-header text-lg text-gray-400 mb-4">CURRENT PERFORMANCE</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-red-400 text-3xl font-bold">{stats.speed}</div>
            <div className="text-sm text-gray-400">Speed</div>
          </div>
          <div>
            <div className="text-blue-400 text-3xl font-bold">{stats.acceleration}</div>
            <div className="text-sm text-gray-400">Acceleration</div>
          </div>
          <div>
            <div className="text-green-400 text-3xl font-bold">{stats.handling}</div>
            <div className="text-sm text-gray-400">Handling</div>
          </div>
        </div>
      </div>

      {message.text && (
        <div className={`card mb-6 ${
          message.type === 'success' ? 'bg-green-500/20 border-green-500/50' : 'bg-red-500/20 border-red-500/50'
        }`}>
          <p className={message.type === 'success' ? 'text-green-400' : 'text-red-400'}>
            {message.text}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {upgrades.map(upgrade => (
          <div
            key={upgrade.id}
            className={`card transition-all ${
              upgrade.owned ? 'opacity-60' : `hover:scale-105 ${getTypeColor(upgrade.type)}`
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              {getTypeIcon(upgrade.type)}
              <h3 className="text-xl font-bold">{upgrade.name}</h3>
            </div>

            <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${
              upgrade.type === 'speed' ? 'bg-red-500/20 text-red-400' :
              upgrade.type === 'acceleration' ? 'bg-blue-500/20 text-blue-400' :
              'bg-green-500/20 text-green-400'
            }`}>
              {upgrade.type.toUpperCase()}
            </div>

            <p className="text-gray-300 mb-4 text-lg">
              +{upgrade.bonus} {upgrade.type}
            </p>

            <div className="flex justify-between items-center pt-4 border-t border-white/10">
              <span className="text-2xl font-bold text-yellow-400">
                ${upgrade.price.toLocaleString()}
              </span>
              {upgrade.owned ? (
                <span className="bg-gray-600 text-gray-300 px-4 py-2 rounded font-bold text-sm">
                  OWNED
                </span>
              ) : (
                <button
                  onClick={() => handleBuy(upgrade.id)}
                  disabled={money < upgrade.price}
                  className={`px-4 py-2 rounded font-bold transition ${
                    money >= upgrade.price
                      ? 'btn-primary'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  BUY
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UpgradesPage;
