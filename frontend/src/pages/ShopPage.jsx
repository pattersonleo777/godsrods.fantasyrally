import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { ShoppingCart, Check } from 'lucide-react';

function ShopPage() {
  const { cars, buyCar, money } = useGame();
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleBuy = (carId) => {
    if (buyCar(carId)) {
      setMessage({ text: 'Car purchased successfully! Check your garage.', type: 'success' });
    } else {
      setMessage({ text: 'Not enough money or already owned!', type: 'error' });
    }
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-header neon-text">CAR DEALERSHIP</h1>
        <div className="card inline-flex items-center gap-2">
          <ShoppingCart size={20} className="text-yellow-400" />
          <span className="text-xl font-bold text-yellow-400">${money.toLocaleString()}</span>
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
        {cars.map(car => (
          <div
            key={car.id}
            className={`card transition-all ${
              car.owned ? 'border-green-500/30' : 'hover:border-cyan-500/50 hover:scale-105'
            }`}
          >
            {/* Car Image */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 aspect-video rounded-lg mb-4 flex items-center justify-center border border-white/5 relative overflow-hidden">
              <span className="text-6xl">🏎️</span>
              {car.owned && (
                <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                  <Check size={16} className="text-white" />
                </div>
              )}
            </div>

            <h3 className="text-2xl font-bold mb-4">{car.name}</h3>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Speed</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${car.speed}%` }}
                    />
                  </div>
                  <span className="font-semibold text-red-400 w-8">{car.speed}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Acceleration</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${car.acceleration}%` }}
                    />
                  </div>
                  <span className="font-semibold text-blue-400 w-8">{car.acceleration}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Handling</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${car.handling}%` }}
                    />
                  </div>
                  <span className="font-semibold text-green-400 w-8">{car.handling}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-white/10">
              <span className="text-2xl font-bold text-yellow-400">
                {car.price === 0 ? 'FREE' : `$${car.price.toLocaleString()}`}
              </span>
              {car.owned ? (
                <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded font-bold text-sm border border-green-500/50">
                  OWNED
                </span>
              ) : (
                <button
                  onClick={() => handleBuy(car.id)}
                  disabled={money < car.price}
                  className={`px-6 py-2 rounded font-bold transition ${
                    money >= car.price
                      ? 'btn-primary'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  BUY NOW
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShopPage;
