import { PDFDocument, rgb, degrees } from 'pdf-lib';
import { NextResponse } from 'next/server';
import { assertMaxSize, assertMime, isUploadFile, jsonError } from '@/lib/server/http';
import { cleanupOldJobs, createJobDirs, createJobId, downloadUrl, ensureBaseDirs, outputPath } from '@/lib/server/storage';
import { writeFile } from 'node:fs/promises';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    await ensureBaseDirs();
    await cleanupOldJobs();

    const formData = await request.formData();
    const file = formData.get('file');
    const text = (formData.get('text') as string) || 'CONFIDENTIAL';

    if (!isUploadFile(file)) {
      return jsonError('Please upload one PDF file.');
    }

    assertMaxSize(file, 50);
    assertMime(file, ['application/pdf', '.pdf'], 'a PDF file');

    const jobId = createJobId();
    await createJobDirs(jobId);

    const bytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    
    const pages = pdfDoc.getPages();
    for (const page of pages) {
      const { width, height } = page.getSize();
      page.drawText(text, {
        x: width / 2 - (text.length * 18), 
        y: height / 2 - 20,
        size: 70,
        color: rgb(0.5, 0.5, 0.5),
        opacity: 0.4,
        rotate: degrees(45)
      });
    }

    const outputBytes = await pdfDoc.save();
    const filename = 'watermarked.pdf';
    await writeFile(outputPath(jobId, filename), Buffer.from(outputBytes));

    return NextResponse.json({
      ok: true,
      filename,
      downloadUrl: downloadUrl(jobId, filename),
      message: 'Watermark added successfully.'
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Unable to add watermark.', 500);
  }
}
