import { env } from '../config/env.js';

let transporterPromise;

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
    subject: 'Invito TourApp - Completa la registrazione',
    text: [
      `Ciao,`,
      ``,
      `${invitedByEmail} ti ha invitato a TourApp.`,
      `Apri questo link per completare la registrazione:`,
      invitationLink,
      ``,
      `Il link scade il ${expiresLabel}.`,
      `Se non hai richiesto l'invito, puoi ignorare questa email.`
    ].join('\n'),
    html: [
      `<p>Ciao,</p>`,
      `<p><strong>${invitedByEmail}</strong> ti ha invitato a TourApp.</p>`,
      `<p>Apri questo link per completare la registrazione:</p>`,
      `<p><a href="${invitationLink}">${invitationLink}</a></p>`,
      `<p>Il link scade il <strong>${expiresLabel}</strong>.</p>`,
      `<p>Se non hai richiesto l'invito, puoi ignorare questa email.</p>`
    ].join('')
  });
}
