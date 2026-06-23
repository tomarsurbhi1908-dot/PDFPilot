import Link from 'next/link';
import { tools } from '@/lib/tools';
import { BrandMark } from '@/components/brand-mark';
import { SiteHeader } from '@/components/site-header';
import { ArrowRight, Combine, Scissors, Image as ImageIcon, Minimize2, FileText, FileEdit, Stamp, Lock, PenTool } from 'lucide-react';

function getToolIcon(slug: string) {
  switch (slug) {
    case 'merge-pdf': return <Combine className="h-6 w-6 text-indigo-500" />;
    case 'split-pdf': return <Scissors className="h-6 w-6 text-emerald-500" />;
    case 'image-to-pdf': return <ImageIcon className="h-6 w-6 text-amber-500" />;
    case 'compress-pdf': return <Minimize2 className="h-6 w-6 text-rose-500" />;
    case 'word-to-pdf': return <FileText className="h-6 w-6 text-blue-500" />;
    case 'pdf-to-word': return <FileEdit className="h-6 w-6 text-sky-500" />;
    case 'watermark-pdf': return <Stamp className="h-6 w-6 text-purple-500" />;
    case 'protect-pdf': return <Lock className="h-6 w-6 text-orange-500" />;
    case 'sign-pdf': return <PenTool className="h-6 w-6 text-pink-500" />;
    default: return <FileText className="h-6 w-6 text-slate-500" />;
  }
}

const features = [
  {
    title: 'No signup',
    text: 'Open a tool and start working immediately.'
  },
  {
    title: 'Private by default',
    text: 'Files are cleared automatically after 1 hour.'
  },
  {
    title: 'Works anywhere',
    text: 'Clean layouts for phone, tablet, and desktop.'
  },
  {
    title: 'Everyday PDF tasks',
    text: 'Merge, split, compress, sign, protect, and convert.'
  }
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden text-slate-900">
      <SiteHeader toolsHref="#tools" ctaHref="#tools" ctaLabel="View tools" />

      <section className="relative mx-auto grid max-w-7xl gap-12 px-6 pb-16 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pt-16">
        <div>
          <div className="rainbow-chip mb-5 inline-flex rounded-full px-4 py-2 text-sm font-bold text-slate-800 backdrop-blur-sm">
            Free PDF tools for everyday documents
          </div>
          <h1 className="max-w-4xl text-4xl font-black leading-tight sm:text-6xl lg:text-7xl">
            PDF tools that feel <span className="rainbow-text">fast and premium.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Use PDFpaglu to merge, split, compress, convert, sign, protect, and watermark PDFs without creating an account.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/tools/merge-pdf" className="rainbow-button inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-3.5 text-center font-bold transition hover:scale-105 sm:w-auto">
              Start with Merge PDF <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Link href="#tools" className="rainbow-frame inline-flex w-full items-center justify-center rounded-full px-8 py-3.5 text-center font-bold text-slate-900 transition hover:-translate-y-0.5 sm:w-auto">
              Browse all tools
            </Link>
          </div>
          <div className="mt-8 grid max-w-2xl gap-4 text-sm text-slate-600 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.title} className="premium-card rounded-xl p-5">
                <p className="font-bold text-slate-900">{feature.title}</p>
                <p className="mt-1 leading-6">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="rainbow-frame relative rounded-2xl p-5">
            <div className="rounded-xl border border-white/70 bg-white/75 p-6 shadow-inner backdrop-blur-xl">
              <div className="mb-6 flex items-center justify-between border-b border-slate-200/60 pb-5">
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">Current job</p>
                  <p className="mt-1 text-lg font-bold text-slate-900">invoice-files.pdf</p>
                </div>
                <span className="rainbow-chip rounded-full px-3 py-1 text-sm font-bold text-slate-800">Ready</span>
              </div>
              <div className="space-y-4">
                {['Upload your files', 'Choose clear settings', 'Download the result'].map((item, index) => (
                  <div key={item} className="premium-card flex items-center gap-4 rounded-xl p-4 transition-transform hover:scale-[1.02]">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-950 text-sm font-black text-white shadow-md">{index + 1}</div>
                    <div>
                      <p className="font-bold text-slate-900">{item}</p>
                      <p className="text-sm text-slate-500">Simple workflow with clear progress.</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rainbow-button mt-6 rounded-xl p-4 text-center font-black transition-transform hover:scale-[1.02]">
                Download PDF
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="tools" className="relative mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="rainbow-text text-sm font-bold uppercase">Tools</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl text-slate-900">Pick a conversion</h2>
          </div>
          <p className="max-w-xl text-slate-600">PDF merge, split, image-to-PDF, compression, Word conversion, watermark, protection and signing in one place.</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="premium-card group relative overflow-hidden rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(100deg,#ff2d55,#ff8a00,#facc15,#22c55e,#06b6d4,#6366f1,#d946ef)] opacity-70 transition group-hover:opacity-100" />
              <div className="mb-6 flex items-center justify-between">
                <div className="rainbow-icon-shell grid h-14 w-14 place-items-center rounded-xl text-lg transition-transform group-hover:scale-110">
                  {getToolIcon(tool.slug)}
                </div>
                <span className="rainbow-chip rounded-full px-3 py-1 text-xs font-bold text-slate-700">{tool.badge}</span>
              </div>
              <h3 className="text-xl font-black text-slate-900">{tool.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{tool.description}</p>
              <p className="rainbow-text mt-6 flex items-center gap-2 text-sm font-bold transition">
                Open tool <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </p>
            </Link>
          ))}
        </div>
      </section>

      <footer id="privacy" className="mx-auto max-w-7xl border-t border-slate-200 px-6 py-10">
        <hr className="rainbow-divider mb-8" />
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <BrandMark size="sm" />
            <span className="text-sm font-bold text-slate-900">PDFpaglu</span>
          </div>
          <p className="text-sm text-slate-500 text-center">
            Your files are automatically deleted after 1 hour. We never store or share your data.
          </p>
          <p className="text-sm text-slate-400">© {new Date().getFullYear()} PDFpaglu</p>
        </div>
      </footer>
    </main>
  );
}
