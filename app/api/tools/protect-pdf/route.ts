import { PDFDocument } from 'pdf-lib';
import { assertMaxSize, assertMime, fileResponse, isUploadFile, jsonError } from '@/lib/server/http';
import { encryptPdfBytes } from '@/lib/server/conversions';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const password = String(formData.get('password') || '');

    if (!isUploadFile(file)) return jsonError('Please upload one PDF file.');
    if (!password) return jsonError('Please provide a password to protect the PDF.');
    assertMaxSize(file, 80);
    assertMime(file, ['application/pdf', '.pdf'], 'a PDF file');

    const inputBytes = new Uint8Array(await file.arrayBuffer());
    const pdf = await PDFDocument.load(inputBytes, { ignoreEncryption: true });
    const normalizedBytes = await pdf.save({ useObjectStreams: false });
    const outputBytes = encryptPdfBytes(normalizedBytes, password);
    const filename = 'protected.pdf';
    return fileResponse(outputBytes, filename, 'PDF protected successfully.');
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Unable to protect PDF.', 500);
  }
}
