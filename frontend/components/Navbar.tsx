'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false); // scrolling down
      } else {
        setIsVisible(true);  // scrolling up
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header className={`fixed top-0 w-full z-50 glass shadow-sm transition-transform duration-300 ease-apple ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="page-container">
        <div className="flex h-24 items-center justify-between">
          <Link href="/" className="flex items-center group">
            <img src="/logo.svg" alt="First Price Immo" className="h-20 w-auto -ml-2 transition-transform duration-300 group-hover:scale-105" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/" className="rounded-lg px-4 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50 hover:text-brand-900 transition-colors">
              Annonces
            </Link>
            {user ? (
              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-brand-100">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-500 text-white text-xs font-bold">
                  {user.name?.charAt(0).toUpperCase() || 'A'}
                </div>
                <button
                  onClick={logout}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            ) : null}
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden rounded-lg p-2 text-brand-600 hover:bg-brand-50"
          >
            {mobileOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-brand-100 bg-white px-4 py-4 animate-fade-in">
          <nav className="flex flex-col gap-1">
            <Link href="/" onClick={() => setMobileOpen(false)} className="rounded-lg px-4 py-3 text-sm font-medium text-brand-600 hover:bg-brand-50">
              Annonces
            </Link>
            {user ? (
              <button onClick={() => { logout(); setMobileOpen(false); }} className="rounded-lg px-4 py-3 text-sm font-medium text-rose-600 hover:bg-rose-50 text-left">
                Déconnexion
              </button>
            ) : null}
          </nav>
        </div>
      )}
    </header>
  );
}
