import { PDFDocument } from 'pdf-lib';
import { assertMaxSize, assertMime, fileResponse, isUploadFile, jsonError } from '@/lib/server/http';
import { parsePageRanges } from '@/lib/server/ranges';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const ranges = String(formData.get('ranges') || '1');

    if (!isUploadFile(file)) return jsonError('Please upload one PDF file.');
    assertMaxSize(file, 50);
    assertMime(file, ['application/pdf', '.pdf'], 'a PDF file');

    const source = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
    const pageIndices = parsePageRanges(ranges, source.getPageCount());

    const output = await PDFDocument.create();
    const copiedPages = await output.copyPages(source, pageIndices);
    copiedPages.forEach((page) => output.addPage(page));

    const filename = 'split.pdf';
    return fileResponse(await output.save(), filename, `Extracted ${pageIndices.length} page(s).`);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Unable to split PDF.', 500);
  }
}
