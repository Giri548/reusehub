import React from 'react';
import { Leaf } from 'lucide-react';

export default function Logo({ size = 'md', light = false }) {
  const sizes = {
    sm: { box: 'h-8 w-8 rounded-lg', icon: 'h-4 w-4', text: 'text-lg' },
    md: { box: 'h-9 w-9 rounded-xl', icon: 'h-5 w-5', text: 'text-xl' },
    lg: { box: 'h-11 w-11 rounded-xl', icon: 'h-6 w-6', text: 'text-2xl' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div className="inline-flex items-center gap-2.5 select-none">
      <div
        className={`${s.box} flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm shadow-emerald-600/25`}
      >
        <Leaf className={s.icon} />
      </div>
      <div className="flex flex-col leading-none">
        <span
          className={`${s.text} font-extrabold tracking-tight ${
            light ? 'text-white' : 'text-slate-900'
          }`}
        >
          ReUse<span className={light ? 'text-emerald-300' : 'text-emerald-600'}>Hub</span>
        </span>
      </div>
    </div>
  );
}
