import { assertMaxSize, assertMime, fileResponse, isUploadFile, jsonError } from '@/lib/server/http';
import { createDocxFromParagraphs, extractPdfText } from '@/lib/server/conversions';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!isUploadFile(file)) return jsonError('Please upload one PDF file.');
    assertMaxSize(file, 50);
    assertMime(file, ['application/pdf', '.pdf'], 'a PDF file');

    const text = await extractPdfText(new Uint8Array(await file.arrayBuffer()));
    const outputBytes = createDocxFromParagraphs(text);
    const filename = 'converted.docx';
    return fileResponse(outputBytes, filename, 'PDF text converted to DOCX. Please review layout after download.');
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Unable to convert PDF to Word.', 500);
  }
}
