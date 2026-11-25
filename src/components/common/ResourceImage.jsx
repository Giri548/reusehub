import React, { useState } from 'react';
import { BookOpen, Armchair, Laptop, PencilRuler, Package } from 'lucide-react';

const CATEGORY_ICON = {
  Books: BookOpen,
  Furniture: Armchair,
  Electronics: Laptop,
  Stationery: PencilRuler,
  Others: Package,
};

export default function ResourceImage({ src, alt, category = 'Others', className = '' }) {
  const [failed, setFailed] = useState(false);
  const Icon = CATEGORY_ICON[category] || Package;

  if (!src || failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 text-emerald-700 ${className}`}
      >
        <Icon className="h-10 w-10 mb-1.5 opacity-80" />
        <span className="text-xs font-semibold uppercase tracking-wider opacity-75">
          {category}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
      loading="lazy"
    />
  );
}
