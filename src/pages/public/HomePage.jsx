import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Armchair,
  Laptop,
  PencilRuler,
  Package,
  Sparkles,
  Recycle,
  Users,
  CheckCircle2,
  QrCode,
  Search,
  UploadCloud,
  HeartHandshake,
  Quote,
  Leaf,
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import Footer from '../../components/layout/Footer';
import ResourceCard from '../../components/common/ResourceCard';
import { CATEGORIES, TESTIMONIALS } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

const CATEGORY_ICONS = {
  Books: BookOpen,
  Furniture: Armchair,
  Electronics: Laptop,
  Stationery: PencilRuler,
  Others: Package,
};

export default function HomePage() {
  const { resources, claims, users } = useApp();
  const [howTab, setHowTab] = useState('receiver');

  const activeResources = resources.filter((r) => r.status === 'Active');
  const recentResources = activeResources.slice(0, 6);

  const completedCount = claims.filter((c) => c.status === 'Completed').length + 1240;
  const totalSaved = resources.reduce((sum, r) => sum + r.quantity, 0) + 3420;
  const kgDiverted = Math.round(
    resources.reduce((sum, r) => sum + (r.weightKg || 5), 0) + 4860
  );
  const activeDonors = users.filter((u) => u.role === 'donor').length + 415;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50/70 pt-14 pb-20 lg:pt-20 lg:pb-28">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-emerald-200/35 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-teal-200/35 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6 animate-slide-up">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                Circular Community Sharing Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Give Resources a{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                  Second Life
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Connect your unused books, ergonomic furniture, refurbished electronics, and stationery with students, schools, and local organizations who need them most.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  to="/browse"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-600/25 transition-all hover:-translate-y-0.5"
                >
                  Explore Resources
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-800 font-bold text-sm sm:text-base border border-emerald-200 shadow-sm transition-all"
                >
                  Donate Unused Items
                </Link>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-600 font-medium">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  100% Free Community Exchange
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  QR-Verified Safe Pickups
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Verified Local NGOs
                </span>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-emerald-900/10 border-4 border-white bg-emerald-900">
                <img
                  src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=1000&q=80"
                  alt="Community members sharing books and supplies"
                  className="w-full h-[380px] sm:h-[430px] object-cover opacity-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center justify-between gap-3 text-white">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                      Live Today in Bengaluru
                    </p>
                    <p className="text-lg font-bold">
                      {activeResources.length} Active Resource Batches Ready for Pickup
                    </p>
                  </div>
                  <Link
                    to="/browse"
                    className="px-4 py-2 rounded-xl bg-white/95 text-emerald-800 text-xs font-bold hover:bg-white transition-colors"
                  >
                    Browse Now
                  </Link>
                </div>
              </div>

              {/* Floating Impact Card */}
              <div className="hidden sm:flex items-center gap-3 bg-white rounded-2xl p-3.5 shadow-xl border border-emerald-100 absolute -top-5 -left-5 animate-float-slow">
                <div className="h-11 w-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Recycle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-lg font-extrabold text-slate-900">{kgDiverted.toLocaleString()} kg</p>
                  <p className="text-xs font-medium text-slate-500">Waste Diverted</p>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-3 bg-white rounded-2xl p-3.5 shadow-xl border border-emerald-100 absolute -bottom-5 -right-4">
                <div className="h-11 w-11 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                  <QrCode className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-slate-900">Instant QR Pass</p>
                  <p className="text-xs font-medium text-slate-500">Seamless handoffs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Browse by Category
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Find What Your Community Needs
              </h2>
            </div>
            <Link
              to="/browse"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800"
            >
              View all categories
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.id] || Package;
              const count = activeResources.filter((r) => r.category === cat.id).length;
              return (
                <Link
                  key={cat.id}
                  to={`/browse?category=${encodeURIComponent(cat.id)}`}
                  className="group p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-emerald-300 hover:bg-emerald-50/30 card-hover flex flex-col justify-between"
                >
                  <div>
                    <div
                      className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${cat.iconBg}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-700">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
                    <span>{count} {count === 1 ? 'listing' : 'listings'}</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recently Added Resources */}
      <section className="py-16 bg-slate-50/70 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Freshly Listed
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Recently Added Resources
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Claim surplus items ready for neighborhood pickup today.
              </p>
            </div>
            <Link
              to="/browse"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-700 hover:border-emerald-300 hover:text-emerald-700 transition-colors"
            >
              Explore All ({activeResources.length})
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-18 py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Simple Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              How ReUseHub Works
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Whether you are clearing out surplus supplies or equipping a community classroom, getting started takes under two minutes.
            </p>

            <div className="inline-flex p-1 rounded-2xl bg-emerald-50 border border-emerald-100 mt-6">
              <button
                onClick={() => setHowTab('receiver')}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                  howTab === 'receiver'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-emerald-800 hover:text-emerald-950'
                }`}
              >
                For Receivers
              </button>
              <button
                onClick={() => setHowTab('donor')}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                  howTab === 'donor'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-emerald-800 hover:text-emerald-950'
                }`}
              >
                For Donors
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {(howTab === 'receiver'
              ? [
                  {
                    step: '01',
                    icon: Search,
                    title: 'Discover Local Resources',
                    desc: 'Filter available books, electronics, furniture, and stationery by category, condition, and neighborhood.',
                  },
                  {
                    step: '02',
                    icon: HeartHandshake,
                    title: 'Submit a Purpose Claim',
                    desc: 'Select the exact quantity you need, share how it will help, and pick a convenient pickup time slot.',
                  },
                  {
                    step: '03',
                    icon: QrCode,
                    title: 'Collect with QR Pass',
                    desc: 'Once approved by the donor, present your verified QR pickup code at the collection desk.',
                  },
                ]
              : [
                  {
                    step: '01',
                    icon: UploadCloud,
                    title: 'List Surplus Items',
                    desc: 'Snap photos, enter quantity, condition, and pickup location in our guided listing form.',
                  },
                  {
                    step: '02',
                    icon: CheckCircle2,
                    title: 'Review & Approve Claims',
                    desc: 'Read receiver purpose statements and approve requests that create the highest community impact.',
                  },
                  {
                    step: '03',
                    icon: Leaf,
                    title: 'Hand Over & Track Impact',
                    desc: 'Verify the receiver’s QR pass at pickup and watch your CO₂ & waste-diversion metrics grow.',
                  },
                ]
            ).map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="relative p-7 rounded-3xl border border-emerald-100 bg-gradient-to-b from-emerald-50/40 to-white hover:shadow-lg transition-all"
                >
                  <span className="text-4xl font-extrabold text-emerald-100 absolute top-5 right-6 select-none">
                    {item.step}
                  </span>
                  <div className="h-12 w-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-5 shadow-md shadow-emerald-600/20">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Community Impact Counters */}
      <section className="py-16 bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              Measurable Community Impact
            </h2>
            <p className="text-emerald-100 text-sm mt-2">
              Every shared notebook, desk, and laptop keeps usable goods out of landfills.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: 'Resources Given New Life', value: totalSaved.toLocaleString() + '+', icon: Package },
              { label: 'Waste Diverted from Landfills', value: `${kgDiverted.toLocaleString()} kg`, icon: Recycle },
              { label: 'Active Community Donors', value: activeDonors.toLocaleString() + '+', icon: Users },
              { label: 'Completed Exchanges', value: completedCount.toLocaleString() + '+', icon: CheckCircle2 },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-6 text-center hover:bg-white/15 transition-colors"
                >
                  <Icon className="h-6 w-6 text-emerald-300 mx-auto mb-3" />
                  <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-emerald-100 mt-1.5 font-medium">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Community Stories
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Trusted by Donors, Libraries & Schools
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between card-hover"
              >
                <div>
                  <Quote className="h-8 w-8 text-emerald-200 mb-4" />
                  <p className="text-sm text-slate-600 leading-relaxed">“{t.quote}”</p>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="h-10 w-10 rounded-full object-cover border border-emerald-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{t.name}</p>
                      <p className="text-xs text-slate-500 truncate">{t.role}</p>
                    </div>
                  </div>
                  <span className="shrink-0 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                    {t.impactTag}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="mt-16 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 p-8 sm:p-12 text-white flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl shadow-emerald-900/10">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold">
                Ready to share or discover resources?
              </h3>
              <p className="text-emerald-100 text-sm sm:text-base mt-2 max-w-xl">
                Create a free Donor or Receiver account in seconds, or explore live demo dashboards right away.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link
                to="/register"
                className="px-6 py-3 rounded-xl bg-white text-emerald-800 font-bold text-sm hover:bg-emerald-50 transition-colors"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 rounded-xl bg-emerald-800/60 border border-emerald-400/40 text-white font-bold text-sm hover:bg-emerald-800 transition-colors"
              >
                Try Demo Dashboards
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
