import { NextResponse } from 'next/server';

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export function isUploadFile(value: FormDataEntryValue | null): value is File {
  return typeof value === 'object' && value !== null && 'arrayBuffer' in value && 'name' in value;
}

export function assertMaxSize(file: File, maxMb = 50) {
  const max = maxMb * 1024 * 1024;
  if (file.size > max) {
    throw new Error(`File is too large. Max allowed size is ${maxMb} MB.`);
  }
}

export function assertMime(file: File, allowed: string[], label: string) {
  const name = file.name.toLowerCase();
  const matches = allowed.some((rule) => {
    if (rule.startsWith('.')) return name.endsWith(rule);
    return file.type === rule;
  });

  if (!matches) {
    throw new Error(`Invalid file type. Please upload ${label}.`);
  }
}

const MIME: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.doc': 'application/msword',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png'
};

function safeDownloadName(name: string) {
  return name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-.]+|[-.]+$/g, '')
    .slice(0, 120) || 'download';
}

function contentTypeFor(filename: string) {
  const ext = filename.slice(filename.lastIndexOf('.')).toLowerCase();
  return MIME[ext] || 'application/octet-stream';
}

function toArrayBuffer(bytes: Uint8Array | ArrayBuffer) {
  if (bytes instanceof ArrayBuffer) return bytes;
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

export function fileResponse(bytes: Uint8Array | ArrayBuffer, filename: string, message: string) {
  const safeFilename = safeDownloadName(filename);

  return new NextResponse(toArrayBuffer(bytes), {
    headers: {
      'Content-Type': contentTypeFor(safeFilename),
      'Content-Disposition': `attachment; filename="${safeFilename}"`,
      'Cache-Control': 'no-store',
      'X-File-Name': encodeURIComponent(safeFilename),
      'X-Message': encodeURIComponent(message)
    }
  });
}
