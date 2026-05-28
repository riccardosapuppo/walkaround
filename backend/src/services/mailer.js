import { getDashboardEmailSettings } from './email-settings.js';
import { DEFAULT_PARTNER_EMAIL_SETTINGS } from './partner-email-templates.js';

let transporterPromise;
let transporterKey;
let nodemailerPromise;

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderTemplate(template, variables = {}) {
  return String(template || '').replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_match, key) => {
    const value = variables[key];
    return value == null ? '' : String(value);
  });
}

function plainTextToHtml(value) {
  return String(value || '')
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, '<br>')}</p>`)
    .join('');
}

function formatItalianDateTime(value) {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleString('it-IT', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

function formatPartnerEuroAmount(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) {
    return '';
  }

  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

function compactNotificationLines(lines) {
  return lines
    .map((line) => (line == null ? '' : String(line)))
    .filter((line, index, allLines) => line.trim() || (index > 0 && index < allLines.length - 1 && allLines[index - 1]?.trim()));
}

function formatNotificationValue(value, fallback = '-') {
  const normalized = String(value ?? '').trim();
  return normalized || fallback;
}

function formatNotificationAddress(parts) {
  return parts.map((part) => String(part || '').trim()).filter(Boolean).join(', ') || '-';
}

function paymentTypeLabel(type) {
  return type === 'bundle' ? 'Pacchetto citta' : 'Luogo singolo';
}

function buildPartnerEmailVariables({
  requestId,
  contactName,
  structureName,
  structureType,
  contactEmail,
  addressCity,
  discountCode,
  cityNames,
  expiresAt,
  userDiscountPercent,
  structureFixedAmount
}) {
  const recipientName = String(contactName || '').trim() || 'partner';
  const cityLabel = Array.isArray(cityNames) && cityNames.length ? cityNames.join(', ') : '';
  const discountPercent = Number(userDiscountPercent);

  return {
    requestId: requestId == null ? '' : String(requestId),
    contactName: recipientName,
    structureName: String(structureName || '').trim(),
    structureType: String(structureType || '').trim(),
    contactEmail: String(contactEmail || '').trim(),
    addressCity: String(addressCity || '').trim(),
    discountCode: String(discountCode || '').trim(),
    cityNames: cityLabel,
    expiresAt: formatItalianDateTime(expiresAt),
    userDiscountPercent: Number.isFinite(discountPercent) ? `${discountPercent}%` : '',
    structureFixedAmount: formatPartnerEuroAmount(structureFixedAmount)
  };
}

async function loadNodemailer() {
  if (!nodemailerPromise) {
    nodemailerPromise = import('nodemailer').then((module) => module.default || module);
  }

  return nodemailerPromise;
}

function buildTransportKey(settings) {
  return JSON.stringify({
    host: settings.host,
    port: settings.port,
    secure: settings.secure,
    user: settings.user,
    password: settings.password
  });
}

async function getTransporter() {
  const settings = await getDashboardEmailSettings();
  const nextTransporterKey = buildTransportKey(settings);

  if (!transporterPromise || transporterKey !== nextTransporterKey) {
    transporterKey = nextTransporterKey;
    transporterPromise = loadNodemailer().then((nodemailer) =>
      nodemailer.createTransport({
        host: settings.host,
        port: settings.port,
        secure: settings.secure,
        auth: settings.user
          ? {
              user: settings.user,
              pass: settings.password
            }
          : undefined
      })
    );
  }

  try {
    const transporter = await transporterPromise;
    return { transporter, from: settings.from };
  } catch (error) {
    if (transporterKey === nextTransporterKey) {
      transporterPromise = undefined;
      transporterKey = undefined;
    }
    throw error;
  }
}

async function sendPartnerTemplateEmail({ to, subjectTemplate, bodyTemplate, variables, attachments = [] }) {
  const { transporter, from } = await getTransporter();
  const subject = renderTemplate(subjectTemplate, variables).trim() || 'Walk Around';
  const text = renderTemplate(bodyTemplate, variables).trim();

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html: plainTextToHtml(text),
    attachments
  });
}

async function sendPlainOperationalEmail({ to, subject, lines }) {
  const recipients = Array.isArray(to) ? to.filter(Boolean) : [to].filter(Boolean);
  if (!recipients.length) {
    return;
  }

  const text = compactNotificationLines(lines).join('\n');
  const { transporter, from } = await getTransporter();
  await transporter.sendMail({
    from,
    to: recipients,
    subject,
    text,
    html: plainTextToHtml(text)
  });
}

export async function sendInvitationEmail({ to, invitationLink, invitedByEmail, expiresAt }) {
  const { transporter, from } = await getTransporter();
  const expiresLabel = new Date(expiresAt).toLocaleString('it-IT', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  await transporter.sendMail({
    from,
    to,
    subject: 'Invito Walk Around - Completa la registrazione',
    text: [
      `Ciao,`,
      ``,
      `${invitedByEmail} ti ha invitato a Walk Around.`,
      `Apri questo link per completare la registrazione:`,
      invitationLink,
      ``,
      `Il link scade il ${expiresLabel}.`,
      `Se non hai richiesto l'invito, puoi ignorare questa email.`
    ].join('\n'),
    html: [
      `<p>Ciao,</p>`,
      `<p><strong>${escapeHtml(invitedByEmail)}</strong> ti ha invitato a Walk Around.</p>`,
      `<p>Apri questo link per completare la registrazione:</p>`,
      `<p><a href="${escapeHtml(invitationLink)}">${escapeHtml(invitationLink)}</a></p>`,
      `<p>Il link scade il <strong>${escapeHtml(expiresLabel)}</strong>.</p>`,
      `<p>Se non hai richiesto l'invito, puoi ignorare questa email.</p>`
    ].join('')
  });
}

export async function sendPasswordResetEmail({ to, resetLink, requestedByEmail, expiresAt }) {
  const { transporter, from } = await getTransporter();
  const expiresLabel = new Date(expiresAt).toLocaleString('it-IT', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  await transporter.sendMail({
    from,
    to,
    subject: 'Walk Around - Reset password',
    text: [
      `Ciao,`,
      ``,
      `${requestedByEmail} ha richiesto il reset della tua password su Walk Around.`,
      `Apri questo link per impostarne una nuova:`,
      resetLink,
      ``,
      `Il link scade il ${expiresLabel}.`,
      `Se non hai richiesto il reset, ignora questa email.`
    ].join('\n'),
    html: [
      `<p>Ciao,</p>`,
      `<p><strong>${escapeHtml(requestedByEmail)}</strong> ha richiesto il reset della tua password su Walk Around.</p>`,
      `<p>Apri questo link per impostarne una nuova:</p>`,
      `<p><a href="${escapeHtml(resetLink)}">${escapeHtml(resetLink)}</a></p>`,
      `<p>Il link scade il <strong>${escapeHtml(expiresLabel)}</strong>.</p>`,
      `<p>Se non hai richiesto il reset, ignora questa email.</p>`
    ].join('')
  });
}

export async function sendDashboardEmailSettingsTestEmail({ to, requestedByEmail }) {
  await sendPlainOperationalEmail({
    to,
    subject: 'Walk Around - Test email dashboard',
    lines: [
      'Email di test inviata correttamente dalla configurazione SMTP della dashboard.',
      '',
      `Richiesta da: ${formatNotificationValue(requestedByEmail)}`,
      `Data: ${formatItalianDateTime(new Date())}`
    ]
  });
}

export async function sendPartnerApprovalEmail({
  requestId,
  to,
  contactName,
  structureName,
  structureType,
  contactEmail,
  addressCity,
  discountCode,
  cityNames,
  expiresAt,
  userDiscountPercent,
  structureFixedAmount,
  pdfBuffer,
  pdfFileName,
  subjectTemplate = DEFAULT_PARTNER_EMAIL_SETTINGS.approvalSubject,
  bodyTemplate = DEFAULT_PARTNER_EMAIL_SETTINGS.approvalBody
}) {
  const variables = buildPartnerEmailVariables({
    requestId,
    contactName,
    structureName,
    structureType,
    contactEmail: contactEmail || to,
    addressCity,
    discountCode,
    cityNames,
    expiresAt,
    userDiscountPercent,
    structureFixedAmount
  });

  await sendPartnerTemplateEmail({
    to,
    subjectTemplate,
    bodyTemplate,
    variables,
    attachments: pdfBuffer
      ? [
          {
            filename: pdfFileName || 'walk-around-partner.pdf',
            content: pdfBuffer,
            contentType: 'application/pdf'
          }
        ]
      : []
  });
}

export async function sendPartnerRejectionEmail({
  requestId,
  to,
  contactName,
  structureName,
  structureType,
  contactEmail,
  addressCity,
  subjectTemplate = DEFAULT_PARTNER_EMAIL_SETTINGS.rejectionSubject,
  bodyTemplate = DEFAULT_PARTNER_EMAIL_SETTINGS.rejectionBody
}) {
  const variables = buildPartnerEmailVariables({
    requestId,
    contactName,
    structureName,
    structureType,
    contactEmail: contactEmail || to,
    addressCity
  });

  await sendPartnerTemplateEmail({
    to,
    subjectTemplate,
    bodyTemplate,
    variables
  });
}

export async function sendPartnerRegistrationNotificationEmail({ to, request }) {
  const requestId = request?.id == null ? '' : `#${request.id}`;
  const contactName = [request?.contactFirstName, request?.contactLastName].filter(Boolean).join(' ');
  const address = formatNotificationAddress([
    [request?.addressStreet, request?.addressNumber].filter(Boolean).join(' '),
    request?.addressPostalCode,
    request?.addressCity,
    request?.addressProvince,
    request?.addressRegion,
    request?.addressCountry
  ]);

  await sendPlainOperationalEmail({
    to,
    subject: `Walk Around - Nuova richiesta partner ${requestId}`.trim(),
    lines: [
      `Nuova richiesta partner ricevuta${requestId ? ` (${requestId})` : ''}.`,
      '',
      `Struttura: ${formatNotificationValue(request?.structureName)}`,
      `Tipologia: ${formatNotificationValue(request?.structureType)}`,
      `P.IVA: ${formatNotificationValue(request?.vatNumber)}`,
      `Camere: ${request?.roomsCount == null ? '-' : request.roomsCount}`,
      `Sito: ${formatNotificationValue(request?.website)}`,
      '',
      `Referente: ${formatNotificationValue(contactName)}`,
      `Email referente: ${formatNotificationValue(request?.contactEmail)}`,
      `Telefono referente: ${formatNotificationValue(request?.contactPhone)}`,
      '',
      `Indirizzo: ${address}`,
      `Note: ${formatNotificationValue(request?.notes)}`,
      `Data richiesta: ${formatNotificationValue(formatItalianDateTime(request?.createdAt))}`
    ]
  });
}

export async function sendPaymentNotificationEmail({ to, orderId, captureId, payer, purchases = [], paymentProvider, paymentEnvironment }) {
  const purchaseRows = Array.isArray(purchases) ? purchases : [];
  const totalAmount = purchaseRows.reduce((sum, purchase) => sum + Number(purchase.finalAmount ?? purchase.amount ?? 0), 0);
  const totalDiscount = purchaseRows.reduce((sum, purchase) => sum + Number(purchase.discountAmount || 0), 0);
  const totalStructureEarning = purchaseRows.reduce((sum, purchase) => sum + Number(purchase.structureEarningAmount || 0), 0);
  const itemLines = purchaseRows.length
    ? purchaseRows.map((purchase, index) => {
        const label = purchase.poiName || purchase.cityName || purchase.poiId || purchase.cityId || 'Contenuto';
        const price = formatPartnerEuroAmount(purchase.finalAmount ?? purchase.amount);
        const code = purchase.inviteCode ? ` - codice ${purchase.inviteCode}` : '';
        return `${index + 1}. ${paymentTypeLabel(purchase.type)}: ${label} - ${price}${code}`;
      })
    : ['Nessun dettaglio acquisto disponibile.'];

  await sendPlainOperationalEmail({
    to,
    subject: `Walk Around - Nuovo pagamento ${formatPartnerEuroAmount(totalAmount)}`,
    lines: [
      'Nuovo pagamento completato.',
      '',
      `Totale incassato: ${formatPartnerEuroAmount(totalAmount)}`,
      `Sconto totale: ${formatPartnerEuroAmount(totalDiscount)}`,
      `Quota strutture: ${formatPartnerEuroAmount(totalStructureEarning)}`,
      `Provider: ${formatNotificationValue(paymentProvider)}`,
      `Ambiente: ${formatNotificationValue(paymentEnvironment)}`,
      `Ordine PayPal: ${formatNotificationValue(orderId)}`,
      `Capture ID: ${formatNotificationValue(captureId)}`,
      '',
      `Cliente: ${formatNotificationValue([payer?.payerFirstName, payer?.payerLastName].filter(Boolean).join(' '))}`,
      `Email cliente: ${formatNotificationValue(payer?.payerEmail)}`,
      `Telefono cliente: ${formatNotificationValue(payer?.payerPhone)}`,
      `Paese cliente: ${formatNotificationValue(payer?.payerCountryCode)}`,
      `Indirizzo cliente: ${formatNotificationValue(payer?.payerAddress)}`,
      '',
      'Dettaglio acquisti:',
      ...itemLines
    ]
  });
}
