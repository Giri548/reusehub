import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Package, HeartHandshake } from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import { useApp } from '../../context/AppContext';

export default function LoginPage() {
  const { login, quickLoginByRole } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});

  const redirectByRole = (role) => {
    if (role === 'donor') navigate('/donor');
    else if (role === 'admin') navigate('/admin');
    else navigate('/receiver');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!email.trim() || !email.includes('@')) errs.email = 'Enter a valid email address.';
    if (!password || password.length < 6) errs.password = 'Password must be at least 6 characters.';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const result = login(email, password);
    if (result.ok) {
      redirectByRole(result.user.role);
    }
  };

  const handleDemo = (role) => {
    const user = quickLoginByRole(role);
    if (user) redirectByRole(user.role);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-white to-teal-50/60">
      <PublicNavbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full grid md:grid-cols-12 bg-white rounded-3xl shadow-xl shadow-emerald-900/5 border border-emerald-100 overflow-hidden">
          {/* Left Panel */}
          <div className="md:col-span-5 bg-gradient-to-br from-emerald-700 to-teal-800 text-white p-8 flex flex-col justify-between">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-emerald-100 text-xs font-bold mb-4">
                Welcome Back
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                Sign in to your ReUseHub Portal
              </h1>
              <p className="text-emerald-100/90 text-sm mt-3 leading-relaxed">
                Track active resource claims, manage surplus donations, or oversee community impact.
              </p>
            </div>

            <div className="mt-8 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                1-Click Instant Demo Access
              </p>
              <button
                type="button"
                onClick={() => handleDemo('receiver')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-left transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <HeartHandshake className="h-4 w-4 text-emerald-300" />
                  <div>
                    <p className="text-xs font-bold">Receiver Demo</p>
                    <p className="text-[11px] text-emerald-200">aarav@reusehub.org</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => handleDemo('donor')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-left transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Package className="h-4 w-4 text-emerald-300" />
                  <div>
                    <p className="text-xs font-bold">Donor Demo</p>
                    <p className="text-[11px] text-emerald-200">meera@reusehub.org</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => handleDemo('admin')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-left transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-300" />
                  <div>
                    <p className="text-xs font-bold">Admin Demo</p>
                    <p className="text-[11px] text-emerald-200">admin@reusehub.org</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right Form */}
          <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
            <h2 className="text-2xl font-extrabold text-slate-900">Member Login</h2>
            <p className="text-sm text-slate-500 mt-1">
              Enter your credentials or use a quick demo role on the left.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@reusehub.org"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                  />
                </div>
                {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-rose-600 mt-1">{errors.password}</p>}
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Demo password for all accounts: <code className="font-mono text-slate-600">password123</code>
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all inline-flex items-center justify-center gap-2"
              >
                Sign In
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <p className="mt-6 text-sm text-slate-600 text-center">
              New to ReUseHub?{' '}
              <Link to="/register" className="font-bold text-emerald-700 hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
