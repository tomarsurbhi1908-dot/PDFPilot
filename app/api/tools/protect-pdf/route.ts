import { NextResponse } from 'next/server';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { assertMaxSize, assertMime, isUploadFile, jsonError } from '@/lib/server/http';
import { cleanupOldJobs, createJobDirs, createJobId, downloadUrl, ensureBaseDirs, outputPath, saveUploadedFile } from '@/lib/server/storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const run = promisify(execFile);

export async function POST(request: Request) {
  try {
    await ensureBaseDirs();
    await cleanupOldJobs();

    const formData = await request.formData();
    const file = formData.get('file');
    const password = String(formData.get('password') || '');

    if (!isUploadFile(file)) return jsonError('Please upload one PDF file.');
    if (!password) return jsonError('Please provide a password to protect the PDF.');
    assertMaxSize(file, 80);
    assertMime(file, ['application/pdf', '.pdf'], 'a PDF file');

    const jobId = createJobId();
    const { uploadDir } = await createJobDirs(jobId);
    const input = await saveUploadedFile(file, uploadDir);
    const filename = 'protected.pdf';
    const output = outputPath(jobId, filename);

    const binary = process.env.QPDF_BINARY || 'qpdf';
    const args = [
      '--encrypt',
      password,
      password,
      '256',
      '--',
      input.path,
      output
    ];

    try {
      await run(binary, args, { timeout: 60000 });
    } catch {
      return jsonError('qpdf is not installed or not available. Install it or set QPDF_BINARY.', 500);
    }

    return NextResponse.json({
      ok: true,
      filename,
      downloadUrl: downloadUrl(jobId, filename),
      message: 'PDF protected successfully.'
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Unable to protect PDF.', 500);
  }
}
