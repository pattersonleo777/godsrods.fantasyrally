import React from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '../context/GameContext';

function GaragePage() {
  const { cars, equippedCar, equipCar } = useGame();
  const ownedCars = cars.filter(c => c.owned);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-header neon-text mb-8">MY GARAGE</h1>

      {ownedCars.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-xl text-gray-400 mb-4">Your garage is empty</p>
          <Link to="/shop" className="btn-primary inline-block">
            Visit the Shop
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ownedCars.map(car => (
            <div
              key={car.id}
              className={`card transition-all ${
                car.equipped
                  ? 'ring-2 ring-cyan-400 shadow-lg shadow-cyan-500/20'
                  : 'hover:border-white/20'
              }`}
            >
              {/* Car Image Placeholder */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 aspect-video rounded-lg mb-4 flex items-center justify-center border border-white/5">
                <span className="text-4xl">🏎️</span>
              </div>

              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{car.name}</h3>
                {car.equipped && (
                  <span className="bg-cyan-500 text-black text-xs px-2 py-1 rounded font-bold">
                    EQUIPPED
                  </span>
                )}
              </div>

              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Speed</span>
                  <span className="font-semibold text-red-400">{car.speed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Acceleration</span>
                  <span className="font-semibold text-blue-400">{car.acceleration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Handling</span>
                  <span className="font-semibold text-green-400">{car.handling}</span>
                </div>
              </div>

              {!car.equipped && (
                <button
                  onClick={() => equipCar(car.id)}
                  className="w-full btn-primary py-3"
                >
                  EQUIP THIS CAR
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Garage Summary */}
      <div className="mt-8 card">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-header text-lg text-gray-400">GARAGE CAPACITY</h3>
            <p className="text-2xl font-bold">{ownedCars.length} / {cars.length} Cars</p>
          </div>
          <Link to="/shop" className="btn-primary">
            BUY MORE CARS
          </Link>
        </div>
      </div>
    </div>
  );
}

export default GaragePage;
