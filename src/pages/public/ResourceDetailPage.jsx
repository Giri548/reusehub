import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Clock,
  ShieldCheck,
  PackageCheck,
  Calendar,
  CheckCircle2,
  Scale,
  Tag,
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import Footer from '../../components/layout/Footer';
import ResourceImage from '../../components/common/ResourceImage';
import StatusBadge from '../../components/common/StatusBadge';
import { useApp } from '../../context/AppContext';

export default function ResourceDetailPage({ embedded = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { resources, currentUser, submitClaim, showToast } = useApp();

  const resource = resources.find((r) => r.id === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [purpose, setPurpose] = useState('');
  const [preferredDate, setPreferredDate] = useState('2026-11-28');
  const [preferredSlot, setPreferredSlot] = useState('10:00 AM – 12:00 PM');
  const [errors, setErrors] = useState({});

  if (!resource) {
    const notFound = (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Resource Not Found</h2>
        <p className="text-slate-600 mt-2">This listing may have been removed or closed.</p>
        <Link
          to={embedded ? '/receiver/browse' : '/browse'}
          className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Browse
        </Link>
      </div>
    );
    if (embedded) return notFound;
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <PublicNavbar />
        <main className="flex-1">{notFound}</main>
        <Footer />
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    const qtyNum = Number(quantity);
    if (!qtyNum || qtyNum < 1 || qtyNum > resource.availableQuantity) {
      errs.quantity = `Enter a quantity between 1 and ${resource.availableQuantity}.`;
    }
    if (!purpose.trim() || purpose.trim().length < 12) {
      errs.purpose = 'Please describe how you plan to use this resource (at least 12 characters).';
    }
    if (!preferredDate) {
      errs.preferredDate = 'Select a preferred pickup date.';
    }
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      showToast('Please fix the highlighted form errors.', 'error');
      return;
    }

    const res = submitClaim({
      resourceId: resource.id,
      quantity: qtyNum,
      purpose,
      preferredDate,
      preferredSlot,
    });

    if (res.ok) {
      setPurpose('');
      setQuantity(1);
      navigate('/receiver/claims');
    }
  };

  const backLink = embedded ? '/receiver/browse' : '/browse';

  const body = (
    <div className={embedded ? 'space-y-6' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6'}>
      <Link
        to={backLink}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Resources
      </Link>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left: Images & Description */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
            <div className="aspect-[16/10] bg-slate-100 relative">
              <ResourceImage
                src={resource.images?.[selectedImage]}
                alt={resource.title}
                category={resource.category}
                className="w-full h-full"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 rounded-full bg-white/95 text-emerald-700 text-xs font-bold shadow-sm">
                  {resource.category}
                </span>
                <StatusBadge status={resource.condition} />
              </div>
            </div>

            {resource.images && resource.images.length > 1 && (
              <div className="p-4 flex gap-3 border-t border-slate-100 bg-slate-50/50">
                {resource.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    className={`h-16 w-24 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === idx
                        ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <ResourceImage
                      src={img}
                      alt={`${resource.title} ${idx + 1}`}
                      category={resource.category}
                      className="w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <StatusBadge status={resource.status} />
              <span className="text-xs text-slate-400">Listed on {resource.createdAt}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {resource.title}
            </h1>

            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              {resource.description}
            </p>

            <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50">
                <MapPin className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Pickup Location</p>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">{resource.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50">
                <Clock className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Pickup Hours</p>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">{resource.pickupWindow}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50">
                <PackageCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Availability</p>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">
                    {resource.availableQuantity} of {resource.quantity} units left
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50">
                <Scale className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Est. Weight Saved</p>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">
                    ~{resource.weightKg || 5} kg landfill diversion
                  </p>
                </div>
              </div>
            </div>

            {resource.tags?.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <Tag className="h-4 w-4 text-slate-400" />
                {resource.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Donor Card + Request Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Offered By
            </p>
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-700 font-bold text-lg flex items-center justify-center">
                {resource.donorName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-slate-900">{resource.donorName}</h3>
                  {resource.donorVerified && (
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  )}
                </div>
                <p className="text-xs font-medium text-slate-500">{resource.donorOrg}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-emerald-200 p-6 sm:p-7 shadow-sm">
            <h2 className="text-xl font-extrabold text-slate-900">Request This Resource</h2>
            <p className="text-xs text-slate-500 mt-1">
              Submit your required quantity and purpose. The donor will review and issue a QR pickup pass.
            </p>

            {resource.availableQuantity === 0 || resource.status !== 'Active' ? (
              <div className="mt-5 p-4 rounded-2xl bg-slate-100 text-slate-700 text-sm font-semibold">
                This resource is currently unavailable for new claims.
              </div>
            ) : !currentUser ? (
              <div className="mt-6 p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                <p className="text-sm font-semibold text-emerald-900">
                  Sign in as a Receiver to claim this resource.
                </p>
                <div className="flex flex-wrap gap-2.5">
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700"
                  >
                    Login to Claim
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-800 text-sm font-bold hover:bg-emerald-100"
                  >
                    Register Free
                  </Link>
                </div>
              </div>
            ) : currentUser.role !== 'receiver' ? (
              <div className="mt-6 p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                <p className="text-sm font-bold text-amber-900">
                  Signed in as {currentUser.role.toUpperCase()}
                </p>
                <p className="text-xs text-amber-800">
                  Only Receiver accounts can submit resource claims. You can switch to the Receiver portal from your dashboard sidebar to test claiming.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Quantity Needed (Max {resource.availableQuantity})
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={resource.availableQuantity}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                  />
                  {errors.quantity && (
                    <p className="text-xs text-rose-600 mt-1">{errors.quantity}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Preferred Date
                    </label>
                    <div className="relative">
                      <Calendar className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="date"
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    {errors.preferredDate && (
                      <p className="text-xs text-rose-600 mt-1">{errors.preferredDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Time Slot
                    </label>
                    <select
                      value={preferredSlot}
                      onChange={(e) => setPreferredSlot(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-emerald-500"
                    >
                      <option>10:00 AM – 12:00 PM</option>
                      <option>12:00 PM – 2:00 PM</option>
                      <option>2:00 PM – 4:00 PM</option>
                      <option>4:00 PM – 6:00 PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Purpose & Community Benefit
                  </label>
                  <textarea
                    rows={4}
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="Briefly explain who will use these items (e.g., neighborhood library, student workshop, personal study)..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                  />
                  {errors.purpose && (
                    <p className="text-xs text-rose-600 mt-1">{errors.purpose}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 inline-flex items-center justify-center gap-2 transition-all"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Submit Resource Request
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (embedded) return body;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PublicNavbar />
      <main className="flex-1">{body}</main>
      <Footer />
    </div>
  );
}
