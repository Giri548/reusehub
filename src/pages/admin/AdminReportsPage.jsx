import React from 'react';
import { BarChart3, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import { CATEGORIES } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

const MONTHLY_DATA = [
  { month: 'Jun', exchanges: 145 },
  { month: 'Jul', exchanges: 192 },
  { month: 'Aug', exchanges: 240 },
  { month: 'Sep', exchanges: 278 },
  { month: 'Oct', exchanges: 315 },
  { month: 'Nov', exchanges: 368 },
];

export default function AdminReportsPage() {
  const { resources, claims, reports, resolveReport } = useApp();

  const maxMonthly = Math.max(...MONTHLY_DATA.map((d) => d.exchanges));
  const approvalRate = claims.length
    ? Math.round(
        (claims.filter((c) => c.status === 'Approved' || c.status === 'Completed').length /
          claims.length) *
          100
      )
    : 0;

  return (
    <div className="space-y-8">
      {/* Analytics Grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                Monthly Completed Exchanges
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">6-month community sharing velocity</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
              +28% YoY
            </span>
          </div>

          <div className="h-56 flex items-end justify-between gap-3 pt-4">
            {MONTHLY_DATA.map((item) => {
              const heightPct = Math.round((item.exchanges / maxMonthly) * 100);
              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-xs font-bold text-slate-700">{item.exchanges}</span>
                  <div className="w-full max-w-[46px] bg-emerald-50 rounded-t-xl flex items-end h-40 overflow-hidden">
                    <div
                      className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-xl transition-all duration-500"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-500">{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-sm space-y-5">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-emerald-600" />
            Platform Health & Funnel
          </h3>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-emerald-800 uppercase">Claim Approval Rate</p>
              <p className="text-2xl font-extrabold text-emerald-900 mt-0.5">{approvalRate}%</p>
            </div>
            <span className="text-xs font-semibold text-emerald-700">Target &gt; 60%</span>
          </div>

          <div className="space-y-3">
            {CATEGORIES.map((cat) => {
              const count = resources.filter((r) => r.category === cat.id).length;
              const pct = resources.length ? Math.round((count / resources.length) * 100) : 0;
              return (
                <div key={cat.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">{cat.name}</span>
                    <span className="text-slate-500">{pct}% ({count})</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Moderation Reports Queue */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Content & Safety Reports
          </h3>
          <span className="text-xs text-slate-500">
            {reports.filter((r) => r.status === 'Open').length} open items
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {reports.map((rep) => (
            <div
              key={rep.id}
              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <StatusBadge status={rep.status} size="xs" />
                  <span className="text-xs font-semibold text-slate-500">
                    Severity: {rep.severity} • Reported {rep.createdAt}
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-900">{rep.listingTitle}</p>
                <p className="text-xs text-slate-600 mt-0.5">
                  {rep.reason} — <span className="italic">by {rep.reportedBy}</span>
                </p>
              </div>

              {rep.status === 'Open' && (
                <button
                  onClick={() => resolveReport(rep.id)}
                  className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Mark Resolved
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
