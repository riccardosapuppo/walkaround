import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const PAGE_MARGIN = 44;
const PARTNER_LANDING_URL = 'https://www.walkaround.cloud/';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let officialLogoCacheLoaded = false;
let officialLogoCache = null;

function sanitizePdfText(value) {
  return String(value ?? '')
    .normalize('NFC')
    .replace(/[‘’‚‛`]/g, "'")
    .replace(/[“”„]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/\u00A0/g, ' ')
    .replace(/[^\x20-\x7E\u00A1-\u00FF]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapePdfText(value) {
  return sanitizePdfText(value)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function wrapPdfText(value, maxChars) {
  const normalized = sanitizePdfText(value);
  if (!normalized) {
    return [];
  }

  const words = normalized.split(/\s+/g).filter(Boolean);
  const lines = [];
  let currentLine = '';

  words.forEach((word) => {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;
    if (nextLine.length <= maxChars) {
      currentLine = nextLine;
      return;
    }

    if (currentLine) {
      lines.push(currentLine);
    }
    currentLine = word;
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

function approximateTextWidth(value, fontSize, font = 'F1') {
  const text = sanitizePdfText(value);
  const bold = font === 'F2';
  let widthUnits = 0;

  for (const char of text) {
    if (char === ' ') {
      widthUnits += 278;
    } else if ('ilI.,:;!|[]()\'`'.includes(char)) {
      widthUnits += bold ? 310 : 280;
    } else if ('mwMW@#%&'.includes(char)) {
      widthUnits += bold ? 880 : 820;
    } else if (/[A-Z]/.test(char)) {
      widthUnits += bold ? 710 : 680;
    } else if (/[0-9]/.test(char)) {
      widthUnits += 556;
    } else if (/[a-z]/.test(char)) {
      widthUnits += bold ? 535 : 500;
    } else {
      widthUnits += 420;
    }
  }

  return (widthUnits / 1000) * fontSize;
}

function formatDateTime(value) {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const pad = (input) => String(input).padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function buildPartnerLandingUrl(discountCode) {
  const normalizedCode = String(discountCode || '').trim();
  if (!normalizedCode) {
    return PARTNER_LANDING_URL;
  }

  return `${PARTNER_LANDING_URL}welcome?code=${encodeURIComponent(normalizedCode)}`;
}

function buildPdfObject(objectId, body) {
  return Buffer.from(`${objectId} 0 obj\n${body}\nendobj\n`, 'latin1');
}

function buildPdfStreamObject(objectId, dictionary, streamBuffer) {
  return Buffer.concat([
    Buffer.from(`${objectId} 0 obj\n${dictionary}\nstream\n`, 'latin1'),
    streamBuffer,
    Buffer.from('\nendstream\nendobj\n', 'latin1')
  ]);
}

function buildPdfDocument(contentStream, xObjects = []) {
  const contentBuffer = Buffer.from(contentStream, 'latin1');
  const imageDefinitions = [];
  let nextObjectId = 7;

  xObjects.forEach((image) => {
    const objectId = nextObjectId;
    nextObjectId += 1;
    const smaskObjectId = image.smaskData ? nextObjectId : null;
    if (smaskObjectId) {
      nextObjectId += 1;
    }
    imageDefinitions.push({ ...image, objectId, smaskObjectId });
  });

  const xObjectResource = imageDefinitions.length
    ? ` /XObject << ${imageDefinitions.map((image) => `/${image.name} ${image.objectId} 0 R`).join(' ')} >>`
    : '';
  const pageResources = `<< /Font << /F1 4 0 R /F2 5 0 R >>${xObjectResource} >>`;
  const objects = [
    null,
    buildPdfObject(1, '<< /Type /Catalog /Pages 2 0 R >>'),
    buildPdfObject(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>'),
    buildPdfObject(
      3,
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources ${pageResources} /Contents 6 0 R >>`
    ),
    buildPdfObject(4, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>'),
    buildPdfObject(5, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>'),
    buildPdfStreamObject(6, `<< /Length ${contentBuffer.length} >>`, contentBuffer)
  ];

  imageDefinitions.forEach((image) => {
    const smaskPart = image.smaskObjectId ? ` /SMask ${image.smaskObjectId} 0 R` : '';
    objects[image.objectId] = buildPdfStreamObject(
      image.objectId,
      `<< /Type /XObject /Subtype /Image /Width ${image.width} /Height ${image.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode /Length ${image.rgbData.length}${smaskPart} >>`,
      image.rgbData
    );
    if (image.smaskObjectId) {
      objects[image.smaskObjectId] = buildPdfStreamObject(
        image.smaskObjectId,
        `<< /Type /XObject /Subtype /Image /Width ${image.width} /Height ${image.height} /ColorSpace /DeviceGray /BitsPerComponent 8 /Filter /FlateDecode /Length ${image.smaskData.length} >>`,
        image.smaskData
      );
    }
  });

  const chunks = [Buffer.from('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n', 'latin1')];
  const offsets = [0];
  let currentOffset = chunks[0].length;

  for (let index = 1; index < objects.length; index += 1) {
    offsets[index] = currentOffset;
    chunks.push(objects[index]);
    currentOffset += objects[index].length;
  }

  const xrefOffset = currentOffset;
  let xref = `xref\n0 ${objects.length}\n`;
  xref += '0000000000 65535 f \n';

  for (let index = 1; index < objects.length; index += 1) {
    xref += `${String(offsets[index]).padStart(10, '0')} 00000 n \n`;
  }

  xref += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  chunks.push(Buffer.from(xref, 'latin1'));
  return Buffer.concat(chunks);
}

function pushRectangle(commands, x, y, width, height, options = {}) {
  const fillColor = Array.isArray(options.fillColor) ? options.fillColor : null;
  const strokeColor = Array.isArray(options.strokeColor) ? options.strokeColor : null;
  const lineWidth = Number.isFinite(options.lineWidth) ? options.lineWidth : 1;

  commands.push('q');
  if (fillColor) {
    commands.push(`${fillColor[0]} ${fillColor[1]} ${fillColor[2]} rg`);
  }
  if (strokeColor) {
    commands.push(`${strokeColor[0]} ${strokeColor[1]} ${strokeColor[2]} RG`);
    commands.push(`${lineWidth} w`);
  }

  const operator = fillColor && strokeColor ? 'B' : fillColor ? 'f' : 'S';
  commands.push(`${x} ${y} ${width} ${height} re ${operator}`);
  commands.push('Q');
}

function pushLine(commands, x1, y1, x2, y2, options = {}) {
  const color = Array.isArray(options.color) ? options.color : [0, 0, 0];
  const lineWidth = Number.isFinite(options.lineWidth) ? options.lineWidth : 1;

  commands.push('q');
  commands.push(`${color[0]} ${color[1]} ${color[2]} RG`);
  commands.push(`${lineWidth} w`);
  commands.push(`${x1} ${y1} m ${x2} ${y2} l S`);
  commands.push('Q');
}

function pushText(commands, text, x, y, options = {}) {
  const font = options.font || 'F1';
  const fontSize = Number.isFinite(options.fontSize) ? options.fontSize : 12;
  const color = Array.isArray(options.color) ? options.color : [0, 0, 0];
  const align = options.align || 'left';
  const escapedText = escapePdfText(text);

  if (!escapedText) {
    return;
  }

  let drawX = x;
  if (align === 'center') {
    drawX -= approximateTextWidth(text, fontSize, font) / 2;
  } else if (align === 'right') {
    drawX -= approximateTextWidth(text, fontSize, font);
  }

  commands.push('BT');
  commands.push(`/${font} ${fontSize} Tf`);
  commands.push(`${color[0]} ${color[1]} ${color[2]} rg`);
  commands.push(`1 0 0 1 ${drawX.toFixed(2)} ${y.toFixed(2)} Tm`);
  commands.push(`(${escapedText}) Tj`);
  commands.push('ET');
}

function pushWrappedText(commands, text, x, y, maxChars, options = {}) {
  const lineHeight = Number.isFinite(options.lineHeight) ? options.lineHeight : 13;
  const maxLines = Number.isFinite(options.maxLines) ? options.maxLines : Infinity;
  const lines = wrapPdfText(text, maxChars).slice(0, maxLines);
  let currentY = y;

  lines.forEach((line) => {
    pushText(commands, line, x, currentY, options);
    currentY -= lineHeight;
  });

  return currentY;
}

function pushImage(commands, name, x, y, width, height) {
  commands.push('q');
  commands.push(`${width.toFixed(2)} 0 0 ${height.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)} cm`);
  commands.push(`/${name} Do`);
  commands.push('Q');
}

function resolveOfficialLogoPath() {
  const candidates = [
    path.resolve(__dirname, '../../../frontend/src/assets/logo.png'),
    path.resolve(__dirname, '../../../frontend/dist/tourism-audio-frontend/browser/assets/logo.png'),
    path.resolve(__dirname, '../../../frontend/dist/tourism-audio-frontend/assets/logo.png'),
    path.resolve(process.cwd(), 'frontend/src/assets/logo.png'),
    path.resolve(process.cwd(), 'src/assets/logo.png'),
    path.resolve(process.cwd(), 'assets/logo.png')
  ];

  return candidates.find((candidate) => fs.existsSync(candidate)) || null;
}

function paethPredictor(left, up, upperLeft) {
  const estimate = left + up - upperLeft;
  const leftDistance = Math.abs(estimate - left);
  const upDistance = Math.abs(estimate - up);
  const upperLeftDistance = Math.abs(estimate - upperLeft);
  if (leftDistance <= upDistance && leftDistance <= upperLeftDistance) {
    return left;
  }
  if (upDistance <= upperLeftDistance) {
    return up;
  }
  return upperLeft;
}

function decodePngImage(buffer) {
  if (!buffer.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return null;
  }

  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  const idatChunks = [];

  while (offset + 12 <= buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.slice(offset + 4, offset + 8).toString('ascii');
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    if (dataEnd + 4 > buffer.length) {
      return null;
    }
    const data = buffer.slice(dataStart, dataEnd);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
    } else if (type === 'IDAT') {
      idatChunks.push(data);
    } else if (type === 'IEND') {
      break;
    }
    offset = dataEnd + 4;
  }

  if (!width || !height || bitDepth !== 8 || (colorType !== 2 && colorType !== 6)) {
    return null;
  }

  const channels = colorType === 6 ? 4 : 3;
  const rowLength = width * channels;
  const inflated = zlib.inflateSync(Buffer.concat(idatChunks));
  const rgb = Buffer.alloc(width * height * 3);
  const alpha = colorType === 6 ? Buffer.alloc(width * height) : null;
  let hasTransparency = false;
  let inputOffset = 0;
  let previousRow = Buffer.alloc(rowLength);

  for (let row = 0; row < height; row += 1) {
    const filter = inflated[inputOffset];
    inputOffset += 1;
    const rawRow = inflated.slice(inputOffset, inputOffset + rowLength);
    inputOffset += rowLength;
    const currentRow = Buffer.alloc(rowLength);

    for (let index = 0; index < rowLength; index += 1) {
      const left = index >= channels ? currentRow[index - channels] : 0;
      const up = previousRow[index] || 0;
      const upperLeft = index >= channels ? previousRow[index - channels] || 0 : 0;
      let value = rawRow[index];
      if (filter === 1) {
        value = (value + left) & 0xff;
      } else if (filter === 2) {
        value = (value + up) & 0xff;
      } else if (filter === 3) {
        value = (value + Math.floor((left + up) / 2)) & 0xff;
      } else if (filter === 4) {
        value = (value + paethPredictor(left, up, upperLeft)) & 0xff;
      }
      currentRow[index] = value;
    }

    for (let col = 0; col < width; col += 1) {
      const sourceIndex = col * channels;
      const pixelIndex = row * width + col;
      const rgbIndex = pixelIndex * 3;
      rgb[rgbIndex] = currentRow[sourceIndex];
      rgb[rgbIndex + 1] = currentRow[sourceIndex + 1];
      rgb[rgbIndex + 2] = currentRow[sourceIndex + 2];
      if (alpha) {
        const alphaValue = currentRow[sourceIndex + 3];
        alpha[pixelIndex] = alphaValue;
        if (alphaValue < 255) {
          hasTransparency = true;
        }
      }
    }

    previousRow = currentRow;
  }

  return {
    width,
    height,
    rgbData: zlib.deflateSync(rgb),
    smaskData: alpha && hasTransparency ? zlib.deflateSync(alpha) : null
  };
}

function loadOfficialLogoImage() {
  if (officialLogoCacheLoaded) {
    return officialLogoCache;
  }

  officialLogoCacheLoaded = true;
  const logoPath = resolveOfficialLogoPath();
  if (!logoPath) {
    officialLogoCache = null;
    return officialLogoCache;
  }

  try {
    officialLogoCache = decodePngImage(fs.readFileSync(logoPath));
  } catch {
    officialLogoCache = null;
  }
  return officialLogoCache;
}

function qrAppendBits(bits, value, length) {
  for (let index = length - 1; index >= 0; index -= 1) {
    bits.push((value >>> index) & 1);
  }
}

function qrBuildGaloisTables() {
  const exp = new Array(512).fill(0);
  const log = new Array(256).fill(0);
  let value = 1;
  for (let index = 0; index < 255; index += 1) {
    exp[index] = value;
    log[value] = index;
    value <<= 1;
    if (value & 0x100) {
      value ^= 0x11d;
    }
  }
  for (let index = 255; index < 512; index += 1) {
    exp[index] = exp[index - 255];
  }
  return { exp, log };
}

const QR_GALOIS = qrBuildGaloisTables();

function qrGfMultiply(left, right) {
  if (!left || !right) {
    return 0;
  }
  return QR_GALOIS.exp[QR_GALOIS.log[left] + QR_GALOIS.log[right]];
}

function qrReedSolomonGenerator(degree) {
  let result = [1];
  for (let index = 0; index < degree; index += 1) {
    const next = new Array(result.length + 1).fill(0);
    result.forEach((coefficient, coefficientIndex) => {
      next[coefficientIndex] ^= coefficient;
      next[coefficientIndex + 1] ^= qrGfMultiply(coefficient, QR_GALOIS.exp[index]);
    });
    result = next;
  }
  return result;
}

function qrReedSolomonCompute(dataCodewords, ecCodewords) {
  const generator = qrReedSolomonGenerator(ecCodewords);
  const result = new Array(ecCodewords).fill(0);

  dataCodewords.forEach((codeword) => {
    const factor = codeword ^ result.shift();
    result.push(0);
    for (let index = 0; index < ecCodewords; index += 1) {
      result[index] ^= qrGfMultiply(generator[index + 1], factor);
    }
  });

  return result;
}

function qrFormatBits(errorCorrectionLevelBits, mask) {
  let data = (errorCorrectionLevelBits << 3) | mask;
  let bits = data << 10;
  const generator = 0x537;
  for (let index = 14; index >= 10; index -= 1) {
    if (((bits >>> index) & 1) !== 0) {
      bits ^= generator << (index - 10);
    }
  }
  return (((data << 10) | bits) ^ 0x5412) & 0x7fff;
}

function qrAddFunctionPattern(matrix, reserved, row, col, dark) {
  if (row < 0 || row >= matrix.length || col < 0 || col >= matrix.length) {
    return;
  }
  matrix[row][col] = dark;
  reserved[row][col] = true;
}

function qrAddFinderPattern(matrix, reserved, row, col) {
  for (let dy = -1; dy <= 7; dy += 1) {
    for (let dx = -1; dx <= 7; dx += 1) {
      const currentRow = row + dy;
      const currentCol = col + dx;
      if (currentRow < 0 || currentRow >= matrix.length || currentCol < 0 || currentCol >= matrix.length) {
        continue;
      }
      const inPattern = dy >= 0 && dy <= 6 && dx >= 0 && dx <= 6;
      const distance = Math.max(Math.abs(dy - 3), Math.abs(dx - 3));
      qrAddFunctionPattern(matrix, reserved, currentRow, currentCol, inPattern && (distance === 3 || distance <= 1));
    }
  }
}

function qrAddAlignmentPattern(matrix, reserved, centerRow, centerCol) {
  for (let dy = -2; dy <= 2; dy += 1) {
    for (let dx = -2; dx <= 2; dx += 1) {
      const distance = Math.max(Math.abs(dy), Math.abs(dx));
      qrAddFunctionPattern(matrix, reserved, centerRow + dy, centerCol + dx, distance === 2 || distance === 0);
    }
  }
}

function qrReserveFormatAreas(matrix, reserved) {
  const size = matrix.length;
  for (let index = 0; index <= 5; index += 1) {
    qrAddFunctionPattern(matrix, reserved, index, 8, false);
  }
  qrAddFunctionPattern(matrix, reserved, 7, 8, false);
  qrAddFunctionPattern(matrix, reserved, 8, 8, false);
  qrAddFunctionPattern(matrix, reserved, 8, 7, false);
  for (let index = 9; index < 15; index += 1) {
    qrAddFunctionPattern(matrix, reserved, 8, 14 - index, false);
  }
  for (let index = 0; index < 8; index += 1) {
    qrAddFunctionPattern(matrix, reserved, 8, size - 1 - index, false);
  }
  for (let index = 8; index < 15; index += 1) {
    qrAddFunctionPattern(matrix, reserved, size - 15 + index, 8, false);
  }
  qrAddFunctionPattern(matrix, reserved, size - 8, 8, true);
}

function qrSetFormatBits(matrix, errorCorrectionLevelBits, mask) {
  const size = matrix.length;
  const bits = qrFormatBits(errorCorrectionLevelBits, mask);
  for (let index = 0; index <= 5; index += 1) {
    matrix[index][8] = ((bits >>> index) & 1) !== 0;
  }
  matrix[7][8] = ((bits >>> 6) & 1) !== 0;
  matrix[8][8] = ((bits >>> 7) & 1) !== 0;
  matrix[8][7] = ((bits >>> 8) & 1) !== 0;
  for (let index = 9; index < 15; index += 1) {
    matrix[8][14 - index] = ((bits >>> index) & 1) !== 0;
  }
  for (let index = 0; index < 8; index += 1) {
    matrix[8][size - 1 - index] = ((bits >>> index) & 1) !== 0;
  }
  for (let index = 8; index < 15; index += 1) {
    matrix[size - 15 + index][8] = ((bits >>> index) & 1) !== 0;
  }
  matrix[size - 8][8] = true;
}

function qrVersionConfigForPayload(payload) {
  const candidates = [
    { version: 3, dataCodewordCount: 55, ecCodewordCount: 15 },
    { version: 4, dataCodewordCount: 80, ecCodewordCount: 20 }
  ];
  const requiredBits = 4 + 8 + payload.length * 8;
  return candidates.find((candidate) => requiredBits <= candidate.dataCodewordCount * 8) || null;
}

function buildQrMatrix(value) {
  const payload = Buffer.from(String(value || ''), 'utf8');
  const config = qrVersionConfigForPayload(payload);
  if (!config) {
    return null;
  }

  const { version, dataCodewordCount, ecCodewordCount } = config;
  const size = 21 + (version - 1) * 4;
  const mask = 0;
  const errorCorrectionLevelBits = 1; // QR level L.
  const bits = [];

  qrAppendBits(bits, 0b0100, 4);
  qrAppendBits(bits, payload.length, 8);
  payload.forEach((byte) => qrAppendBits(bits, byte, 8));
  if (bits.length > dataCodewordCount * 8) {
    return null;
  }
  qrAppendBits(bits, 0, Math.min(4, dataCodewordCount * 8 - bits.length));
  while (bits.length % 8 !== 0) {
    bits.push(0);
  }

  const dataCodewords = [];
  for (let index = 0; index < bits.length; index += 8) {
    let codeword = 0;
    for (let bitIndex = 0; bitIndex < 8; bitIndex += 1) {
      codeword = (codeword << 1) | bits[index + bitIndex];
    }
    dataCodewords.push(codeword);
  }
  for (let padIndex = 0; dataCodewords.length < dataCodewordCount; padIndex += 1) {
    dataCodewords.push(padIndex % 2 === 0 ? 0xec : 0x11);
  }

  const codewords = [...dataCodewords, ...qrReedSolomonCompute(dataCodewords, ecCodewordCount)];
  const matrix = Array.from({ length: size }, () => new Array(size).fill(false));
  const reserved = Array.from({ length: size }, () => new Array(size).fill(false));

  qrAddFinderPattern(matrix, reserved, 0, 0);
  qrAddFinderPattern(matrix, reserved, 0, size - 7);
  qrAddFinderPattern(matrix, reserved, size - 7, 0);
  for (let index = 8; index < size - 8; index += 1) {
    const dark = index % 2 === 0;
    qrAddFunctionPattern(matrix, reserved, 6, index, dark);
    qrAddFunctionPattern(matrix, reserved, index, 6, dark);
  }
  const alignmentPosition = 4 * version + 10;
  qrAddAlignmentPattern(matrix, reserved, alignmentPosition, alignmentPosition);
  qrReserveFormatAreas(matrix, reserved);

  const dataBits = [];
  codewords.forEach((codeword) => qrAppendBits(dataBits, codeword, 8));
  let bitIndex = 0;
  let upward = true;
  for (let col = size - 1; col >= 1; col -= 2) {
    if (col === 6) {
      col -= 1;
    }
    for (let rowOffset = 0; rowOffset < size; rowOffset += 1) {
      const row = upward ? size - 1 - rowOffset : rowOffset;
      for (let currentCol = col; currentCol >= col - 1; currentCol -= 1) {
        if (reserved[row][currentCol]) {
          continue;
        }
        const maskBit = (row + currentCol) % 2 === 0;
        matrix[row][currentCol] = Boolean(dataBits[bitIndex] || 0) !== maskBit;
        bitIndex += 1;
      }
    }
    upward = !upward;
  }

  qrSetFormatBits(matrix, errorCorrectionLevelBits, mask);
  return matrix;
}

function pushQrCode(commands, value, x, y, size, title, subtitle) {
  const matrix = buildQrMatrix(value);
  if (!matrix) {
    pushQrPlaceholder(commands, x, y, size, title, subtitle);
    return;
  }

  pushRectangle(commands, x, y, size, size, {
    fillColor: [1, 1, 1]
  });

  const quietZone = 4;
  const totalModules = matrix.length + quietZone * 2;
  const moduleSize = Math.max(1, Math.floor(size / totalModules));
  const renderedSize = moduleSize * totalModules;
  const renderX = x + (size - renderedSize) / 2;
  const renderY = y + (size - renderedSize) / 2;
  const qrX = renderX + quietZone * moduleSize;
  const qrY = renderY + quietZone * moduleSize;

  matrix.forEach((row, rowIndex) => {
    let startCol = -1;
    row.forEach((dark, colIndex) => {
      if (dark && startCol === -1) {
        startCol = colIndex;
      }
      const atEnd = colIndex === row.length - 1;
      if ((!dark || atEnd) && startCol !== -1) {
        const endCol = dark && atEnd ? colIndex : colIndex - 1;
        pushRectangle(commands, qrX + startCol * moduleSize, qrY + (matrix.length - 1 - rowIndex) * moduleSize, (endCol - startCol + 1) * moduleSize, moduleSize, {
          fillColor: [0.05, 0.08, 0.12]
        });
        startCol = -1;
      }
    });
  });

  if (title) {
    pushText(commands, title, x + size / 2, y - 16, {
      font: 'F2',
      fontSize: 8.5,
      color: [0.08, 0.22, 0.36],
      align: 'center'
    });
  }
  pushText(commands, subtitle, x + size / 2, title ? y - 28 : y - 16, {
    font: 'F1',
    fontSize: 7.5,
    color: [0.32, 0.4, 0.5],
    align: 'center'
  });
}

function buildAddressLine(data) {
  const parts = [];
  const firstLine = [data.addressStreet, data.addressNumber].filter(Boolean).join(' ');
  const secondLine = [data.addressPostalCode, data.addressCity, data.addressProvince].filter(Boolean).join(' ');
  const thirdLine = [data.addressRegion, data.addressCountry].filter(Boolean).join(', ');
  if (firstLine) {
    parts.push(firstLine);
  }
  if (secondLine) {
    parts.push(secondLine);
  }
  if (thirdLine) {
    parts.push(thirdLine);
  }
  return parts.join(' - ');
}

function formatDiscountPercentLabel(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const numericValue = Number(value);
  if (!Number.isFinite(numericValue) || numericValue < 0) {
    return null;
  }

  const roundedValue = Number(numericValue.toFixed(2));
  return `${roundedValue}%`;
}

function buildDiscountScopeLabels(applyTo) {
  if (applyTo === 'single') {
    return {
      it: 'Singole audioguide',
      en: 'Single audio guides'
    };
  }

  return {
    it: 'Pacchetto città',
    en: 'City package'
  };
}

function buildDiscountRows(cityNames, discountCode, applyTo) {
  if (!discountCode) {
    return [];
  }

  const scope = buildDiscountScopeLabels(applyTo);
  const cities = cityNames.length ? cityNames : ['Contenuti associati'];
  const rows = cities.map((cityName) => ({
    cityName: sanitizePdfText(cityName).toUpperCase(),
    discountCode,
    scopeIt: scope.it,
    scopeEn: scope.en
  }));

  if (rows.length <= 5) {
    return rows;
  }

  return [
    ...rows.slice(0, 4),
    {
      cityName: `ALTRE ${rows.length - 4} CITTÀ`,
      discountCode,
      scopeIt: scope.it,
      scopeEn: scope.en
    }
  ];
}

function pushItalianFlag(commands, x, y, width, height) {
  pushRectangle(commands, x, y, width / 3, height, { fillColor: [0, 0.57, 0.23] });
  pushRectangle(commands, x + width / 3, y, width / 3, height, { fillColor: [1, 1, 1] });
  pushRectangle(commands, x + (width / 3) * 2, y, width / 3, height, { fillColor: [0.8, 0.08, 0.12] });
  pushRectangle(commands, x, y, width, height, { strokeColor: [0.82, 0.86, 0.9], lineWidth: 0.5 });
}

function pushUkFlag(commands, x, y, width, height) {
  pushRectangle(commands, x, y, width, height, { fillColor: [0.02, 0.13, 0.43] });
  pushLine(commands, x, y, x + width, y + height, { color: [1, 1, 1], lineWidth: 5 });
  pushLine(commands, x, y + height, x + width, y, { color: [1, 1, 1], lineWidth: 5 });
  pushLine(commands, x, y, x + width, y + height, { color: [0.78, 0.05, 0.12], lineWidth: 2.2 });
  pushLine(commands, x, y + height, x + width, y, { color: [0.78, 0.05, 0.12], lineWidth: 2.2 });
  pushRectangle(commands, x + width / 2 - 3.2, y, 6.4, height, { fillColor: [1, 1, 1] });
  pushRectangle(commands, x, y + height / 2 - 3.2, width, 6.4, { fillColor: [1, 1, 1] });
  pushRectangle(commands, x + width / 2 - 1.7, y, 3.4, height, { fillColor: [0.78, 0.05, 0.12] });
  pushRectangle(commands, x, y + height / 2 - 1.7, width, 3.4, { fillColor: [0.78, 0.05, 0.12] });
  pushRectangle(commands, x, y, width, height, { strokeColor: [0.82, 0.86, 0.9], lineWidth: 0.5 });
}

function pushLanguageFlag(commands, language, centerX, y) {
  const width = language === 'it' ? 25 : 28;
  const height = 17;
  const x = centerX - width / 2;
  if (language === 'it') {
    pushItalianFlag(commands, x, y, width, height);
    return;
  }
  pushUkFlag(commands, x, y, width, height);
}

function pushPromoPanel(commands, panel) {
  const {
    x,
    y,
    width,
    height,
    language,
    paragraphs,
    discountIntroLines,
    discountText,
    discountOutro,
    fallbackText
  } = panel;
  const darkBlue = [0.05, 0.19, 0.33];
  const mutedBlue = [0.27, 0.36, 0.48];
  const red = [0.75, 0, 0];
  const centerX = x + width / 2;

  pushLanguageFlag(commands, language, centerX, y + height - 24);

  let textY = y + height - 58;
  paragraphs.forEach((paragraph) => {
    textY = pushWrappedText(commands, paragraph, centerX, textY, 38, {
      font: 'F1',
      fontSize: 10.2,
      color: darkBlue,
      align: 'center',
      lineHeight: 12.5,
      maxLines: 5
    });
    textY -= 10;
  });

  if (discountText) {
    textY -= 2;
    discountIntroLines.forEach((line) => {
      pushText(commands, line, centerX, textY, {
        font: 'F2',
        fontSize: 12,
        color: darkBlue,
        align: 'center'
      });
      textY -= 14;
    });
    textY -= 7;
    pushText(commands, discountText, centerX, textY, {
      font: 'F2',
      fontSize: 20,
      color: red,
      align: 'center'
    });
    textY -= 22;
    pushWrappedText(commands, discountOutro, centerX, textY, 36, {
      font: 'F2',
      fontSize: 11.2,
      color: darkBlue,
      align: 'center',
      lineHeight: 13,
      maxLines: 3
    });
    return;
  }

  pushWrappedText(commands, fallbackText, centerX, y + 36, 37, {
    font: 'F2',
    fontSize: 11,
    color: mutedBlue,
    align: 'center',
    lineHeight: 13,
    maxLines: 3
  });
}

function pushActivationStep(commands, x, y, width, number, lines) {
  pushRectangle(commands, x + width / 2 - 10, y + 51, 20, 20, {
    fillColor: [0.07, 0.25, 0.43],
    strokeColor: [0.07, 0.25, 0.43],
    lineWidth: 1
  });
  pushText(commands, String(number), x + width / 2, y + 58.5, {
    font: 'F2',
    fontSize: 10,
    color: [1, 1, 1],
    align: 'center'
  });

  let textY = y + 38;
  lines.forEach((line, index) => {
    const fontSize = index === 0 ? 9.2 : 8.2;
    pushWrappedText(commands, line, x + width / 2, textY, 22, {
      font: index === 0 ? 'F2' : 'F1',
      fontSize,
      color: index === 0 ? [0.08, 0.22, 0.36] : [0.32, 0.4, 0.5],
      align: 'center',
      lineHeight: fontSize + 2,
      maxLines: index === 0 ? 2 : 1
    });
    textY -= index === 0 ? 24 : 12;
  });
}

function pushQrPlaceholder(commands, x, y, size, title, subtitle) {
  pushRectangle(commands, x, y, size, size, {
    fillColor: [1, 1, 1],
    strokeColor: [0.18, 0.27, 0.38],
    lineWidth: 1.4
  });
  pushRectangle(commands, x + 8, y + 8, size - 16, size - 16, {
    strokeColor: [0.78, 0.84, 0.9],
    lineWidth: 1
  });
  pushText(commands, 'QR', x + size / 2, y + size / 2 + 3, {
    font: 'F2',
    fontSize: 19,
    color: [0.18, 0.27, 0.38],
    align: 'center'
  });
  pushText(commands, 'CODE', x + size / 2, y + size / 2 - 13, {
    font: 'F2',
    fontSize: 9,
    color: [0.18, 0.27, 0.38],
    align: 'center'
  });

  if (title) {
    pushText(commands, title, x + size / 2, y - 16, {
      font: 'F2',
      fontSize: 8.5,
      color: [0.08, 0.22, 0.36],
      align: 'center'
    });
  }
  pushText(commands, subtitle, x + size / 2, title ? y - 28 : y - 16, {
    font: 'F1',
    fontSize: 7.5,
    color: [0.39, 0.46, 0.56],
    align: 'center'
  });
}

function pushDiscountCodesTable(commands, x, y, width, rows) {
  if (!rows.length) {
    return;
  }

  const titleHeight = 24;
  const columnHeaderHeight = 20;
  const rowHeight = 21;
  const height = titleHeight + columnHeaderHeight + rows.length * rowHeight;
  const cityColumnWidth = 162;
  const codeColumnWidth = 124;
  const scopeColumnWidth = width - cityColumnWidth - codeColumnWidth;
  const titleY = y + height - titleHeight;
  const columnHeaderY = titleY - columnHeaderHeight;
  const cityColumnX = x;
  const codeColumnX = x + cityColumnWidth;
  const scopeColumnX = codeColumnX + codeColumnWidth;

  pushRectangle(commands, x, y, width, height, {
    fillColor: [0.972, 0.976, 0.98],
    strokeColor: [0.78, 0.82, 0.87],
    lineWidth: 0.8
  });
  pushRectangle(commands, x, titleY, width, titleHeight, {
    fillColor: [0.972, 0.976, 0.98],
    strokeColor: [0.78, 0.82, 0.87],
    lineWidth: 0.8
  });
  pushLine(commands, x + width / 2, titleY, x + width / 2, titleY + titleHeight, {
    color: [0.82, 0.86, 0.9],
    lineWidth: 0.6
  });
  pushText(commands, 'CODICI SCONTO', x + width / 4, titleY + 7, {
    font: 'F2',
    fontSize: 10,
    color: [0.05, 0.19, 0.33],
    align: 'center'
  });
  pushText(commands, 'DISCOUNT CODES', x + (width * 3) / 4, titleY + 7, {
    font: 'F2',
    fontSize: 10,
    color: [0.05, 0.19, 0.33],
    align: 'center'
  });

  pushRectangle(commands, x, columnHeaderY, width, columnHeaderHeight, {
    fillColor: [0.93, 0.95, 0.97],
    strokeColor: [0.78, 0.82, 0.87],
    lineWidth: 0.6
  });
  pushLine(commands, codeColumnX, columnHeaderY, codeColumnX, columnHeaderY + columnHeaderHeight, {
    color: [0.82, 0.86, 0.9],
    lineWidth: 0.6
  });
  pushLine(commands, scopeColumnX, columnHeaderY, scopeColumnX, columnHeaderY + columnHeaderHeight, {
    color: [0.82, 0.86, 0.9],
    lineWidth: 0.6
  });
  pushText(commands, 'CITTÀ / CITY', cityColumnX + cityColumnWidth / 2, columnHeaderY + 6.5, {
    font: 'F2',
    fontSize: 8,
    color: [0.18, 0.27, 0.38],
    align: 'center'
  });
  pushText(commands, 'CODICE / CODE', codeColumnX + codeColumnWidth / 2, columnHeaderY + 6.5, {
    font: 'F2',
    fontSize: 8,
    color: [0.18, 0.27, 0.38],
    align: 'center'
  });
  pushText(commands, 'APPLICATO A / APPLIES TO', scopeColumnX + scopeColumnWidth / 2, columnHeaderY + 6.5, {
    font: 'F2',
    fontSize: 7.6,
    color: [0.18, 0.27, 0.38],
    align: 'center'
  });

  rows.forEach((row, index) => {
    const rowY = columnHeaderY - (index + 1) * rowHeight;
    pushRectangle(commands, x, rowY, width, rowHeight, {
      fillColor: index % 2 === 0 ? [1, 1, 1] : [0.972, 0.976, 0.98]
    });
    pushLine(commands, x, rowY, x + width, rowY, { color: [0.82, 0.86, 0.9], lineWidth: 0.6 });
    pushLine(commands, codeColumnX, rowY, codeColumnX, rowY + rowHeight, {
      color: [0.82, 0.86, 0.9],
      lineWidth: 0.6
    });
    pushLine(commands, scopeColumnX, rowY, scopeColumnX, rowY + rowHeight, {
      color: [0.82, 0.86, 0.9],
      lineWidth: 0.6
    });
    pushText(commands, row.cityName.slice(0, 24), cityColumnX + cityColumnWidth / 2, rowY + 7.2, {
      font: 'F2',
      fontSize: 8.8,
      color: [0.13, 0.23, 0.34],
      align: 'center'
    });
    pushText(commands, row.discountCode, codeColumnX + codeColumnWidth / 2, rowY + 7.1, {
      font: 'F2',
      fontSize: 9.7,
      color: [0.05, 0.19, 0.33],
      align: 'center'
    });
    pushText(commands, row.scopeIt, scopeColumnX + scopeColumnWidth / 2, rowY + 11.4, {
      font: 'F2',
      fontSize: 7.5,
      color: [0.13, 0.23, 0.34],
      align: 'center'
    });
    pushText(commands, row.scopeEn, scopeColumnX + scopeColumnWidth / 2, rowY + 3.8, {
      font: 'F1',
      fontSize: 7.2,
      color: [0.32, 0.4, 0.5],
      align: 'center'
    });
  });
}

export function buildPartnerPromotionFileName(structureName, code) {
  const normalizedStructure = sanitizePdfText(structureName || 'struttura')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'struttura';
  const normalizedCode = sanitizePdfText(code || '').replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 12) || 'anteprima';
  return `walk-around-${normalizedStructure}-${normalizedCode}.pdf`;
}

function formatCityList(cityNames, conjunction) {
  const names = Array.isArray(cityNames) ? cityNames.map((value) => sanitizePdfText(value)).filter(Boolean) : [];
  if (!names.length) {
    return '';
  }
  if (names.length === 1) {
    return names[0];
  }
  return `${names.slice(0, -1).join(', ')} ${conjunction} ${names[names.length - 1]}`;
}

function buildDiscountOutroLabels(applyTo, cityNames) {
  const italianCityList = formatCityList(cityNames, 'e');
  const englishCityList = formatCityList(cityNames, 'and');
  const hasMultipleCities = cityNames.length > 1;

  if (applyTo === 'single') {
    return {
      it:
        italianCityList
          ? `sulle singole audioguide ${hasMultipleCities ? 'delle città' : 'della città'} di ${italianCityList}`
          : 'sulle singole audioguide della città selezionata',
      en: englishCityList
        ? `on single audio guides for ${englishCityList}`
        : 'on single audio guides for the selected city'
    };
  }

  return {
    it:
      italianCityList
        ? `${hasMultipleCities ? 'sui pacchetti città' : 'sul pacchetto città'} di ${italianCityList}`
        : 'sul pacchetto città selezionato',
    en: englishCityList
      ? hasMultipleCities
        ? `on the city packages for ${englishCityList}`
        : `on the ${englishCityList} city package`
      : 'on the selected city package'
  };
}

export function buildPartnerPromotionPdf(data) {
  const structureName = sanitizePdfText(data?.structureName || 'Struttura partner') || 'Struttura partner';
  const structureType = sanitizePdfText(data?.structureType || '');
  const discountCode = sanitizePdfText(data?.discountCode || '').replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 16);
  const applyTo = data?.applyTo === 'single' ? 'single' : 'bundle';
  const addressLine = buildAddressLine(data);
  const cityNames = Array.isArray(data?.cityNames)
    ? data.cityNames.map((value) => sanitizePdfText(value)).filter(Boolean)
    : [];
  const validCitiesLabel = cityNames.length ? cityNames.join(', ') : 'contenuti Walk Around associati';
  const expiryLabel = formatDateTime(data?.expiresAt);
  const userDiscountLabel = formatDiscountPercentLabel(data?.userDiscountPercent);
  const discountText = userDiscountLabel ? `${userDiscountLabel} OFF` : null;
  const website = sanitizePdfText(data?.website || '');
  const contactEmail = sanitizePdfText(data?.contactEmail || '');
  const contactPhone = sanitizePdfText(data?.contactPhone || '');
  const discountRows = buildDiscountRows(cityNames, discountCode, applyTo);
  const discountOutroLabels = buildDiscountOutroLabels(applyTo, cityNames);
  const scope = applyTo === 'single'
    ? {
        itUnlock: 'SBLOCCA IL LUOGO'
      }
    : {
        itUnlock: 'SBLOCCA IL PACCHETTO CITTÀ'
      };
  const partnerMeta = [
    structureType ? `${structureName} - ${structureType}` : structureName,
    expiryLabel ? `Valido fino al ${expiryLabel}` : null
  ].filter(Boolean);
  const partnerLandingUrl = buildPartnerLandingUrl(discountCode);
  const contactMeta = [
    addressLine,
    website,
    contactPhone ? `Tel. ${contactPhone}` : null,
    contactEmail
  ].filter(Boolean);

  const commands = [];
  const pdfImages = [];
  const darkBlue = [0.05, 0.19, 0.33];
  const accentBlue = [0.04, 0.31, 0.52];
  const orange = [1, 0.52, 0];
  const officialLogo = loadOfficialLogoImage();
  if (officialLogo) {
    pdfImages.push({ name: 'AppLogo', ...officialLogo });
  }

  pushRectangle(commands, 0, 0, PAGE_WIDTH, PAGE_HEIGHT, { fillColor: [1, 1, 1] });

  if (officialLogo) {
    const logoBoxWidth = 210;
    const logoBoxHeight = 84;
    const logoRatio = officialLogo.width / officialLogo.height;
    const logoDrawWidth = Math.min(logoBoxWidth, logoBoxHeight * logoRatio);
    const logoDrawHeight = logoDrawWidth / logoRatio;
    pushImage(
      commands,
      'AppLogo',
      (PAGE_WIDTH - logoDrawWidth) / 2,
      752 + (logoBoxHeight - logoDrawHeight) / 2,
      logoDrawWidth,
      logoDrawHeight
    );
  } else {
    const logoFontSize = 34;
    const walkLabel = 'Walk';
    const aroundLabel = 'Around';
    const logoGap = 8;
    const logoWidth =
      approximateTextWidth(walkLabel, logoFontSize, 'F2') +
      logoGap +
      approximateTextWidth(aroundLabel, logoFontSize, 'F2');
    const logoStartX = (PAGE_WIDTH - logoWidth) / 2;
    pushText(commands, walkLabel, logoStartX, 779, {
      font: 'F2',
      fontSize: logoFontSize,
      color: [0.13, 0.3, 0.51]
    });
    pushText(commands, aroundLabel, logoStartX + approximateTextWidth(walkLabel, logoFontSize, 'F2') + logoGap, 779, {
      font: 'F2',
      fontSize: logoFontSize,
      color: orange
    });
  }
  pushLine(commands, 176, 746, 419, 746, { color: [0.9, 0.92, 0.94], lineWidth: 0.8 });

  pushText(commands, structureName, PAGE_WIDTH / 2, 725, {
    font: 'F2',
    fontSize: 13,
    color: darkBlue,
    align: 'center'
  });

  const summaryParts = [
    discountCode ? `Codice ${discountCode}` : null,
    userDiscountLabel ? `Sconto ${userDiscountLabel}` : null,
    `Valido per ${validCitiesLabel}`
  ].filter(Boolean);
  pushWrappedText(commands, summaryParts.join(' | '), PAGE_WIDTH / 2, 707, 82, {
    font: 'F1',
    fontSize: 8.8,
    color: [0.35, 0.43, 0.53],
    align: 'center',
    lineHeight: 10,
    maxLines: 2
  });

  pushPromoPanel(commands, {
    x: 57,
    y: 456,
    width: 226,
    height: 224,
    language: 'it',
    paragraphs: [
      'Esplora la città attraverso racconti, leggende e dettagli che spesso sfuggono allo sguardo.',
      "WALK AROUND ti offre un'esperienza coinvolgente e autentica, scoprendo monumenti, vicoli e atmosfere uniche direttamente dal tuo smartphone."
    ],
    discountIntroLines: ['Grazie a questa struttura', 'hai diritto a'],
    discountText,
    discountOutro: discountOutroLabels.it,
    fallbackText: discountCode
      ? "Codice sconto disponibile sui contenuti associati nell'app."
      : 'Il codice sconto non è ancora stato assegnato.'
  });
  pushPromoPanel(commands, {
    x: 312,
    y: 456,
    width: 226,
    height: 224,
    language: 'en',
    paragraphs: [
      'Explore the city through stories, legends, and details that often escape the eye.',
      'WALK AROUND offers you an immersive and authentic experience, discovering monuments, alleyways, and unique atmospheres directly from your smartphone.'
    ],
    discountIntroLines: ['Thanks to this partner,', "you're entitled to"],
    discountText,
    discountOutro: discountOutroLabels.en,
    fallbackText: discountCode
      ? 'The discount code is available on associated content in the app.'
      : 'The discount code has not been assigned yet.'
  });

  pushLine(commands, 57, 418, PAGE_WIDTH - 57, 418, { color: [0.9, 0.92, 0.94], lineWidth: 0.8 });
  pushText(commands, 'COME USARE LO SCONTO / HOW TO USE', PAGE_WIDTH / 2, 398, {
    font: 'F2',
    fontSize: 10.5,
    color: darkBlue,
    align: 'center'
  });
  pushActivationStep(commands, 64, 320, 136, 1, ['INQUADRA IL QR O APRI IL LINK', 'SCAN QR OR OPEN LINK']);
  pushActivationStep(commands, 230, 320, 136, 2, [
    discountCode ? 'CONFERMA IL CODICE' : 'INSERISCI IL CODICE',
    discountCode ? 'CONFIRM THE CODE' : 'ENTER THE CODE'
  ]);
  pushActivationStep(commands, 396, 320, 136, 3, [scope.itUnlock, 'START EXPLORING']);

  const activationInfoLines = discountCode
    ? [
        `Link diretto / Direct link: ${partnerLandingUrl}`,
        `Manuale / Manual: www.walkaround.cloud + codice/code ${discountCode}`
      ]
    : [
        'Quando il codice sarà assegnato, usa QR Code, link diretto o inserimento manuale.',
        'Once the code is assigned, use QR Code, direct link or manual entry.'
  ];
  activationInfoLines.forEach((line, index) => {
    pushText(commands, line, PAGE_WIDTH / 2, 321 - index * 10, {
      font: 'F1',
      fontSize: 7.3,
      color: [0.35, 0.43, 0.53],
      align: 'center'
    });
  });

  const qrSize = 123;
  const qrX = Math.round((PAGE_WIDTH - qrSize) / 2);
  const qrY = 177;
  if (discountCode) {
    pushQrCode(commands, partnerLandingUrl, qrX, qrY, qrSize, '', '');
  } else {
    pushQrPlaceholder(commands, qrX, qrY, qrSize, '', '');
  }

  if (discountRows.length) {
    pushDiscountCodesTable(commands, 57, 34, 481, discountRows);
  } else {
    pushText(commands, 'Codice sconto non ancora assegnato', PAGE_WIDTH / 2, 136, {
      font: 'F2',
      fontSize: 10,
      color: [0.35, 0.43, 0.53],
      align: 'center'
    });
  }

  let footerY = 26;
  const footerLines = [
    ...partnerMeta,
    contactMeta.length ? contactMeta.join(' | ') : null
  ].filter(Boolean);
  footerLines.slice(0, 4).forEach((line) => {
    pushWrappedText(commands, line, PAGE_MARGIN, footerY, 72, {
      font: 'F1',
      fontSize: 6.7,
      color: [0.39, 0.46, 0.56],
      lineHeight: 7,
      maxLines: 1
    });
    footerY -= 7;
  });

  pushText(commands, 'www.walkaround.cloud', PAGE_WIDTH - PAGE_MARGIN, 11, {
    font: 'F2',
    fontSize: 8.4,
    color: accentBlue,
    align: 'right'
  });

  return buildPdfDocument(commands.join('\n'), pdfImages);
}
