import React from 'react';
import { Leaf, Recycle, Users, PackageCheck, Award } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import { CATEGORIES } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export default function DonorImpactPage() {
  const { currentUser, resources, claims } = useApp();

  const myListings = resources.filter((r) => r.donorId === currentUser?.id);
  const myClaims = claims.filter((c) => c.donorId === currentUser?.id);
  const completed = myClaims.filter((c) => c.status === 'Completed' || c.status === 'Approved');

  const totalItemsDonated = myListings.reduce((s, r) => s + r.quantity, 0);
  const totalKg = Math.round(myListings.reduce((s, r) => s + (r.weightKg || 4), 0));
  const co2Saved = Math.round(totalKg * 2.4);
  const beneficiaries = new Set(completed.map((c) => c.receiverOrg || c.receiverId)).size;

  const maxCatCount = Math.max(
    1,
    ...CATEGORIES.map((cat) =>
      myListings.filter((r) => r.category === cat.id).reduce((s, r) => s + r.quantity, 0)
    )
  );

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-br from-emerald-700 to-teal-800 text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-lg">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-emerald-100 text-xs font-bold mb-2">
            <Award className="h-3.5 w-3.5" /> Sustainability Report
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold">Your Environmental Impact</h2>
          <p className="text-emerald-100 text-sm mt-1 max-w-xl">
            Every surplus item you list keeps usable materials in circulation and reduces manufacturing emissions.
          </p>
        </div>
        <div className="bg-white/10 border border-white/20 rounded-2xl px-5 py-4 text-center shrink-0">
          <p className="text-xs uppercase tracking-wider text-emerald-200 font-bold">CO₂ Avoided</p>
          <p className="text-3xl font-extrabold mt-1">{co2Saved} kg</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Items Shared" value={totalItemsDonated} subtitle="Across all categories" icon={PackageCheck} color="emerald" />
        <StatCard title="Waste Diverted" value={`${totalKg} kg`} subtitle="Kept out of landfills" icon={Recycle} color="teal" />
        <StatCard title="CO₂ Emissions Saved" value={`${co2Saved} kg`} subtitle="Estimated lifecycle offset" icon={Leaf} color="emerald" />
        <StatCard title="Communities Reached" value={Math.max(beneficiaries, 1)} subtitle="Verified local groups" icon={Users} color="sky" />
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <h3 className="text-lg font-extrabold text-slate-900 mb-5">Donations by Category</h3>
        <div className="space-y-4">
          {CATEGORIES.map((cat) => {
            const qty = myListings
              .filter((r) => r.category === cat.id)
              .reduce((s, r) => s + r.quantity, 0);
            const pct = Math.round((qty / maxCatCount) * 100);
            return (
              <div key={cat.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-800">{cat.name}</span>
                  <span className="text-xs font-bold text-emerald-700">{qty} units</span>
                </div>
                <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                    style={{ width: `${Math.max(pct, qty > 0 ? 8 : 0)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
