import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, PackageCheck, ShieldCheck, ArrowUpRight } from 'lucide-react';
import ResourceImage from './ResourceImage';
import StatusBadge from './StatusBadge';

export default function ResourceCard({ resource, basePath = '/resources' }) {
  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden card-hover flex flex-col">
      <Link to={`${basePath}/${resource.id}`} className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <ResourceImage
          src={resource.images?.[0]}
          alt={resource.title}
          category={resource.category}
          className="w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/95 text-emerald-700 shadow-sm backdrop-blur-sm">
            {resource.category}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <StatusBadge status={resource.condition} size="xs" />
        </div>
        {resource.availableQuantity === 0 && (
          <div className="absolute inset-0 bg-slate-900/55 flex items-center justify-center">
            <span className="px-3 py-1 rounded-full bg-white text-slate-900 text-xs font-bold uppercase tracking-wider">
              Fully Claimed
            </span>
          </div>
        )}
      </Link>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2">
          <span className="inline-flex items-center gap-1 font-medium text-slate-700 truncate">
            {resource.donorOrg || resource.donorName}
            {resource.donorVerified && (
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" title="Verified Donor" />
            )}
          </span>
          <span className="text-slate-400 shrink-0">{resource.createdAt}</span>
        </div>

        <Link to={`${basePath}/${resource.id}`}>
          <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors">
            {resource.title}
          </h3>
        </Link>

        <p className="text-sm text-slate-600 line-clamp-2 mt-2 flex-1">
          {resource.description}
        </p>

        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
          <div className="flex flex-col gap-1 min-w-0">
            <span className="inline-flex items-center gap-1 text-slate-500 truncate">
              <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{resource.location}</span>
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
              <PackageCheck className="h-3.5 w-3.5 shrink-0" />
              {resource.availableQuantity} of {resource.quantity} available
            </span>
          </div>

          <Link
            to={`${basePath}/${resource.id}`}
            className="shrink-0 inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 font-semibold hover:bg-emerald-600 hover:text-white transition-colors"
          >
            View
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
