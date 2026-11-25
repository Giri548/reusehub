import React from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardList,
  CheckCircle2,
  CalendarClock,
  Leaf,
  ArrowRight,
  QrCode,
  Search,
  MapPin,
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import ResourceCard from '../../components/common/ResourceCard';
import { useApp } from '../../context/AppContext';

export default function ReceiverOverview() {
  const { currentUser, claims, resources, notifications } = useApp();

  const myClaims = claims.filter((c) => c.receiverId === currentUser?.id);
  const pendingCount = myClaims.filter((c) => c.status === 'Pending').length;
  const approvedClaims = myClaims.filter((c) => c.status === 'Approved');
  const completedCount = myClaims.filter((c) => c.status === 'Completed').length;
  const itemsCollected = myClaims
    .filter((c) => c.status === 'Completed')
    .reduce((sum, c) => sum + c.quantity, 0);

  const recommended = resources
    .filter((r) => r.status === 'Active' && r.availableQuantity > 0)
    .slice(0, 3);

  const myUnreadNotifs = notifications.filter(
    (n) => n.userId === currentUser?.id && !n.read
  );

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 p-6 sm:p-8 text-white shadow-lg shadow-emerald-900/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-emerald-100 text-xs font-bold mb-2">
            Receiver Dashboard
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            Hello, {currentUser?.name?.split(' ')[0]}!
          </h2>
          <p className="text-emerald-100 text-sm mt-1.5 max-w-xl">
            You have <span className="font-bold text-white">{approvedClaims.length}</span> approved pickup(s) ready with QR passes and{' '}
            <span className="font-bold text-white">{myUnreadNotifs.length}</span> unread notification(s).
          </p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <Link
            to="/receiver/browse"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-emerald-800 font-bold text-sm hover:bg-emerald-50 transition-colors"
          >
            <Search className="h-4 w-4" />
            Browse Resources
          </Link>
          <Link
            to="/receiver/schedule"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800/60 border border-emerald-400/40 text-white font-bold text-sm hover:bg-emerald-800 transition-colors"
          >
            <QrCode className="h-4 w-4" />
            View QR Passes
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pending Claims"
          value={pendingCount}
          subtitle="Awaiting donor review"
          icon={ClipboardList}
          color="amber"
        />
        <StatCard
          title="Approved Pickups"
          value={approvedClaims.length}
          subtitle="QR passes active"
          icon={CalendarClock}
          color="emerald"
        />
        <StatCard
          title="Completed Exchanges"
          value={completedCount}
          subtitle="Successfully collected"
          icon={CheckCircle2}
          color="teal"
        />
        <StatCard
          title="Items Reused"
          value={itemsCollected}
          subtitle="Given a second life"
          icon={Leaf}
          trend="+Circular"
          color="emerald"
        />
      </div>

      {/* Approved Upcoming Pickups + Recent Claims */}
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-extrabold text-slate-900">Upcoming Approved Pickups</h3>
            <Link
              to="/receiver/schedule"
              className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1"
            >
              Full Schedule <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {approvedClaims.length === 0 ? (
            <div className="p-6 rounded-2xl bg-slate-50 text-center text-sm text-slate-500">
              No upcoming approved pickups yet. Browse resources to submit a request!
            </div>
          ) : (
            <div className="space-y-3">
              {approvedClaims.map((claim) => (
                <div
                  key={claim.id}
                  className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-slate-900 truncate">{claim.resourceTitle}</p>
                    <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                      <CalendarClock className="h-3.5 w-3.5 text-emerald-600" />
                      {claim.preferredDate} • {claim.preferredSlot}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 truncate">
                      <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      {claim.pickupLocation}
                    </p>
                  </div>
                  <Link
                    to="/receiver/schedule"
                    className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                  >
                    <QrCode className="h-3.5 w-3.5" />
                    {claim.pickupCode}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-extrabold text-slate-900">Recent Claim Activity</h3>
            <Link
              to="/receiver/claims"
              className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1"
            >
              All Claims <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {myClaims.length === 0 ? (
            <div className="p-6 rounded-2xl bg-slate-50 text-center text-sm text-slate-500">
              You haven’t submitted any claims yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {myClaims.slice(0, 4).map((claim) => (
                <div key={claim.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{claim.resourceTitle}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Qty: {claim.quantity} • Donor: {claim.donorName}
                    </p>
                  </div>
                  <StatusBadge status={claim.status} size="xs" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recommended Resources */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-extrabold text-slate-900">Recommended for Your Community</h3>
          <Link
            to="/receiver/browse"
            className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1"
          >
            Explore All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recommended.map((res) => (
            <ResourceCard key={res.id} resource={res} basePath="/receiver/resources" />
          ))}
        </div>
      </div>
    </div>
  );
}
