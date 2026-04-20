import { env } from '../config/env.js';

let transporterPromise;

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
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
      `<p><strong>${invitedByEmail}</strong> ti ha invitato a Walk Around.</p>`,
      `<p>Apri questo link per completare la registrazione:</p>`,
      `<p><a href="${invitationLink}">${invitationLink}</a></p>`,
      `<p>Il link scade il <strong>${expiresLabel}</strong>.</p>`,
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
      `<p><strong>${requestedByEmail}</strong> ha richiesto il reset della tua password su Walk Around.</p>`,
      `<p>Apri questo link per impostarne una nuova:</p>`,
      `<p><a href="${resetLink}">${resetLink}</a></p>`,
      `<p>Il link scade il <strong>${expiresLabel}</strong>.</p>`,
      `<p>Se non hai richiesto il reset, ignora questa email.</p>`
    ].join('')
  });
}

export async function sendPartnerApprovalEmail({
  to,
  contactName,
  structureName,
  discountCode,
  cityNames,
  expiresAt,
  pdfBuffer,
  pdfFileName
}) {
  const transporter = await getTransporter();
  const recipientName = String(contactName || '').trim() || 'partner';
  const cityLabel = Array.isArray(cityNames) && cityNames.length ? cityNames.join(', ') : 'le citta configurate in dashboard';
  const expiresLabel = expiresAt
    ? new Date(expiresAt).toLocaleString('it-IT', {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    : null;

  await transporter.sendMail({
    from: env.smtp.from,
    to,
    subject: 'Walk Around - Richiesta partner approvata',
    text: [
      `Ciao ${recipientName},`,
      ``,
      `la richiesta partner per ${structureName} e stata approvata.`,
      `Il codice sconto associato alla struttura e: ${discountCode}.`,
      `Citta abilitate: ${cityLabel}.`,
      expiresLabel ? `Scadenza del codice: ${expiresLabel}.` : null,
      `In allegato trovi il PDF pronto da esporre ai turisti.`,
      ``,
      `Per qualsiasi dubbio puoi rispondere a questa email.`
    ]
      .filter(Boolean)
      .join('\n'),
    html: [
      `<p>Ciao ${escapeHtml(recipientName)},</p>`,
      `<p>la richiesta partner per <strong>${escapeHtml(structureName)}</strong> e stata approvata.</p>`,
      `<p>Il codice sconto associato alla struttura e <strong>${escapeHtml(discountCode)}</strong>.</p>`,
      `<p>Citta abilitate: <strong>${escapeHtml(cityLabel)}</strong>.</p>`,
      expiresLabel ? `<p>Scadenza del codice: <strong>${escapeHtml(expiresLabel)}</strong>.</p>` : '',
      `<p>In allegato trovi il PDF pronto da esporre ai turisti.</p>`,
      `<p>Per qualsiasi dubbio puoi rispondere a questa email.</p>`
    ].join(''),
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
