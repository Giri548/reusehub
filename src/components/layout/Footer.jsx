import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Heart, Send } from 'lucide-react';
import Logo from '../common/Logo';
import { useApp } from '../../context/AppContext';

export default function Footer() {
  const [email, setEmail] = useState('');
  const { showToast } = useApp();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    showToast('Subscribed to ReUseHub weekly impact digest!', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-emerald-950 text-emerald-100 border-t border-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Logo light />
            <p className="mt-4 text-sm text-emerald-200/80 leading-relaxed">
              ReUseHub connects generous individuals and organizations with students, schools, and local communities to give surplus resources a meaningful second life.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-300">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>Bengaluru Community Network & Beyond</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-emerald-200/80">
              <li>
                <Link to="/browse" className="hover:text-white transition-colors">
                  Browse All Resources
                </Link>
              </li>
              <li>
                <Link to="/browse?category=Books" className="hover:text-white transition-colors">
                  Books & Textbooks
                </Link>
              </li>
              <li>
                <Link to="/browse?category=Furniture" className="hover:text-white transition-colors">
                  Office & Study Furniture
                </Link>
              </li>
              <li>
                <Link to="/browse?category=Electronics" className="hover:text-white transition-colors">
                  Refurbished Electronics
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Our Mission
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Dashboards
            </h4>
            <ul className="space-y-2.5 text-sm text-emerald-200/80">
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Become a Donor
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Join as a Receiver
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Member Login
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Weekly Impact Digest
            </h4>
            <p className="text-sm text-emerald-200/80 mb-3">
              Get updates on newly listed community batches and sustainability milestones.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="h-4 w-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.org"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-emerald-900/70 border border-emerald-800 text-sm text-white placeholder:text-emerald-400 focus:outline-none focus:border-emerald-400"
                />
              </div>
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-semibold text-sm transition-colors inline-flex items-center gap-1"
                aria-label="Subscribe"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-emerald-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-300/80">
          <p>© {new Date().getFullYear()} ReUseHub. Built for circular communities.</p>
          <p className="inline-flex items-center gap-1.5">
            Made with <Heart className="h-3.5 w-3.5 text-emerald-400 fill-emerald-400" /> to reduce waste and empower sharing.
          </p>
        </div>
      </div>
    </footer>
  );
}
