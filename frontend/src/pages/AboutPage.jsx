import React from 'react';
import { Github, Twitter, Mail, Heart, Zap, Car, Trophy } from 'lucide-react';

function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-header neon-text mb-8 text-center">ABOUT GODSRODS</h1>

      {/* Game Info */}
      <div className="card mb-8 text-center">
        <div className="text-6xl mb-4">🏎️</div>
        <h2 className="text-2xl font-header mb-4">Drag Racing Underground</h2>
        <p className="text-gray-400 max-w-lg mx-auto">
          GodsRods is an adrenaline-fueled drag racing game where you build your dream garage,
          upgrade your rides, and compete against the best racers in the underground scene.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card text-center">
          <div className="flex justify-center mb-3 text-cyan-400">
            <Car size={32} />
          </div>
          <h3 className="font-bold mb-2">Collect Cars</h3>
          <p className="text-sm text-gray-400">
            Build your ultimate garage with unique vehicles
          </p>
        </div>
        <div className="card text-center">
          <div className="flex justify-center mb-3 text-orange-400">
            <Zap size={32} />
          </div>
          <h3 className="font-bold mb-2">Upgrade Performance</h3>
          <p className="text-sm text-gray-400">
            Boost speed, acceleration, and handling
          </p>
        </div>
        <div className="card text-center">
          <div className="flex justify-center mb-3 text-yellow-400">
            <Trophy size={32} />
          </div>
          <h3 className="font-bold mb-2">Compete & Win</h3>
          <p className="text-sm text-gray-400">
            Race through different difficulty levels
          </p>
        </div>
      </div>

      {/* How to Play */}
      <div className="card mb-8">
        <h2 className="font-header text-xl text-cyan-400 mb-4">HOW TO PLAY</h2>
        <ol className="space-y-3 text-gray-300">
          <li className="flex gap-3">
            <span className="bg-cyan-500 text-black w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">1</span>
            <span>Start with your free Street Starter car and $10,000</span>
          </li>
          <li className="flex gap-3">
            <span className="bg-cyan-500 text-black w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">2</span>
            <span>Race in the City Streets to earn money and experience</span>
          </li>
          <li className="flex gap-3">
            <span className="bg-cyan-500 text-black w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">3</span>
            <span>Purchase upgrades to boost your car's performance</span>
          </li>
          <li className="flex gap-3">
            <span className="bg-cyan-500 text-black w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">4</span>
            <span>Buy faster cars to unlock harder races with bigger prizes</span>
          </li>
          <li className="flex gap-3">
            <span className="bg-cyan-500 text-black w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">5</span>
            <span>Climb the leaderboard and become the ultimate drag racer!</span>
          </li>
        </ol>
      </div>

      {/* Tech Stack */}
      <div className="card mb-8">
        <h2 className="font-header text-xl text-cyan-400 mb-4">BUILT WITH</h2>
        <div className="flex flex-wrap gap-2">
          {['React', 'React Router', 'Tailwind CSS', 'Vite', 'Lucide Icons', 'Supabase'].map(tech => (
            <span key={tech} className="px-3 py-1 bg-white/10 rounded-full text-sm">
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Credits */}
      <div className="card text-center">
        <h2 className="font-header text-xl text-cyan-400 mb-4">CREDITS</h2>
        <p className="text-gray-400 mb-4">
          Made with <Heart size={16} className="inline text-red-500" /> by the GodsRods Team
        </p>
        <div className="flex justify-center gap-4">
          <a href="#" className="text-gray-400 hover:text-white transition">
            <Github size={24} />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition">
            <Twitter size={24} />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition">
            <Mail size={24} />
          </a>
        </div>
        <p className="text-sm text-gray-500 mt-6">
          Version 1.0.0 | 2024
        </p>
      </div>
    </div>
  );
}

export default AboutPage;
