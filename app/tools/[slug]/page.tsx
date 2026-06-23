import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTool, tools } from '@/lib/tools';
import { BrandMark } from '@/components/brand-mark';
import ToolClient from './tool-client';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};

  return {
    title: tool.title,
    description: tool.description,
    openGraph: {
      title: `${tool.title} - PDFpaglu`,
      description: tool.description,
    },
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  return (
    <main className="min-h-screen px-6 py-6 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-slate-600 transition hover:text-slate-900">
            <BrandMark />
            <span className="font-bold text-slate-900">PDFpaglu</span>
          </Link>
          <Link href="/#tools" className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm transition hover:bg-slate-50">
            All tools
          </Link>
        </header>

        <section className="mb-8 text-center">
          <div className="mb-4 inline-flex rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-700 font-medium">
            {tool.badge}
          </div>
          <h1 className="text-4xl font-black sm:text-6xl text-slate-900">{tool.title}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">{tool.description}</p>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Files are used only for this conversion and cleared automatically after 1 hour.
          </p>
        </section>

        <ToolClient tool={tool} />
      </div>

      <footer className="mx-auto max-w-5xl border-t border-slate-200 mt-16 pt-8 pb-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Link href="/" className="flex items-center gap-2">
            <BrandMark size="sm" />
            <span className="text-sm font-bold text-slate-900">PDFpaglu</span>
          </Link>
          <p className="text-sm text-slate-500 text-center">
            Your files are automatically deleted after 1 hour. We never store or share your data.
          </p>
          <p className="text-sm text-slate-400">© {new Date().getFullYear()} PDFpaglu</p>
        </div>
      </footer>
    </main>
  );
}
