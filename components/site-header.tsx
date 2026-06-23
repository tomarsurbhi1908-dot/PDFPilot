import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BrandMark } from '@/components/brand-mark';

type SiteHeaderProps = {
  toolsHref?: string;
  ctaHref?: string;
  ctaLabel?: string;
};

export function SiteHeader({
  toolsHref = '/#tools',
  ctaHref = '/tools/merge-pdf',
  ctaLabel = 'Start now',
}: SiteHeaderProps) {
  return (
    <div className="sticky top-4 z-50 mx-auto flex w-full max-w-6xl justify-center px-4">
      <header className="rainbow-frame relative w-full overflow-hidden rounded-2xl bg-white/80 ring-1 ring-slate-900/5 backdrop-blur-xl">
        <div className="h-1 bg-[linear-gradient(100deg,#ff2d55,#ff8a00,#facc15,#22c55e,#06b6d4,#6366f1,#d946ef)]" />
        <div className="mx-auto flex min-h-16 items-center justify-between gap-3 px-4 py-2 sm:gap-4 sm:px-6">
          <Link href="/" className="group flex min-w-0 items-center gap-3 transition-transform duration-300 hover:scale-[1.02]">
            <BrandMark size="sm" />
            <span className="truncate text-xl font-black text-slate-800" style={{ textShadow: '1px 1px 0px #cbd5e1, 2px 2px 0px #94a3b8' }}>
              PDFpaglu
            </span>
          </Link>

          <nav aria-label="Primary navigation" className="hidden items-center gap-1 md:flex">
            <Link href={toolsHref} className="rounded-xl px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-white/80 hover:text-rose-600">
              Tools
            </Link>
            <Link href="/tools/merge-pdf" className="rounded-xl px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-white/80 hover:text-orange-600">
              Merge
            </Link>
            <Link href="/tools/compress-pdf" className="rounded-xl px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-white/80 hover:text-emerald-600">
              Compress
            </Link>
            <Link href="/tools/pdf-to-word" className="rounded-xl px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-white/80 hover:text-indigo-600">
              Convert
            </Link>
          </nav>

          <Link
            href={ctaHref}
            className="rainbow-button inline-flex max-w-[44vw] shrink-0 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_34px_-20px_rgba(99,102,241,0.9)] active:translate-y-0 sm:max-w-none sm:px-5"
          >
            <span className="truncate">{ctaLabel}</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </header>
    </div>
  );
}
