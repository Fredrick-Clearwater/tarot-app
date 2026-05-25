import { useState } from 'react';
import type { AppPage } from '../types';

interface HeaderProps {
  onNavigate: (page: AppPage) => void;
  currentPage: AppPage;
}

export default function Header({ onNavigate, currentPage }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems: { page: AppPage; label: string; icon: string }[] = [
    { page: 'home', label: '占卜', icon: '🃏' },
    { page: 'history', label: '记录', icon: '📜' },
    { page: 'settings', label: '设置', icon: '⚙️' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-mystic-950/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 group"
        >
          <span className="text-2xl">🌙</span>
          <h1 className="text-xl font-serif font-bold text-gradient group-hover:opacity-80 transition-opacity">
            Mystic Tarot
          </h1>
        </button>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${
                  currentPage === item.page
                    ? 'bg-mystic-600/30 text-mystic-200 border border-mystic-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <span className="mr-1.5">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="sm:hidden border-t border-white/10 bg-mystic-950/95 backdrop-blur-md">
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => {
                onNavigate(item.page);
                setMenuOpen(false);
              }}
              className={`w-full px-4 py-3 text-left text-sm font-medium transition-colors
                ${
                  currentPage === item.page
                    ? 'bg-mystic-600/20 text-mystic-200'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
