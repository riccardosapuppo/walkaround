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
  const numericValue = Number(value);
  const safeValue = Number.isFinite(numericValue) && numericValue > 0 ? numericValue : 20;
  const roundedValue = Number(safeValue.toFixed(2));
  return `${roundedValue}%`;
}

function buildDiscountRows(cityNames, discountCode) {
  const cities = cityNames.length ? cityNames : ['Tutte le citta'];
  const rows = cities.map((cityName) => ({
    cityName: sanitizePdfText(cityName).toUpperCase(),
    discountCode
  }));

  if (rows.length <= 5) {
    return rows;
  }

  return [
    ...rows.slice(0, 4),
    {
      cityName: `ALTRE ${rows.length - 4} CITTA`,
      discountCode
    }
  ];
}

function pushPromoPanel(commands, panel) {
  const { x, y, width, height, languageLabel, title, paragraphs, discountText, footerText } = panel;
  const darkBlue = [0.05, 0.19, 0.33];
  const mutedBlue = [0.27, 0.36, 0.48];
  const red = [0.88, 0.18, 0.18];
  const badgeWidth = 132;
  const badgeHeight = 34;
  const badgeX = x + (width - badgeWidth) / 2;
  const badgeY = y + height - 108;

  pushRectangle(commands, x, y, width, height, {
    fillColor: [1, 1, 1],
    strokeColor: [0.83, 0.88, 0.93],
    lineWidth: 1
  });
  pushRectangle(commands, x, y + height - 32, width, 32, { fillColor: [0.93, 0.96, 0.99] });
  pushText(commands, languageLabel, x + 14, y + height - 21, {
    font: 'F2',
    fontSize: 8.5,
    color: [0.38, 0.47, 0.59]
  });
  pushText(commands, title, x + width / 2, y + height - 58, {
    font: 'F2',
    fontSize: 14,
    color: darkBlue,
    align: 'center'
  });

  pushRectangle(commands, badgeX, badgeY, badgeWidth, badgeHeight, {
    fillColor: red,
    strokeColor: red,
    lineWidth: 1
  });
  pushText(commands, discountText, x + width / 2, badgeY + 11, {
    font: 'F2',
    fontSize: 17,
    color: [1, 1, 1],
    align: 'center'
  });

  let textY = badgeY - 17;
  paragraphs.forEach((paragraph) => {
    textY = pushWrappedText(commands, paragraph, x + 18, textY, 36, {
      font: 'F1',
      fontSize: 8.8,
      color: mutedBlue,
      lineHeight: 10,
      maxLines: 3
    });
    textY -= 2;
  });

  pushWrappedText(commands, footerText, x + 18, y + 14, 36, {
    font: 'F1',
    fontSize: 7.7,
    color: mutedBlue,
    lineHeight: 8.5,
    maxLines: 2
  });
}

function pushActivationStep(commands, x, y, width, number, lines) {
  pushRectangle(commands, x, y, width, 70, {
    fillColor: [1, 1, 1],
    strokeColor: [0.82, 0.88, 0.93],
    lineWidth: 1
  });
  pushRectangle(commands, x + 12, y + 43, 20, 20, {
    fillColor: [0.07, 0.25, 0.43],
    strokeColor: [0.07, 0.25, 0.43],
    lineWidth: 1
  });
  pushText(commands, String(number), x + 22, y + 49, {
    font: 'F2',
    fontSize: 10,
    color: [1, 1, 1],
    align: 'center'
  });

  let textY = y + 51;
  lines.forEach((line, index) => {
    const fontSize = index === 0 ? 9.5 : 8.4;
    pushWrappedText(commands, line, x + 40, textY, 17, {
      font: index === 0 ? 'F2' : 'F1',
      fontSize,
      color: index === 0 ? [0.08, 0.22, 0.36] : [0.32, 0.4, 0.5],
      lineHeight: fontSize + 2,
      maxLines: index === 0 ? 2 : 1
    });
    textY -= index === 0 ? 26 : 12;
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
    fontSize: 18,
    color: [0.18, 0.27, 0.38],
    align: 'center'
  });
  pushText(commands, 'CODE', x + size / 2, y + size / 2 - 13, {
    font: 'F2',
    fontSize: 9,
    color: [0.18, 0.27, 0.38],
    align: 'center'
  });

  pushText(commands, title, x + size / 2, y - 16, {
    font: 'F2',
    fontSize: 8.5,
    color: [0.08, 0.22, 0.36],
    align: 'center'
  });
  pushText(commands, subtitle, x + size / 2, y - 28, {
    font: 'F1',
    fontSize: 7.5,
    color: [0.39, 0.46, 0.56],
    align: 'center'
  });
}

function pushDiscountCodesTable(commands, x, y, width, rows) {
  const headerHeight = 26;
  const rowHeight = 20;
  const height = headerHeight + rows.length * rowHeight;
  const codeColumnWidth = 145;
  const cityColumnWidth = width - codeColumnWidth;

  pushRectangle(commands, x, y, width, height, {
    fillColor: [1, 1, 1],
    strokeColor: [0.78, 0.84, 0.9],
    lineWidth: 1
  });
  pushRectangle(commands, x, y + height - headerHeight, width, headerHeight, {
    fillColor: [0.06, 0.24, 0.42],
    strokeColor: [0.06, 0.24, 0.42],
    lineWidth: 1
  });
  pushText(commands, 'CODICI SCONTO / DISCOUNT CODES', x + width / 2, y + height - 17, {
    font: 'F2',
    fontSize: 11.5,
    color: [1, 1, 1],
    align: 'center'
  });

  rows.forEach((row, index) => {
    const rowY = y + height - headerHeight - (index + 1) * rowHeight;
    pushRectangle(commands, x, rowY, width, rowHeight, {
      fillColor: index % 2 === 0 ? [0.97, 0.985, 1] : [1, 1, 1]
    });
    pushLine(commands, x, rowY, x + width, rowY, { color: [0.86, 0.9, 0.94], lineWidth: 0.7 });
    pushLine(commands, x + cityColumnWidth, rowY, x + cityColumnWidth, rowY + rowHeight, {
      color: [0.86, 0.9, 0.94],
      lineWidth: 0.7
    });
    pushText(commands, row.cityName.slice(0, 30), x + 14, rowY + 7, {
      font: 'F2',
      fontSize: 9.5,
      color: [0.13, 0.23, 0.34]
    });
    pushText(commands, row.discountCode, x + cityColumnWidth + codeColumnWidth / 2, rowY + 7, {
      font: 'F2',
      fontSize: 10.5,
      color: [0.88, 0.18, 0.18],
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
  const userDiscountLabel = formatDiscountPercentLabel(data?.userDiscountPercent);
  const website = sanitizePdfText(data?.website || '');
  const contactEmail = sanitizePdfText(data?.contactEmail || '');
  const contactPhone = sanitizePdfText(data?.contactPhone || '');
  const discountRows = buildDiscountRows(cityNames, discountCode);
  const partnerMeta = [
    structureType ? `${structureName} - ${structureType}` : structureName,
    expiryLabel ? `Valido fino al ${expiryLabel}` : null
  ].filter(Boolean);
  const contactMeta = [
    addressLine,
    website,
    contactPhone ? `Tel. ${contactPhone}` : null,
    contactEmail
  ].filter(Boolean);

  const commands = [];
  const darkBlue = [0.05, 0.19, 0.33];
  const accentBlue = [0.06, 0.24, 0.42];
  const red = [0.88, 0.18, 0.18];

  pushRectangle(commands, 0, 0, PAGE_WIDTH, PAGE_HEIGHT, { fillColor: [0.985, 0.991, 1] });
  pushRectangle(commands, 0, PAGE_HEIGHT - 92, PAGE_WIDTH, 92, { fillColor: accentBlue });
  pushRectangle(commands, 0, PAGE_HEIGHT - 104, PAGE_WIDTH, 12, { fillColor: red });

  pushText(commands, 'WALK AROUND', PAGE_WIDTH / 2, PAGE_HEIGHT - 48, {
    font: 'F2',
    fontSize: 28,
    color: [1, 1, 1],
    align: 'center'
  });
  pushText(commands, 'Cammina.Ascolta.Esplora.', PAGE_WIDTH / 2, PAGE_HEIGHT - 70, {
    font: 'F1',
    fontSize: 10.5,
    color: [0.9, 0.96, 1],
    align: 'center'
  });
  pushText(commands, 'PROMO PARTNER', PAGE_WIDTH / 2, PAGE_HEIGHT - 98, {
    font: 'F2',
    fontSize: 10,
    color: [1, 1, 1],
    align: 'center'
  });

  pushText(commands, structureName, PAGE_WIDTH / 2, 716, {
    font: 'F2',
    fontSize: 14,
    color: darkBlue,
    align: 'center'
  });
  pushWrappedText(commands, `Codice ${discountCode} valido per ${validCitiesLabel}`, PAGE_WIDTH / 2, 699, 74, {
    font: 'F1',
    fontSize: 9.5,
    color: [0.35, 0.43, 0.53],
    align: 'center',
    lineHeight: 11,
    maxLines: 2
  });

  pushPromoPanel(commands, {
    x: PAGE_MARGIN,
    y: 472,
    width: 242,
    height: 210,
    languageLabel: 'ENGLISH',
    title: 'Explore the city',
    paragraphs: [
      'Explore the city through stories, legends, and details that often escape the eye.',
      'WALK AROUND offers an immersive and authentic experience directly from your smartphone.'
    ],
    discountText: `${userDiscountLabel} OFF`,
    footerText: 'Thanks to this partner, the code unlocks the discount on all audio guide packages in the app.'
  });
  pushPromoPanel(commands, {
    x: PAGE_WIDTH - PAGE_MARGIN - 242,
    y: 472,
    width: 242,
    height: 210,
    languageLabel: 'ITALIANO',
    title: 'Esplora la citta',
    paragraphs: [
      'Esplora la citta attraverso racconti, leggende e dettagli che spesso sfuggono allo sguardo.',
      'WALK AROUND ti offre un esperienza coinvolgente e autentica direttamente dal tuo smartphone.'
    ],
    discountText: `${userDiscountLabel} OFF`,
    footerText: 'Grazie a questa struttura hai diritto allo sconto su tutti i pacchetti di audioguide nell app.'
  });

  pushRectangle(commands, PAGE_MARGIN, 366, PAGE_WIDTH - PAGE_MARGIN * 2, 96, {
    fillColor: [0.94, 0.97, 1],
    strokeColor: [0.77, 0.84, 0.91],
    lineWidth: 1
  });
  pushText(commands, 'COME ATTIVARE / HOW TO USE', PAGE_WIDTH / 2, 438, {
    font: 'F2',
    fontSize: 12,
    color: darkBlue,
    align: 'center'
  });
  pushActivationStep(commands, PAGE_MARGIN + 14, 377, 150, 1, ['SCARICA L APP', 'DOWNLOAD THE APP']);
  pushActivationStep(commands, PAGE_MARGIN + 179, 377, 150, 2, ['INSERISCI IL CODICE', discountCode]);
  pushActivationStep(commands, PAGE_MARGIN + 344, 377, 150, 3, ['SBLOCCA LA CITTA', 'START EXPLORING']);

  pushText(commands, 'Inquadra il QR oppure cerca Walk Around sullo store.', PAGE_WIDTH / 2, 340, {
    font: 'F1',
    fontSize: 9.2,
    color: [0.35, 0.43, 0.53],
    align: 'center'
  });

  pushQrPlaceholder(commands, 154, 249, 62, 'QR APP', 'Download app');
  pushQrPlaceholder(commands, 380, 249, 62, 'QR CODE', 'Codice sconto');

  pushDiscountCodesTable(commands, 90, 89, 415, discountRows);

  let footerY = 57;
  partnerMeta.forEach((line) => {
    pushWrappedText(commands, line, PAGE_MARGIN, footerY, 72, {
      font: 'F1',
      fontSize: 7.8,
      color: [0.39, 0.46, 0.56],
      lineHeight: 9,
      maxLines: 1
    });
    footerY -= 9;
  });

  if (contactMeta.length) {
    pushWrappedText(commands, contactMeta.join(' | '), PAGE_MARGIN, 24, 85, {
      font: 'F1',
      fontSize: 7.3,
      color: [0.5, 0.56, 0.64],
      lineHeight: 8,
      maxLines: 1
    });
  }
  pushText(commands, 'WALK AROUND', PAGE_WIDTH - PAGE_MARGIN, 24, {
    font: 'F2',
    fontSize: 8.4,
    color: accentBlue,
    align: 'right'
  });

  return buildPdfDocument(commands.join('\n'));
}
