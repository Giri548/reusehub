import React, { useState } from 'react';
import { CalendarClock, QrCode, CheckCircle2, MapPin, User } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { useApp } from '../../context/AppContext';

export default function DonorSchedulePage() {
  const { currentUser, claims, updateClaimStatus, showToast } = useApp();
  const [verifyCode, setVerifyCode] = useState('');

  const approvedPickups = claims.filter(
    (c) => c.donorId === currentUser?.id && c.status === 'Approved'
  );
  const completedPickups = claims.filter(
    (c) => c.donorId === currentUser?.id && c.status === 'Completed'
  );

  const handleQuickVerify = (e) => {
    e.preventDefault();
    const match = approvedPickups.find(
      (c) => c.pickupCode.toUpperCase() === verifyCode.trim().toUpperCase()
    );
    if (!match) {
      showToast('No active approved pickup matches that QR code.', 'error');
      return;
    }
    updateClaimStatus(match.id, 'Completed');
    setVerifyCode('');
  };

  return (
    <div className="space-y-8">
      {/* Quick QR Code Check-in Box */}
      <div className="bg-white rounded-2xl border border-emerald-200 p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <QrCode className="h-5 w-5 text-emerald-600" />
            Verify Receiver Pickup Code
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Enter the code shown on the receiver’s QR pass (e.g., <code className="font-mono text-emerald-700">RH-8492-CS</code>) to complete handoff.
          </p>
        </div>

        <form onSubmit={handleQuickVerify} className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            value={verifyCode}
            onChange={(e) => setVerifyCode(e.target.value)}
            placeholder="Enter code (RH-...)"
            className="flex-1 md:w-52 px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-mono uppercase focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0"
          >
            Verify & Complete
          </button>
        </form>
      </div>

      {/* Scheduled Handoffs */}
      <section className="space-y-4">
        <h3 className="text-lg font-extrabold text-slate-900">
          Upcoming Scheduled Handoffs ({approvedPickups.length})
        </h3>

        {approvedPickups.length === 0 ? (
          <EmptyState
            icon={CalendarClock}
            title="No upcoming handoffs"
            description="Approved receiver claims will show up on your pickup schedule."
          />
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {approvedPickups.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <StatusBadge status={item.status} />
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    {item.pickupCode}
                  </span>
                </div>

                <h4 className="font-extrabold text-slate-900 text-base">{item.resourceTitle}</h4>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <p className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-emerald-600" />
                    Receiver: <span className="font-semibold text-slate-800">{item.receiverName}</span> ({item.receiverOrg})
                  </p>
                  <p className="flex items-center gap-2">
                    <CalendarClock className="h-3.5 w-3.5 text-emerald-600" />
                    {item.preferredDate} • {item.preferredSlot} • Qty: {item.quantity}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                    {item.pickupLocation}
                  </p>
                </div>

                <button
                  onClick={() => updateClaimStatus(item.id, 'Completed')}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Mark Pickup Completed
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {completedPickups.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-lg font-extrabold text-slate-900">
            Completed Handoffs ({completedPickups.length})
          </h3>
          <div className="bg-white rounded-2xl border border-slate-200/80 divide-y divide-slate-100">
            {completedPickups.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-slate-900">{item.resourceTitle}</p>
                  <p className="text-xs text-slate-500">
                    Collected by {item.receiverName} • {item.quantity} unit(s) • Code {item.pickupCode}
                  </p>
                </div>
                <StatusBadge status="Completed" />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
