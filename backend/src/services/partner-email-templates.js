export const LEGACY_PARTNER_APPROVAL_BODY = [
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
].join('\n');

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
    'Puoi completare la registrazione del tuo account partner da questo link:',
    '{{activationUrl}}',
    '',
    'Link dashboard partner, da conservare per gli accessi successivi:',
    '{{dashboardUrl}}',
    '',
    'Una volta attivato il tuo account, potrai accedere alla dashboard partner per consultare le informazioni della struttura, verificare il codice sconto attivo, controllare le citta abilitate e consultare le condizioni economiche della partnership, inclusa la quota riconosciuta alla struttura per i pagamenti generati tramite il codice sconto associato.',
    '',
    'Per qualsiasi dubbio puoi rispondere a questa email.',
    '',
    'Grazie,',
    'Walk Around'
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
  ].join('\n'),
  activationSubject: 'Walk Around - Attiva il tuo account partner',
  activationBody: [
    'Ciao {{contactName}},',
    '',
    'abbiamo generato un nuovo link per completare la registrazione del tuo account partner per {{structureName}}.',
    '',
    'Link registrazione:',
    '{{activationUrl}}',
    '',
    'Link dashboard partner, da usare dopo aver completato la registrazione:',
    '{{dashboardUrl}}',
    '',
    'Una volta attivato il tuo account, potrai accedere alla dashboard partner per consultare le informazioni della struttura, verificare il codice sconto attivo, controllare le citta abilitate e consultare le condizioni economiche della partnership.',
    '',
    'Per qualsiasi dubbio puoi rispondere a questa email.',
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
  { key: 'addressCity', description: 'Citta indicata nella richiesta' },
  { key: 'discountCode', description: 'Codice sconto generato in approvazione' },
  { key: 'cityNames', description: 'Citta abilitate per il codice sconto' },
  { key: 'expiresAt', description: 'Scadenza del codice sconto' },
  { key: 'userDiscountPercent', description: 'Percentuale sconto applicata agli utenti' },
  { key: 'structureFixedAmount', description: 'Quota fissa riconosciuta alla struttura' },
  { key: 'activationUrl', description: 'Link per completare la registrazione account partner' },
  { key: 'dashboardUrl', description: 'Link alla dashboard partner' }
];
