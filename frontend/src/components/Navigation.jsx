import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Car, Trophy, Wrench, DollarSign, Users, Settings, Home, Zap, Award, ShoppingCart, Menu, X } from 'lucide-react';
import { useGame } from '../context/GameContext';

function Navigation() {
  const { money } = useGame();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { to: '/', icon: <Home size={18} />, label: 'Home' },
    { to: '/garage', icon: <Car size={18} />, label: 'Garage' },
    { to: '/races', icon: <Zap size={18} />, label: 'Races' },
    { to: '/upgrades', icon: <Wrench size={18} />, label: 'Upgrades' },
    { to: '/shop', icon: <ShoppingCart size={18} />, label: 'Shop' },
    { to: '/leaderboard', icon: <Trophy size={18} />, label: 'Leaderboard' },
    { to: '/history', icon: <Award size={18} />, label: 'History' },
    { to: '/stats', icon: <Users size={18} />, label: 'Stats' },
    { to: '/settings', icon: <Settings size={18} />, label: 'Settings' },
    { to: '/about', icon: <DollarSign size={18} />, label: 'About' },
  ];

  return (
    <nav className="glass border-b border-cyan-500/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-header neon-text tracking-wider">GODSRODS</span>
          </Link>

          {/* Balance Display */}
          <div className="hidden md:flex items-center gap-6">
            <div className="text-yellow-400 font-bold text-lg">
              ${money.toLocaleString()}
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                icon={item.icon}
                active={location.pathname === item.to}
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-4">
            <div className="text-yellow-400 font-bold">
              ${money.toLocaleString()}
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white p-2"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/10">
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-4 py-3 rounded transition ${
                    location.pathname === item.to
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  <span className="text-sm">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function NavLink({ to, icon, children, active }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-1 px-3 py-2 rounded text-sm transition ${
        active
          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
          : 'bg-white/5 hover:bg-white/10'
      }`}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}

export default Navigation;
