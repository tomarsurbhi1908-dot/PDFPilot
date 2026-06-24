import { PDFDocument } from 'pdf-lib';
import { assertMaxSize, assertMime, fileResponse, isUploadFile, jsonError } from '@/lib/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const A4 = { width: 595.28, height: 841.89 };
const MARGIN = 32;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files').filter(isUploadFile);

    if (files.length < 1) return jsonError('Upload at least one JPG or PNG image.');

    files.forEach((file) => {
      assertMaxSize(file, 20);
      assertMime(file, ['image/jpeg', 'image/png', '.jpg', '.jpeg', '.png'], 'JPG or PNG images');
    });

    const pdf = await PDFDocument.create();

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const image = file.type === 'image/png' || file.name.toLowerCase().endsWith('.png')
        ? await pdf.embedPng(bytes)
        : await pdf.embedJpg(bytes);

      const page = pdf.addPage([A4.width, A4.height]);
      const maxWidth = A4.width - MARGIN * 2;
      const maxHeight = A4.height - MARGIN * 2;
      const scale = Math.min(maxWidth / image.width, maxHeight / image.height, 1);
      const width = image.width * scale;
      const height = image.height * scale;

      page.drawImage(image, {
        x: (A4.width - width) / 2,
        y: (A4.height - height) / 2,
        width,
        height
      });
    }

    const filename = 'images.pdf';
    return fileResponse(await pdf.save(), filename, 'Images converted to PDF successfully.');
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Unable to convert images.', 500);
  }
}
