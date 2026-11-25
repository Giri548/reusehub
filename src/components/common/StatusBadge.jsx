import React from 'react';

const STATUS_MAP = {
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Completed: 'bg-teal-50 text-teal-700 border-teal-200',
  Verified: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  'Pending Review': 'bg-amber-50 text-amber-700 border-amber-200',
  Open: 'bg-amber-50 text-amber-700 border-amber-200',
  Paused: 'bg-slate-100 text-slate-600 border-slate-200',
  Closed: 'bg-slate-100 text-slate-600 border-slate-200',
  Rejected: 'bg-rose-50 text-rose-700 border-rose-200',
  Disabled: 'bg-rose-50 text-rose-700 border-rose-200',
  Flagged: 'bg-rose-50 text-rose-700 border-rose-200',
  'Like New': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Refurbished: 'bg-teal-50 text-teal-700 border-teal-200',
  Good: 'bg-sky-50 text-sky-700 border-sky-200',
  Fair: 'bg-amber-50 text-amber-700 border-amber-200',
};

export default function StatusBadge({ status, size = 'sm' }) {
  const cls =
    STATUS_MAP[status] || 'bg-slate-100 text-slate-700 border-slate-200';
  const sizeCls =
    size === 'xs'
      ? 'px-2 py-0.5 text-[11px]'
      : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold whitespace-nowrap ${cls} ${sizeCls}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );
}
