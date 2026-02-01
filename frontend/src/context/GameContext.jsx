import React, { createContext, useContext, useState, useEffect } from 'react';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
};

// Initial game data
const initialCars = [
  { id: 1, name: 'Street Starter', speed: 50, acceleration: 40, handling: 45, price: 0, owned: true, equipped: true, image: '/assets/images/starter.jpg' },
  { id: 2, name: 'City Cruiser', speed: 65, acceleration: 55, handling: 60, price: 5000, owned: false, equipped: false, image: '/assets/images/cruiser.jpg' },
  { id: 3, name: 'Speed Demon', speed: 80, acceleration: 75, handling: 70, price: 15000, owned: false, equipped: false, image: '/assets/images/demon.jpg' },
  { id: 4, name: 'Thunder Bolt', speed: 95, acceleration: 90, handling: 85, price: 35000, owned: false, equipped: false, image: '/assets/images/thunderbolt.jpg' },
  { id: 5, name: 'Apex Predator', speed: 100, acceleration: 100, handling: 95, price: 75000, owned: false, equipped: false, image: '/assets/images/apex.jpg' },
];

const initialUpgrades = [
  { id: 1, name: 'Turbo Kit', type: 'acceleration', bonus: 10, price: 2000, owned: false },
  { id: 2, name: 'Nitrous System', type: 'speed', bonus: 15, price: 3500, owned: false },
  { id: 3, name: 'Racing Tires', type: 'handling', bonus: 12, price: 1500, owned: false },
  { id: 4, name: 'Engine Tune', type: 'acceleration', bonus: 20, price: 5000, owned: false },
  { id: 5, name: 'Aerodynamic Kit', type: 'speed', bonus: 25, price: 7000, owned: false },
  { id: 6, name: 'Suspension Pro', type: 'handling', bonus: 18, price: 4000, owned: false },
];

export const races = [
  { id: 1, name: 'City Streets', difficulty: 'Easy', prize: 500, requiredSpeed: 40, description: 'Night cruise through downtown' },
  { id: 2, name: 'Highway Rush', difficulty: 'Medium', prize: 1500, requiredSpeed: 60, description: 'High-speed highway challenge' },
  { id: 3, name: 'Mountain Pass', difficulty: 'Hard', prize: 3500, requiredSpeed: 80, description: 'Treacherous mountain roads' },
  { id: 4, name: 'Desert Storm', difficulty: 'Expert', prize: 7500, requiredSpeed: 90, description: 'Sandstorm survival race' },
  { id: 5, name: 'Championship Finals', difficulty: 'Legend', prize: 15000, requiredSpeed: 95, description: 'The ultimate showdown' },
];

export function GameProvider({ children }) {
  // Load saved state or use defaults
  const loadState = (key, defaultValue) => {
    const saved = localStorage.getItem(`godsrods_${key}`);
    return saved ? JSON.parse(saved) : defaultValue;
  };

  const [money, setMoney] = useState(() => loadState('money', 10000));
  const [cars, setCars] = useState(() => loadState('cars', initialCars));
  const [upgrades, setUpgrades] = useState(() => loadState('upgrades', initialUpgrades));
  const [raceHistory, setRaceHistory] = useState(() => loadState('raceHistory', []));
  const [playerStats, setPlayerStats] = useState(() => loadState('playerStats', {
    totalRaces: 0,
    wins: 0,
    losses: 0,
    totalEarnings: 0,
    fastestTime: null,
  }));

  const [leaderboard] = useState([
    { name: 'SpeedKing', wins: 45, totalEarnings: 125000 },
    { name: 'RaceQueen', wins: 38, totalEarnings: 98000 },
    { name: 'NitroNinja', wins: 32, totalEarnings: 87000 },
    { name: 'DriftMaster', wins: 28, totalEarnings: 72000 },
    { name: 'TurboTitan', wins: 25, totalEarnings: 65000 },
  ]);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem('godsrods_money', JSON.stringify(money));
  }, [money]);

  useEffect(() => {
    localStorage.setItem('godsrods_cars', JSON.stringify(cars));
  }, [cars]);

  useEffect(() => {
    localStorage.setItem('godsrods_upgrades', JSON.stringify(upgrades));
  }, [upgrades]);

  useEffect(() => {
    localStorage.setItem('godsrods_raceHistory', JSON.stringify(raceHistory));
  }, [raceHistory]);

  useEffect(() => {
    localStorage.setItem('godsrods_playerStats', JSON.stringify(playerStats));
  }, [playerStats]);

  const equippedCar = cars.find(c => c.equipped);

  const getCarStats = () => {
    if (!equippedCar) return { speed: 0, acceleration: 0, handling: 0 };

    let stats = {
      speed: equippedCar.speed,
      acceleration: equippedCar.acceleration,
      handling: equippedCar.handling,
    };

    upgrades.filter(u => u.owned).forEach(upgrade => {
      stats[upgrade.type] += upgrade.bonus;
    });

    return stats;
  };

  const buyCar = (carId) => {
    const car = cars.find(c => c.id === carId);
    if (car && money >= car.price && !car.owned) {
      setMoney(prev => prev - car.price);
      setCars(prev => prev.map(c => c.id === carId ? { ...c, owned: true } : c));
      return true;
    }
    return false;
  };

  const equipCar = (carId) => {
    setCars(prev => prev.map(c => ({ ...c, equipped: c.id === carId })));
  };

  const buyUpgrade = (upgradeId) => {
    const upgrade = upgrades.find(u => u.id === upgradeId);
    if (upgrade && money >= upgrade.price && !upgrade.owned) {
      setMoney(prev => prev - upgrade.price);
      setUpgrades(prev => prev.map(u => u.id === upgradeId ? { ...u, owned: true } : u));
      return true;
    }
    return false;
  };

  const completeRace = (race, won, raceTime) => {
    const earnings = won ? race.prize : Math.floor(race.prize * 0.2);
    setMoney(prev => prev + earnings);

    const historyEntry = {
      ...race,
      won,
      earnings,
      date: new Date().toISOString(),
      carUsed: equippedCar?.name,
      raceTime,
    };

    setRaceHistory(prev => [historyEntry, ...prev.slice(0, 49)]);

    setPlayerStats(prev => ({
      totalRaces: prev.totalRaces + 1,
      wins: prev.wins + (won ? 1 : 0),
      losses: prev.losses + (won ? 0 : 1),
      totalEarnings: prev.totalEarnings + earnings,
      fastestTime: raceTime && (!prev.fastestTime || raceTime < prev.fastestTime) ? raceTime : prev.fastestTime,
    }));

    return earnings;
  };

  const resetGame = () => {
    setMoney(10000);
    setCars(initialCars);
    setUpgrades(initialUpgrades);
    setRaceHistory([]);
    setPlayerStats({
      totalRaces: 0,
      wins: 0,
      losses: 0,
      totalEarnings: 0,
      fastestTime: null,
    });
  };

  return (
    <GameContext.Provider value={{
      money,
      cars,
      upgrades,
      raceHistory,
      leaderboard,
      playerStats,
      equippedCar,
      getCarStats,
      buyCar,
      equipCar,
      buyUpgrade,
      completeRace,
      resetGame,
    }}>
      {children}
    </GameContext.Provider>
  );
}
