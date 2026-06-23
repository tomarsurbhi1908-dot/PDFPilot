import Link from 'next/link';
import { tools } from '@/lib/tools';
import { BrandMark } from '@/components/brand-mark';
import { Combine, Scissors, Image as ImageIcon, Minimize2, FileText, FileEdit, Stamp, Lock, PenTool } from 'lucide-react';

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
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-3">
          <BrandMark />
          <span className="text-lg font-bold">PDFpaglu</span>
        </Link>
        <a href="#tools" className="rounded-lg border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50">
          View tools
        </a>
      </header>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-16 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pt-16">
        <div>
          <div className="mb-5 inline-flex rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
            Free PDF tools for everyday documents
          </div>
          <h1 className="max-w-4xl text-5xl font-black leading-tight sm:text-6xl lg:text-7xl">
            PDF tools that get the job done fast.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Use PDFpaglu to merge, split, compress, convert, sign, protect, and watermark PDFs without creating an account.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/tools/merge-pdf" className="rounded-lg bg-slate-900 px-6 py-3 text-center font-bold text-white shadow-sm transition hover:bg-slate-800">
              Start with Merge PDF
            </Link>
            <Link href="#tools" className="rounded-lg border border-slate-200 bg-white px-6 py-3 text-center font-bold text-slate-900 shadow-sm transition hover:bg-slate-50">
              Browse all tools
            </Link>
          </div>
          <div className="mt-8 grid max-w-2xl gap-3 text-sm text-slate-600 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <p className="font-bold text-slate-900">{feature.title}</p>
                <p className="mt-1 leading-6">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="relative border border-slate-200 bg-white p-4 shadow-xl">
            <div className="border border-slate-200 bg-slate-50 p-5">
              <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <p className="text-sm text-slate-500">Current job</p>
                  <p className="font-semibold text-slate-900">invoice-files.pdf</p>
                </div>
                <span className="rounded-lg bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">Ready</span>
              </div>
              <div className="space-y-3">
                {['Upload your files', 'Choose clear settings', 'Download the result'].map((item, index) => (
                  <div key={item} className="flex items-center gap-4 border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-slate-900 text-sm font-black text-white">{index + 1}</div>
                    <div>
                      <p className="font-semibold text-slate-900">{item}</p>
                      <p className="text-sm text-slate-500">Simple workflow with clear progress.</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-lg bg-gradient-to-r from-indigo-600 to-rose-600 p-4 text-center font-black text-white shadow-md">
                Download PDF
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="tools" className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase text-indigo-600">Tools</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl text-slate-900">Pick a conversion</h2>
          </div>
          <p className="max-w-xl text-slate-600">PDF merge, split, image-to-PDF, compression, Word conversion, watermark, protection and signing in one place.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-lg bg-slate-50 text-lg font-black border border-slate-100">
                  {getToolIcon(tool.slug)}
                </div>
                <span className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500 bg-slate-50">{tool.badge}</span>
              </div>
              <h3 className="text-xl font-black text-slate-900">{tool.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{tool.description}</p>
              <p className="mt-5 text-sm font-bold text-indigo-600 transition group-hover:text-indigo-700">Open tool</p>
            </Link>
          ))}
        </div>
      </section>

      <footer className="mx-auto max-w-7xl border-t border-slate-200 px-6 py-10">
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
