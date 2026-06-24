import { PDFDocument } from 'pdf-lib';
import { assertMaxSize, assertMime, fileResponse, isUploadFile, jsonError } from '@/lib/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files').filter(isUploadFile);

    if (files.length < 2) {
      return jsonError('Upload at least 2 PDF files to merge.');
    }

    files.forEach((file) => {
      assertMaxSize(file, 50);
      assertMime(file, ['application/pdf', '.pdf'], 'PDF files');
    });

    const merged = await PDFDocument.create();

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const source = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const copiedPages = await merged.copyPages(source, source.getPageIndices());
      copiedPages.forEach((page) => merged.addPage(page));
    }

    const outputBytes = await merged.save();
    const filename = 'merged.pdf';
    return fileResponse(outputBytes, filename, 'PDFs merged successfully.');
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Unable to merge PDFs.', 500);
  }
}
