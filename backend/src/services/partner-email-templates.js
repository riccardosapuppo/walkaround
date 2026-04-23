export const DEFAULT_PARTNER_EMAIL_SETTINGS = {
  approvalSubject: 'Walk Around - Richiesta partner approvata',
  approvalBody: [
    'Ciao {{contactName}},',
    '',
    'la richiesta partner per {{structureName}} e stata approvata.',
    'Codice sconto: {{discountCode}}.',
    'Citta abilitate: {{cityNames}}.',
    'Scadenza codice: {{expiresAt}}.',
    '',
    'In allegato trovi il PDF pronto da esporre ai turisti.',
    '',
    'Per qualsiasi dubbio puoi rispondere a questa email.'
  ].join('\n'),
  rejectionSubject: 'Walk Around - Richiesta partner non approvata',
  rejectionBody: [
    'Ciao {{contactName}},',
    '',
    'ti informiamo che la richiesta partner per {{structureName}} non e stata approvata.',
    '',
    'Per maggiori informazioni puoi rispondere a questa email.',
    '',
    'Grazie,',
    'Walk Around'
  ].join('\n')
};

export const PARTNER_EMAIL_TEMPLATE_PLACEHOLDERS = [
  { key: 'contactName', description: 'Nome e cognome del referente partner' },
  { key: 'structureName', description: 'Nome della struttura' },
  { key: 'structureType', description: 'Tipologia della struttura' },
  { key: 'contactEmail', description: 'Email del referente partner' },
  { key: 'requestId', description: 'ID della richiesta partner' },
  { key: 'addressCity', description: 'Citta indicata nella richiesta' },
  { key: 'discountCode', description: 'Codice sconto generato in approvazione' },
  { key: 'cityNames', description: 'Citta abilitate per il codice sconto' },
  { key: 'expiresAt', description: 'Scadenza del codice sconto' },
  { key: 'userDiscountPercent', description: 'Percentuale sconto applicata agli utenti' },
  { key: 'structureFixedAmount', description: 'Quota fissa riconosciuta alla struttura' }
];
