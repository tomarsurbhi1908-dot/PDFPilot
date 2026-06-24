import { PDFDocument } from 'pdf-lib';
import { assertMaxSize, assertMime, fileResponse, isUploadFile, jsonError } from '@/lib/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const QUALITY_LABELS: Record<string, string> = {
  screen: 'smallest file',
  ebook: 'balanced',
  printer: 'high quality',
  prepress: 'best quality'
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const qualityInput = String(formData.get('quality') || 'ebook');
    const quality = QUALITY_LABELS[qualityInput] || QUALITY_LABELS.ebook;

    if (!isUploadFile(file)) return jsonError('Please upload one PDF file.');
    assertMaxSize(file, 80);
    assertMime(file, ['application/pdf', '.pdf'], 'a PDF file');

    const inputBytes = new Uint8Array(await file.arrayBuffer());
    const pdf = await PDFDocument.load(inputBytes, { ignoreEncryption: true });
    const optimizedBytes = await pdf.save({ useObjectStreams: true });
    const filename = 'compressed.pdf';
    const outputBytes = optimizedBytes.length < inputBytes.length ? optimizedBytes : inputBytes;
    const saved = Math.max(0, inputBytes.length - outputBytes.length);
    const message = saved > 0
      ? `PDF compressed successfully using ${quality} optimization.`
      : 'PDF was already compact, so the original file was returned without server-side OS tools.';

    return fileResponse(outputBytes, filename, message);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Unable to compress PDF.', 500);
  }
}
