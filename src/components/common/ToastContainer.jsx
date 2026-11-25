import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const STYLES = {
  success: {
    wrap: 'bg-white border-emerald-200 text-slate-800 shadow-emerald-900/10',
    icon: <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />,
  },
  error: {
    wrap: 'bg-white border-rose-200 text-slate-800 shadow-rose-900/10',
    icon: <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />,
  },
  warning: {
    wrap: 'bg-white border-amber-200 text-slate-800 shadow-amber-900/10',
    icon: <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />,
  },
  info: {
    wrap: 'bg-white border-teal-200 text-slate-800 shadow-teal-900/10',
    icon: <Info className="h-5 w-5 text-teal-600 shrink-0" />,
  },
};

export default function ToastContainer() {
  const { toasts, dismissToast } = useApp();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full px-4 sm:px-0 pointer-events-none">
      {toasts.map((toast) => {
        const style = STYLES[toast.type] || STYLES.info;
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-3.5 shadow-lg animate-slide-in-right ${style.wrap}`}
          >
            {style.icon}
            <p className="text-sm font-medium flex-1 leading-snug">{toast.message}</p>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
