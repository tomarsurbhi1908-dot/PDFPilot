import { PDFDocument, rgb, degrees } from 'pdf-lib';
import { assertMaxSize, assertMime, fileResponse, isUploadFile, jsonError } from '@/lib/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const text = (formData.get('text') as string) || 'CONFIDENTIAL';

    if (!isUploadFile(file)) {
      return jsonError('Please upload one PDF file.');
    }

    assertMaxSize(file, 50);
    assertMime(file, ['application/pdf', '.pdf'], 'a PDF file');

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
    return fileResponse(outputBytes, filename, 'Watermark added successfully.');
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Unable to add watermark.', 500);
  }
}
