import React from 'react';
import { CalendarClock, MapPin, User, CheckCircle2, Info } from 'lucide-react';
import QRCodeDisplay from '../../components/common/QRCodeDisplay';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';

export default function ReceiverSchedule() {
  const { currentUser, claims, updateClaimStatus } = useApp();

  const myScheduled = claims.filter(
    (c) => c.receiverId === currentUser?.id && (c.status === 'Approved' || c.status === 'Completed')
  );

  const approvedOnly = myScheduled.filter((c) => c.status === 'Approved');
  const pastPickups = myScheduled.filter((c) => c.status === 'Completed');

  return (
    <div className="space-y-8">
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-emerald-900">
          <span className="font-bold">How QR Pickups Work:</span> Show your unique QR code below to the donor when collecting items. Once handed over, click <strong>Confirm Pickup Completed</strong> to log your community impact.
        </div>
      </div>

      {/* Active Approved Pickups with QR Codes */}
      <section className="space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900">
          Upcoming Approved Pickups ({approvedOnly.length})
        </h2>

        {approvedOnly.length === 0 ? (
          <EmptyState
            icon={CalendarClock}
            title="No approved pickups scheduled"
            description="Once a donor approves your pending claim, your scheduled slot and QR pickup pass will appear here."
            action={
              <Link
                to="/receiver/browse"
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold"
              >
                Browse Resources
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {approvedOnly.map((claim) => (
              <div
                key={claim.id}
                className="bg-white rounded-3xl border border-emerald-200/80 p-6 shadow-sm flex flex-col sm:flex-row gap-6 items-center"
              >
                <div className="shrink-0">
                  <QRCodeDisplay
                    code={claim.pickupCode}
                    subtitle="Show at pickup location"
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-3 w-full">
                  <div className="flex items-center justify-between gap-2">
                    <StatusBadge status={claim.status} />
                    <span className="text-xs font-bold text-emerald-700">
                      Qty: {claim.quantity}
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-900 leading-snug">
                    {claim.resourceTitle}
                  </h3>

                  <div className="space-y-2 text-xs text-slate-600">
                    <p className="flex items-center gap-2">
                      <CalendarClock className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span className="font-semibold text-slate-800">
                        {claim.preferredDate} • {claim.preferredSlot}
                      </span>
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{claim.pickupLocation}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <User className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Donor: {claim.donorName}</span>
                    </p>
                  </div>

                  {claim.donorNote && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-900">
                      <span className="font-bold">Instructions:</span> {claim.donorNote}
                    </div>
                  )}

                  <button
                    onClick={() => updateClaimStatus(claim.id, 'Completed')}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center justify-center gap-2 transition-colors"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Confirm Pickup Completed
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Past Completed Pickups */}
      {pastPickups.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900">
            Completed Pickup History ({pastPickups.length})
          </h2>
          <div className="bg-white rounded-2xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden">
            {pastPickups.map((item) => (
              <div
                key={item.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <p className="font-bold text-sm text-slate-900">{item.resourceTitle}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Collected {item.quantity} unit(s) on {item.preferredDate} • Code:{' '}
                    <span className="font-mono font-semibold">{item.pickupCode}</span>
                  </p>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
