import React, { useState } from 'react';
import { CheckCircle2, XCircle, Calendar, Building2, MessageSquare, Inbox } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { useApp } from '../../context/AppContext';

const TABS = ['All', 'Pending', 'Approved', 'Rejected', 'Completed'];

export default function IncomingClaimsPage() {
  const { currentUser, claims, updateClaimStatus } = useApp();
  const [activeTab, setActiveTab] = useState('All');
  const [noteById, setNoteById] = useState({});

  const myIncoming = claims.filter((c) => c.donorId === currentUser?.id);
  const filtered =
    activeTab === 'All' ? myIncoming : myIncoming.filter((c) => c.status === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-1.5 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm">
        {TABS.map((tab) => {
          const count =
            tab === 'All'
              ? myIncoming.length
              : myIncoming.filter((c) => c.status === tab).length;
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

      {filtered.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={`No ${activeTab === 'All' ? '' : activeTab.toLowerCase()} claims`}
          description="Requests from receivers for your listed resources will appear here."
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((claim) => (
            <div
              key={claim.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <StatusBadge status={claim.status} />
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      Requested Qty: {claim.quantity}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {claim.resourceTitle}
                  </h3>
                </div>
                <span className="text-xs text-slate-400">Submitted {claim.createdAt}</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <p className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-emerald-600" />
                    {claim.receiverName} ({claim.receiverOrg})
                  </p>
                  <p className="text-slate-600 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                    Preferred Pickup: {claim.preferredDate} • {claim.preferredSlot}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
                  <p className="font-bold text-emerald-900 mb-0.5">Receiver Purpose:</p>
                  <p className="text-slate-700 leading-relaxed">{claim.purpose}</p>
                </div>
              </div>

              {claim.status === 'Pending' && (
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="relative flex-1">
                    <MessageSquare className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={noteById[claim.id] || ''}
                      onChange={(e) =>
                        setNoteById((prev) => ({ ...prev, [claim.id]: e.target.value }))
                      }
                      placeholder="Optional pickup instructions or decline reason..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() =>
                        updateClaimStatus(
                          claim.id,
                          'Approved',
                          noteById[claim.id] || 'Ready at pickup desk.'
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Approve & Issue QR
                    </button>
                    <button
                      onClick={() =>
                        updateClaimStatus(
                          claim.id,
                          'Rejected',
                          noteById[claim.id] || 'Currently allocated to another request.'
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </button>
                  </div>
                </div>
              )}

              {claim.status === 'Approved' && (
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-slate-600">
                    Pickup Pass Code:{' '}
                    <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {claim.pickupCode}
                    </span>
                  </p>
                  <button
                    onClick={() => updateClaimStatus(claim.id, 'Completed')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Mark Handed Over
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
