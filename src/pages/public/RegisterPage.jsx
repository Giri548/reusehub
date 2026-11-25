import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, MapPin, Building2, Package, HeartHandshake, ArrowRight } from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import { useApp } from '../../context/AppContext';

export default function RegisterPage() {
  const { register } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'receiver',
    organization: '',
    location: '',
  });
  const [errors, setErrors] = useState({});

  const update = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      errs.name = 'Please enter your full name.';
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Enter a valid email address.';
    }
    if (!form.password || form.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }
    if (!form.role) {
      errs.role = 'Select whether you are joining as a Donor or Receiver.';
    }

    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const result = register(form);
    if (result.ok) {
      navigate(result.user.role === 'donor' ? '/donor' : '/receiver');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-white to-teal-50/60">
      <PublicNavbar />

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl shadow-emerald-900/5 border border-emerald-100 p-7 sm:p-10">
          <div className="text-center max-w-md mx-auto">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-2">
              Join the Circular Community
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Create Your ReUseHub Account
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Choose your role below and start sharing or collecting resources.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            {/* Role Selection Cards */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Select Your Role
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'receiver',
                    title: 'Receiver',
                    desc: 'Browse & request resources for study, NGOs, or community use',
                    icon: HeartHandshake,
                  },
                  {
                    id: 'donor',
                    title: 'Donor',
                    desc: 'List unused items, approve requests & track waste diverted',
                    icon: Package,
                  },
                ].map((r) => {
                  const Icon = r.icon;
                  const active = form.role === r.id;
                  return (
                    <button
                      type="button"
                      key={r.id}
                      onClick={() => update('role', r.id)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3 ${
                        active
                          ? 'border-emerald-600 bg-emerald-50/70 shadow-sm'
                          : 'border-slate-200 hover:border-emerald-300'
                      }`}
                    >
                      <div
                        className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                          active ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900">{r.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5 leading-snug">{r.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    placeholder="e.g., Priya Sharma"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    placeholder="priya@example.org"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => update('password', e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                {errors.password && <p className="text-xs text-rose-600 mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => update('confirmPassword', e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-rose-600 mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Organization / School (Optional)
                </label>
                <div className="relative">
                  <Building2 className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={form.organization}
                    onChange={(e) => update('organization', e.target.value)}
                    placeholder="e.g., Community Library"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Neighborhood / City
                </label>
                <div className="relative">
                  <MapPin className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => update('location', e.target.value)}
                    placeholder="e.g., Indiranagar, Bengaluru"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all inline-flex items-center justify-center gap-2"
            >
              Create Account & Enter Dashboard
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-600 text-center">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-emerald-700 hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
