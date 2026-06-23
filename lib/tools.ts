export type ToolSlug =
  | 'merge-pdf'
  | 'split-pdf'
  | 'image-to-pdf'
  | 'compress-pdf'
  | 'word-to-pdf'
  | 'pdf-to-word'
  | 'watermark-pdf'
  | 'protect-pdf'
  | 'sign-pdf';

export type ToolConfig = {
  slug: ToolSlug;
  title: string;
  shortTitle: string;
  description: string;
  accept: string;
  multiple: boolean;
  endpoint: string;
  badge: string;
  helpText: string;
  output: string;
  needsRanges?: boolean;
  needsQuality?: boolean;
  needsText?: boolean;
  needsPassword?: boolean;
  needsSignature?: boolean;
  experimental?: boolean;
};

export const tools: ToolConfig[] = [
  {
    slug: 'merge-pdf',
    title: 'Merge PDF',
    shortTitle: 'Merge',
    description: 'Combine multiple PDF files into one clean downloadable PDF.',
    accept: 'application/pdf',
    multiple: true,
    endpoint: '/api/tools/merge-pdf',
    badge: 'Browser-friendly',
    helpText: 'Upload 2 or more PDFs. Reorder them before converting.',
    output: 'merged.pdf'
  },
  {
    slug: 'split-pdf',
    title: 'Split PDF',
    shortTitle: 'Split',
    description: 'Extract selected pages from a PDF using page ranges.',
    accept: 'application/pdf',
    multiple: false,
    endpoint: '/api/tools/split-pdf',
    badge: 'Precise pages',
    helpText: 'Example range: 1-3,5,8-10. Leave blank to extract page 1.',
    output: 'split.pdf',
    needsRanges: true
  },
  {
    slug: 'image-to-pdf',
    title: 'Image to PDF',
    shortTitle: 'Image to PDF',
    description: 'Convert JPG and PNG images into a single polished PDF.',
    accept: 'image/jpeg,image/png',
    multiple: true,
    endpoint: '/api/tools/image-to-pdf',
    badge: 'JPG / PNG',
    helpText: 'Upload one or more JPG/PNG images. Each image becomes one PDF page.',
    output: 'images.pdf'
  },
  {
    slug: 'compress-pdf',
    title: 'Compress PDF',
    shortTitle: 'Compress',
    description: 'Reduce PDF file size using a server-side compression engine.',
    accept: 'application/pdf',
    multiple: false,
    endpoint: '/api/tools/compress-pdf',
    badge: 'Reduce size',
    helpText: 'Upload one PDF and choose the compression level you prefer.',
    output: 'compressed.pdf',
    needsQuality: true
  },
  {
    slug: 'word-to-pdf',
    title: 'Word to PDF',
    shortTitle: 'Word to PDF',
    description: 'Convert DOC and DOCX files to PDF using LibreOffice headless.',
    accept: '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    multiple: false,
    endpoint: '/api/tools/word-to-pdf',
    badge: 'DOC / DOCX',
    helpText: 'Upload one Word document and convert it into a PDF.',
    output: 'converted.pdf'
  },
  {
    slug: 'pdf-to-word',
    title: 'PDF to Word',
    shortTitle: 'PDF to Word',
    description: 'Convert PDF into DOCX with an experimental Python converter.',
    accept: 'application/pdf',
    multiple: false,
    endpoint: '/api/tools/pdf-to-word',
    badge: 'Experimental',
    helpText: 'Upload one PDF. Complex layouts may need small edits after conversion.',
    output: 'converted.docx',
    experimental: true
  },
  {
    slug: 'watermark-pdf',
    title: 'Watermark PDF',
    shortTitle: 'Watermark',
    description: 'Stamp an image or text over your PDF in seconds.',
    accept: 'application/pdf',
    multiple: false,
    endpoint: '/api/tools/watermark-pdf',
    badge: 'Custom text',
    helpText: 'Enter the text you want to use as a watermark.',
    output: 'watermarked.pdf',
    needsText: true
  },
  {
    slug: 'protect-pdf',
    title: 'Protect PDF',
    shortTitle: 'Protect',
    description: 'Encrypt your PDF with a password to prevent unauthorized access.',
    accept: 'application/pdf',
    multiple: false,
    endpoint: '/api/tools/protect-pdf',
    badge: 'Secure',
    helpText: 'Enter a strong password to encrypt the PDF file.',
    output: 'protected.pdf',
    needsPassword: true
  },
  {
    slug: 'sign-pdf',
    title: 'Sign PDF',
    shortTitle: 'Sign',
    description: 'Stamp a signature image on the last page of your PDF.',
    accept: 'application/pdf',
    multiple: false,
    endpoint: '/api/tools/sign-pdf',
    badge: 'Stamp',
    helpText: 'Upload a PDF. You will be prompted to upload a signature image next.',
    output: 'signed.pdf',
    needsSignature: true
  }
];

export function getTool(slug: string) {
  return tools.find((tool) => tool.slug === slug);
}
