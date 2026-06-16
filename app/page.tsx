import Link from 'next/link';
import { tools } from '@/lib/tools';
import { Combine, Scissors, Image as ImageIcon, Minimize2, FileText, FileEdit, Stamp, Lock } from 'lucide-react';

function getToolIcon(slug: string) {
  switch (slug) {
    case 'merge-pdf': return <Combine className="h-6 w-6 text-slate-950" />;
    case 'split-pdf': return <Scissors className="h-6 w-6 text-slate-950" />;
    case 'image-to-pdf': return <ImageIcon className="h-6 w-6 text-slate-950" />;
    case 'compress-pdf': return <Minimize2 className="h-6 w-6 text-slate-950" />;
    case 'word-to-pdf': return <FileText className="h-6 w-6 text-slate-950" />;
    case 'pdf-to-word': return <FileEdit className="h-6 w-6 text-slate-950" />;
    case 'watermark-pdf': return <Stamp className="h-6 w-6 text-slate-950" />;
    case 'protect-pdf': return <Lock className="h-6 w-6 text-slate-950" />;
    default: return <FileText className="h-6 w-6 text-slate-950" />;
  }
}

const features = [
  'Temporary files only',
  'Easy download flow',
  'Clean mobile UI',
  'No paid API required'
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-lg font-black text-slate-950 shadow-glow">P</div>
          <span className="text-lg font-bold tracking-tight">PDFPilot</span>
        </Link>
        <a href="#tools" className="rounded-full border border-white/10 px-5 py-2 text-sm text-slate-200 transition hover:bg-white/10">
          View tools
        </a>
      </header>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-16 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pt-16">
        <div>
          <div className="mb-5 inline-flex rounded-full border border-indigo-400/30 bg-indigo-400/10 px-4 py-2 text-sm text-indigo-100">
            All-in-one PDF conversion starter
          </div>
          <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Merge, convert and download files in one place.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            A premium SaaS-style PDF tools website with upload screens, conversion APIs, temporary storage, and ready download links.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/tools/merge-pdf" className="rounded-2xl bg-white px-6 py-3 text-center font-bold text-slate-950 transition hover:bg-slate-200">
              Start merging PDFs
            </Link>
            <Link href="/tools/image-to-pdf" className="rounded-2xl border border-white/15 px-6 py-3 text-center font-bold text-white transition hover:bg-white/10">
              Convert images
            </Link>
          </div>
          <div className="mt-8 grid max-w-xl grid-cols-2 gap-3 text-sm text-slate-300 sm:grid-cols-4">
            {features.map((feature) => (
              <div key={feature} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-center">
                {feature}
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 rounded-[3rem] bg-indigo-500/20 blur-3xl" />
          <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.06] p-4 shadow-2xl backdrop-blur">
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-5">
              <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-sm text-slate-400">Current job</p>
                  <p className="font-semibold">invoice-files.pdf</p>
                </div>
                <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-sm text-emerald-200">Ready</span>
              </div>
              <div className="space-y-3">
                {['Upload files', 'Convert securely', 'Download result'].map((item, index) => (
                  <div key={item} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-sm font-black text-slate-950">{index + 1}</div>
                    <div>
                      <p className="font-semibold">{item}</p>
                      <p className="text-sm text-slate-400">Fast tool flow with clean states.</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 p-4 text-center font-black">
                Download PDF
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="tools" className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-200">Tools</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Pick a conversion</h2>
          </div>
          <p className="max-w-xl text-slate-300">MVP includes PDF merge, split, image-to-PDF, compression, Word-to-PDF and experimental PDF-to-Word.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group rounded-3xl border border-white/10 bg-white/[0.05] p-6 transition hover:-translate-y-1 hover:border-indigo-300/40 hover:bg-white/[0.08]"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-lg font-black text-slate-950">
                  {getToolIcon(tool.slug)}
                </div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">{tool.badge}</span>
              </div>
              <h3 className="text-xl font-black">{tool.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{tool.description}</p>
              <p className="mt-5 text-sm font-bold text-indigo-200 transition group-hover:text-white">Open tool →</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
