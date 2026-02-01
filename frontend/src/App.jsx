import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import GaragePage from './pages/GaragePage';
import RacesPage from './pages/RacesPage';
import RacePage from './pages/RacePage';
import UpgradesPage from './pages/UpgradesPage';
import ShopPage from './pages/ShopPage';
import LeaderboardPage from './pages/LeaderboardPage';
import HistoryPage from './pages/HistoryPage';
import StatsPage from './pages/StatsPage';
import SettingsPage from './pages/SettingsPage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/garage" element={<GaragePage />} />
        <Route path="/races" element={<RacesPage />} />
        <Route path="/race/:raceId" element={<RacePage />} />
        <Route path="/upgrades" element={<UpgradesPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </div>
  );
}

export default App;
