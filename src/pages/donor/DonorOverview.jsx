import React from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Inbox,
  CheckCircle2,
  Recycle,
  PlusCircle,
  ArrowRight,
  CalendarClock,
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import ResourceImage from '../../components/common/ResourceImage';
import { useApp } from '../../context/AppContext';

export default function DonorOverview() {
  const { currentUser, resources, claims } = useApp();

  const myListings = resources.filter((r) => r.donorId === currentUser?.id);
  const activeCount = myListings.filter((r) => r.status === 'Active').length;
  const myClaims = claims.filter((c) => c.donorId === currentUser?.id);
  const pendingClaims = myClaims.filter((c) => c.status === 'Pending');
  const completedClaims = myClaims.filter((c) => c.status === 'Completed');
  const approvedClaims = myClaims.filter((c) => c.status === 'Approved');
  const kgSaved = Math.round(
    myListings.reduce((sum, r) => sum + (r.weightKg || 5), 0)
  );

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-emerald-100 text-xs font-bold mb-2">
            Donor Portal
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            Thank you for sharing, {currentUser?.name?.split(' ')[0]}!
          </h2>
          <p className="text-emerald-100 text-sm mt-1.5 max-w-xl">
            You have <span className="font-bold text-white">{pendingClaims.length}</span> incoming claim request(s) awaiting review and{' '}
            <span className="font-bold text-white">{approvedClaims.length}</span> upcoming scheduled pickup(s).
          </p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <Link
            to="/donor/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-emerald-800 font-bold text-sm hover:bg-emerald-50 transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            New Resource Listing
          </Link>
          <Link
            to="/donor/claims"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-900/60 border border-emerald-400/40 text-white font-bold text-sm hover:bg-emerald-900 transition-colors"
          >
            <Inbox className="h-4 w-4" />
            Review Claims ({pendingClaims.length})
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Listings"
          value={activeCount}
          subtitle={`${myListings.length} total created`}
          icon={Package}
          color="emerald"
        />
        <StatCard
          title="Incoming Requests"
          value={pendingClaims.length}
          subtitle="Needs your approval"
          icon={Inbox}
          color="amber"
        />
        <StatCard
          title="Completed Handoffs"
          value={completedClaims.length}
          subtitle={`${approvedClaims.length} scheduled next`}
          icon={CheckCircle2}
          color="teal"
        />
        <StatCard
          title="Est. Waste Diverted"
          value={`${kgSaved} kg`}
          subtitle="Circular environmental impact"
          icon={Recycle}
          trend="Top 10%"
          color="emerald"
        />
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Pending Requests */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-extrabold text-slate-900">Pending Receiver Requests</h3>
            <Link
              to="/donor/claims"
              className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1"
            >
              Manage All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {pendingClaims.length === 0 ? (
            <div className="p-6 rounded-2xl bg-slate-50 text-center text-sm text-slate-500">
              All incoming requests are handled!
            </div>
          ) : (
            <div className="space-y-3">
              {pendingClaims.slice(0, 4).map((claim) => (
                <div
                  key={claim.id}
                  className="p-4 rounded-2xl border border-amber-100 bg-amber-50/30 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {claim.receiverName} • <span className="text-emerald-700">Qty {claim.quantity}</span>
                    </p>
                    <p className="text-xs text-slate-600 truncate mt-0.5">{claim.resourceTitle}</p>
                    <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                      <CalendarClock className="h-3 w-3" /> {claim.preferredDate} ({claim.preferredSlot})
                    </p>
                  </div>
                  <Link
                    to="/donor/claims"
                    className="shrink-0 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                  >
                    Review
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Recent Listings */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-extrabold text-slate-900">Your Recent Listings</h3>
            <Link
              to="/donor/listings"
              className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1"
            >
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {myListings.length === 0 ? (
            <div className="p-6 rounded-2xl bg-slate-50 text-center text-sm text-slate-500">
              You haven’t posted any resources yet.
            </div>
          ) : (
            <div className="space-y-3">
              {myListings.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className="h-12 w-14 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                    <ResourceImage
                      src={item.images?.[0]}
                      alt={item.title}
                      category={item.category}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{item.title}</p>
                    <p className="text-xs text-slate-500">
                      {item.availableQuantity}/{item.quantity} left • {item.category}
                    </p>
                  </div>
                  <StatusBadge status={item.status} size="xs" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
