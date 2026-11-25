import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, LayoutDashboard, LogOut } from 'lucide-react';
import Logo from '../common/Logo';
import { useApp } from '../../context/AppContext';

export default function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser, logout, settings } = useApp();
  const navigate = useNavigate();

  const dashboardPath =
    currentUser?.role === 'donor'
      ? '/donor'
      : currentUser?.role === 'admin'
      ? '/admin'
      : '/receiver';

  const navLinkCls = ({ isActive }) =>
    `text-sm font-semibold transition-colors px-3 py-2 rounded-lg ${
      isActive
        ? 'text-emerald-700 bg-emerald-50'
        : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/60'
    }`;

  return (
    <header className="sticky top-0 z-40 glass-nav">
      {settings.maintenanceBanner && (
        <div className="bg-emerald-900 text-emerald-50 text-xs font-medium text-center py-1.5 px-4">
          Scheduled community maintenance this Sunday 2:00 AM – 4:00 AM IST. Pickups remain unaffected.
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          <Link to="/" className="shrink-0">
            <Logo />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" end className={navLinkCls}>
              Home
            </NavLink>
            <NavLink to="/browse" className={navLinkCls}>
              Browse Resources
            </NavLink>
            <NavLink to="/about" className={navLinkCls}>
              About
            </NavLink>
          </nav>

          <div className="hidden md:flex items-center gap-2.5">
            {currentUser ? (
              <>
                <Link
                  to={dashboardPath}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 shadow-sm shadow-emerald-600/20 transition-all"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)} Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:text-rose-600 hover:border-rose-200 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 shadow-sm shadow-emerald-600/20 transition-all"
                >
                  Register
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-emerald-100 bg-white px-4 py-4 space-y-2 animate-fade-in">
          <NavLink
            to="/"
            end
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `block px-3 py-2.5 rounded-xl text-sm font-semibold ${
                isActive ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700'
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/browse"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `block px-3 py-2.5 rounded-xl text-sm font-semibold ${
                isActive ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700'
              }`
            }
          >
            Browse Resources
          </NavLink>
          <NavLink
            to="/about"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `block px-3 py-2.5 rounded-xl text-sm font-semibold ${
                isActive ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700'
              }`
            }
          >
            About
          </NavLink>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {currentUser ? (
              <>
                <Link
                  to={dashboardPath}
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                    navigate('/');
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
