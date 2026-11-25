import React, { useState } from 'react';
import { Save, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function AdminSettingsPage() {
  const { settings, updateSettings, resetDemoData } = useApp();
  const [form, setForm] = useState(settings);

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings(form);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <form
        onSubmit={handleSave}
        className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6"
      >
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Platform Configuration</h2>
          <p className="text-sm text-slate-500 mt-1">
            Control listing moderation, claim quotas, and community announcement banners.
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              key: 'autoApproveListings',
              label: 'Auto-approve verified donor listings',
              desc: 'When enabled, new resource listings appear immediately in public search.',
            },
            {
              key: 'requirePurposeStatement',
              label: 'Require receiver purpose statement',
              desc: 'Receivers must explain how items will be used when submitting claims.',
            },
            {
              key: 'maintenanceBanner',
              label: 'Show top maintenance announcement banner',
              desc: 'Displays a subtle notice across the public navbar.',
            },
          ].map((toggle) => (
            <label
              key={toggle.key}
              className="flex items-start justify-between gap-4 p-4 rounded-2xl border border-slate-200/80 hover:bg-slate-50/70 cursor-pointer"
            >
              <div>
                <p className="text-sm font-bold text-slate-900">{toggle.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{toggle.desc}</p>
              </div>
              <input
                type="checkbox"
                checked={!!form[toggle.key]}
                onChange={(e) => setForm({ ...form, [toggle.key]: e.target.checked })}
                className="h-5 w-5 accent-emerald-600 rounded mt-0.5"
              />
            </label>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Max Active Claims per Receiver
            </label>
            <input
              type="number"
              min={1}
              max={20}
              value={form.maxActiveClaimsPerUser}
              onChange={(e) =>
                setForm({ ...form, maxActiveClaimsPerUser: Number(e.target.value) })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Support Contact Email
            </label>
            <input
              type="email"
              value={form.platformEmail}
              onChange={(e) => setForm({ ...form, platformEmail: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={resetDemoData}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Demo Data
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-sm"
          >
            <Save className="h-4 w-4" />
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
