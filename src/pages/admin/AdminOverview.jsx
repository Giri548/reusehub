import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Package,
  ClipboardList,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import { CATEGORIES } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export default function AdminOverview() {
  const { users, resources, claims, organizations, reports } = useApp();

  const activeListings = resources.filter((r) => r.status === 'Active').length;
  const completedExchanges = claims.filter((c) => c.status === 'Completed').length;
  const pendingOrgs = organizations.filter((o) => o.status === 'Pending');
  const openReports = reports.filter((r) => r.status === 'Open');

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={users.length}
          subtitle={`${users.filter((u) => u.status === 'Active').length} active accounts`}
          icon={Users}
          trend="+14%"
          color="emerald"
        />
        <StatCard
          title="Active Listings"
          value={activeListings}
          subtitle={`${resources.length} total listings`}
          icon={Package}
          color="teal"
        />
        <StatCard
          title="Total Claims"
          value={claims.length}
          subtitle={`${claims.filter((c) => c.status === 'Pending').length} pending review`}
          icon={ClipboardList}
          color="sky"
        />
        <StatCard
          title="Completed Exchanges"
          value={completedExchanges}
          subtitle="Verified QR handoffs"
          icon={CheckCircle2}
          trend="Healthy"
          color="emerald"
        />
      </div>

      {/* Action Queues */}
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              Pending Org Verifications ({pendingOrgs.length})
            </h3>
            <Link
              to="/admin/verifications"
              className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1"
            >
              Review Queue <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {pendingOrgs.length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center bg-slate-50 rounded-xl">
              All organization applications reviewed.
            </p>
          ) : (
            <div className="space-y-3">
              {pendingOrgs.map((org) => (
                <div
                  key={org.id}
                  className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{org.orgName}</p>
                    <p className="text-xs text-slate-500">
                      {org.type} • {org.location}
                    </p>
                  </div>
                  <StatusBadge status={org.status} size="xs" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-500" />
              Open Moderation Reports ({openReports.length})
            </h3>
            <Link
              to="/admin/reports"
              className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1"
            >
              View Reports <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {openReports.length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center bg-slate-50 rounded-xl">
              No open moderation reports.
            </p>
          ) : (
            <div className="space-y-3">
              {openReports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-4 rounded-xl border border-amber-100 bg-amber-50/40 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{rep.listingTitle}</p>
                    <p className="text-xs text-slate-600 truncate">{rep.reason}</p>
                  </div>
                  <StatusBadge status={rep.status} size="xs" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-extrabold text-slate-900">Resource Supply by Category</h3>
          <Link to="/admin/listings" className="text-xs font-bold text-emerald-700 hover:underline">
            Manage Listings
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => {
            const count = resources.filter((r) => r.category === cat.id).length;
            const totalQty = resources
              .filter((r) => r.category === cat.id)
              .reduce((s, r) => s + r.quantity, 0);
            return (
              <div key={cat.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60">
                <p className="text-xs font-bold text-slate-500 uppercase">{cat.name}</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">{count}</p>
                <p className="text-xs text-emerald-700 font-semibold mt-0.5">{totalQty} total units</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
