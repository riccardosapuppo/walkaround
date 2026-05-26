const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const PAGE_MARGIN = 44;
const PARTNER_LANDING_URL = 'https://www.walkaround.cloud/';

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

  return `${PARTNER_LANDING_URL}?code=${encodeURIComponent(normalizedCode)}`;
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

function buildDiscountRows(cityNames, discountCode) {
  if (!discountCode) {
    return [];
  }

  const cities = cityNames.length ? cityNames : ['Contenuti associati'];
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
      cityName: `ALTRE ${rows.length - 4} CITTÀ`,
      discountCode
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
  if (!rows.length) {
    return;
  }

  const headerHeight = 26;
  const rowHeight = 24;
  const height = headerHeight + rows.length * rowHeight;
  const codeColumnWidth = width / 2;
  const cityColumnWidth = width - codeColumnWidth;

  pushRectangle(commands, x, y, width, height, {
    fillColor: [0.972, 0.976, 0.98],
    strokeColor: [0.78, 0.82, 0.87],
    lineWidth: 0.8
  });
  pushRectangle(commands, x, y + height - headerHeight, width, headerHeight, {
    fillColor: [0.972, 0.976, 0.98],
    strokeColor: [0.78, 0.82, 0.87],
    lineWidth: 0.8
  });
  pushText(commands, 'CODICI SCONTO          DISCOUNT CODES', x + width / 2, y + height - 17, {
    font: 'F2',
    fontSize: 10,
    color: [0.05, 0.19, 0.33],
    align: 'center'
  });

  rows.forEach((row, index) => {
    const rowY = y + height - headerHeight - (index + 1) * rowHeight;
    pushRectangle(commands, x, rowY, width, rowHeight, {
      fillColor: index % 2 === 0 ? [1, 1, 1] : [0.972, 0.976, 0.98]
    });
    pushLine(commands, x, rowY, x + width, rowY, { color: [0.82, 0.86, 0.9], lineWidth: 0.6 });
    pushLine(commands, x + cityColumnWidth, rowY, x + cityColumnWidth, rowY + rowHeight, {
      color: [0.82, 0.86, 0.9],
      lineWidth: 0.6
    });
    pushText(commands, row.cityName.slice(0, 30), x + cityColumnWidth / 2, rowY + 8, {
      font: 'F2',
      fontSize: 10,
      color: [0.13, 0.23, 0.34],
      align: 'center'
    });
    pushText(commands, row.discountCode, x + cityColumnWidth + codeColumnWidth / 2, rowY + 7, {
      font: 'F2',
      fontSize: 10.5,
      color: [0.05, 0.19, 0.33],
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
  const discountRows = buildDiscountRows(cityNames, discountCode);
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
  const darkBlue = [0.05, 0.19, 0.33];
  const accentBlue = [0.04, 0.31, 0.52];
  const orange = [1, 0.52, 0];

  pushRectangle(commands, 0, 0, PAGE_WIDTH, PAGE_HEIGHT, { fillColor: [1, 1, 1] });

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
  pushLine(commands, 176, 766, 419, 766, { color: [0.9, 0.92, 0.94], lineWidth: 0.8 });

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
  pushText(commands, 'COME ATTIVARE / HOW TO USE', PAGE_WIDTH / 2, 398, {
    font: 'F2',
    fontSize: 10.5,
    color: darkBlue,
    align: 'center'
  });
  pushActivationStep(commands, 64, 320, 136, 1, ["SCARICA L'APP", 'DOWNLOAD THE APP']);
  pushActivationStep(commands, 230, 320, 136, 2, [
    discountCode ? 'INSERISCI IL CODICE' : 'INSERISCI IL CODICE SCONTO',
    discountCode || 'ENTER THE DISCOUNT CODE'
  ]);
  pushActivationStep(commands, 396, 320, 136, 3, [scope.itUnlock, 'START EXPLORING']);

  pushWrappedText(commands, `Inquadra il QR Code oppure vai su ${partnerLandingUrl}`, PAGE_WIDTH / 2, 304, 88, {
    font: 'F1',
    fontSize: 9.2,
    color: [0.35, 0.43, 0.53],
    align: 'center',
    lineHeight: 10,
    maxLines: 2
  });

  pushQrPlaceholder(commands, 178, 224, 66, 'QR APP', 'Download app');
  pushQrPlaceholder(commands, 351, 224, 66, 'QR CODE', discountCode ? 'Codice sconto' : 'Da assegnare');

  if (discountRows.length) {
    pushDiscountCodesTable(commands, 57, 58, 481, discountRows);
  } else {
    pushText(commands, 'Codice sconto non ancora assegnato', PAGE_WIDTH / 2, 136, {
      font: 'F2',
      fontSize: 10,
      color: [0.35, 0.43, 0.53],
      align: 'center'
    });
  }

  let footerY = 35;
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
    pushWrappedText(commands, contactMeta.join(' | '), PAGE_MARGIN, 19, 85, {
      font: 'F1',
      fontSize: 7.3,
      color: [0.5, 0.56, 0.64],
      lineHeight: 8,
      maxLines: 1
    });
  }
  pushText(commands, 'www.walkaround.cloud', PAGE_WIDTH - PAGE_MARGIN, 19, {
    font: 'F2',
    fontSize: 8.4,
    color: accentBlue,
    align: 'right'
  });

  return buildPdfDocument(commands.join('\n'));
}
