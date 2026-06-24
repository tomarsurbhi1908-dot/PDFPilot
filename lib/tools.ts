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
  seoTitle?: string;
  shortTitle: string;
  description: string;
  longDescription?: string;
  howToGuide?: { title: string; description: string }[];
  faqs?: { question: string; answer: string }[];
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
    seoTitle: 'Merge PDF Online Free - Combine PDF Files | PDFpaglu',
    shortTitle: 'Merge',
    description: 'Combine multiple PDF files into one clean downloadable PDF.',
    longDescription: 'Our free online PDF merger allows you to quickly combine multiple PDF documents into a single file. No registration or software installation is required. Simply drag and drop your files, reorder them if necessary, and download your merged PDF in seconds. All files are automatically deleted from our servers after one hour to guarantee your privacy.',
    howToGuide: [
      { title: 'Upload Files', description: 'Click to select your PDF files or drag and drop them directly into the upload area.' },
      { title: 'Reorder Pages', description: 'Once uploaded, you can drag the files to rearrange them in your desired order.' },
      { title: 'Merge & Download', description: 'Click the "Merge" button to combine your files, then download your new PDF immediately.' }
    ],
    faqs: [
      { question: 'Is it safe to merge PDF files online?', answer: 'Yes, absolutely. We use secure TLS connections for file uploads, and all files are permanently deleted from our servers 1 hour after processing.' },
      { question: 'Can I merge PDFs on a Mac or mobile phone?', answer: 'Yes! PDFpaglu works entirely in your web browser. You can merge files on Windows, Mac, iOS, or Android without installing any software.' },
      { question: 'Is there a limit to how many files I can merge?', answer: 'You can merge a generous number of files at once for free. If your files are extremely large, they may take slightly longer to process.' }
    ],
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
    seoTitle: 'Split PDF Online Free - Extract PDF Pages | PDFpaglu',
    shortTitle: 'Split',
    description: 'Extract selected pages from a PDF using page ranges.',
    longDescription: 'Easily extract specific pages or page ranges from your PDF document. Our free online PDF splitter is perfect for breaking large documents into smaller, more manageable pieces. Simply upload your file, enter the page numbers you want to keep, and download your new, smaller PDF document instantly.',
    howToGuide: [
      { title: 'Upload your PDF', description: 'Select the PDF file you wish to split or extract pages from.' },
      { title: 'Enter Page Ranges', description: 'Type the pages you need (e.g., "1-5, 8, 11-13"). You can preview the selection.' },
      { title: 'Split & Download', description: 'Click the split button. We will generate a new PDF containing only your selected pages.' }
    ],
    faqs: [
      { question: 'How do I extract a single page from a PDF?', answer: 'Upload your PDF and simply type the single page number (like "1" or "5") in the page range input. We will create a PDF with just that page.' },
      { question: 'Will my original PDF be modified?', answer: 'No. Your original file remains untouched. We create a brand new PDF file containing your extracted pages for you to download.' }
    ],
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
    seoTitle: 'Convert Image to PDF Online Free - JPG/PNG to PDF | PDFpaglu',
    shortTitle: 'Image to PDF',
    description: 'Convert JPG and PNG images into a single polished PDF.',
    longDescription: 'Turn your photos and images into a professional PDF document. Our free Image to PDF converter supports JPG and PNG formats. It is perfect for creating digital portfolios, scanning receipts, or combining multiple photos into one easily shareable document.',
    howToGuide: [
      { title: 'Upload Images', description: 'Select one or multiple JPG or PNG images from your device.' },
      { title: 'Arrange Order', description: 'Drag and drop your images to get them in the right sequence.' },
      { title: 'Convert', description: 'Hit convert and we will instantly merge your images into a single PDF file.' }
    ],
    faqs: [
      { question: 'Does converting an image to PDF reduce its quality?', answer: 'No, we try to preserve the original image quality as much as possible while placing it inside the PDF document.' },
      { question: 'Can I combine multiple images into one PDF?', answer: 'Yes! You can upload dozens of images at once and we will combine them into a multi-page PDF document.' }
    ],
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
    seoTitle: 'Compress PDF Online Free - Reduce PDF File Size | PDFpaglu',
    shortTitle: 'Compress',
    description: 'Optimize PDF structure to reduce file size when possible.',
    longDescription: 'Are your PDF files too large to email or upload? Use our free PDF compressor to optimize the PDF structure directly in the app runtime. Some files are already compact, but many PDFs can be cleaned up and saved smaller without installing software.',
    howToGuide: [
      { title: 'Upload PDF', description: 'Select the heavy PDF document you want to compress.' },
      { title: 'Select Compression Level', description: 'Choose between standard compression (good quality) or extreme compression (smallest size).' },
      { title: 'Download Smaller PDF', description: 'Click compress and download your optimized, lightweight PDF file.' }
    ],
    faqs: [
      { question: 'Will compressing my PDF make it blurry?', answer: 'We use smart compression that balances size and quality. For most documents, the visual difference is unnoticeable.' },
      { question: 'Is this tool safe for confidential documents?', answer: 'Yes, your files are completely safe. They are uploaded via a secure connection and deleted automatically 1 hour after compression.' }
    ],
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
    seoTitle: 'Convert Word to PDF Online Free - DOCX to PDF | PDFpaglu',
    shortTitle: 'Word to PDF',
    description: 'Convert DOCX text into a clean downloadable PDF.',
    longDescription: 'Easily convert text from Microsoft Word DOCX documents into a clean PDF. This runtime-safe converter is best for text documents; complex Word layouts, images, and legacy DOC files may require a full Office conversion engine.',
    howToGuide: [
      { title: 'Upload Word Document', description: 'Select your DOCX file to upload.' },
      { title: 'Processing', description: 'We extract readable text and place it into a clean PDF document.' },
      { title: 'Download PDF', description: 'Once converted, your new PDF is ready to download instantly.' }
    ],
    faqs: [
      { question: 'Will my formatting change during conversion?', answer: 'No, our converter preserves your original formatting, fonts, and images exactly as they appear in Word.' },
      { question: 'Do I need Microsoft Word installed?', answer: 'No, everything is processed on our servers. You do not need any Office software installed on your device.' }
    ],
    accept: '.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    multiple: false,
    endpoint: '/api/tools/word-to-pdf',
    badge: 'DOCX',
    helpText: 'Upload one DOCX document and convert its text into a PDF.',
    output: 'converted.pdf'
  },
  {
    slug: 'pdf-to-word',
    title: 'PDF to Word',
    seoTitle: 'Convert PDF to Word Online Free - PDF to DOCX | PDFpaglu',
    shortTitle: 'PDF to Word',
    description: 'Extract selectable PDF text into a DOCX document.',
    longDescription: 'Turn selectable text from PDF files into editable Microsoft Word documents (DOCX). PDF files use fixed layouts, so extracted text may need formatting adjustments after download, especially for scans or complex designs.',
    howToGuide: [
      { title: 'Upload PDF', description: 'Select the PDF file you need to edit in Word.' },
      { title: 'Convert', description: 'Wait a few seconds while we extract the text and formatting.' },
      { title: 'Download Word File', description: 'Download your editable DOCX file.' }
    ],
    faqs: [
      { question: 'Is the converted Word document editable?', answer: 'Yes. The resulting DOCX file can be opened in Microsoft Word or Google Docs and edited freely.' },
      { question: 'Will complex layouts look perfect?', answer: 'Simple text documents usually convert cleanly, but scanned PDFs, custom fonts, tables, columns, or graphics may require manual adjustment in Word.' }
    ],
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
    seoTitle: 'Add Watermark to PDF Online Free - Stamp PDFs | PDFpaglu',
    shortTitle: 'Watermark',
    description: 'Stamp an image or text over your PDF in seconds.',
    longDescription: 'Protect your intellectual property or classify your documents by adding a watermark to your PDF files. Our free tool lets you stamp custom text (like "CONFIDENTIAL" or "DRAFT") across the pages of your PDF document in just a few clicks.',
    howToGuide: [
      { title: 'Upload PDF', description: 'Select the document you want to watermark.' },
      { title: 'Type Text', description: 'Enter the text you want to use as your watermark stamp.' },
      { title: 'Apply & Download', description: 'We will stamp the text diagonally across your PDF and prepare it for download.' }
    ],
    faqs: [
      { question: 'Can I remove the watermark later?', answer: 'Once a watermark is flattened into the PDF using our tool, it is generally permanent and difficult to remove. Always keep a backup of your original file.' },
      { question: 'Is this tool free?', answer: 'Yes, you can watermark as many PDFs as you need for absolutely free.' }
    ],
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
    seoTitle: 'Password Protect PDF Online Free - Encrypt PDF | PDFpaglu',
    shortTitle: 'Protect',
    description: 'Encrypt your PDF with a password to prevent unauthorized access.',
    longDescription: 'Secure your sensitive PDF documents by adding a strong password. Our Protect PDF tool uses strong encryption to ensure that only people with the correct password can open and view the contents of your file.',
    howToGuide: [
      { title: 'Upload PDF', description: 'Select the private PDF file you wish to secure.' },
      { title: 'Set Password', description: 'Enter a strong password. Make sure you remember it!' },
      { title: 'Encrypt', description: 'We will encrypt the file. Download your secure, password-protected PDF.' }
    ],
    faqs: [
      { question: 'Can PDFpaglu recover a forgotten password?', answer: 'No. We use strong encryption and do not store your passwords. If you forget the password, you will not be able to open the file.' },
      { question: 'How secure is the encryption?', answer: 'We use industry-standard encryption protocols to protect your file, ensuring maximum security.' }
    ],
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
    seoTitle: 'Sign PDF Online Free - Add Signature to PDF | PDFpaglu',
    shortTitle: 'Sign',
    description: 'Stamp a signature image on the last page of your PDF.',
    longDescription: 'Need to sign a contract or form? Our free Sign PDF tool allows you to upload an image of your signature and seamlessly stamp it onto your PDF document. It is fast, secure, and requires no complicated software.',
    howToGuide: [
      { title: 'Upload Document', description: 'Select the PDF that needs to be signed.' },
      { title: 'Upload Signature', description: 'Provide an image (PNG or JPG) of your signature.' },
      { title: 'Apply Signature', description: 'We will stamp your signature onto the document for you to download.' }
    ],
    faqs: [
      { question: 'Does this create a legally binding digital signature?', answer: 'This tool places a visual image of your signature on the PDF. While often accepted for everyday documents, it is not a cryptographic digital signature (like DocuSign).' },
      { question: 'Are my signed documents stored securely?', answer: 'Yes, your files are processed securely and automatically deleted from our servers one hour after signing.' }
    ],
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
