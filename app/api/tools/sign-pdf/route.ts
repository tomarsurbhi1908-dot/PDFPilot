import { PDFDocument } from 'pdf-lib';
import { assertMaxSize, assertMime, fileResponse, isUploadFile, jsonError } from '@/lib/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const signature = formData.get('signature');

    if (!isUploadFile(file)) return jsonError('Please upload one PDF file.');
    if (!isUploadFile(signature)) return jsonError('Please upload a signature image.');

    assertMaxSize(file, 50);
    assertMime(file, ['application/pdf', '.pdf'], 'a PDF file');
    
    assertMaxSize(signature, 5);
    assertMime(signature, ['image/jpeg', 'image/png', '.jpg', '.jpeg', '.png'], 'a PNG or JPG image');

    const pdfBytes = await file.arrayBuffer();
    const signatureBytes = await signature.arrayBuffer();

    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    
    let image;
    if (signature.type === 'image/jpeg' || signature.name.toLowerCase().endsWith('.jpg') || signature.name.toLowerCase().endsWith('.jpeg')) {
      image = await pdfDoc.embedJpg(signatureBytes);
    } else {
      image = await pdfDoc.embedPng(signatureBytes);
    }

    const pages = pdfDoc.getPages();
    const lastPage = pages[pages.length - 1];
    
    // Scale image to a reasonable width (e.g. 150 points)
    const scaleFactor = 150 / image.width;
    const dims = image.scale(scaleFactor);
    
    const { width } = lastPage.getSize();
    
    // Stamp bottom-right, 50px padding
    lastPage.drawImage(image, {
      x: width - dims.width - 50,
      y: 50,
      width: dims.width,
      height: dims.height,
    });

    const outputBytes = await pdfDoc.save();
    const filename = 'signed.pdf';
    return fileResponse(outputBytes, filename, 'PDF signed successfully.');
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Unable to sign PDF.', 500);
  }
}
