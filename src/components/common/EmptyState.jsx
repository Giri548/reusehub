import React from 'react';
import { PackageOpen } from 'lucide-react';

export default function EmptyState({
  icon: Icon = PackageOpen,
  title = 'Nothing here yet',
  description = 'Try adjusting your filters or check back later.',
  action,
}) {
  return (
    <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center flex flex-col items-center justify-center">
      <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mt-1.5">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
