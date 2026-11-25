import React, { useState } from 'react';
import { Search, UserCheck, UserX, ShieldCheck } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import { useApp } from '../../context/AppContext';

export default function AdminUsersPage() {
  const { users, toggleUserAccountStatus } = useApp();
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filtered = users.filter((u) => {
    const matchQ =
      !query.trim() ||
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase()) ||
      u.organization?.toLowerCase().includes(query.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchQ && matchRole;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users by name, email, or organization..."
            className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex gap-2">
          {['all', 'receiver', 'donor', 'admin'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold capitalize transition-colors ${
                roleFilter === r
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-emerald-50'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-5">Member</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Organization</th>
                <th className="py-3.5 px-4">Joined</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 overflow-hidden">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                        ) : (
                          user.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 flex items-center gap-1">
                          {user.name}
                          {user.verified && <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />}
                        </p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold capitalize">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600">{user.organization}</td>
                  <td className="py-3.5 px-4 text-xs text-slate-500">{user.joinedAt}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={user.status} size="xs" />
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => toggleUserAccountStatus(user.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                        user.status === 'Active'
                          ? 'border border-rose-200 text-rose-600 hover:bg-rose-50'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {user.status === 'Active' ? (
                        <>
                          <UserX className="h-3.5 w-3.5" /> Disable
                        </>
                      ) : (
                        <>
                          <UserCheck className="h-3.5 w-3.5" /> Enable
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
