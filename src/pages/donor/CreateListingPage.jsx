import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, X, CheckCircle2, ImagePlus, MapPin, Clock } from 'lucide-react';
import { CATEGORIES, CONDITIONS } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

const SAMPLE_PRESETS = {
  Books: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
  Furniture: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=800&q=80',
  Electronics: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
  Stationery: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&w=800&q=80',
  Others: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
};

export default function CreateListingPage() {
  const { currentUser, createResource, showToast } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    category: 'Books',
    condition: 'Like New',
    quantity: 1,
    location: currentUser?.location || '',
    pickupWindow: 'Mon–Sat, 10:00 AM – 6:00 PM',
    description: '',
    weightKg: 4,
  });
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.slice(0, 4 - images.length).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setImages((prev) => [...prev, ev.target.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const addSampleImage = () => {
    const sample = SAMPLE_PRESETS[form.category] || SAMPLE_PRESETS.Others;
    if (!images.includes(sample)) {
      setImages((prev) => [...prev, sample]);
    }
  };

  const removeImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.title.trim() || form.title.trim().length < 5) {
      errs.title = 'Enter a descriptive title (at least 5 characters).';
    }
    if (!form.description.trim() || form.description.trim().length < 15) {
      errs.description = 'Add a clear description (at least 15 characters).';
    }
    if (!form.quantity || Number(form.quantity) < 1) {
      errs.quantity = 'Quantity must be at least 1.';
    }
    if (!form.location.trim()) {
      errs.location = 'Pickup location is required.';
    }
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      showToast('Please complete all required listing fields.', 'error');
      return;
    }

    const finalImages = images.length > 0 ? images : [SAMPLE_PRESETS[form.category]];
    createResource({ ...form, images: finalImages });
    navigate('/donor/listings');
  };

  return (
    <div className="max-w-4xl">
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-extrabold text-slate-900">Create a Resource Listing</h2>
          <p className="text-sm text-slate-500 mt-1">
            Provide clear photos and condition details so verified community members can request what they need.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Zone */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Resource Photos (Up to 4)
              </label>
              <button
                type="button"
                onClick={addSampleImage}
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"
              >
                <ImagePlus className="h-3.5 w-3.5" />
                Use Sample {form.category} Photo
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((src, idx) => (
                <div key={idx} className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 group">
                  <img src={src} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-slate-900/75 text-white hover:bg-rose-600 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}

              {images.length < 4 && (
                <label className="aspect-[4/3] rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 hover:bg-emerald-50 flex flex-col items-center justify-center cursor-pointer text-emerald-700 transition-colors p-3 text-center">
                  <UploadCloud className="h-6 w-6 mb-1.5" />
                  <span className="text-xs font-bold">Upload Image</span>
                  <span className="text-[10px] text-emerald-600/80 mt-0.5">PNG, JPG</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Resource Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g., 10 Gently Used High-School Science Textbooks"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500"
              />
              {errors.title && <p className="text-xs text-rose-600 mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-emerald-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Condition *
              </label>
              <select
                value={form.condition}
                onChange={(e) => setForm({ ...form, condition: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-emerald-500"
              >
                {CONDITIONS.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Quantity Available *
              </label>
              <input
                type="number"
                min={1}
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500"
              />
              {errors.quantity && <p className="text-xs text-rose-600 mt-1">{errors.quantity}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Estimated Weight (kg)
              </label>
              <input
                type="number"
                min={0.5}
                step="0.5"
                value={form.weightKg}
                onChange={(e) => setForm({ ...form, weightKg: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Pickup Location *
              </label>
              <div className="relative">
                <MapPin className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="Neighborhood & City"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              {errors.location && <p className="text-xs text-rose-600 mt-1">{errors.location}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Pickup Availability Window
              </label>
              <div className="relative">
                <Clock className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={form.pickupWindow}
                  onChange={(e) => setForm({ ...form, pickupWindow: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Description & Specifications *
              </label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe dimensions, age, included accessories, or any minor wear..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500"
              />
              {errors.description && (
                <p className="text-xs text-rose-600 mt-1">{errors.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate('/donor/listings')}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20"
            >
              <CheckCircle2 className="h-4 w-4" />
              Publish Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
