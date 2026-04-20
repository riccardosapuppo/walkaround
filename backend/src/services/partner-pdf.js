const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const PAGE_MARGIN = 44;

function sanitizePdfText(value) {
  return String(value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\x20-\x7E]/g, ' ')
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

function approximateTextWidth(value, fontSize) {
  return sanitizePdfText(value).length * fontSize * 0.52;
}

function formatEuro(value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return null;
  }
  return `EUR ${numericValue.toFixed(2)}`;
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

function buildPdfObject(objectId, body) {
  return `${objectId} 0 obj\n${body}\nendobj\n`;
}

function buildPdfDocument(contentStream) {
  const contentBuffer = Buffer.from(contentStream, 'latin1');
  const objects = [
    null,
    buildPdfObject(1, '<< /Type /Catalog /Pages 2 0 R >>'),
    buildPdfObject(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>'),
    buildPdfObject(
      3,
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>`
    ),
    buildPdfObject(4, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>'),
    buildPdfObject(5, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>'),
    buildPdfObject(6, `<< /Length ${contentBuffer.length} >>\nstream\n${contentStream}\nendstream`)
  ];

  let pdf = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
  const offsets = [0];

  for (let index = 1; index < objects.length; index += 1) {
    offsets[index] = Buffer.byteLength(pdf, 'latin1');
    pdf += objects[index];
  }

  const xrefOffset = Buffer.byteLength(pdf, 'latin1');
  pdf += `xref\n0 ${objects.length}\n`;
  pdf += '0000000000 65535 f \n';

  for (let index = 1; index < objects.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, '0')} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return Buffer.from(pdf, 'latin1');
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
    drawX -= approximateTextWidth(text, fontSize) / 2;
  } else if (align === 'right') {
    drawX -= approximateTextWidth(text, fontSize);
  }

  commands.push('BT');
  commands.push(`/${font} ${fontSize} Tf`);
  commands.push(`${color[0]} ${color[1]} ${color[2]} rg`);
  commands.push(`1 0 0 1 ${drawX.toFixed(2)} ${y.toFixed(2)} Tm`);
  commands.push(`(${escapedText}) Tj`);
  commands.push('ET');
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

export function buildPartnerPromotionFileName(structureName, code) {
  const normalizedStructure = sanitizePdfText(structureName || 'struttura')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'struttura';
  const normalizedCode = sanitizePdfText(code || 'SCONTO').replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 12) || 'SCONTO';
  return `walk-around-${normalizedStructure}-${normalizedCode}.pdf`;
}

export function buildPartnerPromotionPdf(data) {
  const structureName = sanitizePdfText(data?.structureName || 'Struttura partner') || 'Struttura partner';
  const structureType = sanitizePdfText(data?.structureType || '');
  const discountCode = sanitizePdfText(data?.discountCode || 'SCONTO').replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 16) || 'SCONTO';
  const addressLine = buildAddressLine(data);
  const cityNames = Array.isArray(data?.cityNames)
    ? data.cityNames.map((value) => sanitizePdfText(value)).filter(Boolean)
    : [];
  const validCitiesLabel = cityNames.length ? cityNames.join(', ') : 'Disponibile sui contenuti Walk Around associati';
  const expiryLabel = formatDateTime(data?.expiresAt);
  const userDiscountLabel = Number(data?.userDiscountPercent) > 0 ? `${Number(data.userDiscountPercent).toFixed(2)}%` : null;
  const structureValueLabel = Number(data?.structureFixedAmount) > 0 ? formatEuro(data.structureFixedAmount) : null;
  const contactName = sanitizePdfText(data?.contactName || '');
  const website = sanitizePdfText(data?.website || '');
  const contactEmail = sanitizePdfText(data?.contactEmail || '');
  const contactPhone = sanitizePdfText(data?.contactPhone || '');
  const footerLines = [
    structureType ? `Tipologia: ${structureType}` : null,
    addressLine ? `Indirizzo: ${addressLine}` : null,
    website ? `Sito web: ${website}` : null,
    contactPhone ? `Telefono: ${contactPhone}` : null,
    contactEmail ? `Email: ${contactEmail}` : null
  ].filter(Boolean);
  const summaryLines = [
    `Codice promozionale: ${discountCode}`,
    `Valido per: ${validCitiesLabel}`,
    expiryLabel ? `Scadenza: ${expiryLabel}` : null,
    userDiscountLabel ? `Sconto turista: ${userDiscountLabel}` : null,
    structureValueLabel ? `Valore struttura: ${structureValueLabel}` : null
  ].filter(Boolean);
  const stepsLines = [
    '1. Scarica l app Walk Around.',
    `2. Inserisci il codice ${discountCode} nella sezione dedicata.`,
    '3. Sblocca il tour e ascolta le audioguide della citta.'
  ];

  const commands = [];

  pushRectangle(commands, 0, 0, PAGE_WIDTH, PAGE_HEIGHT, { fillColor: [0.97, 0.985, 1] });
  pushRectangle(commands, 0, PAGE_HEIGHT - 154, PAGE_WIDTH, 154, { fillColor: [0.11, 0.32, 0.63] });
  pushRectangle(commands, 0, PAGE_HEIGHT - 166, PAGE_WIDTH, 12, { fillColor: [0.13, 0.53, 0.38] });

  pushText(commands, 'WALK AROUND PARTNER', PAGE_WIDTH / 2, PAGE_HEIGHT - 62, {
    font: 'F2',
    fontSize: 22,
    color: [1, 1, 1],
    align: 'center'
  });
  pushText(commands, structureName, PAGE_WIDTH / 2, PAGE_HEIGHT - 95, {
    font: 'F2',
    fontSize: 20,
    color: [1, 1, 1],
    align: 'center'
  });
  pushText(commands, 'Mostra questo flyer ai tuoi ospiti per attivare il codice.', PAGE_WIDTH / 2, PAGE_HEIGHT - 121, {
    font: 'F1',
    fontSize: 11,
    color: [0.92, 0.96, 1],
    align: 'center'
  });

  pushRectangle(commands, PAGE_MARGIN, PAGE_HEIGHT - 262, PAGE_WIDTH - PAGE_MARGIN * 2, 66, {
    fillColor: [1, 1, 1],
    strokeColor: [0.82, 0.88, 0.96],
    lineWidth: 1.2
  });
  pushText(commands, 'Struttura partner approvata', PAGE_MARGIN + 16, PAGE_HEIGHT - 225, {
    font: 'F2',
    fontSize: 15,
    color: [0.1, 0.23, 0.38]
  });
  pushText(commands, contactName ? `Referente: ${contactName}` : 'Referente registrato nella richiesta partner', PAGE_MARGIN + 16, PAGE_HEIGHT - 247, {
    font: 'F1',
    fontSize: 10.5,
    color: [0.34, 0.42, 0.55]
  });

  pushRectangle(commands, PAGE_MARGIN, PAGE_HEIGHT - 410, PAGE_WIDTH - PAGE_MARGIN * 2, 116, {
    fillColor: [0.94, 0.97, 1],
    strokeColor: [0.7, 0.8, 0.93],
    lineWidth: 1.6
  });
  pushText(commands, 'CODICE SCONTO', PAGE_WIDTH / 2, PAGE_HEIGHT - 340, {
    font: 'F1',
    fontSize: 11,
    color: [0.25, 0.39, 0.56],
    align: 'center'
  });
  pushText(commands, discountCode, PAGE_WIDTH / 2, PAGE_HEIGHT - 378, {
    font: 'F2',
    fontSize: 28,
    color: [0.11, 0.32, 0.63],
    align: 'center'
  });

  pushRectangle(commands, PAGE_MARGIN, PAGE_HEIGHT - 646, 240, 196, {
    fillColor: [1, 1, 1],
    strokeColor: [0.84, 0.89, 0.96],
    lineWidth: 1
  });
  pushRectangle(commands, PAGE_WIDTH - PAGE_MARGIN - 240, PAGE_HEIGHT - 646, 240, 196, {
    fillColor: [1, 1, 1],
    strokeColor: [0.84, 0.89, 0.96],
    lineWidth: 1
  });

  pushText(commands, 'Dettagli promozione', PAGE_MARGIN + 16, PAGE_HEIGHT - 474, {
    font: 'F2',
    fontSize: 13,
    color: [0.1, 0.23, 0.38]
  });
  let detailY = PAGE_HEIGHT - 498;
  summaryLines.forEach((line) => {
    wrapPdfText(line, 33).forEach((wrappedLine) => {
      pushText(commands, wrappedLine, PAGE_MARGIN + 16, detailY, {
        font: 'F1',
        fontSize: 10.5,
        color: [0.31, 0.39, 0.51]
      });
      detailY -= 16;
    });
  });

  pushText(commands, 'Come usarlo', PAGE_WIDTH - PAGE_MARGIN - 224, PAGE_HEIGHT - 474, {
    font: 'F2',
    fontSize: 13,
    color: [0.1, 0.23, 0.38]
  });
  let stepsY = PAGE_HEIGHT - 498;
  stepsLines.forEach((line) => {
    wrapPdfText(line, 35).forEach((wrappedLine) => {
      pushText(commands, wrappedLine, PAGE_WIDTH - PAGE_MARGIN - 224, stepsY, {
        font: 'F1',
        fontSize: 10.5,
        color: [0.31, 0.39, 0.51]
      });
      stepsY -= 16;
    });
  });

  pushRectangle(commands, PAGE_MARGIN, 54, PAGE_WIDTH - PAGE_MARGIN * 2, 88, {
    fillColor: [0.96, 0.98, 1],
    strokeColor: [0.85, 0.9, 0.97],
    lineWidth: 1
  });
  pushText(commands, 'Riferimenti struttura', PAGE_MARGIN + 16, 118, {
    font: 'F2',
    fontSize: 12,
    color: [0.1, 0.23, 0.38]
  });

  let footerY = 96;
  footerLines.forEach((line) => {
    wrapPdfText(line, 70).forEach((wrappedLine) => {
      pushText(commands, wrappedLine, PAGE_MARGIN + 16, footerY, {
        font: 'F1',
        fontSize: 9.5,
        color: [0.35, 0.44, 0.57]
      });
      footerY -= 14;
    });
  });

  pushText(commands, 'www.walkaround.it', PAGE_WIDTH - PAGE_MARGIN, 34, {
    font: 'F2',
    fontSize: 10,
    color: [0.12, 0.32, 0.63],
    align: 'right'
  });

  return buildPdfDocument(commands.join('\n'));
}
