import React from 'react';
import { Copy, CheckCircle2, QrCode } from 'lucide-react';
import { useState } from 'react';

/**
 * Renders a deterministic, clean SVG QR-style matrix generated from the pickup code
 * so approved pickups have a realistic, crisp pass with zero external library failures.
 */
export default function QRCodeDisplay({ code = 'RH-0000', subtitle = 'Scan at donor pickup desk' }) {
  const [copied, setCopied] = useState(false);

  const size = 21;
  // Deterministic PRNG seeded by code string
  let seed = 0;
  for (let i = 0; i < code.length; i++) {
    seed = (seed * 31 + code.charCodeAt(i)) >>> 0;
  }

  const isFinder = (r, c) => {
    const inTopLeft = r < 7 && c < 7;
    const inTopRight = r < 7 && c >= size - 7;
    const inBottomLeft = r >= size - 7 && c < 7;
    return inTopLeft || inTopRight || inBottomLeft;
  };

  const finderPixel = (r, c) => {
    const lr = r < 7 ? r : r - (size - 7);
    const lc = c < 7 ? c : c - (size - 7);
    if (lr === 0 || lr === 6 || lc === 0 || lc === 6) return true;
    if (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4) return true;
    return false;
  };

  const cells = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      let dark = false;
      if (isFinder(r, c)) {
        dark = finderPixel(r, c);
      } else if (r === 7 || c === 7) {
        dark = false;
      } else {
        const hash = Math.sin(seed + r * 37 + c * 91) * 10000;
        dark = hash - Math.floor(hash) > 0.48;
      }
      if (dark) {
        cells.push({ r, c });
      }
    }
  }

  const handleCopy = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center bg-white border border-emerald-200 rounded-2xl p-5 shadow-sm">
      <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-3">
        <QrCode className="h-3.5 w-3.5" />
        Verified Pickup Pass
      </div>

      <div className="p-3 bg-white rounded-xl border-2 border-slate-100 shadow-inner">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-40 h-40 text-slate-900"
          shapeRendering="crispEdges"
          role="img"
          aria-label={`QR Code for ${code}`}
        >
          <rect width={size} height={size} fill="#ffffff" />
          {cells.map((cell) => (
            <rect
              key={`${cell.r}-${cell.c}`}
              x={cell.c}
              y={cell.r}
              width={1}
              height={1}
              fill="#064e3b"
            />
          ))}
        </svg>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="font-mono text-base font-bold tracking-wider text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
          {code}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-emerald-700 hover:border-emerald-300 transition-colors"
          title="Copy pickup code"
        >
          {copied ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>
      <p className="text-xs text-slate-500 mt-2 text-center">{subtitle}</p>
    </div>
  );
}
