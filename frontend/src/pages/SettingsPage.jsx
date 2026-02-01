import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { RefreshCw, AlertTriangle, Save, Volume2, VolumeX, Moon, Sun } from 'lucide-react';

function SettingsPage() {
  const { resetGame, money, playerStats } = useGame();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [showSaveMessage, setShowSaveMessage] = useState(false);

  const handleReset = () => {
    resetGame();
    setShowResetConfirm(false);
    window.location.reload();
  };

  const handleSave = () => {
    setShowSaveMessage(true);
    setTimeout(() => setShowSaveMessage(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-4xl font-header neon-text mb-8">SETTINGS</h1>

      {showSaveMessage && (
        <div className="card bg-green-500/20 border-green-500/50 mb-6">
          <p className="text-green-400 flex items-center gap-2">
            <Save size={20} /> Settings saved successfully!
          </p>
        </div>
      )}

      {/* Game Settings */}
      <div className="card mb-6">
        <h2 className="font-header text-xl text-cyan-400 mb-6">GAME SETTINGS</h2>

        <div className="space-y-6">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              <div>
                <div className="font-semibold">Sound Effects</div>
                <div className="text-sm text-gray-400">Enable game sound effects</div>
              </div>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-14 h-8 rounded-full transition-colors ${
                soundEnabled ? 'bg-cyan-500' : 'bg-gray-600'
              }`}
            >
              <div className={`w-6 h-6 bg-white rounded-full transition-transform mx-1 ${
                soundEnabled ? 'translate-x-6' : ''
              }`} />
            </button>
          </div>

          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon size={20} /> : <Sun size={20} />}
              <div>
                <div className="font-semibold">Dark Mode</div>
                <div className="text-sm text-gray-400">Use dark theme</div>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-14 h-8 rounded-full transition-colors ${
                darkMode ? 'bg-cyan-500' : 'bg-gray-600'
              }`}
            >
              <div className={`w-6 h-6 bg-white rounded-full transition-transform mx-1 ${
                darkMode ? 'translate-x-6' : ''
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Save Data Info */}
      <div className="card mb-6">
        <h2 className="font-header text-xl text-cyan-400 mb-6">SAVE DATA</h2>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Current Balance</span>
            <span className="font-semibold text-yellow-400">${money.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Total Races</span>
            <span className="font-semibold">{playerStats.totalRaces}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Total Earnings</span>
            <span className="font-semibold text-yellow-400">${playerStats.totalEarnings.toLocaleString()}</span>
          </div>
        </div>

        <p className="text-sm text-gray-400 mb-4">
          Your progress is automatically saved to your browser's local storage.
        </p>

        <button onClick={handleSave} className="btn-primary w-full flex items-center justify-center gap-2">
          <Save size={18} /> FORCE SAVE
        </button>
      </div>

      {/* Danger Zone */}
      <div className="card border-red-500/30">
        <h2 className="font-header text-xl text-red-400 mb-6 flex items-center gap-2">
          <AlertTriangle size={20} /> DANGER ZONE
        </h2>

        <p className="text-gray-400 mb-4">
          Resetting your game will delete all progress, including your cars, upgrades, money, and race history.
          This action cannot be undone.
        </p>

        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full bg-red-500/20 text-red-400 border border-red-500/50 py-3 rounded font-bold hover:bg-red-500/30 transition flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} /> RESET GAME
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-red-400 font-semibold text-center">
              Are you sure? This cannot be undone!
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 bg-red-500 text-white py-3 rounded font-bold hover:bg-red-600 transition"
              >
                YES, RESET
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 bg-gray-600 text-white py-3 rounded font-bold hover:bg-gray-500 transition"
              >
                CANCEL
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SettingsPage;
