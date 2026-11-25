import React, { useState } from 'react';
import { Search, CheckCircle2, Flag, Trash2 } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import ResourceImage from '../../components/common/ResourceImage';
import ConfirmModal from '../../components/common/ConfirmModal';
import { CATEGORIES } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export default function AdminListingsPage() {
  const { resources, toggleResourceStatus, deleteResource } = useApp();
  const [query, setQuery] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = resources.filter((r) => {
    const matchQ =
      !query.trim() ||
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.donorName.toLowerCase().includes(query.toLowerCase());
    const matchCat = catFilter === 'All' || r.category === catFilter;
    const matchStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchQ && matchCat && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col md:flex-row gap-3 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search listings or donor name..."
            className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="flex flex-wrap gap-2.5">
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Flagged">Flagged</option>
            <option value="Paused">Paused</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="h-16 w-20 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                <ResourceImage
                  src={item.images?.[0]}
                  alt={item.title}
                  category={item.category}
                  className="w-full h-full"
                />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                    {item.category}
                  </span>
                  <StatusBadge status={item.status} size="xs" />
                </div>
                <p className="font-bold text-slate-900 text-sm truncate">{item.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Donor: {item.donorName} ({item.donorOrg}) • Qty {item.availableQuantity}/{item.quantity}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {item.status !== 'Active' && (
                <button
                  onClick={() => toggleResourceStatus(item.id, 'Active')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Approve
                </button>
              )}
              {item.status !== 'Flagged' && (
                <button
                  onClick={() => toggleResourceStatus(item.id, 'Flagged')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-300 text-amber-700 hover:bg-amber-50 text-xs font-bold"
                >
                  <Flag className="h-3.5 w-3.5" />
                  Flag
                </button>
              )}
              <button
                onClick={() => setDeleteTarget(item)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Remove Listing?"
        message={`Permanently remove "${deleteTarget?.title}" from ReUseHub?`}
        confirmLabel="Remove Listing"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          deleteResource(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
