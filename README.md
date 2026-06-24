# PDFPilot — PDF Tools Website

A premium PDF conversion website starter built with Next.js, TypeScript, Tailwind CSS and server-side conversion routes.

## Included tools

- Merge PDF
- Split PDF by page ranges
- Image to PDF for JPG/PNG
- Compress PDF using in-process PDF optimization
- Word to PDF for DOCX text documents
- PDF to Word text extraction, experimental
- Password protect PDF
- Sign PDF

## Run locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Runtime notes

The core PDF tools run in-process with JavaScript dependencies, so they do not need Ghostscript, LibreOffice, qpdf, Python, or temporary filesystem writes.

Word to PDF supports DOCX text extraction. Legacy `.doc` files and pixel-perfect Office layout conversion require a dedicated Office conversion worker.

PDF to Word extracts selectable PDF text into DOCX. Scanned PDFs and complex fixed-layout documents may need OCR or a commercial conversion engine for best results.

## Routes

Frontend pages:

```text
/
/tools/merge-pdf
/tools/split-pdf
/tools/image-to-pdf
/tools/compress-pdf
/tools/word-to-pdf
/tools/pdf-to-word
/tools/watermark-pdf
/tools/protect-pdf
/tools/sign-pdf
```

API routes:

```text
POST /api/tools/merge-pdf
POST /api/tools/split-pdf
POST /api/tools/image-to-pdf
POST /api/tools/compress-pdf
POST /api/tools/word-to-pdf
POST /api/tools/pdf-to-word
POST /api/tools/watermark-pdf
POST /api/tools/protect-pdf
POST /api/tools/sign-pdf
```

## File privacy

Uploaded files are processed in memory by the API route and returned directly as downloads.

For production, you should add:

- Authentication if needed
- Rate limiting
- Better job queue for large files
- Virus scanning
- A cron cleanup job
- Cloud object storage with short expiry links if you later add asynchronous jobs
- Worker containers for OCR or pixel-perfect Office conversions

## Important notes

PDF to Word conversion is never perfect because PDF is a fixed-layout format. Keep it marked experimental unless you use a more advanced commercial conversion engine.

## Deployment recommendation

The included routes are designed to avoid forbidden serverless operations such as spawning binaries or writing temporary conversion files. Use Docker or a VPS/container worker only if you add full LibreOffice, Ghostscript, OCR, or commercial conversion engines later.
