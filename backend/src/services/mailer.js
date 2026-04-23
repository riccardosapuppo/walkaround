import { env } from '../config/env.js';
import { DEFAULT_PARTNER_EMAIL_SETTINGS } from './partner-email-templates.js';

let transporterPromise;

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

async function getTransporter() {
  if (!transporterPromise) {
    transporterPromise = import('nodemailer')
      .then((module) => module.default || module)
      .then((nodemailer) =>
        nodemailer.createTransport({
          host: env.smtp.host,
          port: env.smtp.port,
          secure: env.smtp.secure,
          auth: {
            user: env.smtp.user,
            pass: env.smtp.password
          }
        })
      );
  }

  return transporterPromise;
}

async function sendPartnerTemplateEmail({ to, subjectTemplate, bodyTemplate, variables, attachments = [] }) {
  const transporter = await getTransporter();
  const subject = renderTemplate(subjectTemplate, variables).trim() || 'Walk Around';
  const text = renderTemplate(bodyTemplate, variables).trim();

  await transporter.sendMail({
    from: env.smtp.from,
    to,
    subject,
    text,
    html: plainTextToHtml(text),
    attachments
  });
}

export async function sendInvitationEmail({ to, invitationLink, invitedByEmail, expiresAt }) {
  const transporter = await getTransporter();
  const expiresLabel = new Date(expiresAt).toLocaleString('it-IT', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  await transporter.sendMail({
    from: env.smtp.from,
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
  const transporter = await getTransporter();
  const expiresLabel = new Date(expiresAt).toLocaleString('it-IT', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  await transporter.sendMail({
    from: env.smtp.from,
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
