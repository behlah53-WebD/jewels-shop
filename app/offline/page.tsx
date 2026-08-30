"use client";

import React from "react";
import Link from "next/link";
import { WifiOff, RotateCcw, ArrowRight } from "lucide-react";

export default function OfflinePage() {
  return (
    <main className="page cream flex flex-col items-center justify-center min-h-[75vh] px-4 text-center">
      <div className="max-w-md w-full py-12 px-6 bg-white/80 backdrop-blur-md rounded-2xl border border-amber-950/10 shadow-xl flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-amber-950/5 flex items-center justify-center mb-6 text-amber-900">
          <WifiOff size={32} />
        </div>

        <p className="text-xs uppercase tracking-widest font-semibold text-amber-900/70 mb-2">
          Offline Mode
        </p>

        <h1 className="text-3xl font-serif italic text-amber-950 mb-3">
          Connection lost.
        </h1>

        <p className="text-sm text-stone-600 mb-8 leading-relaxed">
          You are currently offline. Please check your internet connection to continue exploring the full collection and live atelier updates.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <button
            onClick={() => window.location.reload()}
            className="btn gold flex items-center justify-center gap-2 text-xs font-semibold py-3 px-6 rounded-lg transition-transform active:scale-95"
          >
            <RotateCcw size={15} /> Retry connection
          </button>
          <Link
            href="/"
            className="btn ghost flex items-center justify-center gap-2 text-xs font-semibold py-3 px-6 rounded-lg"
          >
            Go home <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </main>
  );
}
