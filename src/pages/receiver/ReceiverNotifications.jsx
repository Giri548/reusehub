import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, CircleDot } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';
import { useApp } from '../../context/AppContext';

export default function ReceiverNotifications() {
  const { currentUser, notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const mine = notifications.filter((n) => n.userId === currentUser?.id);
  const visible = filter === 'unread' ? mine.filter((n) => !n.read) : mine;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold ${
              filter === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-emerald-50'
            }`}
          >
            All ({mine.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold ${
              filter === 'unread'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-emerald-50'
            }`}
          >
            Unread ({mine.filter((n) => !n.read).length})
          </button>
        </div>

        <button
          onClick={() => markAllNotificationsRead(currentUser?.id)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline"
        >
          <CheckCheck className="h-4 w-4" />
          Mark all as read
        </button>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="You're all caught up!"
          description="No notifications match this filter right now."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden shadow-sm">
          {visible.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                markNotificationRead(n.id);
                if (n.link) navigate(n.link);
              }}
              className={`p-5 flex items-start gap-4 cursor-pointer hover:bg-slate-50 transition-colors ${
                !n.read ? 'bg-emerald-50/40' : ''
              }`}
            >
              <div
                className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                  !n.read ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                }`}
              >
                <Bell className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-slate-900">{n.title}</p>
                  <span className="text-xs text-slate-400 shrink-0">{n.createdAt}</span>
                </div>
                <p className="text-sm text-slate-600 mt-1">{n.message}</p>
              </div>
              {!n.read && <CircleDot className="h-4 w-4 text-emerald-600 shrink-0 mt-1" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
