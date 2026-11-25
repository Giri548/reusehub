import React, { useState } from 'react';
import { ShieldCheck, FileText, MapPin, Mail, CheckCircle2, XCircle } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import { useApp } from '../../context/AppContext';

export default function AdminVerificationsPage() {
  const { organizations, updateOrganizationVerification } = useApp();
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered =
    statusFilter === 'All'
      ? organizations
      : organizations.filter((o) => o.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm">
        {['All', 'Pending', 'Approved', 'Rejected'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              statusFilter === s
                ? 'bg-emerald-600 text-white'
                : 'text-slate-600 hover:bg-emerald-50'
            }`}
          >
            {s} ({s === 'All' ? organizations.length : organizations.filter((o) => o.status === s).length})
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {filtered.map((org) => (
          <div
            key={org.id}
            className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                    {org.type}
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900 mt-0.5 flex items-center gap-1.5">
                    {org.orgName}
                    {org.status === 'Approved' && (
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    )}
                  </h3>
                </div>
                <StatusBadge status={org.status} />
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{org.description}</p>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs text-slate-600">
                <p>
                  <span className="font-bold text-slate-800">Contact:</span> {org.contactPerson}
                </p>
                <p className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-emerald-600" /> {org.email}
                </p>
                <p className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-emerald-600" /> {org.location}
                </p>
                <p className="flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-emerald-600" />
                  <span>
                    Reg #{org.regNumber} • <span className="font-semibold text-emerald-700">{org.documentName}</span>
                  </span>
                </p>
              </div>
            </div>

            {org.status === 'Pending' && (
              <div className="flex gap-2.5 pt-2 border-t border-slate-100">
                <button
                  onClick={() => updateOrganizationVerification(org.id, 'Approved')}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Approve Verification
                </button>
                <button
                  onClick={() => updateOrganizationVerification(org.id, 'Rejected')}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold"
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
