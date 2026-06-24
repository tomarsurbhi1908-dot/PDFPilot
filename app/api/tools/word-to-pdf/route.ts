import { assertMaxSize, assertMime, fileResponse, isUploadFile, jsonError } from '@/lib/server/http';
import { docxToPdfBytes } from '@/lib/server/conversions';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!isUploadFile(file)) return jsonError('Please upload one DOCX file.');
    assertMaxSize(file, 50);
    if (file.name.toLowerCase().endsWith('.doc')) {
      return jsonError('Legacy .doc files need an Office conversion worker. Please upload a .docx file.', 400);
    }
    assertMime(
      file,
      [
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.docx'
      ],
      'a DOCX file'
    );

    const outputBytes = await docxToPdfBytes(new Uint8Array(await file.arrayBuffer()));
    const filename = 'converted.pdf';
    return fileResponse(outputBytes, filename, 'DOCX text converted to PDF successfully.');
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Unable to convert Word to PDF.', 500);
  }
}
