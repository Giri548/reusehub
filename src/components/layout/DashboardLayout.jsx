import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  ClipboardList,
  CalendarClock,
  Bell,
  UserCircle,
  PlusCircle,
  Package,
  Inbox,
  BarChart3,
  Users,
  ShieldCheck,
  FileBarChart2,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  ChevronRight,
} from 'lucide-react';
import Logo from '../common/Logo';
import { useApp } from '../../context/AppContext';

const ROLE_MENUS = {
  receiver: [
    { label: 'Overview', to: '/receiver', icon: LayoutDashboard, end: true },
    { label: 'Browse Resources', to: '/receiver/browse', icon: Search },
    { label: 'My Claims', to: '/receiver/claims', icon: ClipboardList },
    { label: 'Pickup Schedule', to: '/receiver/schedule', icon: CalendarClock },
    { label: 'Notifications', to: '/receiver/notifications', icon: Bell },
    { label: 'Profile', to: '/receiver/profile', icon: UserCircle },
  ],
  donor: [
    { label: 'Overview', to: '/donor', icon: LayoutDashboard, end: true },
    { label: 'Create Listing', to: '/donor/create', icon: PlusCircle },
    { label: 'My Listings', to: '/donor/listings', icon: Package },
    { label: 'Incoming Claims', to: '/donor/claims', icon: Inbox },
    { label: 'Pickup Schedule', to: '/donor/schedule', icon: CalendarClock },
    { label: 'Impact Summary', to: '/donor/impact', icon: BarChart3 },
    { label: 'Profile', to: '/donor/profile', icon: UserCircle },
  ],
  admin: [
    { label: 'Overview', to: '/admin', icon: LayoutDashboard, end: true },
    { label: 'User Management', to: '/admin/users', icon: Users },
    { label: 'Listing Management', to: '/admin/listings', icon: Package },
    { label: 'Org Verifications', to: '/admin/verifications', icon: ShieldCheck },
    { label: 'Reports & Analytics', to: '/admin/reports', icon: FileBarChart2 },
    { label: 'Settings', to: '/admin/settings', icon: Settings },
  ],
};

export default function DashboardLayout({ role, title, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifDropdown, setNotifDropdown] = useState(false);
  const {
    currentUser,
    logout,
    notifications,
    markNotificationRead,
    quickLoginByRole,
  } = useApp();
  const navigate = useNavigate();

  const menu = ROLE_MENUS[role] || [];
  const userNotifs = notifications.filter((n) => n.userId === currentUser?.id);
  const unreadCount = userNotifs.filter((n) => !n.read).length;

  const handleRoleSwitch = (nextRole) => {
    const switched = quickLoginByRole(nextRole);
    if (switched) {
      navigate(`/${nextRole}`);
    }
  };

  const navItemCls = ({ isActive }) =>
    `flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
      isActive
        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/25'
        : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
    }`;

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/80">
      <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100">
        <Link to="/" className="shrink-0">
          <Logo size="sm" />
        </Link>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="px-4 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
          <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 overflow-hidden">
            {currentUser?.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} className="h-full w-full object-cover" />
            ) : (
              currentUser?.name?.charAt(0) || 'U'
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">{currentUser?.name}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              {role} Portal
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {menu.map((item) => {
          const Icon = item.icon;
          const showBadge = item.label === 'Notifications' && unreadCount > 0;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={navItemCls}
            >
              <span className="flex items-center gap-3">
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </span>
              {showBadge && (
                <span className="px-2 py-0.5 text-[11px] rounded-full bg-rose-500 text-white font-bold">
                  {unreadCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Quick role preview switcher for seamless demo exploration */}
      <div className="p-4 border-t border-slate-100 space-y-3">
        <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/70">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Switch Demo Portal
          </p>
          <div className="grid grid-cols-3 gap-1">
            {['receiver', 'donor', 'admin'].map((r) => (
              <button
                key={r}
                onClick={() => handleRoleSwitch(r)}
                className={`py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  role === r
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            <Home className="h-3.5 w-3.5" />
            Public Site
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 text-xs font-semibold text-rose-600 hover:bg-rose-50"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-68 xl:w-72 shrink-0 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full z-10 animate-fade-in">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="capitalize">{role}</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-emerald-700 font-semibold truncate">{title}</span>
              </div>
              <h1 className="text-lg font-extrabold text-slate-900 truncate">{title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {role === 'receiver' && (
              <Link
                to="/receiver/browse"
                className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors"
              >
                <Search className="h-3.5 w-3.5" />
                Find Resources
              </Link>
            )}
            {role === 'donor' && (
              <Link
                to="/donor/create"
                className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                Donate Resource
              </Link>
            )}

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdown(!notifDropdown)}
                className="relative p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setNotifDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl z-20 overflow-hidden animate-fade-in">
                    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900">Notifications</span>
                      <span className="text-xs text-emerald-700 font-semibold">
                        {unreadCount} unread
                      </span>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                      {userNotifs.length === 0 ? (
                        <p className="p-4 text-xs text-slate-500 text-center">
                          No notifications right now.
                        </p>
                      ) : (
                        userNotifs.slice(0, 5).map((n) => (
                          <button
                            key={n.id}
                            onClick={() => {
                              markNotificationRead(n.id);
                              setNotifDropdown(false);
                              if (n.link) navigate(n.link);
                            }}
                            className={`w-full text-left p-3.5 hover:bg-slate-50 transition-colors ${
                              !n.read ? 'bg-emerald-50/40' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-xs font-bold text-slate-900">{n.title}</p>
                              {!n.read && (
                                <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 mt-1" />
                              )}
                            </div>
                            <p className="text-xs text-slate-600 mt-1 line-clamp-2">{n.message}</p>
                            <p className="text-[10px] text-slate-400 mt-1">{n.createdAt}</p>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
