import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { QrCode, XCircle, CheckCircle2, MapPin, Calendar, X, Search } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import ResourceImage from '../../components/common/ResourceImage';
import QRCodeDisplay from '../../components/common/QRCodeDisplay';
import EmptyState from '../../components/common/EmptyState';
import ConfirmModal from '../../components/common/ConfirmModal';
import { useApp } from '../../context/AppContext';

const TABS = ['All', 'Pending', 'Approved', 'Rejected', 'Completed'];

export default function ReceiverClaims() {
  const { currentUser, claims, cancelClaim, updateClaimStatus } = useApp();
  const [activeTab, setActiveTab] = useState('All');
  const [qrModalClaim, setQrModalClaim] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);

  const myClaims = claims.filter((c) => c.receiverId === currentUser?.id);
  const filtered =
    activeTab === 'All' ? myClaims : myClaims.filter((c) => c.status === activeTab);

  return (
    <div className="space-y-6">
      {/* Status Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex flex-wrap gap-1.5">
          {TABS.map((tab) => {
            const count =
              tab === 'All'
                ? myClaims.length
                : myClaims.filter((c) => c.status === tab).length;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 ${
                  activeTab === tab
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                {tab}
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    activeTab === tab ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <Link
          to="/receiver/browse"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100"
        >
          <Search className="h-3.5 w-3.5" />
          Request More
        </Link>
      </div>

      {/* Claims List */}
      {filtered.length === 0 ? (
        <EmptyState
          title={`No ${activeTab === 'All' ? '' : activeTab.toLowerCase()} claims found`}
          description="Browse available community resources to submit your first claim request."
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
        <div className="space-y-4">
          {filtered.map((claim) => (
            <div
              key={claim.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-5"
            >
              <div className="w-full md:w-36 h-28 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                <ResourceImage
                  src={claim.resourceImage}
                  alt={claim.resourceTitle}
                  category={claim.resourceCategory}
                  className="w-full h-full"
                />
              </div>

              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                      {claim.resourceCategory}
                    </span>
                    <StatusBadge status={claim.status} />
                  </div>
                  <span className="text-xs text-slate-400">Requested {claim.createdAt}</span>
                </div>

                <Link to={`/receiver/resources/${claim.resourceId}`}>
                  <h3 className="text-base font-extrabold text-slate-900 hover:text-emerald-700 transition-colors">
                    {claim.resourceTitle}
                  </h3>
                </Link>

                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-700">Purpose:</span> {claim.purpose}
                </p>

                {claim.donorNote && (
                  <p className="text-xs text-emerald-800 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
                    <span className="font-bold">Donor Note:</span> {claim.donorNote}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="font-semibold text-slate-700">Qty: {claim.quantity}</span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                    {claim.preferredDate} ({claim.preferredSlot})
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                    {claim.pickupLocation}
                  </span>
                </div>
              </div>

              <div className="flex md:flex-col justify-end gap-2 shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-5">
                {claim.status === 'Approved' && (
                  <>
                    <button
                      onClick={() => setQrModalClaim(claim)}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
                    >
                      <QrCode className="h-4 w-4" />
                      Show QR Pass
                    </button>
                    <button
                      onClick={() => updateClaimStatus(claim.id, 'Completed')}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-emerald-200 text-emerald-700 hover:bg-emerald-50 text-xs font-bold"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Confirm Collected
                    </button>
                  </>
                )}

                {claim.status === 'Pending' && (
                  <button
                    onClick={() => setCancelTarget(claim)}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold"
                  >
                    <XCircle className="h-4 w-4" />
                    Cancel Request
                  </button>
                )}

                {claim.status === 'Completed' && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 bg-teal-50 px-3 py-2 rounded-xl">
                    <CheckCircle2 className="h-4 w-4" />
                    Collected
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Code Modal */}
      {qrModalClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setQrModalClaim(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-extrabold text-slate-900 pr-8">
              Pickup Verification Pass
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">{qrModalClaim.resourceTitle}</p>

            <QRCodeDisplay
              code={qrModalClaim.pickupCode}
              subtitle={`Present to ${qrModalClaim.donorName} at ${qrModalClaim.pickupLocation}`}
            />

            <div className="mt-4 p-3 rounded-xl bg-slate-50 text-xs text-slate-600 space-y-1">
              <p>
                <span className="font-bold">Scheduled:</span> {qrModalClaim.preferredDate} •{' '}
                {qrModalClaim.preferredSlot}
              </p>
              <p>
                <span className="font-bold">Approved Qty:</span> {qrModalClaim.quantity} unit(s)
              </p>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!cancelTarget}
        title="Cancel Claim Request?"
        message={`Are you sure you want to withdraw your request for "${cancelTarget?.resourceTitle}"?`}
        confirmLabel="Yes, Cancel Request"
        onCancel={() => setCancelTarget(null)}
        onConfirm={() => {
          cancelClaim(cancelTarget.id);
          setCancelTarget(null);
        }}
      />
    </div>
  );
}
