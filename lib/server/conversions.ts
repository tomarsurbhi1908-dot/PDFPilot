import { createHash, randomBytes } from 'node:crypto';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const A4 = { width: 595.28, height: 841.89 };
const MARGIN = 54;
const FONT_SIZE = 11;
const LINE_HEIGHT = 16;

const PDF_PASSWORD_PADDING = new Uint8Array([
  0x28, 0xbf, 0x4e, 0x5e, 0x4e, 0x75, 0x8a, 0x41,
  0x64, 0x00, 0x4e, 0x56, 0xff, 0xfa, 0x01, 0x08,
  0x2e, 0x2e, 0x00, 0xb6, 0xd0, 0x68, 0x3e, 0x80,
  0x2f, 0x0c, 0xa9, 0xfe, 0x64, 0x53, 0x69, 0x7a
]);

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

function bytesToBinary(bytes: Uint8Array) {
  let output = '';
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    output += String.fromCharCode(...chunk);
  }
  return output;
}

function binaryToBytes(value: string) {
  const bytes = new Uint8Array(value.length);
  for (let index = 0; index < value.length; index += 1) {
    bytes[index] = value.charCodeAt(index) & 0xff;
  }
  return bytes;
}

function concatBytes(parts: Uint8Array[]) {
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const output = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    output.set(part, offset);
    offset += part.length;
  }
  return output;
}

function utf8(value: string) {
  return textEncoder.encode(value);
}

function xmlEscape(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function xmlUnescape(value: string) {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
}

async function decompress(data: Uint8Array, format: 'deflate' | 'deflate-raw') {
  const body = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer;
  const stream = new Blob([body]).stream().pipeThrough(new DecompressionStream(format));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function inflate(data: Uint8Array, preferred: 'deflate' | 'deflate-raw') {
  try {
    return await decompress(data, preferred);
  } catch {
    return decompress(data, preferred === 'deflate' ? 'deflate-raw' : 'deflate');
  }
}

function readUInt16(bytes: Uint8Array, offset: number) {
  return bytes[offset] | (bytes[offset + 1] << 8);
}

function readUInt32(bytes: Uint8Array, offset: number) {
  return (
    bytes[offset] |
    (bytes[offset + 1] << 8) |
    (bytes[offset + 2] << 16) |
    (bytes[offset + 3] << 24)
  ) >>> 0;
}

function writeUInt16(bytes: Uint8Array, offset: number, value: number) {
  bytes[offset] = value & 0xff;
  bytes[offset + 1] = (value >>> 8) & 0xff;
}

function writeUInt32(bytes: Uint8Array, offset: number, value: number) {
  bytes[offset] = value & 0xff;
  bytes[offset + 1] = (value >>> 8) & 0xff;
  bytes[offset + 2] = (value >>> 16) & 0xff;
  bytes[offset + 3] = (value >>> 24) & 0xff;
}

function crc32(data: Uint8Array) {
  const table = crc32Table();
  let crc = 0xffffffff;
  for (const byte of data) {
    crc = table[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

let cachedCrcTable: Uint32Array | null = null;
function crc32Table() {
  if (cachedCrcTable) return cachedCrcTable;
  const table = new Uint32Array(256);
  for (let index = 0; index < 256; index += 1) {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) {
      value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }
    table[index] = value >>> 0;
  }
  cachedCrcTable = table;
  return table;
}

function createZip(files: { name: string; data: Uint8Array }[]) {
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;

  for (const file of files) {
    const name = utf8(file.name);
    const checksum = crc32(file.data);
    const local = new Uint8Array(30 + name.length);

    writeUInt32(local, 0, 0x04034b50);
    writeUInt16(local, 4, 20);
    writeUInt16(local, 6, 0x0800);
    writeUInt16(local, 8, 0);
    writeUInt16(local, 10, 0);
    writeUInt16(local, 12, 0);
    writeUInt32(local, 14, checksum);
    writeUInt32(local, 18, file.data.length);
    writeUInt32(local, 22, file.data.length);
    writeUInt16(local, 26, name.length);
    writeUInt16(local, 28, 0);
    local.set(name, 30);

    const central = new Uint8Array(46 + name.length);
    writeUInt32(central, 0, 0x02014b50);
    writeUInt16(central, 4, 20);
    writeUInt16(central, 6, 20);
    writeUInt16(central, 8, 0x0800);
    writeUInt16(central, 10, 0);
    writeUInt16(central, 12, 0);
    writeUInt16(central, 14, 0);
    writeUInt32(central, 16, checksum);
    writeUInt32(central, 20, file.data.length);
    writeUInt32(central, 24, file.data.length);
    writeUInt16(central, 28, name.length);
    writeUInt16(central, 30, 0);
    writeUInt16(central, 32, 0);
    writeUInt16(central, 34, 0);
    writeUInt16(central, 36, 0);
    writeUInt32(central, 38, 0);
    writeUInt32(central, 42, offset);
    central.set(name, 46);

    localParts.push(local, file.data);
    centralParts.push(central);
    offset += local.length + file.data.length;
  }

  const centralDirectory = concatBytes(centralParts);
  const end = new Uint8Array(22);
  writeUInt32(end, 0, 0x06054b50);
  writeUInt16(end, 8, files.length);
  writeUInt16(end, 10, files.length);
  writeUInt32(end, 12, centralDirectory.length);
  writeUInt32(end, 16, offset);
  writeUInt16(end, 20, 0);

  return concatBytes([...localParts, centralDirectory, end]);
}

async function readZipEntry(zipBytes: Uint8Array, wantedName: string) {
  let eocdOffset = -1;
  for (let index = zipBytes.length - 22; index >= 0; index -= 1) {
    if (readUInt32(zipBytes, index) === 0x06054b50) {
      eocdOffset = index;
      break;
    }
  }
  if (eocdOffset < 0) throw new Error('The DOCX file is not a valid ZIP archive.');

  const centralOffset = readUInt32(zipBytes, eocdOffset + 16);
  const entryCount = readUInt16(zipBytes, eocdOffset + 10);
  let cursor = centralOffset;

  for (let entry = 0; entry < entryCount; entry += 1) {
    if (readUInt32(zipBytes, cursor) !== 0x02014b50) break;

    const method = readUInt16(zipBytes, cursor + 10);
    const compressedSize = readUInt32(zipBytes, cursor + 20);
    const filenameLength = readUInt16(zipBytes, cursor + 28);
    const extraLength = readUInt16(zipBytes, cursor + 30);
    const commentLength = readUInt16(zipBytes, cursor + 32);
    const localOffset = readUInt32(zipBytes, cursor + 42);
    const filename = textDecoder.decode(zipBytes.subarray(cursor + 46, cursor + 46 + filenameLength));

    if (filename === wantedName) {
      const localFilenameLength = readUInt16(zipBytes, localOffset + 26);
      const localExtraLength = readUInt16(zipBytes, localOffset + 28);
      const dataStart = localOffset + 30 + localFilenameLength + localExtraLength;
      const compressed = zipBytes.subarray(dataStart, dataStart + compressedSize);
      if (method === 0) return compressed;
      if (method === 8) return inflate(compressed, 'deflate-raw');
      throw new Error('This DOCX uses an unsupported ZIP compression method.');
    }

    cursor += 46 + filenameLength + extraLength + commentLength;
  }

  throw new Error('The DOCX file does not contain word/document.xml.');
}

function docxXmlToParagraphs(xml: string) {
  const paragraphs: string[] = [];
  const paragraphMatches = xml.match(/<w:p\b[\s\S]*?<\/w:p>/g) || [];

  for (const paragraphXml of paragraphMatches) {
    const parts: string[] = [];
    const normalized = paragraphXml
      .replace(/<w:tab\b[^>]*\/>/g, '<w:t>\t</w:t>')
      .replace(/<w:br\b[^>]*\/>/g, '<w:t>\n</w:t>');
    const textMatches = normalized.matchAll(/<w:t\b[^>]*>([\s\S]*?)<\/w:t>/g);
    for (const match of textMatches) {
      parts.push(xmlUnescape(match[1]));
    }
    const text = parts.join('').trim();
    if (text) paragraphs.push(text);
  }

  return paragraphs.length ? paragraphs : ['No readable text was found in this DOCX file.'];
}

function wrapLine(text: string, maxWidth: number, widthOf: (value: string) => number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (widthOf(candidate) <= maxWidth) {
      current = candidate;
      continue;
    }

    if (current) lines.push(current);
    if (widthOf(word) <= maxWidth) {
      current = word;
      continue;
    }

    let fragment = '';
    for (const char of word) {
      const next = fragment + char;
      if (widthOf(next) > maxWidth && fragment) {
        lines.push(fragment);
        fragment = char;
      } else {
        fragment = next;
      }
    }
    current = fragment;
  }

  if (current) lines.push(current);
  return lines.length ? lines : [''];
}

export async function docxToPdfBytes(docxBytes: Uint8Array) {
  const documentXml = textDecoder.decode(await readZipEntry(docxBytes, 'word/document.xml'));
  const paragraphs = docxXmlToParagraphs(documentXml);
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const maxWidth = A4.width - MARGIN * 2;
  let page = pdf.addPage([A4.width, A4.height]);
  let y = A4.height - MARGIN;

  page.drawText('Converted Word Document', {
    x: MARGIN,
    y,
    size: 15,
    font: bold,
    color: rgb(0.08, 0.1, 0.15)
  });
  y -= LINE_HEIGHT * 1.8;

  for (const paragraph of paragraphs) {
    const lines = wrapLine(paragraph, maxWidth, (value) => font.widthOfTextAtSize(value, FONT_SIZE));
    for (const line of lines) {
      if (y < MARGIN) {
        page = pdf.addPage([A4.width, A4.height]);
        y = A4.height - MARGIN;
      }
      page.drawText(line, {
        x: MARGIN,
        y,
        size: FONT_SIZE,
        font,
        color: rgb(0.12, 0.14, 0.18)
      });
      y -= LINE_HEIGHT;
    }
    y -= LINE_HEIGHT * 0.45;
  }

  return pdf.save({ useObjectStreams: true });
}

function getStreamBytes(objectBody: string) {
  const streamIndex = objectBody.indexOf('stream');
  const endStreamIndex = objectBody.lastIndexOf('endstream');
  if (streamIndex < 0 || endStreamIndex < 0 || endStreamIndex <= streamIndex) return null;

  let dataStart = streamIndex + 'stream'.length;
  if (objectBody[dataStart] === '\r' && objectBody[dataStart + 1] === '\n') dataStart += 2;
  else if (objectBody[dataStart] === '\n' || objectBody[dataStart] === '\r') dataStart += 1;

  let dataEnd = endStreamIndex;
  if (objectBody[dataEnd - 1] === '\n') dataEnd -= 1;
  if (objectBody[dataEnd - 1] === '\r') dataEnd -= 1;

  return {
    prefix: objectBody.slice(0, dataStart),
    data: binaryToBytes(objectBody.slice(dataStart, dataEnd)),
    separator: objectBody.slice(dataEnd, endStreamIndex),
    suffix: objectBody.slice(endStreamIndex)
  };
}

function decodePdfStringBytes(bytes: number[]) {
  if (bytes.length >= 2 && bytes[0] === 0xfe && bytes[1] === 0xff) {
    let output = '';
    for (let index = 2; index + 1 < bytes.length; index += 2) {
      output += String.fromCharCode((bytes[index] << 8) | bytes[index + 1]);
    }
    return output;
  }
  return bytes.map((byte) => (byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : ' ')).join('');
}

function readLiteralString(value: string, start: number) {
  const bytes: number[] = [];
  let depth = 1;
  let index = start + 1;

  while (index < value.length && depth > 0) {
    const char = value[index];
    if (char === '\\') {
      const next = value[index + 1];
      if (next === 'n') bytes.push(0x0a);
      else if (next === 'r') bytes.push(0x0d);
      else if (next === 't') bytes.push(0x09);
      else if (next === 'b') bytes.push(0x08);
      else if (next === 'f') bytes.push(0x0c);
      else if (next === '\r' && value[index + 2] === '\n') index += 1;
      else if (next === '\n' || next === '\r') {
        index += 1;
      } else if (/[0-7]/.test(next || '')) {
        const octal = value.slice(index + 1, index + 4).match(/^[0-7]{1,3}/)?.[0] || '';
        bytes.push(parseInt(octal, 8) & 0xff);
        index += octal.length - 1;
      } else if (next) {
        bytes.push(next.charCodeAt(0) & 0xff);
      }
      index += 2;
      continue;
    }
    if (char === '(') {
      depth += 1;
      bytes.push(char.charCodeAt(0));
    } else if (char === ')') {
      depth -= 1;
      if (depth > 0) bytes.push(char.charCodeAt(0));
    } else {
      bytes.push(char.charCodeAt(0) & 0xff);
    }
    index += 1;
  }

  return { bytes: new Uint8Array(bytes), end: index };
}

function readHexString(value: string, start: number) {
  const end = value.indexOf('>', start + 1);
  if (end < 0) return null;
  const hex = value.slice(start + 1, end).replace(/\s+/g, '');
  const bytes: number[] = [];
  for (let index = 0; index < hex.length; index += 2) {
    bytes.push(parseInt(hex.slice(index, index + 2).padEnd(2, '0'), 16) & 0xff);
  }
  return { bytes: new Uint8Array(bytes), end: end + 1 };
}

function extractTextFromContentStream(content: string) {
  const lines: string[] = [];
  let pending: string[] = [];
  let index = 0;

  const flush = () => {
    const text = pending.join('').replace(/\s+/g, ' ').trim();
    if (text) lines.push(text);
    pending = [];
  };

  while (index < content.length) {
    const char = content[index];
    if (/\s/.test(char)) {
      index += 1;
      continue;
    }
    if (char === '%') {
      while (index < content.length && content[index] !== '\n' && content[index] !== '\r') index += 1;
      continue;
    }
    if (char === '(') {
      const parsed = readLiteralString(content, index);
      pending.push(decodePdfStringBytes([...parsed.bytes]));
      index = parsed.end;
      continue;
    }
    if (char === '<' && content[index + 1] !== '<') {
      const parsed = readHexString(content, index);
      if (parsed) {
        pending.push(decodePdfStringBytes([...parsed.bytes]));
        index = parsed.end;
        continue;
      }
    }
    if (/[A-Za-z'"*]/.test(char)) {
      const match = content.slice(index).match(/^[A-Za-z'"*]+/);
      const operator = match?.[0] || char;
      if (operator === 'Tj' || operator === 'TJ' || operator === "'" || operator === '"') {
        flush();
      } else if (operator === 'T*' || operator === 'Td' || operator === 'TD') {
        flush();
      }
      index += operator.length;
      continue;
    }
    index += 1;
  }

  flush();
  return lines;
}

export async function extractPdfText(pdfBytes: Uint8Array) {
  const binary = bytesToBinary(pdfBytes);
  const objectRegex = /(\d+)\s+(\d+)\s+obj([\s\S]*?)endobj/g;
  const lines: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = objectRegex.exec(binary))) {
    const body = match[3];
    const stream = getStreamBytes(body);
    if (!stream) continue;

    let streamBytes = stream.data;
    if (/\/FlateDecode\b/.test(stream.prefix)) {
      try {
        streamBytes = await inflate(streamBytes, 'deflate');
      } catch {
        continue;
      }
    }

    lines.push(...extractTextFromContentStream(bytesToBinary(streamBytes)));
  }

  const compact = lines.map((line) => line.trim()).filter(Boolean);
  return compact.length ? compact : ['No selectable text could be extracted from this PDF.'];
}

export function createDocxFromParagraphs(paragraphs: string[]) {
  const body = paragraphs
    .map((paragraph) => {
      const lines = paragraph.split(/\r?\n/);
      const runs = lines
        .map((line, index) => {
          const breakTag = index === 0 ? '' : '<w:br/>';
          return `<w:r>${breakTag}<w:t xml:space="preserve">${xmlEscape(line)}</w:t></w:r>`;
        })
        .join('');
      return `<w:p>${runs}</w:p>`;
    })
    .join('');

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${body}
    <w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/></w:sectPr>
  </w:body>
</w:document>`;

  return createZip([
    {
      name: '[Content_Types].xml',
      data: utf8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`)
    },
    {
      name: '_rels/.rels',
      data: utf8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`)
    },
    { name: 'word/document.xml', data: utf8(documentXml) }
  ]);
}

function md5(chunks: Uint8Array[]) {
  const hash = createHash('md5');
  for (const chunk of chunks) hash.update(Buffer.from(chunk));
  return new Uint8Array(hash.digest());
}

function rc4(key: Uint8Array, data: Uint8Array) {
  const state = new Uint8Array(256);
  for (let index = 0; index < 256; index += 1) state[index] = index;

  let j = 0;
  for (let index = 0; index < 256; index += 1) {
    j = (j + state[index] + key[index % key.length]) & 0xff;
    [state[index], state[j]] = [state[j], state[index]];
  }

  const output = new Uint8Array(data.length);
  let i = 0;
  j = 0;
  for (let index = 0; index < data.length; index += 1) {
    i = (i + 1) & 0xff;
    j = (j + state[i]) & 0xff;
    [state[i], state[j]] = [state[j], state[i]];
    output[index] = data[index] ^ state[(state[i] + state[j]) & 0xff];
  }
  return output;
}

function padPassword(password: string) {
  const encoded = utf8(password).slice(0, 32);
  const padded = new Uint8Array(32);
  padded.set(encoded);
  padded.set(PDF_PASSWORD_PADDING.slice(0, 32 - encoded.length), encoded.length);
  return padded;
}

function int32Le(value: number) {
  const bytes = new Uint8Array(4);
  const unsigned = value >>> 0;
  writeUInt32(bytes, 0, unsigned);
  return bytes;
}

function objectKey(fileKey: Uint8Array, objectNumber: number, generation: number) {
  const data = new Uint8Array(fileKey.length + 5);
  data.set(fileKey);
  data[fileKey.length] = objectNumber & 0xff;
  data[fileKey.length + 1] = (objectNumber >>> 8) & 0xff;
  data[fileKey.length + 2] = (objectNumber >>> 16) & 0xff;
  data[fileKey.length + 3] = generation & 0xff;
  data[fileKey.length + 4] = (generation >>> 8) & 0xff;
  return md5([data]).slice(0, Math.min(fileKey.length + 5, 16));
}

function hex(bytes: Uint8Array) {
  return [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('').toUpperCase();
}

function encryptStringTokens(value: string, key: Uint8Array) {
  let output = '';
  let index = 0;

  while (index < value.length) {
    const char = value[index];
    if (char === '(') {
      const parsed = readLiteralString(value, index);
      output += `<${hex(rc4(key, parsed.bytes))}>`;
      index = parsed.end;
      continue;
    }
    if (char === '<' && value[index + 1] !== '<' && value[index - 1] !== '<') {
      const parsed = readHexString(value, index);
      if (parsed) {
        output += `<${hex(rc4(key, parsed.bytes))}>`;
        index = parsed.end;
        continue;
      }
    }
    output += char;
    index += 1;
  }

  return output;
}

function encryptObjectBody(body: string, objectNumber: number, generation: number, fileKey: Uint8Array) {
  const key = objectKey(fileKey, objectNumber, generation);
  const stream = getStreamBytes(body);
  if (!stream) return encryptStringTokens(body, key);

  const encryptedPrefix = encryptStringTokens(stream.prefix, key);
  const encryptedStream = bytesToBinary(rc4(key, stream.data));
  return `${encryptedPrefix}${encryptedStream}${stream.separator}${stream.suffix}`;
}

export function encryptPdfBytes(pdfBytes: Uint8Array, password: string) {
  const userPassword = padPassword(password);
  const ownerPassword = padPassword(password);
  const permissions = -4;
  let ownerKey = md5([ownerPassword]);
  for (let index = 0; index < 50; index += 1) ownerKey = md5([ownerKey]);
  ownerKey = ownerKey.slice(0, 16);

  let ownerEntry = rc4(ownerKey, userPassword);
  for (let round = 1; round <= 19; round += 1) {
    ownerEntry = rc4(ownerKey.map((byte) => byte ^ round), ownerEntry);
  }

  const fileId = md5([pdfBytes, utf8(String(Date.now())), randomBytes(16)]);
  let fileKey = md5([userPassword, ownerEntry, int32Le(permissions), fileId]);
  for (let index = 0; index < 50; index += 1) fileKey = md5([fileKey.slice(0, 16)]);
  fileKey = fileKey.slice(0, 16);

  let userDigest = md5([PDF_PASSWORD_PADDING, fileId]);
  let userEntryFirstHalf = rc4(fileKey, userDigest);
  for (let round = 1; round <= 19; round += 1) {
    userEntryFirstHalf = rc4(fileKey.map((byte) => byte ^ round), userEntryFirstHalf);
  }
  const userEntry = new Uint8Array(32);
  userEntry.set(userEntryFirstHalf);

  const source = bytesToBinary(pdfBytes);
  const objects: { number: number; generation: number; body: string }[] = [];
  const objectRegex = /(\d+)\s+(\d+)\s+obj([\s\S]*?)endobj/g;
  let match: RegExpExecArray | null;
  let maxObjectNumber = 0;

  while ((match = objectRegex.exec(source))) {
    const number = Number(match[1]);
    const generation = Number(match[2]);
    objects.push({ number, generation, body: match[3].replace(/^\s+|\s+$/g, '') });
    maxObjectNumber = Math.max(maxObjectNumber, number);
  }

  const root = source.match(/\/Root\s+(\d+)\s+(\d+)\s+R/);
  const info = source.match(/\/Info\s+(\d+)\s+(\d+)\s+R/);
  if (!objects.length || !root) throw new Error('Unable to prepare this PDF for password protection.');

  const encryptObjectNumber = maxObjectNumber + 1;
  const size = encryptObjectNumber + 1;
  const offsets = new Map<number, number>();
  const parts: string[] = ['%PDF-1.4\n%\xE2\xE3\xCF\xD3\n'];

  for (const object of objects) {
    offsets.set(object.number, binaryToBytes(parts.join('')).length);
    parts.push(`${object.number} ${object.generation} obj\n`);
    parts.push(encryptObjectBody(object.body, object.number, object.generation, fileKey));
    parts.push('\nendobj\n');
  }

  offsets.set(encryptObjectNumber, binaryToBytes(parts.join('')).length);
  parts.push(`${encryptObjectNumber} 0 obj\n`);
  parts.push(`<< /Filter /Standard /V 2 /R 3 /Length 128 /O <${hex(ownerEntry)}> /U <${hex(userEntry)}> /P ${permissions} >>`);
  parts.push('\nendobj\n');

  const startXref = binaryToBytes(parts.join('')).length;
  parts.push(`xref\n0 ${size}\n`);
  parts.push('0000000000 65535 f \n');
  for (let objectNumber = 1; objectNumber < size; objectNumber += 1) {
    const offset = offsets.get(objectNumber);
    parts.push(offset === undefined ? '0000000000 65535 f \n' : `${String(offset).padStart(10, '0')} 00000 n \n`);
  }

  parts.push('trailer\n');
  parts.push(`<< /Size ${size} /Root ${root[1]} ${root[2]} R`);
  if (info) parts.push(` /Info ${info[1]} ${info[2]} R`);
  parts.push(` /Encrypt ${encryptObjectNumber} 0 R /ID [<${hex(fileId)}> <${hex(fileId)}>] >>\n`);
  parts.push(`startxref\n${startXref}\n%%EOF\n`);

  return binaryToBytes(parts.join(''));
}
