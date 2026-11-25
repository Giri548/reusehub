import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ShieldCheck, Globe2, HeartHandshake, ArrowRight } from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import Footer from '../../components/layout/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavbar />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-16 lg:py-24 border-b border-emerald-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-4">
              <Leaf className="h-3.5 w-3.5" />
              Our Mission & Story
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Bridging Surplus and Need in Every Neighborhood
            </h1>
            <p className="text-base sm:text-lg text-slate-600 mt-5 leading-relaxed">
              Every year, millions of usable textbooks, office chairs, laptops, and stationery kits sit idle in closets or head to landfills—while nearby students, community libraries, and NGOs struggle to afford basic learning tools. ReUseHub makes circular sharing effortless, transparent, and local.
            </p>
          </div>
        </section>

        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Globe2,
                title: 'Circular Sustainability',
                desc: 'Extending the lifespan of everyday electronics, furniture, and paper goods drastically lowers embodied carbon and municipal waste.',
              },
              {
                icon: ShieldCheck,
                title: 'Trust & Verification',
                desc: 'Partner schools, libraries, and NGOs go through organization verification, and every approved pickup generates a unique QR pass.',
              },
              {
                icon: HeartHandshake,
                title: 'Dignified Community Access',
                desc: 'Receivers browse cleanly photographed listings, request exact quantities with purpose notes, and schedule respectful pickups.',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-7 rounded-3xl border border-slate-200/80 bg-white shadow-sm card-hover"
                >
                  <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-16 rounded-3xl bg-emerald-900 text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-extrabold">Want to partner or donate a bulk batch?</h2>
              <p className="text-emerald-200 text-sm mt-2 max-w-xl">
                Register as a Donor or Receiver today and join 400+ local contributors building zero-waste communities.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-sm transition-colors"
              >
                Join ReUseHub
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/browse"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-emerald-600 text-white font-bold text-sm hover:bg-emerald-800 transition-colors"
              >
                Browse Items
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
