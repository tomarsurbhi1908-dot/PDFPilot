'use client';

import { useMemo, useRef, useState } from 'react';
import type { ToolConfig } from '@/lib/tools';
import { prettyBytes } from '@/lib/utils';

type Result = {
  ok: boolean;
  filename?: string;
  downloadUrl?: string;
  message?: string;
  error?: string;
};

export default function ToolClient({ tool }: { tool: ToolConfig }) {
  const [files, setFiles] = useState<File[]>([]);
  const [ranges, setRanges] = useState('1');
  const [quality, setQuality] = useState('ebook');
  const [text, setText] = useState('CONFIDENTIAL');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'uploading' | 'ready' | 'error'>('idle');
  const [result, setResult] = useState<Result | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const canConvert = useMemo(() => {
    if (tool.multiple) return files.length > 0 && (tool.slug !== 'merge-pdf' || files.length > 1);
    return files.length === 1;
  }, [files, tool.multiple, tool.slug]);

  function onFiles(nextFiles: FileList | null) {
    if (!nextFiles) return;
    setFiles((current) => {
      const incoming = Array.from(nextFiles);
      return tool.multiple ? [...current, ...incoming] : incoming.slice(0, 1);
    });
    setResult(null);
    setStatus('idle');
  }

  function moveFile(index: number, direction: -1 | 1) {
    setFiles((current) => {
      const copy = [...current];
      const target = index + direction;
      if (target < 0 || target >= copy.length) return current;
      [copy[index], copy[target]] = [copy[target], copy[index]];
      return copy;
    });
  }

  async function convert() {
    if (!canConvert) return;
    setStatus('uploading');
    setResult(null);

    const form = new FormData();
    if (tool.multiple) {
      files.forEach((file) => form.append('files', file));
    } else {
      form.append('file', files[0]);
    }
    if (tool.needsRanges) form.append('ranges', ranges);
    if (tool.needsQuality) form.append('quality', quality);
    if (tool.needsText) form.append('text', text);
    if (tool.needsPassword) form.append('password', password);

    try {
      const response = await fetch(tool.endpoint, {
        method: 'POST',
        body: form
      });
      const data = (await response.json()) as Result;
      setResult(data);
      setStatus(data.ok ? 'ready' : 'error');
    } catch {
      setResult({ ok: false, error: 'Something went wrong. Please try again.' });
      setStatus('error');
    }
  }

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-4 shadow-2xl backdrop-blur sm:p-6">
      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          onFiles(event.dataTransfer.files);
        }}
        className="rounded-[1.5rem] border border-dashed border-indigo-300/40 bg-slate-950/60 p-8 text-center transition hover:border-indigo-200/70"
      >
        <input
          ref={inputRef}
          type="file"
          accept={tool.accept}
          multiple={tool.multiple}
          className="hidden"
          onChange={(event) => onFiles(event.target.files)}
        />
        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-white text-2xl font-black text-slate-950">↑</div>
        <h2 className="text-2xl font-black">Drop files here</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-300">{tool.helpText}</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-6 rounded-2xl bg-white px-6 py-3 font-bold text-slate-950 transition hover:bg-slate-200"
        >
          Choose files
        </button>
      </div>

      {files.length > 0 && (
        <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-slate-950/50 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-black">Selected files</h3>
            <button type="button" className="text-sm text-slate-400 hover:text-white" onClick={() => setFiles([])}>
              Clear all
            </button>
          </div>
          <div className="space-y-3">
            {files.map((file, index) => (
              <div key={`${file.name}-${index}`} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-white">{index + 1}. {file.name}</p>
                  <p className="text-sm text-slate-400">{prettyBytes(file.size)}</p>
                </div>
                <div className="flex gap-2">
                  {tool.slug === 'merge-pdf' && (
                    <>
                      <button type="button" className="rounded-xl border border-white/10 px-3 py-2 text-sm hover:bg-white/10" onClick={() => moveFile(index, -1)}>Up</button>
                      <button type="button" className="rounded-xl border border-white/10 px-3 py-2 text-sm hover:bg-white/10" onClick={() => moveFile(index, 1)}>Down</button>
                    </>
                  )}
                  <button
                    type="button"
                    className="rounded-xl border border-red-300/20 px-3 py-2 text-sm text-red-100 hover:bg-red-500/10"
                    onClick={() => setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(tool.needsRanges || tool.needsQuality || tool.needsText || tool.needsPassword) && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {tool.needsRanges && (
            <label className="block rounded-2xl border border-white/10 bg-slate-950/50 p-4">
              <span className="text-sm font-bold text-slate-200">Pages to extract</span>
              <input
                value={ranges}
                onChange={(event) => setRanges(event.target.value)}
                placeholder="1-3,5"
                className="mt-3 w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none focus:border-indigo-300/60"
              />
            </label>
          )}
          {tool.needsQuality && (
            <label className="block rounded-2xl border border-white/10 bg-slate-950/50 p-4">
              <span className="text-sm font-bold text-slate-200">Compression quality</span>
              <select
                value={quality}
                onChange={(event) => setQuality(event.target.value)}
                className="mt-3 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-300/60"
              >
                <option value="screen">Smallest file</option>
                <option value="ebook">Balanced</option>
                <option value="printer">High quality</option>
                <option value="prepress">Best quality</option>
              </select>
            </label>
          )}
          {tool.needsText && (
            <label className="block rounded-2xl border border-white/10 bg-slate-950/50 p-4">
              <span className="text-sm font-bold text-slate-200">Watermark text</span>
              <input
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="CONFIDENTIAL"
                className="mt-3 w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none focus:border-indigo-300/60"
              />
            </label>
          )}
          {tool.needsPassword && (
            <label className="block rounded-2xl border border-white/10 bg-slate-950/50 p-4">
              <span className="text-sm font-bold text-slate-200">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter strong password"
                className="mt-3 w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none focus:border-indigo-300/60"
              />
            </label>
          )}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-slate-400">
          Output: <span className="font-semibold text-slate-200">{tool.output}</span>
          {tool.experimental && <span className="ml-2 text-amber-200">Experimental conversion</span>}
        </div>
        <button
          type="button"
          disabled={!canConvert || status === 'uploading'}
          onClick={convert}
          className="rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-7 py-3 font-black text-white transition disabled:cursor-not-allowed disabled:opacity-40"
        >
          {status === 'uploading' ? 'Converting...' : `Convert ${tool.shortTitle}`}
        </button>
      </div>

      {result && (
        <div className={`mt-6 rounded-2xl border p-4 ${result.ok ? 'border-emerald-300/20 bg-emerald-400/10' : 'border-red-300/20 bg-red-500/10'}`}>
          <p className="font-bold">{result.ok ? result.message : result.error}</p>
          {result.ok && result.downloadUrl && (
            <a
              href={result.downloadUrl}
              className="mt-4 inline-flex rounded-xl bg-white px-5 py-3 font-black text-slate-950 transition hover:bg-slate-200"
            >
              Download {result.filename || 'file'}
            </a>
          )}
        </div>
      )}
    </section>
  );
}
