import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, trend, color = 'emerald' }) {
  const colors = {
    emerald: 'bg-emerald-50 text-emerald-600',
    teal: 'bg-teal-50 text-teal-600',
    amber: 'bg-amber-50 text-amber-600',
    sky: 'bg-sky-50 text-sky-600',
    rose: 'bg-rose-50 text-rose-600',
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1.5">{value}</p>
        </div>
        {Icon && (
          <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${colors[color] || colors.emerald}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      {(subtitle || trend) && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {trend && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold">
              {trend}
            </span>
          )}
          {subtitle && <span className="text-slate-500 truncate">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
