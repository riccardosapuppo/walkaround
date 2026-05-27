import { Component, ElementRef, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import {
  AdminAuthService,
  CatalogMediaTarget,
  CatalogCityInput,
  CatalogPublicationStatus,
  CatalogPoiInput,
  DashboardAppCacheSettings,
  DashboardPartnerRequest,
  DiscountCodeApplyTo,
  DashboardCatalogCity,
  DashboardCatalogPoi,
  DashboardDiscountCode,
  DashboardPayPalSettings,
  DashboardPartnerEmailSettings,
  DashboardPrivacyPolicySettings,
  DashboardPaymentRow,
  DashboardPaymentsSummary,
  PartnerEmailSettingsInput,
  PrivacyPolicyTranslations,
  PartnerRequestApprovalInput,
  PartnerRequestPdfPreviewInput,
  DashboardStructure,
  DashboardUserAssociation,
  StructureAssociatedUserRow,
  DashboardUserRow,
  InviteResponse,
  OpenAiAudioTargetLanguage,
  OpenAiGeneratePoiAudioResponse,
  OpenAiPoiTranslationSummary,
  OpenAiPoiTranslationStatus,
  OpenAiTranslatePoiResponse,
  OpenAiTranslationSettings,
  OpenAiTranslationUsage,
  UserRole
} from '../../core/services/admin-auth.service';
import { PoiTranslationFields, PoiTranslations } from '../../core/models/localized-content.model';

type DashboardSection =
  | 'users'
  | 'structures'
  | 'discounts'
  | 'partnerRequests'
  | 'partnerEmails'
  | 'payments'
  | 'paypal'
  | 'gptTranslations'
  | 'globalSettings'
  | 'catalog';
type CatalogTab = 'cities' | 'pois';
type GlobalSettingsTab = 'privacyPolicy' | 'appCache';
type GptTranslationsTab = 'texts' | 'audio' | 'settings';
type PoiMapPickerTarget = 'create' | 'edit';
type ContentEditorLanguage = 'en' | 'fr' | 'es' | 'de' | 'pl';
type AudioEditorLanguage = OpenAiAudioTargetLanguage;
type PrivacyPolicyLanguage = 'it' | ContentEditorLanguage;
type PoiMapSearchResult = {
  displayName: string;
  lat: number;
  lng: number;
  osmUrl: string;
};
type CatalogPoiTranslationsFormValue = Record<
  ContentEditorLanguage,
  {
    descriptionShort: string;
    descriptionLong: string;
    audioUrl: string;
  }
>;
type DiscountCodesByStructureGroup = {
  structureId: string;
  structureName: string | null;
  structureAddress: string | null;
  codes: DashboardDiscountCode[];
};

const DASHBOARD_ACTIVE_SECTION_KEY = 'walkaround.dashboard.activeSection';

const DEFAULT_PARTNER_EMAIL_SETTINGS: PartnerEmailSettingsInput = {
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

const DEFAULT_PARTNER_EMAIL_PLACEHOLDERS: DashboardPartnerEmailSettings['placeholders'] = [
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

@Component({
  standalone: false,
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnDestroy, OnInit {
  readonly noStructureValue = '__none__';
  readonly fixedCreateCityRegion = 'Sicilia';
  readonly contentLanguages: ReadonlyArray<{ code: ContentEditorLanguage; label: string }> = [
    { code: 'en', label: 'Inglese' },
    { code: 'fr', label: 'Francese' },
    { code: 'es', label: 'Spagnolo' },
    { code: 'de', label: 'Tedesco' },
    { code: 'pl', label: 'Polacco' }
  ];
  readonly audioLanguages: ReadonlyArray<{ code: AudioEditorLanguage; label: string }> = [
    { code: 'it', label: 'Italiano' },
    ...this.contentLanguages
  ];
  readonly ttsVoiceOptions: ReadonlyArray<{ value: string; label: string }> = [
    { value: 'alloy', label: 'Alloy' },
    { value: 'ash', label: 'Ash' },
    { value: 'ballad', label: 'Ballad' },
    { value: 'coral', label: 'Coral' },
    { value: 'echo', label: 'Echo' },
    { value: 'fable', label: 'Fable' },
    { value: 'onyx', label: 'Onyx' },
    { value: 'nova', label: 'Nova' },
    { value: 'sage', label: 'Sage' },
    { value: 'shimmer', label: 'Shimmer' },
    { value: 'verse', label: 'Verse' },
    { value: 'marin', label: 'Marin' },
    { value: 'cedar', label: 'Cedar' }
  ];
  readonly privacyPolicyLanguages: ReadonlyArray<{ code: PrivacyPolicyLanguage; label: string }> = [
    { code: 'it', label: 'Italiano' },
    ...this.contentLanguages
  ];
  readonly poiCategoryOptions: string[] = [
    'Monumento',
    'Museo',
    'Archeologia',
    'Cultura',
    'Chiesa',
    'Palazzo',
    'Castello',
    'Piazza',
    'Quartiere',
    'Mercato',
    'Natura',
    'Parco',
    'Belvedere',
    'Spiaggia',
    'Teatro',
    'Galleria',
    'Esperienza'
  ];
  readonly sections: Array<{ id: DashboardSection; label: string }> = [
    { id: 'users', label: 'Utenti' },
    { id: 'structures', label: 'Strutture' },
    { id: 'discounts', label: 'Codici invito/sconto' },
    { id: 'partnerRequests', label: 'Richieste partner' },
    { id: 'partnerEmails', label: 'Email partner' },
    { id: 'payments', label: 'Pagamenti' },
    { id: 'paypal', label: 'PayPal' },
    { id: 'gptTranslations', label: 'Traduzioni GPT' },
    { id: 'globalSettings', label: 'Impostazioni globali' },
    { id: 'catalog', label: 'Città e Punti interesse' }
  ];
  readonly managerSections: Array<{ id: DashboardSection; label: string }> = [
    { id: 'users', label: 'Utenti associati' },
    { id: 'discounts', label: 'Codici invito/sconto' },
    { id: 'payments', label: 'Pagamenti' }
  ];
  readonly globalSettingsTabs: Array<{ id: GlobalSettingsTab; label: string }> = [
    { id: 'privacyPolicy', label: 'Privacy policy' },
    { id: 'appCache', label: 'Cache e aggiornamenti' }
  ];
  readonly gptTranslationsTabs: Array<{ id: GptTranslationsTab; label: string }> = [
    { id: 'texts', label: 'Testi tradotti' },
    { id: 'audio', label: 'Audio guide' },
    { id: 'settings', label: 'Impostazioni' }
  ];

  authChecked = false;
  isAuthenticated = false;
  activeSection: DashboardSection = this.readStoredActiveSection();
  showInviteSection = false;
  showCreateUserSection = false;
  showStructureSection = false;
  selectedUsersStructureFilterId: string | null = null;
  selectedPaymentsStructureId = '';
  editingStructureId: string | null = null;
  catalogTab: CatalogTab = 'cities';
  activeGlobalSettingsTab: GlobalSettingsTab = 'privacyPolicy';
  activeGptTranslationsTab: GptTranslationsTab = 'texts';

  loggingIn = false;
  showLoginPassword = false;
  inviting = false;
  creatingUser = false;
  loadingUsers = false;
  loadingStructures = false;
  loadingAssociatedUsers = false;
  loadingPayments = false;
  loadingPartnerRequests = false;
  loadingPartnerEmailSettings = false;
  loadingPayPalSettings = false;
  loadingOpenAiTranslationSettings = false;
  loadingOpenAiTranslationStatus = false;
  loadingOpenAiTranslationSummary = false;
  loadingPrivacyPolicySettings = false;
  loadingAppCacheSettings = false;
  creatingStructure = false;
  updatingStructure = false;
  loadingDiscountCodes = false;
  creatingDiscountCode = false;
  updatingDiscountCode = false;
  savingPayPalSettings = false;
  savingPartnerEmailSettings = false;
  savingOpenAiTranslationSettings = false;
  previewingOpenAiVoice = false;
  savingPrivacyPolicySettings = false;
  bumpingAppCacheVersion = false;
  translatingPrivacyPolicy = false;
  bulkTranslatingPois = false;
  bulkGeneratingPoiAudios = false;
  testingPayPalSettings = false;
  loadingCatalogCities = false;
  loadingCatalogPois = false;
  savingCatalogCity = false;
  savingCatalogPoi = false;
  uploadingCatalogAudio = false;
  uploadingCatalogCityImage = false;
  uploadingCatalogImage = false;
  uploadingCatalogPoiTranslationAudio: Record<ContentEditorLanguage, boolean> = { en: false, fr: false, es: false, de: false, pl: false };
  uploadingCatalogCityEditImage = false;
  uploadingCatalogPoiEditImage = false;
  uploadingCatalogPoiEditAudio = false;
  uploadingCatalogPoiEditTranslationAudio: Record<ContentEditorLanguage, boolean> = { en: false, fr: false, es: false, de: false, pl: false };
  deletingCatalogCityId: string | null = null;
  deletingCatalogPoiId: string | null = null;
  savingUserId: string | null = null;
  savingDiscountCodeId: number | null = null;
  previewingDiscountCodeId: number | null = null;
  deletingDiscountCodeId: number | null = null;
  deletingStructureId: string | null = null;
  resettingPasswordUserId: string | null = null;
  deletingUserId: string | null = null;
  impersonatingUserId: string | null = null;
  translatingPoiId: string | null = null;
  generatingPoiAudioId: string | null = null;

  lastInvite: InviteResponse | null = null;
  users: DashboardUserRow[] = [];
  structures: DashboardStructure[] = [];
  discountCodes: DashboardDiscountCode[] = [];
  discountCodesByStructureId: Record<string, DashboardDiscountCode[]> = {};
  discountCodeGroups: DiscountCodesByStructureGroup[] = [];
  highlightedDiscountCodeId: number | null = null;
  highlightedDiscountStructureId: string | null = null;
  associatedUsers: StructureAssociatedUserRow[] = [];
  payments: DashboardPaymentRow[] = [];
  partnerRequests: DashboardPartnerRequest[] = [];
  partnerEmailSettings: DashboardPartnerEmailSettings | null = null;
  payPalSettings: DashboardPayPalSettings | null = null;
  openAiTranslationSettings: OpenAiTranslationSettings | null = null;
  openAiTranslationStatusRows: OpenAiPoiTranslationStatus[] = [];
  openAiTranslationSummary: OpenAiPoiTranslationSummary | null = null;
  privacyPolicySettings: DashboardPrivacyPolicySettings | null = null;
  appCacheSettings: DashboardAppCacheSettings | null = null;
  privacyPolicyTranslations: Record<PrivacyPolicyLanguage, string> = this.emptyPrivacyPolicyTranslations();
  privacyPolicySelectedLanguage: PrivacyPolicyLanguage = 'it';
  privacyPolicyTranslateOverwrite = false;
  privacyPolicyTranslationUsage: OpenAiTranslationUsage = {
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0
  };
  privacyPolicyTranslationLog: string[] = [];
  selectedGptTranslationPoiId = '';
  gptTranslationProgressTotal = 0;
  gptTranslationProgressDone = 0;
  gptTranslationUsage: OpenAiTranslationUsage = {
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0
  };
  gptTranslationLog: string[] = [];
  gptAudioProgressTotal = 0;
  gptAudioProgressDone = 0;
  gptAudioLog: string[] = [];
  paymentsSummary: DashboardPaymentsSummary = {
    totalPayments: 0,
    totalCollected: 0,
    totalDiscountAmount: 0,
    totalStructureEarnings: 0
  };
  catalogCities: DashboardCatalogCity[] = [];
  catalogPois: DashboardCatalogPoi[] = [];
  selectedCatalogCityId = '';
  editingCatalogCityId: string | null = null;
  editingCatalogPoiId: string | null = null;
  partnerRequestApprovalTarget: DashboardPartnerRequest | null = null;
  approvingPartnerRequestId: number | null = null;
  rejectingPartnerRequestId: number | null = null;
  deletingPartnerRequestId: number | null = null;
  previewingPartnerRequestId: number | null = null;
  private lastLoadedCatalogPoisCityId = '';
  private catalogPoisRequestToken = 0;
  private openAiTranslationStatusRequestToken = 0;
  private openAiTranslationSummaryRequestToken = 0;
  private hasLoadedCatalogCitiesOnce = false;
  mapPickerLoading = false;
  mapPickerResults: PoiMapSearchResult[] = [];
  mapPickerSelectedLat: number | null = null;
  mapPickerSelectedLng: number | null = null;
  mapPickerMapReady = false;
  private mapPickerTarget: PoiMapPickerTarget | null = null;
  mapPickerTargetLabel = '';
  private editingCatalogCityIsDefault = false;
  private createCatalogCityDialogRef?: MatDialogRef<unknown>;
  private createCatalogPoiDialogRef?: MatDialogRef<unknown>;
  private editCatalogCityDialogRef?: MatDialogRef<unknown>;
  private editCatalogPoiDialogRef?: MatDialogRef<unknown>;
  private createDiscountCodeDialogRef?: MatDialogRef<unknown>;
  private editDiscountCodeDialogRef?: MatDialogRef<unknown>;
  private partnerRequestApprovalDialogRef?: MatDialogRef<unknown>;
  private catalogPoiAudioPlayerDialogRef?: MatDialogRef<unknown>;
  private poiMapPickerDialogRef?: MatDialogRef<unknown>;
  private gptTranslationInterruptDialogRef?: MatDialogRef<unknown, boolean>;
  private poiMapInstance: any = null;
  private poiMapMarker: any = null;
  private leafletLoaderPromise?: Promise<void>;
  private gptTranslationRunToken = 0;
  private confirmedGptTranslationLanguage: ContentEditorLanguage = 'en';
  private confirmedGptTranslationOverwrite = false;
  private confirmedGptAudioLanguage: AudioEditorLanguage = 'it';
  private confirmedGptAudioOverwrite = false;
  private openAiVoicePreviewAudio: HTMLAudioElement | null = null;
  private openAiVoicePreviewUrl: string | null = null;
  private openAiVoicePreviewRequestToken = 0;
  private readonly audioDurationByUrl: Record<string, number> = {};
  private readonly pendingAudioDurationUrls = new Set<string>();
  private readonly invalidAudioDurationUrls = new Set<string>();
  private readonly maxCatalogAudioUploadBytes = 15 * 1024 * 1024;
  private readonly maxCatalogImageUploadBytes = 10 * 1024 * 1024;
  private readonly maxPrivacyPolicyImportBytes = 2 * 1024 * 1024;
  audioPlayerPoiName = '';
  audioPlayerFileName = '';
  audioPlayerUrl = '';

  @ViewChild('createCatalogCityDialog') createCatalogCityDialog?: TemplateRef<unknown>;
  @ViewChild('createCatalogPoiDialog') createCatalogPoiDialog?: TemplateRef<unknown>;
  @ViewChild('editCatalogCityDialog') editCatalogCityDialog?: TemplateRef<unknown>;
  @ViewChild('editCatalogPoiDialog') editCatalogPoiDialog?: TemplateRef<unknown>;
  @ViewChild('createDiscountCodeDialog') createDiscountCodeDialog?: TemplateRef<unknown>;
  @ViewChild('editDiscountCodeDialog') editDiscountCodeDialog?: TemplateRef<unknown>;
  @ViewChild('partnerRequestApprovalDialog') partnerRequestApprovalDialog?: TemplateRef<unknown>;
  @ViewChild('catalogPoiAudioPlayerDialog') catalogPoiAudioPlayerDialog?: TemplateRef<unknown>;
  @ViewChild('poiMapPickerDialog') poiMapPickerDialog?: TemplateRef<unknown>;
  @ViewChild('gptTranslationInterruptDialog') gptTranslationInterruptDialog?: TemplateRef<unknown>;
  @ViewChild('poiMapCanvas') poiMapCanvas?: ElementRef<HTMLDivElement>;
  @ViewChild('privacyPolicyEditor') privacyPolicyEditor?: ElementRef<HTMLDivElement>;

  readonly structureInviteCodeDraftByUserId: Record<string, string> = {};
  editingDiscountCodeId: number | null = null;
  private readonly italianDateTimeFormatter = new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  private readonly italianCurrencyFormatter = new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  readonly loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  readonly inviteForm = this.formBuilder.nonNullable.group({
    firstName: ['', [Validators.required, Validators.maxLength(120)]],
    lastName: ['', [Validators.required, Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email]],
    role: ['facility_manager' as UserRole, [Validators.required]],
    structureId: [this.noStructureValue]
  });

  readonly createUserForm = this.formBuilder.nonNullable.group({
    firstName: ['', [Validators.required, Validators.maxLength(120)]],
    lastName: ['', [Validators.required, Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(120)]],
    role: ['user' as UserRole, [Validators.required]],
    structureId: [this.noStructureValue]
  });

  readonly structureForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(160)]],
    street: ['', [Validators.required, Validators.maxLength(160)]],
    streetNumber: ['', [Validators.required, Validators.maxLength(20)]],
    city: ['', [Validators.required, Validators.maxLength(120)]],
    postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
    province: ['', [Validators.maxLength(80)]],
    country: ['Italia', [Validators.maxLength(80)]]
  });

  readonly structureEditForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(160)]],
    street: ['', [Validators.required, Validators.maxLength(160)]],
    streetNumber: ['', [Validators.required, Validators.maxLength(20)]],
    city: ['', [Validators.required, Validators.maxLength(120)]],
    postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
    province: ['', [Validators.maxLength(80)]],
    country: ['Italia', [Validators.maxLength(80)]]
  });

  readonly discountCodeCreateForm = this.formBuilder.nonNullable.group({
    structureId: ['', [Validators.required]],
    applyTo: ['bundle' as DiscountCodeApplyTo, [Validators.required]],
    cityIds: [[] as string[], [Validators.required]],
    code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern(/^[A-Z0-9]{6}$/)]],
    userDiscountPercent: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    structureFixedAmount: [0, [Validators.required, Validators.min(0), Validators.max(10000)]],
    expiresAt: ['', [Validators.required]]
  });

  readonly discountCodeEditForm = this.formBuilder.nonNullable.group({
    applyTo: ['bundle' as DiscountCodeApplyTo, [Validators.required]],
    cityIds: [[] as string[], [Validators.required]],
    userDiscountPercent: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    structureFixedAmount: [0, [Validators.required, Validators.min(0), Validators.max(10000)]],
    expiresAt: ['', [Validators.required]]
  });

  readonly partnerRequestApprovalForm = this.formBuilder.nonNullable.group({
    applyTo: ['bundle' as DiscountCodeApplyTo, [Validators.required]],
    cityIds: [[] as string[], [Validators.required]],
    code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern(/^[A-Z0-9]{6}$/)]],
    userDiscountPercent: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    structureFixedAmount: [0, [Validators.required, Validators.min(0), Validators.max(10000)]],
    expiresAt: ['', [Validators.required]]
  });

  readonly partnerEmailSettingsForm = this.formBuilder.nonNullable.group({
    approvalSubject: [DEFAULT_PARTNER_EMAIL_SETTINGS.approvalSubject, [Validators.required, Validators.maxLength(200)]],
    approvalBody: [DEFAULT_PARTNER_EMAIL_SETTINGS.approvalBody, [Validators.required, Validators.maxLength(10000)]],
    rejectionSubject: [DEFAULT_PARTNER_EMAIL_SETTINGS.rejectionSubject, [Validators.required, Validators.maxLength(200)]],
    rejectionBody: [DEFAULT_PARTNER_EMAIL_SETTINGS.rejectionBody, [Validators.required, Validators.maxLength(10000)]]
  });

  readonly payPalForm = this.formBuilder.nonNullable.group({
    isEnabled: [false],
    mode: ['sandbox' as 'sandbox' | 'live', [Validators.required]],
    clientId: ['', [Validators.maxLength(400)]],
    clientSecret: ['', [Validators.maxLength(400)]],
    merchantId: ['', [Validators.maxLength(180)]],
    merchantEmail: ['', [Validators.email, Validators.maxLength(180)]],
    brandName: ['Walk Around', [Validators.maxLength(127)]],
    webhookId: ['', [Validators.maxLength(180)]]
  });

  readonly openAiTranslationSettingsForm = this.formBuilder.nonNullable.group({
    apiKey: ['', [Validators.maxLength(500)]],
    model: ['gpt-4o-mini', [Validators.required, Validators.maxLength(120)]],
    ttsModel: ['gpt-4o-mini-tts', [Validators.required, Validators.maxLength(120)]],
    ttsVoice: ['alloy', [Validators.required]],
    ttsInstructions: [
      'Narrazione chiara, naturale e professionale per una audioguida turistica. Ritmo medio, tono coinvolgente e pronuncia curata dei nomi propri italiani.',
      [Validators.maxLength(1200)]
    ]
  });

  readonly gptTranslationForm = this.formBuilder.nonNullable.group({
    cityId: ['', [Validators.required]],
    targetLanguage: ['en' as ContentEditorLanguage, [Validators.required]],
    poiId: [''],
    overwrite: [false]
  });

  readonly gptAudioForm = this.formBuilder.nonNullable.group({
    cityId: ['', [Validators.required]],
    targetLanguage: ['it' as AudioEditorLanguage, [Validators.required]],
    poiId: [''],
    overwrite: [false]
  });

  readonly catalogCityForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    region: [{ value: this.fixedCreateCityRegion, disabled: true }, [Validators.required, Validators.maxLength(120)]],
    bundlePrice: [0, [Validators.required, Validators.min(0), Validators.max(10000)]],
    heroImage: ['', [Validators.required, Validators.maxLength(500)]],
    isPublished: [true],
    translations: this.formBuilder.nonNullable.group({})
  });

  readonly catalogPoiForm = this.formBuilder.nonNullable.group({
    cityId: ['', [Validators.required]],
    name: ['', [Validators.required, Validators.maxLength(180)]],
    address: ['', [Validators.maxLength(240)]],
    lat: [0, [Validators.required, Validators.min(-90), Validators.max(90)]],
    lng: [0, [Validators.required, Validators.min(-180), Validators.max(180)]],
    category: [this.poiCategoryOptions[0], [Validators.required]],
    descriptionShort: ['', [Validators.required, Validators.maxLength(1000)]],
    descriptionLong: ['', [Validators.required, Validators.maxLength(10000)]],
    imageUrl: ['', [Validators.required, Validators.maxLength(500)]],
    audioUrl: ['', [Validators.maxLength(500)]],
    priceSingle: [0, [Validators.required, Validators.min(0), Validators.max(10000)]],
    durationSec: [60, [Validators.required, Validators.min(1), Validators.max(7200)]],
    isPublished: [false],
    translations: this.formBuilder.nonNullable.group({
      en: this.formBuilder.nonNullable.group({
        descriptionShort: ['', [Validators.maxLength(1000)]],
        descriptionLong: ['', [Validators.maxLength(10000)]],
        audioUrl: ['', [Validators.maxLength(500)]]
      }),
      fr: this.formBuilder.nonNullable.group({
        descriptionShort: ['', [Validators.maxLength(1000)]],
        descriptionLong: ['', [Validators.maxLength(10000)]],
        audioUrl: ['', [Validators.maxLength(500)]]
      }),
      es: this.formBuilder.nonNullable.group({
        descriptionShort: ['', [Validators.maxLength(1000)]],
        descriptionLong: ['', [Validators.maxLength(10000)]],
        audioUrl: ['', [Validators.maxLength(500)]]
      }),
      de: this.formBuilder.nonNullable.group({
        descriptionShort: ['', [Validators.maxLength(1000)]],
        descriptionLong: ['', [Validators.maxLength(10000)]],
        audioUrl: ['', [Validators.maxLength(500)]]
      }),
      pl: this.formBuilder.nonNullable.group({
        descriptionShort: ['', [Validators.maxLength(1000)]],
        descriptionLong: ['', [Validators.maxLength(10000)]],
        audioUrl: ['', [Validators.maxLength(500)]]
      })
    })
  });

  readonly catalogCityEditForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    region: ['', [Validators.required, Validators.maxLength(120)]],
    bundlePrice: [0, [Validators.required, Validators.min(0), Validators.max(10000)]],
    heroImage: ['', [Validators.required, Validators.maxLength(500)]],
    isPublished: [false],
    translations: this.formBuilder.nonNullable.group({})
  });

  readonly catalogPoiEditForm = this.formBuilder.nonNullable.group({
    cityId: ['', [Validators.required]],
    name: ['', [Validators.required, Validators.maxLength(180)]],
    address: ['', [Validators.maxLength(240)]],
    lat: [0, [Validators.required, Validators.min(-90), Validators.max(90)]],
    lng: [0, [Validators.required, Validators.min(-180), Validators.max(180)]],
    category: [this.poiCategoryOptions[0], [Validators.required]],
    descriptionShort: ['', [Validators.required, Validators.maxLength(1000)]],
    descriptionLong: ['', [Validators.required, Validators.maxLength(10000)]],
    imageUrl: ['', [Validators.required, Validators.maxLength(500)]],
    audioUrl: ['', [Validators.maxLength(500)]],
    priceSingle: [0, [Validators.required, Validators.min(0), Validators.max(10000)]],
    durationSec: [60, [Validators.required, Validators.min(1), Validators.max(7200)]],
    isPublished: [false],
    translations: this.formBuilder.nonNullable.group({
      en: this.formBuilder.nonNullable.group({
        descriptionShort: ['', [Validators.maxLength(1000)]],
        descriptionLong: ['', [Validators.maxLength(10000)]],
        audioUrl: ['', [Validators.maxLength(500)]]
      }),
      fr: this.formBuilder.nonNullable.group({
        descriptionShort: ['', [Validators.maxLength(1000)]],
        descriptionLong: ['', [Validators.maxLength(10000)]],
        audioUrl: ['', [Validators.maxLength(500)]]
      }),
      es: this.formBuilder.nonNullable.group({
        descriptionShort: ['', [Validators.maxLength(1000)]],
        descriptionLong: ['', [Validators.maxLength(10000)]],
        audioUrl: ['', [Validators.maxLength(500)]]
      }),
      de: this.formBuilder.nonNullable.group({
        descriptionShort: ['', [Validators.maxLength(1000)]],
        descriptionLong: ['', [Validators.maxLength(10000)]],
        audioUrl: ['', [Validators.maxLength(500)]]
      }),
      pl: this.formBuilder.nonNullable.group({
        descriptionShort: ['', [Validators.maxLength(1000)]],
        descriptionLong: ['', [Validators.maxLength(10000)]],
        audioUrl: ['', [Validators.maxLength(500)]]
      })
    })
  });

  readonly poiMapSearchForm = this.formBuilder.nonNullable.group({
    query: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(220)]]
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly auth: AdminAuthService,
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.showDashboardMessagesFromQuery();
    this.auth.ensureAuthenticated().subscribe((isAuthenticated) => {
      this.authChecked = true;
      this.isAuthenticated = isAuthenticated;
      if (isAuthenticated && this.canAccessDashboard) {
        this.syncDashboardDataForCurrentRole();
      }
    });

    this.inviteForm.controls.role.valueChanges.subscribe((role) => {
      if (role === 'admin') {
        this.inviteForm.controls.structureId.setValue(this.noStructureValue);
      }
    });
    this.createUserForm.controls.role.valueChanges.subscribe((role) => {
      if (role === 'admin') {
        this.createUserForm.controls.structureId.setValue(this.noStructureValue);
      }
    });

    this.discountCodeCreateForm.controls.code.valueChanges.subscribe((value) => {
      const normalized = this.normalizeStructureInviteCode(value || '');
      if (normalized !== value) {
        this.discountCodeCreateForm.controls.code.setValue(normalized, { emitEvent: false });
      }
    });
    this.partnerRequestApprovalForm.controls.code.valueChanges.subscribe((value) => {
      const normalized = this.normalizeStructureInviteCode(value || '');
      if (normalized !== value) {
        this.partnerRequestApprovalForm.controls.code.setValue(normalized, { emitEvent: false });
      }
    });
    [
      this.openAiTranslationSettingsForm.controls.ttsModel,
      this.openAiTranslationSettingsForm.controls.ttsVoice,
      this.openAiTranslationSettingsForm.controls.ttsInstructions
    ].forEach((control) => {
      control.valueChanges.subscribe(() => this.cancelOpenAiVoicePreview());
    });

    this.startCreateCatalogCity();
    this.startCreateCatalogPoi();
  }

  get currentEmail(): string {
    return this.auth.user?.email || '';
  }

  get currentName(): string {
    const firstName = this.auth.user?.firstName || '';
    const lastName = this.auth.user?.lastName || '';
    return `${firstName} ${lastName}`.trim();
  }

  get currentUserId(): string {
    return this.auth.user?.id || '';
  }

  get currentRole(): UserRole {
    return this.auth.user?.role || 'facility_manager';
  }

  get canManageUsers(): boolean {
    return this.isAuthenticated && this.auth.isAdmin;
  }

  get canAccessDashboard(): boolean {
    return this.isAuthenticated && (this.currentRole === 'admin' || this.currentRole === 'facility_manager');
  }

  get canViewDiscountCodes(): boolean {
    return this.canManageUsers || this.isFacilityManager;
  }

  get canManagePayPal(): boolean {
    return this.canManageUsers;
  }

  get canManagePartnerEmails(): boolean {
    return this.canManageUsers;
  }

  get canManageGptTranslations(): boolean {
    return this.canManageUsers;
  }

  get canManageGlobalSettings(): boolean {
    return this.canManageUsers;
  }

  get visibleSections(): Array<{ id: DashboardSection; label: string }> {
    if (this.canManageUsers) {
      return this.sections;
    }
    if (this.isFacilityManager) {
      return this.managerSections;
    }
    return [];
  }

  get isFacilityManager(): boolean {
    return this.isAuthenticated && this.currentRole === 'facility_manager';
  }

  get canSavePayPalSettings(): boolean {
    return this.canManagePayPal && !this.savingPayPalSettings && this.payPalForm.valid;
  }

  get canSavePartnerEmailSettings(): boolean {
    return this.canManagePartnerEmails && !this.savingPartnerEmailSettings && this.partnerEmailSettingsForm.valid;
  }

  get partnerEmailPlaceholders(): DashboardPartnerEmailSettings['placeholders'] {
    return this.partnerEmailSettings?.placeholders?.length ? this.partnerEmailSettings.placeholders : DEFAULT_PARTNER_EMAIL_PLACEHOLDERS;
  }

  get canSaveOpenAiTranslationSettings(): boolean {
    return this.canManageGptTranslations && !this.savingOpenAiTranslationSettings && this.openAiTranslationSettingsForm.valid;
  }

  get canPreviewOpenAiVoice(): boolean {
    return (
      this.canManageGptTranslations &&
      Boolean(this.openAiTranslationSettings?.hasApiKey) &&
      this.openAiTranslationSettingsForm.controls.ttsModel.valid &&
      this.openAiTranslationSettingsForm.controls.ttsVoice.valid &&
      this.openAiTranslationSettingsForm.controls.ttsInstructions.valid &&
      !this.previewingOpenAiVoice &&
      !this.savingOpenAiTranslationSettings
    );
  }

  get canSavePrivacyPolicySettings(): boolean {
    return this.canManageGlobalSettings && !this.loadingPrivacyPolicySettings && !this.savingPrivacyPolicySettings;
  }

  get canBumpAppCacheVersion(): boolean {
    return this.canManageGlobalSettings && !this.loadingAppCacheSettings && !this.bumpingAppCacheVersion;
  }

  get configuredPrivacyPolicyLanguagesCount(): number {
    return this.privacyPolicyLanguages.filter(({ code }) => this.hasPrivacyPolicyContent(code)).length;
  }

  get selectedPrivacyPolicyLanguageLabel(): string {
    return this.privacyPolicyLanguages.find((language) => language.code === this.privacyPolicySelectedLanguage)?.label || 'Italiano';
  }

  get hasItalianPrivacyPolicyContent(): boolean {
    return this.hasPrivacyPolicyContent('it');
  }

  get canTranslatePrivacyPolicy(): boolean {
    return (
      this.canManageGlobalSettings &&
      Boolean(this.openAiTranslationSettings?.hasApiKey) &&
      this.hasItalianPrivacyPolicyContent &&
      !this.loadingPrivacyPolicySettings &&
      !this.savingPrivacyPolicySettings &&
      !this.translatingPrivacyPolicy
    );
  }

  get selectedGptTranslationLanguageLabel(): string {
    const selected = this.gptTranslationForm.controls.targetLanguage.value;
    return this.contentLanguages.find((language) => language.code === selected)?.label || selected.toUpperCase();
  }

  get selectedGptAudioLanguageLabel(): string {
    const selected = this.gptAudioForm.controls.targetLanguage.value;
    return this.audioLanguages.find((language) => language.code === selected)?.label || selected.toUpperCase();
  }

  get selectedGptStatusLanguage(): AudioEditorLanguage {
    return this.activeGptTranslationsTab === 'audio'
      ? this.gptAudioForm.controls.targetLanguage.value
      : this.gptTranslationForm.controls.targetLanguage.value;
  }

  get selectedGptStatusLanguageLabel(): string {
    return this.activeGptTranslationsTab === 'audio' ? this.selectedGptAudioLanguageLabel : this.selectedGptTranslationLanguageLabel;
  }

  get selectedGptStatusCityId(): string {
    return this.activeGptTranslationsTab === 'audio'
      ? this.gptAudioForm.controls.cityId.value || this.selectedCatalogCityId
      : this.gptTranslationForm.controls.cityId.value || this.selectedCatalogCityId;
  }

  get selectedGptTranslationCityLabel(): string {
    const cityId = this.selectedGptStatusCityId;
    return this.catalogCities.find((city) => city.id === cityId)?.name || 'nessuna citta selezionata';
  }

  get hasOpenAiGlobalSummary(): boolean {
    return Boolean(this.openAiTranslationSummary);
  }

  get gptGlobalTotalPoisCount(): number {
    return Number(this.openAiTranslationSummary?.totalPois || 0);
  }

  get gptGlobalTranslationMissingCount(): number {
    return Number(this.openAiTranslationSummary?.textMissingPois || 0);
  }

  get gptGlobalTranslationCompleteCount(): number {
    return Number(this.openAiTranslationSummary?.textCompletePois || 0);
  }

  get gptGlobalAudioMissingCount(): number {
    return Number(this.openAiTranslationSummary?.audioMissingPois || 0);
  }

  get gptGlobalAudioGenerableMissingCount(): number {
    return Number(this.openAiTranslationSummary?.audioGenerableMissingPois || 0);
  }

  get gptGlobalAudioReadyCount(): number {
    return Number(this.openAiTranslationSummary?.audioReadyPois || 0);
  }

  get gptTranslationProgressPercent(): number {
    if (!this.gptTranslationProgressTotal) {
      return 0;
    }
    return Math.min(100, Math.round((this.gptTranslationProgressDone / this.gptTranslationProgressTotal) * 100));
  }

  get gptAudioProgressPercent(): number {
    if (!this.gptAudioProgressTotal) {
      return 0;
    }
    return Math.min(100, Math.round((this.gptAudioProgressDone / this.gptAudioProgressTotal) * 100));
  }

  get gptTranslationMissingCount(): number {
    return this.openAiTranslationStatusRows.filter((row) => !row.isComplete).length;
  }

  get gptTranslationCompleteCount(): number {
    return this.openAiTranslationStatusRows.filter((row) => row.isComplete).length;
  }

  get gptAudioMissingCount(): number {
    return this.openAiTranslationStatusRows.filter((row) => !row.hasAudio).length;
  }

  get gptAudioGenerableMissingCount(): number {
    return this.openAiTranslationStatusRows.filter((row) => this.isPoiTranslationTextReady(row.translation) && !row.hasAudio).length;
  }

  get gptAudioReadyCount(): number {
    return this.openAiTranslationStatusRows.filter((row) => Boolean(row.hasAudio)).length;
  }

  get selectedGptTranslationPoi(): DashboardCatalogPoi | null {
    const selectedPoiId =
      (this.activeGptTranslationsTab === 'audio' ? this.gptAudioForm.controls.poiId.value : this.gptTranslationForm.controls.poiId.value) ||
      this.selectedGptTranslationPoiId;
    if (!selectedPoiId) {
      return null;
    }
    return this.catalogPois.find((poi) => poi.id === selectedPoiId) || null;
  }

  get selectedGptTranslationPoiTargetFields(): PoiTranslationFields {
    const poi = this.selectedGptTranslationPoi;
    const language = this.selectedGptStatusLanguage;
    if (poi && language === 'it') {
      return {
        descriptionShort: poi.descriptionShort,
        descriptionLong: poi.descriptionLong,
        audioUrl: poi.audioUrl
      };
    }
    return poi?.translations?.[language] || {};
  }

  get selectedGptTranslationPoiHasText(): boolean {
    return this.isPoiTranslationTextReady(this.selectedGptTranslationPoiTargetFields);
  }

  get selectedGptTranslationPoiAudioUrl(): string {
    return String(this.selectedGptTranslationPoiTargetFields.audioUrl || '').trim();
  }

  get canTranslateSelectedGptPoi(): boolean {
    return (
      this.canManageGptTranslations &&
      this.activeGptTranslationsTab === 'texts' &&
      Boolean(this.openAiTranslationSettings?.hasApiKey) &&
      Boolean(this.selectedGptTranslationPoi) &&
      !this.loadingCatalogPois &&
      !this.loadingOpenAiTranslationStatus &&
      !this.bulkTranslatingPois &&
      !this.bulkGeneratingPoiAudios &&
      !this.translatingPoiId &&
      !this.generatingPoiAudioId
    );
  }

  get hasActiveGptTranslation(): boolean {
    return this.bulkTranslatingPois || this.bulkGeneratingPoiAudios || Boolean(this.translatingPoiId) || Boolean(this.generatingPoiAudioId);
  }

  get canTranslateMissingGptPois(): boolean {
    return (
      this.canManageGptTranslations &&
      this.activeGptTranslationsTab === 'texts' &&
      Boolean(this.openAiTranslationSettings?.hasApiKey) &&
      Boolean(this.gptTranslationForm.controls.cityId.value) &&
      this.gptTranslationMissingCount > 0 &&
      !this.loadingOpenAiTranslationStatus &&
      !this.loadingCatalogPois &&
      !this.bulkTranslatingPois &&
      !this.bulkGeneratingPoiAudios &&
      !this.translatingPoiId &&
      !this.generatingPoiAudioId
    );
  }

  get canGenerateSelectedGptPoiAudio(): boolean {
    return (
      this.canManageGptTranslations &&
      this.activeGptTranslationsTab === 'audio' &&
      Boolean(this.openAiTranslationSettings?.hasApiKey) &&
      Boolean(this.selectedGptTranslationPoi) &&
      this.selectedGptTranslationPoiHasText &&
      (!this.selectedGptTranslationPoiAudioUrl || this.gptAudioForm.controls.overwrite.value) &&
      !this.loadingCatalogPois &&
      !this.loadingOpenAiTranslationStatus &&
      !this.bulkTranslatingPois &&
      !this.bulkGeneratingPoiAudios &&
      !this.translatingPoiId &&
      !this.generatingPoiAudioId
    );
  }

  get gptAudioRowsToGenerate(): OpenAiPoiTranslationStatus[] {
    const overwrite = this.gptAudioForm.controls.overwrite.value;
    return this.openAiTranslationStatusRows.filter((row) => {
      return this.isPoiTranslationTextReady(row.translation) && (overwrite || !row.hasAudio);
    });
  }

  ngOnDestroy(): void {
    this.cancelOpenAiVoicePreview();
  }

  get canGenerateMissingGptPoiAudios(): boolean {
    return (
      this.canManageGptTranslations &&
      this.activeGptTranslationsTab === 'audio' &&
      Boolean(this.openAiTranslationSettings?.hasApiKey) &&
      Boolean(this.gptAudioForm.controls.cityId.value) &&
      this.gptAudioRowsToGenerate.length > 0 &&
      !this.loadingOpenAiTranslationStatus &&
      !this.loadingCatalogPois &&
      !this.bulkTranslatingPois &&
      !this.bulkGeneratingPoiAudios &&
      !this.translatingPoiId &&
      !this.generatingPoiAudioId
    );
  }

  get canGenerateCatalogGptPoiAudios(): boolean {
    const availableCount = this.gptAudioForm.controls.overwrite.value ? this.gptGlobalTotalPoisCount : this.gptGlobalAudioGenerableMissingCount;
    return (
      this.canManageGptTranslations &&
      this.activeGptTranslationsTab === 'audio' &&
      Boolean(this.openAiTranslationSettings?.hasApiKey) &&
      this.catalogCities.length > 0 &&
      availableCount > 0 &&
      !this.loadingOpenAiTranslationSummary &&
      !this.loadingCatalogCities &&
      !this.bulkTranslatingPois &&
      !this.bulkGeneratingPoiAudios &&
      !this.translatingPoiId &&
      !this.generatingPoiAudioId
    );
  }

  get canGenerateAllGptPoiAudios(): boolean {
    return (
      this.canManageGptTranslations &&
      this.activeGptTranslationsTab === 'audio' &&
      Boolean(this.openAiTranslationSettings?.hasApiKey) &&
      this.catalogCities.length > 0 &&
      !this.loadingCatalogCities &&
      !this.bulkTranslatingPois &&
      !this.bulkGeneratingPoiAudios &&
      !this.translatingPoiId &&
      !this.generatingPoiAudioId
    );
  }

  get payPalStatusLabel(): string {
    const status = this.payPalSettings?.lastVerificationStatus || 'incomplete';
    if (status === 'valid') {
      return 'Connessione valida';
    }
    if (status === 'invalid') {
      return 'Connessione non valida';
    }
    if (status === 'pending') {
      return 'Da verificare';
    }
    return 'Configurazione incompleta';
  }

  get isImpersonating(): boolean {
    return this.isAuthenticated && this.auth.isImpersonating;
  }

  get impersonatedByEmail(): string {
    return this.auth.session?.session.impersonatedBy?.email || '';
  }

  get totalUsers(): number {
    return this.usersForDisplay.length;
  }

  get totalStructures(): number {
    return this.structures.length;
  }

  get usersForDisplay(): DashboardUserRow[] {
    if (!this.selectedUsersStructureFilterId) {
      return this.users;
    }
    return this.users.filter((user) => this.userHasStructureAssociation(user, this.selectedUsersStructureFilterId || ''));
  }

  get isUsersStructureFilterActive(): boolean {
    return !!this.selectedUsersStructureFilterId;
  }

  get usersStructureFilterName(): string {
    if (!this.selectedUsersStructureFilterId) {
      return '';
    }
    const structure = this.structures.find((item) => item.id === this.selectedUsersStructureFilterId);
    return structure?.name || this.selectedUsersStructureFilterId;
  }

  get totalAssociatedUsers(): number {
    return this.associatedUsers.length;
  }

  get totalPayments(): number {
    return this.paymentsSummary.totalPayments;
  }

  get totalPartnerRequests(): number {
    return this.partnerRequests.length;
  }

  get pendingPartnerRequests(): number {
    return this.partnerRequests.filter((request) => request.status === 'pending').length;
  }

  get approvedPartnerRequests(): number {
    return this.partnerRequests.filter((request) => request.status === 'approved').length;
  }

  get sentPartnerRequestPdfs(): number {
    return this.partnerRequests.filter((request) => request.pdfReleaseStatus === 'sent').length;
  }

  get totalStructureEarnings(): number {
    return this.paymentsSummary.totalStructureEarnings;
  }

  get managerStructureName(): string {
    return this.auth.user?.structureName || 'Nessuna struttura assegnata';
  }

  get managedStructureId(): string | null {
    return this.auth.user?.structureId || null;
  }

  get editingDiscountCode(): DashboardDiscountCode | null {
    if (!this.editingDiscountCodeId) {
      return null;
    }
    return this.discountCodes.find((item) => item.id === this.editingDiscountCodeId) || null;
  }

  get discountCodeCreateScopeLabel(): string {
    return this.discountCodeCreateForm.controls.applyTo.value === 'bundle' ? 'città' : 'luogo';
  }

  get discountCodeEditScopeLabel(): string {
    return this.discountCodeEditForm.controls.applyTo.value === 'bundle' ? 'città' : 'luogo';
  }

  get isInviteStructureRequired(): boolean {
    return this.inviteForm.controls.role.value !== 'admin';
  }

  get isInviteStructureMissing(): boolean {
    if (!this.isInviteStructureRequired) {
      return false;
    }

    const selectedStructureId = this.inviteForm.controls.structureId.value;
    return !this.structures.length || !selectedStructureId || selectedStructureId === this.noStructureValue;
  }

  get canSubmitInvite(): boolean {
    if (this.inviting || this.inviteForm.invalid) {
      return false;
    }

    return !this.isInviteStructureMissing;
  }

  get isCreateUserStructureRequired(): boolean {
    return this.createUserForm.controls.role.value === 'facility_manager';
  }

  get isCreateUserStructureVisible(): boolean {
    return this.createUserForm.controls.role.value !== 'admin';
  }

  get isCreateUserStructureMissing(): boolean {
    if (!this.isCreateUserStructureRequired) {
      return false;
    }

    const selectedStructureId = this.createUserForm.controls.structureId.value;
    return !this.structures.length || !selectedStructureId || selectedStructureId === this.noStructureValue;
  }

  get canSubmitCreateUser(): boolean {
    if (this.creatingUser || this.createUserForm.invalid) {
      return false;
    }

    return !this.isCreateUserStructureMissing;
  }

  get canManageCatalog(): boolean {
    return this.canManageUsers;
  }

  get canSaveCatalogCity(): boolean {
    return this.canManageCatalog && !this.savingCatalogCity && !this.uploadingCatalogCityImage && this.catalogCityForm.valid;
  }

  get canSaveCatalogCityEdit(): boolean {
    return (
      this.canManageCatalog &&
      !!this.editingCatalogCityId &&
      !this.savingCatalogCity &&
      !this.uploadingCatalogCityEditImage &&
      this.catalogCityEditForm.valid
    );
  }

  get canSaveCatalogPoi(): boolean {
    return (
      this.canManageCatalog &&
      !this.savingCatalogPoi &&
      !this.uploadingCatalogAudio &&
      !this.uploadingCatalogImage &&
      !this.hasCatalogPoiTranslationAudioUploadInProgress('create') &&
      this.catalogPoiForm.valid
    );
  }

  get canSaveCatalogPoiEdit(): boolean {
    return (
      this.canManageCatalog &&
      !!this.editingCatalogPoiId &&
      !this.savingCatalogPoi &&
      !this.uploadingCatalogPoiEditImage &&
      !this.uploadingCatalogPoiEditAudio &&
      !this.hasCatalogPoiTranslationAudioUploadInProgress('edit') &&
      this.catalogPoiEditForm.valid
    );
  }

  catalogPublicationStatusLabel(status: CatalogPublicationStatus | null | undefined): string {
    return status === 'draft' ? 'Bozza' : 'Pubblicato';
  }

  catalogPublicationStatusClass(status: CatalogPublicationStatus | null | undefined): string {
    return status === 'draft' ? 'draft' : 'published';
  }

  private isCatalogItemPublished(status: CatalogPublicationStatus | null | undefined): boolean {
    return status !== 'draft';
  }

  get canSaveStructureEdit(): boolean {
    return this.canManageUsers && !!this.editingStructureId && !this.updatingStructure && this.structureEditForm.valid;
  }

  get hasPoiMapSelection(): boolean {
    return this.mapPickerSelectedLat !== null && this.mapPickerSelectedLng !== null;
  }

  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(event: BeforeUnloadEvent): void {
    if (!this.hasActiveGptTranslation) {
      return;
    }

    event.preventDefault();
    event.returnValue = '';
  }

  async selectSection(section: DashboardSection): Promise<void> {
    if (!this.visibleSections.some((item) => item.id === section)) {
      return;
    }
    if (section !== this.activeSection && !(await this.confirmGptTranslationContextChange())) {
      return;
    }
    if (section !== this.activeSection) {
      this.cancelActiveGptTranslationForContextChange();
    }

    this.activeSection = section;
    this.storeActiveSection(section);
    if (section !== 'users') {
      this.showInviteSection = false;
      this.showCreateUserSection = false;
    }
    if (section !== 'structures') {
      this.showStructureSection = false;
      this.cancelStructureEdit();
    }
    if (section !== 'discounts') {
      this.savingDiscountCodeId = null;
      this.previewingDiscountCodeId = null;
      this.deletingDiscountCodeId = null;
      this.highlightedDiscountCodeId = null;
      this.highlightedDiscountStructureId = null;
      this.closeCreateDiscountCodeDialog();
      this.closeEditDiscountCodeDialog();
    }
    if (section !== 'partnerRequests') {
      this.closePartnerRequestApprovalDialog();
      this.rejectingPartnerRequestId = null;
      this.deletingPartnerRequestId = null;
      this.previewingPartnerRequestId = null;
    }
    if (section !== 'catalog') {
      this.closeCreateCatalogCityDialog();
      this.closeCreateCatalogPoiDialog();
    }
    if (section !== 'gptTranslations') {
      this.translatingPoiId = null;
      this.generatingPoiAudioId = null;
    }
    if (section === 'payments' && this.canAccessDashboard) {
      this.loadPayments();
    } else if (section === 'partnerRequests' && this.canManageUsers) {
      this.loadPartnerRequests();
    } else if (section === 'partnerEmails' && this.canManagePartnerEmails) {
      this.loadPartnerEmailSettings();
    } else if (section === 'paypal' && this.canManagePayPal) {
      this.loadPayPalSettings();
    } else if (section === 'gptTranslations' && this.canManageGptTranslations) {
      this.ensureGptTranslationsLoaded();
    } else if (section === 'globalSettings' && this.canManageGlobalSettings) {
      this.ensureGlobalSettingsLoaded();
    } else if (section === 'discounts' && this.canViewDiscountCodes) {
      this.loadDiscountCodes();
    } else if (section === 'structures' && this.canManageUsers) {
      this.loadDiscountCodes();
    } else if (section === 'catalog' && this.canManageCatalog) {
      this.ensureCatalogLoaded();
    } else {
      this.closeCreateCatalogCityDialog();
      this.closeCreateCatalogPoiDialog();
      this.closeCatalogCityEditDialog();
      this.closeCatalogPoiEditDialog();
      this.closePoiMapPicker();
    }
  }

  private ensureActiveSectionAllowed(): void {
    if (!this.visibleSections.length) {
      return;
    }
    if (this.visibleSections.some((section) => section.id === this.activeSection)) {
      return;
    }
    this.activeSection = this.visibleSections[0].id;
    this.storeActiveSection(this.activeSection);
  }

  private syncDashboardDataForCurrentRole(): void {
    this.ensureActiveSectionAllowed();
    this.selectedUsersStructureFilterId = null;

    if (!this.canAccessDashboard) {
      return;
    }

    if (this.canManageUsers) {
      this.refreshAll();
      return;
    }

    if (this.isFacilityManager) {
      this.loadAssociatedUsers();
      this.loadPayments();
      this.loadDiscountCodes();
    }
  }

  selectCatalogTab(tab: CatalogTab): void {
    this.catalogTab = tab;
    if (tab === 'pois') {
      this.ensureCatalogLoaded();
    }
  }

  toggleInviteSection(): void {
    this.showInviteSection = !this.showInviteSection;
    if (this.showInviteSection) {
      this.showCreateUserSection = false;
    }
  }

  toggleCreateUserSection(): void {
    this.showCreateUserSection = !this.showCreateUserSection;
    if (this.showCreateUserSection) {
      this.showInviteSection = false;
    }
  }

  toggleStructureSection(): void {
    this.showStructureSection = !this.showStructureSection;
    if (this.showStructureSection) {
      this.cancelStructureEdit();
    }
  }

  toggleCatalogCityCreateSection(): void {
    if (!this.canManageCatalog || !this.createCatalogCityDialog) {
      return;
    }

    this.startCreateCatalogCity();
    this.createCatalogCityDialogRef?.close();
    this.createCatalogCityDialogRef = this.dialog.open(this.createCatalogCityDialog, {
      width: '900px',
      maxWidth: '95vw'
    });
    this.createCatalogCityDialogRef.afterClosed().subscribe(() => {
      this.createCatalogCityDialogRef = undefined;
      this.uploadingCatalogCityImage = false;
      this.startCreateCatalogCity();
    });
  }

  toggleCatalogPoiCreateSection(): void {
    if (!this.canManageCatalog || !this.createCatalogPoiDialog) {
      return;
    }

    this.ensureCatalogLoaded();
    this.startCreateCatalogPoi();
    this.createCatalogPoiDialogRef?.close();
    this.createCatalogPoiDialogRef = this.dialog.open(this.createCatalogPoiDialog, {
      width: '980px',
      maxWidth: '96vw'
    });
    this.createCatalogPoiDialogRef.afterClosed().subscribe(() => {
      this.createCatalogPoiDialogRef = undefined;
      this.uploadingCatalogImage = false;
      this.uploadingCatalogAudio = false;
      this.startCreateCatalogPoi();
    });
  }

  closeCreateCatalogCityDialog(): void {
    this.createCatalogCityDialogRef?.close();
    this.createCatalogCityDialogRef = undefined;
    this.uploadingCatalogCityImage = false;
    this.startCreateCatalogCity();
  }

  closeCreateCatalogPoiDialog(): void {
    this.createCatalogPoiDialogRef?.close();
    this.createCatalogPoiDialogRef = undefined;
    this.uploadingCatalogImage = false;
    this.uploadingCatalogAudio = false;
    this.startCreateCatalogPoi();
  }

  openPoiMapPicker(target: PoiMapPickerTarget): void {
    if (!this.canManageCatalog || !this.poiMapPickerDialog) {
      return;
    }

    const targetForm = target === 'edit' ? this.catalogPoiEditForm : this.catalogPoiForm;
    const targetLat = Number(targetForm.controls.lat.value);
    const targetLng = Number(targetForm.controls.lng.value);

    this.mapPickerTarget = target;
    this.mapPickerResults = [];
    this.mapPickerLoading = false;
    this.mapPickerMapReady = false;
    this.mapPickerTargetLabel = '';
    this.mapPickerSelectedLat = Number.isFinite(targetLat) ? targetLat : 41.902782;
    this.mapPickerSelectedLng = Number.isFinite(targetLng) ? targetLng : 12.496366;
    this.poiMapSearchForm.reset({ query: '' });

    this.poiMapPickerDialogRef?.close();
    this.poiMapPickerDialogRef = this.dialog.open(this.poiMapPickerDialog, {
      width: '960px',
      maxWidth: '96vw'
    });
    this.poiMapPickerDialogRef.afterOpened().subscribe(() => {
      void this.initializePoiMap();
    });
    this.poiMapPickerDialogRef.afterClosed().subscribe(() => {
      this.destroyPoiMap();
    });
  }

  closePoiMapPicker(): void {
    this.poiMapPickerDialogRef?.close();
    this.poiMapPickerDialogRef = undefined;
    this.mapPickerTarget = null;
    this.mapPickerLoading = false;
    this.mapPickerMapReady = false;
    this.mapPickerResults = [];
    this.mapPickerTargetLabel = '';
    this.mapPickerSelectedLat = null;
    this.mapPickerSelectedLng = null;
    this.destroyPoiMap();
    this.poiMapSearchForm.reset({ query: '' });
  }

  searchPoiMap(): void {
    if (this.poiMapSearchForm.invalid || this.mapPickerLoading) {
      this.poiMapSearchForm.markAllAsTouched();
      return;
    }

    const query = this.poiMapSearchForm.controls.query.value.trim();
    if (!query) {
      return;
    }

    const endpoint = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=10&accept-language=it&q=${encodeURIComponent(query)}`;
    this.mapPickerLoading = true;
    fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Ricerca mappa non disponibile');
        }
        return response.json() as Promise<Array<{ display_name?: string; lat?: string; lon?: string }>>;
      })
      .then((rows) => {
        this.mapPickerResults = (rows || [])
          .map((row) => {
            const lat = Number(row.lat);
            const lng = Number(row.lon);
            if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
              return null;
            }
            return {
              displayName: (row.display_name || '').trim() || `${lat}, ${lng}`,
              lat,
              lng,
              osmUrl: `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`
            } as PoiMapSearchResult;
          })
          .filter((row): row is PoiMapSearchResult => !!row);

        if (this.mapPickerResults.length) {
          this.selectPoiMapResult(this.mapPickerResults[0]);
        }
      })
      .catch((error: { message?: string }) => {
        this.mapPickerResults = [];
        const message = error?.message || 'Errore durante la ricerca del luogo';
        this.snackBar.open(message, 'Chiudi', { duration: 3500 });
      })
      .finally(() => {
        this.mapPickerLoading = false;
      });
  }

  selectPoiMapResult(result: PoiMapSearchResult): void {
    this.mapPickerTargetLabel = result.displayName;
    this.mapPickerSelectedLat = result.lat;
    this.mapPickerSelectedLng = result.lng;
    this.updatePoiMapMarker(result.lat, result.lng, true);
  }

  usePoiMapResult(result: PoiMapSearchResult): void {
    this.selectPoiMapResult(result);
    this.confirmPoiMapSelection();
  }

  confirmPoiMapSelection(): void {
    if (!this.hasPoiMapSelection) {
      return;
    }

    const selectedLat = Number(this.mapPickerSelectedLat);
    const selectedLng = Number(this.mapPickerSelectedLng);
    const targetForm = this.mapPickerTarget === 'edit' ? this.catalogPoiEditForm : this.catalogPoiForm;
    targetForm.controls.lat.setValue(selectedLat);
    targetForm.controls.lng.setValue(selectedLng);
    targetForm.controls.lat.markAsDirty();
    targetForm.controls.lng.markAsDirty();
    targetForm.controls.lat.markAsTouched();
    targetForm.controls.lng.markAsTouched();
    this.closePoiMapPicker();
    this.snackBar.open(`Coordinate impostate: ${selectedLat.toFixed(6)}, ${selectedLng.toFixed(6)}`, 'OK', { duration: 2400 });
  }

  login(): void {
    if (this.loginForm.invalid || this.loggingIn) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loggingIn = true;
    const { email, password } = this.loginForm.getRawValue();
    this.auth.login(email, password).subscribe({
      next: () => {
        this.loggingIn = false;
        this.isAuthenticated = true;
        this.authChecked = true;
        this.loginForm.reset();
        if (this.canAccessDashboard) {
          this.syncDashboardDataForCurrentRole();
        }
      },
      error: (error: { error?: { message?: string } }) => {
        this.loggingIn = false;
        const message = error?.error?.message || 'Login non riuscito';
        this.snackBar.open(message, 'Chiudi', { duration: 3200 });
      }
    });
  }

  toggleLoginPasswordVisibility(): void {
    this.showLoginPassword = !this.showLoginPassword;
  }

  invite(): void {
    if (!this.canManageUsers) {
      return;
    }

    if (this.inviteForm.invalid || this.inviting) {
      this.inviteForm.markAllAsTouched();
      return;
    }

    const { firstName, lastName, email, role, structureId } = this.inviteForm.getRawValue();

    if (role !== 'admin' && !this.structures.length) {
      this.inviteForm.controls.structureId.markAsTouched();
      this.snackBar.open('Devi prima registrare almeno una struttura per invitare un gestore', 'Chiudi', {
        duration: 3500
      });
      return;
    }

    const normalizedStructureId = structureId === this.noStructureValue ? undefined : structureId;
    if (role !== 'admin' && !normalizedStructureId) {
      this.inviteForm.controls.structureId.markAsTouched();
      this.snackBar.open('Per un gestore devi selezionare una struttura', 'Chiudi', { duration: 3200 });
      return;
    }

    this.inviting = true;
    this.auth.inviteUser(firstName, lastName, email, role, window.location.origin, normalizedStructureId).subscribe({
      next: (response) => {
        this.inviting = false;
        this.lastInvite = response;
        this.inviteForm.reset({
          firstName: '',
          lastName: '',
          email: '',
          role: 'facility_manager',
          structureId: this.noStructureValue
        });
        this.showInviteSection = false;
        this.snackBar.open(`Invito inviato a ${this.displayName(response.firstName, response.lastName, response.email)}`, 'OK', {
          duration: 3200
        });
        this.refreshAll();
      },
      error: (error: { error?: { message?: string } }) => {
        this.inviting = false;
        const message = error?.error?.message || 'Errore durante invio invito';
        this.snackBar.open(message, 'Chiudi', { duration: 3500 });
      }
    });
  }

  createUser(): void {
    if (!this.canManageUsers) {
      return;
    }

    if (this.createUserForm.invalid || this.creatingUser) {
      this.createUserForm.markAllAsTouched();
      return;
    }

    const { firstName, lastName, email, password, role, structureId } = this.createUserForm.getRawValue();

    if (role === 'facility_manager' && !this.structures.length) {
      this.createUserForm.controls.structureId.markAsTouched();
      this.snackBar.open('Devi prima registrare almeno una struttura per creare un gestore', 'Chiudi', {
        duration: 3500
      });
      return;
    }

    const normalizedStructureId = structureId === this.noStructureValue ? undefined : structureId;
    if (role === 'facility_manager' && !normalizedStructureId) {
      this.createUserForm.controls.structureId.markAsTouched();
      this.snackBar.open('Per un gestore devi selezionare una struttura', 'Chiudi', { duration: 3200 });
      return;
    }

    const finalStructureId = role === 'admin' ? undefined : normalizedStructureId;

    this.creatingUser = true;
    this.auth
      .createUser(firstName.trim(), lastName.trim(), email.trim(), password, role, finalStructureId)
      .subscribe({
        next: (createdUser) => {
          this.creatingUser = false;
          this.createUserForm.reset({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            role: 'user',
            structureId: this.noStructureValue
          });
          this.showCreateUserSection = false;
          this.snackBar.open(
            `Utente creato: ${this.displayName(createdUser.firstName, createdUser.lastName, createdUser.email)}`,
            'OK',
            { duration: 3200 }
          );
          this.refreshAll();
        },
        error: (error: { error?: { message?: string } }) => {
          this.creatingUser = false;
          const message = error?.error?.message || 'Errore creazione utente';
          this.snackBar.open(message, 'Chiudi', { duration: 3500 });
        }
      });
  }

  loadUsers(): void {
    if (!this.canManageUsers || this.loadingUsers) {
      return;
    }

    this.loadingUsers = true;
    this.auth.listUsers().subscribe({
      next: (rows) => {
        this.loadingUsers = false;
        this.users = rows.map((row) => ({
          ...row,
          associatedStructures: Array.isArray(row.associatedStructures) ? row.associatedStructures : [],
          unlockedCities: Array.isArray(row.unlockedCities) ? row.unlockedCities : [],
          unlockedPois: Array.isArray(row.unlockedPois) ? row.unlockedPois : [],
          unlockedCitiesCount: Number(row.unlockedCitiesCount || 0),
          unlockedPoisCount: Number(row.unlockedPoisCount || 0)
        }));
      },
      error: (error: { error?: { message?: string } }) => {
        this.loadingUsers = false;
        const message = error?.error?.message || 'Errore caricamento utenti';
        this.snackBar.open(message, 'Chiudi', { duration: 3500 });
      }
    });
  }

  loadStructures(): void {
    if (!this.canManageUsers || this.loadingStructures) {
      return;
    }

    this.loadingStructures = true;
    this.auth.listStructures().subscribe({
      next: (rows) => {
        this.loadingStructures = false;
        this.structures = rows;
        const selectedDiscountStructureId = this.discountCodeCreateForm.controls.structureId.value;
        if (!selectedDiscountStructureId && rows.length) {
          this.discountCodeCreateForm.controls.structureId.setValue(rows[0].id);
        } else if (selectedDiscountStructureId && !rows.some((item) => item.id === selectedDiscountStructureId)) {
          this.discountCodeCreateForm.controls.structureId.setValue(rows[0]?.id || '');
        }
        if (this.editingStructureId && !rows.some((structure) => structure.id === this.editingStructureId)) {
          this.cancelStructureEdit();
        }
        if (
          this.selectedUsersStructureFilterId &&
          !rows.some((structure) => structure.id === this.selectedUsersStructureFilterId)
        ) {
          this.selectedUsersStructureFilterId = null;
        }
        if (this.selectedPaymentsStructureId && !rows.some((structure) => structure.id === this.selectedPaymentsStructureId)) {
          this.selectedPaymentsStructureId = '';
        }
        if (this.activeSection === 'discounts' || this.activeSection === 'structures') {
          this.loadDiscountCodes();
        }
      },
      error: (error: { error?: { message?: string } }) => {
        this.loadingStructures = false;
        const message = error?.error?.message || 'Errore caricamento strutture';
        this.snackBar.open(message, 'Chiudi', { duration: 3500 });
      }
    });
  }

  loadAssociatedUsers(): void {
    if (!this.isFacilityManager || this.loadingAssociatedUsers) {
      return;
    }

    this.loadingAssociatedUsers = true;
    this.auth.listAssociatedUsers().subscribe({
      next: (rows) => {
        this.loadingAssociatedUsers = false;
        this.associatedUsers = rows;
      },
      error: (error: { error?: { message?: string } }) => {
        this.loadingAssociatedUsers = false;
        const message = error?.error?.message || 'Errore caricamento utenti associati';
        this.snackBar.open(message, 'Chiudi', { duration: 3500 });
      }
    });
  }

  loadPayments(): void {
    if (!this.canAccessDashboard || this.loadingPayments) {
      return;
    }

    const structureIdFilter = this.canManageUsers ? this.selectedPaymentsStructureId || undefined : undefined;
    this.loadingPayments = true;
    this.auth.listPayments(structureIdFilter).subscribe({
      next: (response) => {
        this.loadingPayments = false;
        this.payments = response?.items || [];
        this.paymentsSummary = response?.summary || {
          totalPayments: 0,
          totalCollected: 0,
          totalDiscountAmount: 0,
          totalStructureEarnings: 0
        };
      },
      error: (error: { error?: { message?: string } }) => {
        this.loadingPayments = false;
        const message = error?.error?.message || 'Errore caricamento pagamenti';
        this.snackBar.open(message, 'Chiudi', { duration: 3500 });
      }
    });
  }

  loadPartnerRequests(): void {
    if (!this.canManageUsers || this.loadingPartnerRequests) {
      return;
    }

    this.loadingPartnerRequests = true;
    this.auth.listPartnerRequests().subscribe({
      next: (rows) => {
        this.loadingPartnerRequests = false;
        this.partnerRequests = this.sortPartnerRequests(rows || []);
      },
      error: (error: { error?: { message?: string } }) => {
        this.loadingPartnerRequests = false;
        const message = error?.error?.message || 'Errore caricamento richieste partner';
        this.snackBar.open(message, 'Chiudi', { duration: 3500 });
      }
    });
  }

  loadPartnerEmailSettings(force = false): void {
    if (!this.canManagePartnerEmails || this.loadingPartnerEmailSettings) {
      return;
    }
    if (this.partnerEmailSettings && !force) {
      return;
    }

    this.loadingPartnerEmailSettings = true;
    this.auth.getPartnerEmailSettings().subscribe({
      next: (settings) => {
        this.loadingPartnerEmailSettings = false;
        this.partnerEmailSettings = settings;
        this.partnerEmailSettingsForm.reset({
          approvalSubject: settings.approvalSubject || '',
          approvalBody: settings.approvalBody || '',
          rejectionSubject: settings.rejectionSubject || '',
          rejectionBody: settings.rejectionBody || ''
        });
      },
      error: (error: { error?: { message?: string } }) => {
        this.loadingPartnerEmailSettings = false;
        const message = error?.error?.message || 'Errore caricamento template email partner';
        this.snackBar.open(message, 'Chiudi', { duration: 3500 });
      }
    });
  }

  savePartnerEmailSettings(): void {
    if (!this.canSavePartnerEmailSettings) {
      this.partnerEmailSettingsForm.markAllAsTouched();
      return;
    }

    const formValue = this.partnerEmailSettingsForm.getRawValue();
    const payload: PartnerEmailSettingsInput = {
      approvalSubject: formValue.approvalSubject.trim(),
      approvalBody: formValue.approvalBody.trim(),
      rejectionSubject: formValue.rejectionSubject.trim(),
      rejectionBody: formValue.rejectionBody.trim()
    };

    this.savingPartnerEmailSettings = true;
    this.auth.updatePartnerEmailSettings(payload).subscribe({
      next: (settings) => {
        this.savingPartnerEmailSettings = false;
        this.partnerEmailSettings = settings;
        this.partnerEmailSettingsForm.reset({
          approvalSubject: settings.approvalSubject || '',
          approvalBody: settings.approvalBody || '',
          rejectionSubject: settings.rejectionSubject || '',
          rejectionBody: settings.rejectionBody || ''
        });
        this.snackBar.open('Template email partner salvati', 'OK', { duration: 2400 });
      },
      error: (error: { error?: { message?: string } }) => {
        this.savingPartnerEmailSettings = false;
        const message = error?.error?.message || 'Errore salvataggio template email partner';
        this.snackBar.open(message, 'Chiudi', { duration: 3500 });
      }
    });
  }

  resetPartnerEmailSettingsToDefaults(): void {
    this.partnerEmailSettingsForm.reset({
      approvalSubject: DEFAULT_PARTNER_EMAIL_SETTINGS.approvalSubject,
      approvalBody: DEFAULT_PARTNER_EMAIL_SETTINGS.approvalBody,
      rejectionSubject: DEFAULT_PARTNER_EMAIL_SETTINGS.rejectionSubject,
      rejectionBody: DEFAULT_PARTNER_EMAIL_SETTINGS.rejectionBody
    });
    this.partnerEmailSettingsForm.markAsDirty();
  }

  partnerEmailPlaceholderToken(key: string): string {
    return `{{${key}}}`;
  }

  ensureGlobalSettingsLoaded(force = false): void {
    if (!this.canManageGlobalSettings) {
      return;
    }

    this.loadPrivacyPolicySettings(force);
    this.loadAppCacheSettings(force);
    this.loadOpenAiTranslationSettings(force);
  }

  selectGlobalSettingsTab(tab: GlobalSettingsTab): void {
    if (tab === this.activeGlobalSettingsTab) {
      return;
    }

    this.capturePrivacyPolicyEditorContent();
    this.activeGlobalSettingsTab = tab;
    if (tab === 'privacyPolicy') {
      this.syncPrivacyPolicyEditor();
    } else if (tab === 'appCache') {
      this.loadAppCacheSettings();
    }
  }

  loadAppCacheSettings(force = false): void {
    if (!this.canManageGlobalSettings || this.loadingAppCacheSettings) {
      return;
    }
    if (this.appCacheSettings && !force) {
      return;
    }

    this.loadingAppCacheSettings = true;
    this.auth.getAppCacheSettings().subscribe({
      next: (settings) => {
        this.loadingAppCacheSettings = false;
        this.appCacheSettings = settings;
      },
      error: (error: { error?: { message?: string } }) => {
        this.loadingAppCacheSettings = false;
        const message = error?.error?.message || 'Errore caricamento impostazioni cache';
        this.snackBar.open(message, 'Chiudi', { duration: 3500 });
      }
    });
  }

  bumpAppCacheVersion(): void {
    if (!this.canBumpAppCacheVersion) {
      return;
    }

    const confirmed = window.confirm(
      'Forzare aggiornamento app e pulizia cache per tutti gli utenti? Al prossimo controllo l app eliminera cache offline, service worker e ricarichera la versione corrente.'
    );
    if (!confirmed) {
      return;
    }

    this.bumpingAppCacheVersion = true;
    this.auth.bumpAppCacheVersion().subscribe({
      next: (settings) => {
        this.bumpingAppCacheVersion = false;
        this.appCacheSettings = settings;
        this.snackBar.open('Aggiornamento cache pubblicato', 'OK', { duration: 3200 });
      },
      error: (error: { error?: { message?: string } }) => {
        this.bumpingAppCacheVersion = false;
        const message = error?.error?.message || 'Errore pubblicazione aggiornamento cache';
        this.snackBar.open(message, 'Chiudi', { duration: 3500 });
      }
    });
  }

  loadPrivacyPolicySettings(force = false): void {
    if (!this.canManageGlobalSettings || this.loadingPrivacyPolicySettings) {
      return;
    }
    if (this.privacyPolicySettings && !force) {
      this.syncPrivacyPolicyEditor();
      return;
    }

    this.loadingPrivacyPolicySettings = true;
    this.auth.getPrivacyPolicySettings().subscribe({
      next: (settings) => {
        this.loadingPrivacyPolicySettings = false;
        this.applyPrivacyPolicySettings(settings);
      },
      error: (error: { error?: { message?: string } }) => {
        this.loadingPrivacyPolicySettings = false;
        const message = error?.error?.message || 'Errore caricamento privacy policy';
        this.snackBar.open(message, 'Chiudi', { duration: 3500 });
      }
    });
  }

  savePrivacyPolicySettings(): void {
    if (!this.canSavePrivacyPolicySettings) {
      return;
    }

    this.capturePrivacyPolicyEditorContent();
    this.savingPrivacyPolicySettings = true;
    this.auth.updatePrivacyPolicySettings({ translations: this.privacyPolicyTranslations }).subscribe({
      next: (settings) => {
        this.savingPrivacyPolicySettings = false;
        this.applyPrivacyPolicySettings(settings);
        this.snackBar.open('Privacy policy salvata', 'OK', { duration: 2400 });
      },
      error: (error: { error?: { message?: string } }) => {
        this.savingPrivacyPolicySettings = false;
        const message = error?.error?.message || 'Errore salvataggio privacy policy';
        this.snackBar.open(message, 'Chiudi', { duration: 3500 });
      }
    });
  }

  async translatePrivacyPolicy(): Promise<void> {
    if (!this.canTranslatePrivacyPolicy) {
      return;
    }

    this.capturePrivacyPolicyEditorContent();
    this.translatingPrivacyPolicy = true;
    this.privacyPolicyTranslationUsage = { inputTokens: 0, outputTokens: 0, totalTokens: 0 };
    this.privacyPolicyTranslationLog = ['Salvataggio privacy italiana...'];

    try {
      const savedSettings = await firstValueFrom(this.auth.updatePrivacyPolicySettings({ translations: this.privacyPolicyTranslations }));
      this.applyPrivacyPolicySettings(savedSettings);
      this.privacyPolicyTranslationLog = ['Traduzione GPT in corso...'];
      const response = await firstValueFrom(
        this.auth.translatePrivacyPolicy({
          sourceLanguage: 'it',
          targetLanguages: this.contentLanguages.map((language) => language.code),
          overwrite: this.privacyPolicyTranslateOverwrite
        })
      );

      this.privacyPolicyTranslationUsage = response.usage || { inputTokens: 0, outputTokens: 0, totalTokens: 0 };
      this.applyPrivacyPolicySettings(response.settings);
      const translatedLabels = response.translatedLanguages.map((language) => this.privacyPolicyLanguageLabel(language)).join(', ');
      const skippedLabels = response.skippedLanguages.map((language) => this.privacyPolicyLanguageLabel(language)).join(', ');
      this.privacyPolicyTranslationLog = [
        translatedLabels ? `Tradotte: ${translatedLabels}` : 'Nessuna nuova lingua tradotta',
        skippedLabels ? `Gia presenti: ${skippedLabels}` : ''
      ].filter(Boolean);
      this.snackBar.open('Traduzione privacy completata', 'OK', { duration: 2600 });
    } catch (error) {
      const message = this.dashboardErrorMessage(error, 'Traduzione privacy non riuscita');
      this.privacyPolicyTranslationLog = [message];
      this.snackBar.open(message, 'Chiudi', { duration: 4500 });
    } finally {
      this.translatingPrivacyPolicy = false;
    }
  }

  selectPrivacyPolicyLanguage(language: PrivacyPolicyLanguage): void {
    if (language === this.privacyPolicySelectedLanguage) {
      return;
    }

    this.capturePrivacyPolicyEditorContent();
    this.privacyPolicySelectedLanguage = language;
    this.syncPrivacyPolicyEditor();
  }

  onPrivacyPolicyEditorInput(): void {
    this.capturePrivacyPolicyEditorContent();
  }

  formatPrivacyPolicyEditor(command: string, value?: string): void {
    const editor = this.privacyPolicyEditor?.nativeElement;
    if (!editor) {
      return;
    }

    editor.focus();
    document.execCommand(command, false, value);
    this.capturePrivacyPolicyEditorContent();
  }

  onPrivacyPolicyFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!file) {
      return;
    }
    if (file.size > this.maxPrivacyPolicyImportBytes) {
      this.snackBar.open('File privacy troppo grande', 'Chiudi', { duration: 3200 });
      input.value = '';
      return;
    }

    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.txt') && !fileName.endsWith('.html') && !fileName.endsWith('.htm')) {
      this.snackBar.open('Importa file .txt o .html, oppure incolla il testo nell editor.', 'Chiudi', { duration: 4200 });
      input.value = '';
      return;
    }

    this.readFileAsText(file)
      .then((content) => {
        const html = fileName.endsWith('.txt') ? this.plainTextToPrivacyHtml(content) : content;
        this.privacyPolicyTranslations[this.privacyPolicySelectedLanguage] = html;
        this.syncPrivacyPolicyEditor();
      })
      .catch((error: Error) => {
        this.snackBar.open(error.message || 'Impossibile leggere il file privacy', 'Chiudi', { duration: 3500 });
      })
      .finally(() => {
        input.value = '';
      });
  }

  hasPrivacyPolicyContent(language: PrivacyPolicyLanguage): boolean {
    return Boolean(String(this.privacyPolicyTranslations[language] || '').trim());
  }

  openPartnerRequestApproval(request: DashboardPartnerRequest): void {
    if (!this.canManageUsers || !this.partnerRequestApprovalDialog) {
      return;
    }
    if (request.status === 'approved') {
      return;
    }
    if (!this.catalogCities.length && !this.loadingCatalogCities) {
      this.loadCatalogCities();
    }

    this.partnerRequestApprovalTarget = request;
    this.startPartnerRequestApproval(request);
    this.partnerRequestApprovalDialogRef?.close();
    this.partnerRequestApprovalDialogRef = this.dialog.open(this.partnerRequestApprovalDialog, {
      width: '760px',
      maxWidth: '95vw'
    });
    this.partnerRequestApprovalDialogRef.afterClosed().subscribe(() => {
      this.partnerRequestApprovalDialogRef = undefined;
      this.approvingPartnerRequestId = null;
      this.previewingPartnerRequestId = null;
      this.startPartnerRequestApproval();
    });
  }

  closePartnerRequestApprovalDialog(): void {
    this.partnerRequestApprovalDialogRef?.close();
    this.partnerRequestApprovalDialogRef = undefined;
    this.approvingPartnerRequestId = null;
    this.previewingPartnerRequestId = null;
    this.startPartnerRequestApproval();
  }

  startPartnerRequestApproval(request: DashboardPartnerRequest | null = null): void {
    this.partnerRequestApprovalTarget = request;
    this.partnerRequestApprovalForm.reset({
      applyTo: 'bundle',
      cityIds: this.catalogCities[0]?.id ? [this.catalogCities[0].id] : [],
      code: '',
      userDiscountPercent: 0,
      structureFixedAmount: 0,
      expiresAt: this.defaultDiscountCodeExpiryInput()
    });
  }

  generateDiscountCodeForPartnerApproval(): void {
    if (!this.canManageUsers || this.approvingPartnerRequestId !== null) {
      return;
    }

    this.auth.generateStructureInviteCode().subscribe({
      next: (inviteCode) => {
        this.partnerRequestApprovalForm.controls.code.setValue(inviteCode);
        this.partnerRequestApprovalForm.controls.code.markAsDirty();
      },
      error: (error: { error?: { message?: string } }) => {
        const message = error?.error?.message || 'Errore generazione codice';
        this.snackBar.open(message, 'Chiudi', { duration: 3200 });
      }
    });
  }

  previewPartnerRequestPdf(request: DashboardPartnerRequest, payload?: PartnerRequestPdfPreviewInput): void {
    if (!this.canManageUsers || this.previewingPartnerRequestId !== null) {
      return;
    }

    this.previewingPartnerRequestId = request.id;
    this.auth
      .previewPartnerRequestPdf(request.id, payload || {})
      .subscribe({
        next: (blob) => {
          this.previewingPartnerRequestId = null;
          this.openPdfBlob(blob);
        },
        error: (error: { error?: { message?: string } }) => {
          this.previewingPartnerRequestId = null;
          const message = error?.error?.message || 'Errore anteprima PDF';
          this.snackBar.open(message, 'Chiudi', { duration: 3500 });
        }
      });
  }

  previewDiscountCodePdf(discountCode: DashboardDiscountCode): void {
    if (!this.canViewDiscountCodes || this.previewingDiscountCodeId !== null) {
      return;
    }

    this.previewingDiscountCodeId = discountCode.id;
    this.auth.previewDiscountCodePdf(discountCode.id).subscribe({
      next: (blob) => {
        this.previewingDiscountCodeId = null;
        this.openPdfBlob(blob);
      },
      error: (error: { error?: { message?: string } }) => {
        this.previewingDiscountCodeId = null;
        const message = error?.error?.message || 'Errore generazione PDF codice sconto';
        this.snackBar.open(message, 'Chiudi', { duration: 3500 });
      }
    });
  }

  private openPdfBlob(blob: Blob): void {
    const objectUrl = URL.createObjectURL(blob);
    const previewLink = document.createElement('a');
    previewLink.href = objectUrl;
    previewLink.target = '_blank';
    previewLink.rel = 'noopener';
    previewLink.click();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
  }

  previewSelectedPartnerRequestPdf(): void {
    const request = this.partnerRequestApprovalTarget;
    if (!request) {
      return;
    }

    const { applyTo, cityIds, code, userDiscountPercent, structureFixedAmount, expiresAt } = this.partnerRequestApprovalForm.getRawValue();
    const expiresAtIso = this.toIsoDateTime(expiresAt);
    const normalizedCode = this.normalizeStructureInviteCode(code || '');
    const normalizedUserDiscountPercent = this.normalizePercent(userDiscountPercent);
    const previewPayload: PartnerRequestPdfPreviewInput = {
      applyTo,
      cityIds: this.normalizeSelectedCityIds(cityIds),
      structureFixedAmount: this.normalizeEuroAmount(structureFixedAmount)
    };
    if (expiresAtIso) {
      previewPayload.expiresAt = expiresAtIso;
    }
    if (normalizedCode) {
      previewPayload.code = normalizedCode;
    }
    if (normalizedCode || normalizedUserDiscountPercent > 0) {
      previewPayload.userDiscountPercent = normalizedUserDiscountPercent;
    }
    this.previewPartnerRequestPdf(request, previewPayload);
  }

  approvePartnerRequest(): void {
    const request = this.partnerRequestApprovalTarget;
    if (!request || !this.canManageUsers || this.approvingPartnerRequestId !== null) {
      return;
    }

    if (this.partnerRequestApprovalForm.invalid) {
      this.partnerRequestApprovalForm.markAllAsTouched();
      return;
    }

    const { applyTo, cityIds, code, userDiscountPercent, structureFixedAmount, expiresAt } = this.partnerRequestApprovalForm.getRawValue();
    const normalizedCode = this.normalizeStructureInviteCode(code || '');
    if (!normalizedCode) {
      this.partnerRequestApprovalForm.controls.code.markAsTouched();
      this.snackBar.open('Codice obbligatorio', 'Chiudi', { duration: 2800 });
      return;
    }
    const expiresAtIso = this.toIsoDateTime(expiresAt);
    if (!expiresAtIso) {
      this.partnerRequestApprovalForm.controls.expiresAt.markAsTouched();
      this.snackBar.open('Scadenza non valida', 'Chiudi', { duration: 2800 });
      return;
    }

    const normalizedCityIds = this.normalizeSelectedCityIds(cityIds);
    if (!normalizedCityIds.length) {
      this.partnerRequestApprovalForm.controls.cityIds.markAsTouched();
      this.snackBar.open('Seleziona almeno una città', 'Chiudi', { duration: 2800 });
      return;
    }

    const payload: PartnerRequestApprovalInput = {
      applyTo,
      cityIds: normalizedCityIds,
      code: normalizedCode,
      userDiscountPercent: this.normalizePercent(userDiscountPercent),
      structureFixedAmount: this.normalizeEuroAmount(structureFixedAmount),
      expiresAt: expiresAtIso
    };

    this.approvingPartnerRequestId = request.id;
    this.auth.approvePartnerRequest(request.id, payload).subscribe({
      next: (updated) => {
        this.approvingPartnerRequestId = null;
        this.partnerRequests = this.sortPartnerRequests(
          this.partnerRequests.map((item) => (item.id === updated.id ? updated : item))
        );
        this.closePartnerRequestApprovalDialog();
        this.loadStructures();
        this.loadDiscountCodes();
        this.snackBar.open(`Richiesta ${updated.structureName} approvata e inviata via email`, 'OK', {
          duration: 3200
        });
      },
      error: (error: { error?: { message?: string } }) => {
        this.approvingPartnerRequestId = null;
        const message = error?.error?.message || 'Errore approvazione richiesta partner';
        this.snackBar.open(message, 'Chiudi', { duration: 3500 });
      }
    });
  }

  rejectPartnerRequest(request: DashboardPartnerRequest): void {
    if (!this.canManageUsers || this.rejectingPartnerRequestId !== null || request.status === 'approved') {
      return;
    }

    const confirmed = window.confirm(`Negare la richiesta partner per "${request.structureName}" e inviare la mail di rifiuto?`);
    if (!confirmed) {
      return;
    }

    this.rejectingPartnerRequestId = request.id;
    this.auth.rejectPartnerRequest(request.id).subscribe({
      next: (updated) => {
        this.rejectingPartnerRequestId = null;
        this.partnerRequests = this.sortPartnerRequests(
          this.partnerRequests.map((item) => (item.id === updated.id ? updated : item))
        );
        this.snackBar.open(`Richiesta ${updated.structureName} negata e inviata via email`, 'OK', { duration: 3000 });
      },
      error: (error: { error?: { message?: string } }) => {
        this.rejectingPartnerRequestId = null;
        const message = error?.error?.message || 'Errore aggiornamento richiesta partner';
        this.snackBar.open(message, 'Chiudi', { duration: 3500 });
      }
    });
  }

  deletePartnerRequest(request: DashboardPartnerRequest): void {
    if (!this.canManageUsers || this.deletingPartnerRequestId !== null || request.status === 'approved') {
      return;
    }

    const confirmed = window.confirm(
      `Eliminare la richiesta partner per "${request.structureName}"? Rimarra nel database ma non sara piu visibile in dashboard.`
    );
    if (!confirmed) {
      return;
    }

    this.deletingPartnerRequestId = request.id;
    this.auth.deletePartnerRequest(request.id).subscribe({
      next: () => {
        this.deletingPartnerRequestId = null;
        this.partnerRequests = this.partnerRequests.filter((item) => item.id !== request.id);
        this.snackBar.open(`Richiesta ${request.structureName} eliminata`, 'OK', { duration: 2800 });
      },
      error: (error: { error?: { message?: string } }) => {
        this.deletingPartnerRequestId = null;
        const message = error?.error?.message || 'Errore eliminazione richiesta partner';
        this.snackBar.open(message, 'Chiudi', { duration: 3500 });
      }
    });
  }

  isPartnerRequestBusy(request: DashboardPartnerRequest): boolean {
    return (
      this.approvingPartnerRequestId === request.id ||
      this.rejectingPartnerRequestId === request.id ||
      this.deletingPartnerRequestId === request.id ||
      this.previewingPartnerRequestId === request.id
    );
  }

  isDiscountCodeBusy(discountCode: DashboardDiscountCode): boolean {
    return (
      this.previewingDiscountCodeId !== null ||
      this.savingDiscountCodeId === discountCode.id ||
      this.deletingDiscountCodeId === discountCode.id
    );
  }

  async openPartnerRequestDiscountCodes(request: DashboardPartnerRequest): Promise<void> {
    if (!this.canViewDiscountCodes || (!request.approvedDiscountCodeId && !request.approvedStructureId)) {
      return;
    }

    await this.selectSection('discounts');
    if (this.activeSection !== 'discounts') {
      return;
    }

    this.highlightedDiscountCodeId = request.approvedDiscountCodeId;
    this.highlightedDiscountStructureId = request.approvedStructureId;
    if (!this.discountCodes.length && !this.loadingDiscountCodes) {
      this.loadDiscountCodes();
    }
    this.scrollHighlightedDiscountCodeIntoView();
  }

  partnerRequestDiscountCitiesLabel(request: DashboardPartnerRequest): string {
    const discount = request.discount;
    if (!discount) {
      return '-';
    }
    const names = Array.isArray(discount.cityNames) ? discount.cityNames.filter(Boolean) : [];
    if (names.length) {
      return names.join(', ');
    }
    const ids = Array.isArray(discount.cityIds) ? discount.cityIds.filter(Boolean) : [];
    if (ids.length) {
      return ids.map((cityId) => this.cityDisplayName(cityId) || cityId).join(', ');
    }
    if (discount.cityName) {
      return discount.cityName;
    }
    if (discount.cityId) {
      return this.cityDisplayName(discount.cityId) || discount.cityId;
    }
    return 'Contenuti associati';
  }

  partnerRequestDiscountValueLabel(request: DashboardPartnerRequest): string {
    const discount = request.discount;
    if (!discount) {
      return '-';
    }
    return `${Number(discount.userDiscountPercent || 0)}% / ${this.formatCurrency(discount.structureFixedAmount)}`;
  }

  partnerRequestStatusLabel(status: DashboardPartnerRequest['status']): string {
    if (status === 'approved') {
      return 'Approvata';
    }
    if (status === 'rejected') {
      return 'Negata';
    }
    return 'In attesa';
  }

  partnerRequestStatusClass(status: DashboardPartnerRequest['status']): string {
    if (status === 'approved') {
      return 'ok';
    }
    if (status === 'rejected') {
      return 'bad';
    }
    return 'warn';
  }

  partnerRequestPdfStatusLabel(status: DashboardPartnerRequest['pdfReleaseStatus']): string {
    return status === 'sent' ? 'Inviato' : 'Da inviare';
  }

  partnerRequestPdfStatusClass(status: DashboardPartnerRequest['pdfReleaseStatus']): string {
    return status === 'sent' ? 'ok' : 'warn';
  }

  loadPayPalSettings(): void {
    if (!this.canManagePayPal || this.loadingPayPalSettings) {
      return;
    }

    this.loadingPayPalSettings = true;
    this.auth.getPayPalSettings().subscribe({
      next: (settings) => {
        this.loadingPayPalSettings = false;
        this.payPalSettings = settings;
        this.applyPayPalSettingsToForm(settings);
      },
      error: (error: { error?: { message?: string } }) => {
        this.loadingPayPalSettings = false;
        const message = error?.error?.message || 'Errore caricamento configurazione PayPal';
        this.snackBar.open(message, 'Chiudi', { duration: 3500 });
      }
    });
  }

  savePayPalSettings(): void {
    if (!this.canSavePayPalSettings) {
      this.payPalForm.markAllAsTouched();
      return;
    }

    this.savingPayPalSettings = true;
    const payload = this.payPalForm.getRawValue();
    const clientId = payload.clientId.trim();
    const clientSecret = payload.clientSecret.trim();
    const hasRequiredCredentials = Boolean(clientId && clientSecret);
    this.auth
      .updatePayPalSettings({
        isEnabled: payload.isEnabled || hasRequiredCredentials,
        mode: payload.mode,
        clientId,
        clientSecret,
        merchantId: payload.merchantId.trim(),
        merchantEmail: payload.merchantEmail.trim(),
        brandName: payload.brandName.trim() || 'Walk Around',
        webhookId: payload.webhookId.trim(),
        currencyCode: 'EUR'
      })
      .subscribe({
        next: (settings) => {
          this.savingPayPalSettings = false;
          this.payPalSettings = settings;
          this.applyPayPalSettingsToForm(settings);
          this.snackBar.open('Configurazione PayPal salvata', 'OK', { duration: 2400 });
        },
        error: (error: { error?: { message?: string } }) => {
          this.savingPayPalSettings = false;
          const message = error?.error?.message || 'Errore salvataggio configurazione PayPal';
          this.snackBar.open(message, 'Chiudi', { duration: 3500 });
        }
      });
  }

  testPayPalSettings(): void {
    if (!this.canManagePayPal || this.testingPayPalSettings) {
      return;
    }

    this.testingPayPalSettings = true;
    this.auth.testPayPalSettings().subscribe({
      next: (response) => {
        this.testingPayPalSettings = false;
        if (response.settings) {
          this.payPalSettings = response.settings;
          this.applyPayPalSettingsToForm(response.settings);
        }
        this.snackBar.open('Connessione PayPal verificata', 'OK', { duration: 2600 });
      },
      error: (error: { error?: { message?: string } }) => {
        this.testingPayPalSettings = false;
        const message = error?.error?.message || 'Verifica PayPal non riuscita';
        if (this.payPalSettings) {
          this.payPalSettings = {
            ...this.payPalSettings,
            lastVerificationStatus: 'invalid',
            lastVerificationError: message
          };
        }
        this.snackBar.open(message, 'Chiudi', { duration: 3600 });
      }
    });
  }

  ensureGptTranslationsLoaded(): void {
    if (!this.canManageGptTranslations) {
      return;
    }

    this.loadOpenAiTranslationSettings();
    this.loadOpenAiTranslationSummary();
    if (!this.catalogCities.length && !this.loadingCatalogCities) {
      this.loadCatalogCities();
      return;
    }

    const cityId = this.ensureActiveGptCitySelection();
    if (cityId) {
      this.loadCatalogPois(cityId);
      this.loadOpenAiTranslationStatus();
    }
  }

  loadOpenAiTranslationSettings(force = false): void {
    if (!this.canManageGptTranslations || this.loadingOpenAiTranslationSettings) {
      return;
    }
    if (this.openAiTranslationSettings && !force) {
      return;
    }

    this.loadingOpenAiTranslationSettings = true;
    this.auth.getOpenAiTranslationSettings().subscribe({
      next: (settings) => {
        this.loadingOpenAiTranslationSettings = false;
        this.openAiTranslationSettings = settings;
        this.openAiTranslationSettingsForm.reset({
          apiKey: '',
          model: settings.model || 'gpt-4o-mini',
          ttsModel: settings.ttsModel || 'gpt-4o-mini-tts',
          ttsVoice: settings.ttsVoice || 'alloy',
          ttsInstructions: settings.ttsInstructions || ''
        });
      },
      error: (error: { error?: { message?: string } }) => {
        this.loadingOpenAiTranslationSettings = false;
        const message = error?.error?.message || 'Errore caricamento configurazione OpenAI';
        this.snackBar.open(message, 'Chiudi', { duration: 3500 });
      }
    });
  }

  saveOpenAiTranslationSettings(): void {
    if (!this.canSaveOpenAiTranslationSettings) {
      this.openAiTranslationSettingsForm.markAllAsTouched();
      return;
    }

    const payload = this.openAiTranslationSettingsForm.getRawValue();
    this.savingOpenAiTranslationSettings = true;
    this.auth
      .saveOpenAiTranslationSettings({
        apiKey: payload.apiKey.trim(),
        model: payload.model.trim() || 'gpt-4o-mini',
        ttsModel: payload.ttsModel.trim() || 'gpt-4o-mini-tts',
        ttsVoice: payload.ttsVoice.trim() || 'alloy',
        ttsInstructions: payload.ttsInstructions.trim()
      })
      .subscribe({
        next: (settings) => {
          this.savingOpenAiTranslationSettings = false;
          this.openAiTranslationSettings = settings;
          this.openAiTranslationSettingsForm.reset({
            apiKey: '',
            model: settings.model || 'gpt-4o-mini',
            ttsModel: settings.ttsModel || 'gpt-4o-mini-tts',
            ttsVoice: settings.ttsVoice || 'alloy',
            ttsInstructions: settings.ttsInstructions || ''
          });
          this.snackBar.open('Configurazione OpenAI salvata', 'OK', { duration: 2400 });
        },
        error: (error: { error?: { message?: string } }) => {
          this.savingOpenAiTranslationSettings = false;
          const message = error?.error?.message || 'Errore salvataggio configurazione OpenAI';
          this.snackBar.open(message, 'Chiudi', { duration: 3500 });
        }
      });
  }

  previewOpenAiVoice(): void {
    if (!this.canPreviewOpenAiVoice) {
      if (!this.openAiTranslationSettings?.hasApiKey) {
        this.snackBar.open('Salva una API key OpenAI prima di riprodurre l anteprima voce.', 'Chiudi', { duration: 3600 });
      }
      return;
    }

    const payload = this.openAiTranslationSettingsForm.getRawValue();
    this.stopOpenAiVoicePreview();
    const previewToken = ++this.openAiVoicePreviewRequestToken;
    this.previewingOpenAiVoice = true;
    this.auth
      .previewOpenAiTranslationVoice({
        ttsModel: payload.ttsModel.trim() || 'gpt-4o-mini-tts',
        ttsVoice: payload.ttsVoice.trim() || 'alloy',
        ttsInstructions: payload.ttsInstructions.trim()
      })
      .subscribe({
        next: (audioBlob) => {
          if (previewToken !== this.openAiVoicePreviewRequestToken) {
            return;
          }
          this.previewingOpenAiVoice = false;
          this.playOpenAiVoicePreview(audioBlob);
        },
        error: (error: unknown) => {
          if (previewToken !== this.openAiVoicePreviewRequestToken) {
            return;
          }
          this.previewingOpenAiVoice = false;
          this.resolveDashboardErrorMessage(error, 'Anteprima voce non riuscita').then((message) => {
            this.snackBar.open(message, 'Chiudi', { duration: 4200 });
          });
        }
      });
  }

  async selectGptTranslationsTab(tab: GptTranslationsTab): Promise<void> {
    if (tab === this.activeGptTranslationsTab) {
      return;
    }
    if (!(await this.confirmGptTranslationContextChange())) {
      return;
    }
    this.cancelActiveGptTranslationForContextChange();

    this.activeGptTranslationsTab = tab;
    this.selectedGptTranslationPoiId = '';
    this.openAiTranslationStatusRows = [];
    this.resetGptTranslationProgress();
    this.resetGptAudioProgress();

    if (tab === 'settings') {
      this.loadOpenAiTranslationSettings();
      return;
    }

    const cityId = this.ensureActiveGptCitySelection();
    if (cityId) {
      this.loadCatalogPois(cityId);
    }
    this.loadOpenAiTranslationSummary();
    this.loadOpenAiTranslationStatus();
  }

  async onGptTranslationCityChanged(cityId: string): Promise<void> {
    const previousCityId = this.gptTranslationForm.controls.cityId.value || this.selectedCatalogCityId;
    if (!(await this.confirmGptTranslationContextChange())) {
      this.gptTranslationForm.controls.cityId.setValue(previousCityId, { emitEvent: false });
      return;
    }
    this.cancelActiveGptTranslationForContextChange();

    this.gptTranslationForm.controls.cityId.setValue(cityId, { emitEvent: false });
    this.gptTranslationForm.controls.poiId.setValue('', { emitEvent: false });
    this.selectedGptTranslationPoiId = '';
    this.resetGptTranslationProgress();
    this.resetGptAudioProgress();

    if (!cityId) {
      this.openAiTranslationStatusRows = [];
      this.catalogPois = [];
      return;
    }

    this.onCatalogCityFilterChange(cityId, { force: true });
    this.loadOpenAiTranslationStatus();
  }

  async onGptAudioCityChanged(cityId: string): Promise<void> {
    const previousCityId = this.gptAudioForm.controls.cityId.value || this.selectedCatalogCityId;
    if (!(await this.confirmGptTranslationContextChange())) {
      this.gptAudioForm.controls.cityId.setValue(previousCityId, { emitEvent: false });
      return;
    }
    this.cancelActiveGptTranslationForContextChange();

    this.gptAudioForm.controls.cityId.setValue(cityId, { emitEvent: false });
    this.gptAudioForm.controls.poiId.setValue('', { emitEvent: false });
    this.selectedGptTranslationPoiId = '';
    this.resetGptAudioProgress();

    if (!cityId) {
      this.openAiTranslationStatusRows = [];
      this.catalogPois = [];
      return;
    }

    this.onCatalogCityFilterChange(cityId, { force: true });
    this.loadOpenAiTranslationStatus();
  }

  async onGptTranslationLanguageChanged(language: ContentEditorLanguage): Promise<void> {
    const previousLanguage = this.confirmedGptTranslationLanguage;
    if (!(await this.confirmGptTranslationContextChange())) {
      this.gptTranslationForm.controls.targetLanguage.setValue(previousLanguage, { emitEvent: false });
      return;
    }
    this.cancelActiveGptTranslationForContextChange();

    this.confirmedGptTranslationLanguage = language;
    this.gptTranslationForm.controls.targetLanguage.setValue(language, { emitEvent: false });
    this.resetGptTranslationProgress();
    this.resetGptAudioProgress();
    this.loadOpenAiTranslationSummary();
    this.loadOpenAiTranslationStatus();
  }

  async onGptAudioLanguageChanged(language: AudioEditorLanguage): Promise<void> {
    const previousLanguage = this.confirmedGptAudioLanguage;
    if (!(await this.confirmGptTranslationContextChange())) {
      this.gptAudioForm.controls.targetLanguage.setValue(previousLanguage, { emitEvent: false });
      return;
    }
    this.cancelActiveGptTranslationForContextChange();

    this.confirmedGptAudioLanguage = language;
    this.gptAudioForm.controls.targetLanguage.setValue(language, { emitEvent: false });
    this.resetGptAudioProgress();
    this.loadOpenAiTranslationSummary();
    this.loadOpenAiTranslationStatus();
  }

  async onGptTranslationPoiChanged(poiId: string): Promise<void> {
    const previousPoiId = this.selectedGptTranslationPoiId || this.gptTranslationForm.controls.poiId.value;
    if (!(await this.confirmGptTranslationContextChange())) {
      this.gptTranslationForm.controls.poiId.setValue(previousPoiId, { emitEvent: false });
      return;
    }
    this.cancelActiveGptTranslationForContextChange();

    this.selectedGptTranslationPoiId = poiId;
    this.gptTranslationForm.controls.poiId.setValue(poiId, { emitEvent: false });
  }

  async onGptAudioPoiChanged(poiId: string): Promise<void> {
    const previousPoiId = this.selectedGptTranslationPoiId || this.gptAudioForm.controls.poiId.value;
    if (!(await this.confirmGptTranslationContextChange())) {
      this.gptAudioForm.controls.poiId.setValue(previousPoiId, { emitEvent: false });
      return;
    }
    this.cancelActiveGptTranslationForContextChange();

    this.selectedGptTranslationPoiId = poiId;
    this.gptAudioForm.controls.poiId.setValue(poiId, { emitEvent: false });
  }

  async onGptTranslationOverwriteChanged(overwrite: boolean): Promise<void> {
    const previousOverwrite = this.confirmedGptTranslationOverwrite;
    if (!(await this.confirmGptTranslationContextChange())) {
      this.gptTranslationForm.controls.overwrite.setValue(previousOverwrite, { emitEvent: false });
      return;
    }
    this.cancelActiveGptTranslationForContextChange();

    this.confirmedGptTranslationOverwrite = overwrite;
    this.gptTranslationForm.controls.overwrite.setValue(overwrite, { emitEvent: false });
    this.resetGptAudioProgress();
  }

  async onGptAudioOverwriteChanged(overwrite: boolean): Promise<void> {
    const previousOverwrite = this.confirmedGptAudioOverwrite;
    if (!(await this.confirmGptTranslationContextChange())) {
      this.gptAudioForm.controls.overwrite.setValue(previousOverwrite, { emitEvent: false });
      return;
    }
    this.cancelActiveGptTranslationForContextChange();

    this.confirmedGptAudioOverwrite = overwrite;
    this.gptAudioForm.controls.overwrite.setValue(overwrite, { emitEvent: false });
    this.resetGptAudioProgress();
  }

  loadOpenAiTranslationStatus(): void {
    if (!this.canManageGptTranslations) {
      return;
    }

    const cityId = this.ensureActiveGptCitySelection();
    const targetLanguage = this.selectedGptStatusLanguage;
    if (!cityId || !targetLanguage) {
      this.openAiTranslationStatusRows = [];
      return;
    }

    const requestToken = ++this.openAiTranslationStatusRequestToken;
    this.loadingOpenAiTranslationStatus = true;
    this.auth.listOpenAiPoiTranslationStatus(cityId, targetLanguage).subscribe({
      next: (rows) => {
        if (requestToken !== this.openAiTranslationStatusRequestToken) {
          return;
        }
        this.loadingOpenAiTranslationStatus = false;
        this.openAiTranslationStatusRows = rows;
        this.ensureSelectedGptTranslationPoi();
      },
      error: (error: { error?: { message?: string } }) => {
        if (requestToken !== this.openAiTranslationStatusRequestToken) {
          return;
        }
        this.loadingOpenAiTranslationStatus = false;
        const message = error?.error?.message || 'Errore caricamento stato traduzioni';
        this.snackBar.open(message, 'Chiudi', { duration: 3500 });
      }
    });
  }

  loadOpenAiTranslationSummary(): void {
    if (!this.canManageGptTranslations) {
      return;
    }

    const targetLanguage = this.selectedGptStatusLanguage;
    if (!targetLanguage) {
      this.openAiTranslationSummary = null;
      return;
    }

    const requestToken = ++this.openAiTranslationSummaryRequestToken;
    this.loadingOpenAiTranslationSummary = true;
    this.auth.getOpenAiPoiTranslationSummary(targetLanguage).subscribe({
      next: (summary) => {
        if (requestToken !== this.openAiTranslationSummaryRequestToken) {
          return;
        }
        this.loadingOpenAiTranslationSummary = false;
        this.openAiTranslationSummary = summary;
      },
      error: (error: { error?: { message?: string } }) => {
        if (requestToken !== this.openAiTranslationSummaryRequestToken) {
          return;
        }
        this.loadingOpenAiTranslationSummary = false;
        this.openAiTranslationSummary = null;
        const message = error?.error?.message || 'Errore caricamento riepilogo traduzioni';
        this.snackBar.open(message, 'Chiudi', { duration: 3500 });
      }
    });
  }

  translateSelectedGptPoi(): void {
    const poi = this.selectedGptTranslationPoi;
    if (!this.canTranslateSelectedGptPoi || !poi) {
      return;
    }

    this.resetGptTranslationProgress(1);
    const runToken = ++this.gptTranslationRunToken;
    this.translatingPoiId = poi.id;
    this.auth
      .translateCatalogPoiWithOpenAi(poi.id, {
        cityId: this.gptTranslationForm.controls.cityId.value,
        targetLanguage: this.gptTranslationForm.controls.targetLanguage.value,
        overwrite: this.gptTranslationForm.controls.overwrite.value
      })
      .subscribe({
        next: (response) => {
          if (runToken !== this.gptTranslationRunToken) {
            return;
          }
          this.translatingPoiId = null;
          this.gptTranslationProgressDone = 1;
          this.applyOpenAiTranslationResponse(response);
          this.addGptTranslationUsage(response.usage);
          this.loadOpenAiTranslationStatus();
          this.loadOpenAiTranslationSummary();
          this.snackBar.open(response.skipped ? 'POI gia tradotto' : 'Traduzione completata', 'OK', { duration: 2600 });
        },
        error: (error: { error?: { message?: string } }) => {
          if (runToken !== this.gptTranslationRunToken) {
            return;
          }
          this.translatingPoiId = null;
          const message = error?.error?.message || 'Traduzione non riuscita';
          this.snackBar.open(message, 'Chiudi', { duration: 4200 });
        }
      });
  }

  async translateMissingGptPoisForCity(): Promise<void> {
    if (!this.canTranslateMissingGptPois) {
      return;
    }

    const cityId = this.gptTranslationForm.controls.cityId.value;
    const targetLanguage = this.gptTranslationForm.controls.targetLanguage.value;
    const overwrite = this.gptTranslationForm.controls.overwrite.value;
    const rowsToTranslate = this.openAiTranslationStatusRows.filter((row) => !row.isComplete);
    if (!cityId || !rowsToTranslate.length) {
      return;
    }

    this.bulkTranslatingPois = true;
    const runToken = ++this.gptTranslationRunToken;
    this.resetGptTranslationProgress(rowsToTranslate.length);
    this.gptTranslationLog = [];

    for (const row of rowsToTranslate) {
      if (runToken !== this.gptTranslationRunToken) {
        break;
      }
      this.translatingPoiId = row.poiId;
      try {
        const response = await firstValueFrom(
          this.auth.translateCatalogPoiWithOpenAi(row.poiId, {
            cityId,
            targetLanguage,
            overwrite
          })
        );
        if (runToken !== this.gptTranslationRunToken) {
          break;
        }
        this.applyOpenAiTranslationResponse(response);
        this.addGptTranslationUsage(response.usage);
        this.gptTranslationProgressDone += 1;
        this.gptTranslationLog = [`${row.name}: ${response.skipped ? 'gia completo' : 'tradotto'}`, ...this.gptTranslationLog].slice(0, 8);
      } catch (error) {
        if (runToken !== this.gptTranslationRunToken) {
          break;
        }
        const message = this.dashboardErrorMessage(error, 'Traduzione interrotta');
        this.gptTranslationLog = [`${row.name}: ${message}`, ...this.gptTranslationLog].slice(0, 8);
        this.snackBar.open(message, 'Chiudi', { duration: 4500 });
        break;
      }
    }

    if (runToken !== this.gptTranslationRunToken) {
      return;
    }
    this.bulkTranslatingPois = false;
    this.translatingPoiId = null;
    this.loadOpenAiTranslationStatus();
    this.loadOpenAiTranslationSummary();
    this.snackBar.open('Traduzione massiva terminata', 'OK', { duration: 2600 });
  }

  generateSelectedGptPoiAudio(): void {
    const poi = this.selectedGptTranslationPoi;
    if (!this.canGenerateSelectedGptPoiAudio || !poi) {
      return;
    }

    this.resetGptAudioProgress(1);
    const runToken = ++this.gptTranslationRunToken;
    this.generatingPoiAudioId = poi.id;
    this.auth
      .generateCatalogPoiAudioWithOpenAi(poi.id, {
        cityId: this.gptAudioForm.controls.cityId.value,
        targetLanguage: this.gptAudioForm.controls.targetLanguage.value,
        overwrite: this.gptAudioForm.controls.overwrite.value
      })
      .subscribe({
        next: (response) => {
          if (runToken !== this.gptTranslationRunToken) {
            return;
          }
          this.generatingPoiAudioId = null;
          this.gptAudioProgressDone = 1;
          this.applyOpenAiAudioResponse(response);
          this.loadOpenAiTranslationStatus();
          this.loadOpenAiTranslationSummary();
          this.snackBar.open(response.skipped ? 'Audio gia presente' : 'Audio tradotto generato', 'OK', { duration: 2600 });
        },
        error: (error: { error?: { message?: string } }) => {
          if (runToken !== this.gptTranslationRunToken) {
            return;
          }
          this.generatingPoiAudioId = null;
          const message = error?.error?.message || 'Generazione audio non riuscita';
          this.snackBar.open(message, 'Chiudi', { duration: 4200 });
        }
      });
  }

  async generateMissingGptPoiAudiosForCity(): Promise<void> {
    if (!this.canGenerateMissingGptPoiAudios) {
      return;
    }

    const cityId = this.gptAudioForm.controls.cityId.value;
    const targetLanguage = this.gptAudioForm.controls.targetLanguage.value;
    const overwrite = this.gptAudioForm.controls.overwrite.value;
    const rowsToGenerate = this.gptAudioRowsToGenerate;
    if (!cityId || !rowsToGenerate.length) {
      return;
    }

    this.bulkGeneratingPoiAudios = true;
    const runToken = ++this.gptTranslationRunToken;
    this.resetGptAudioProgress(rowsToGenerate.length);

    for (const row of rowsToGenerate) {
      if (runToken !== this.gptTranslationRunToken) {
        break;
      }
      this.generatingPoiAudioId = row.poiId;
      try {
        const response = await firstValueFrom(
          this.auth.generateCatalogPoiAudioWithOpenAi(row.poiId, {
            cityId,
            targetLanguage,
            overwrite
          })
        );
        if (runToken !== this.gptTranslationRunToken) {
          break;
        }
        this.applyOpenAiAudioResponse(response);
        this.gptAudioProgressDone += 1;
        this.gptAudioLog = [`${row.name}: ${response.skipped ? 'audio gia presente' : 'audio generato'}`, ...this.gptAudioLog].slice(0, 8);
      } catch (error) {
        if (runToken !== this.gptTranslationRunToken) {
          break;
        }
        const message = this.dashboardErrorMessage(error, 'Generazione audio interrotta');
        this.gptAudioLog = [`${row.name}: ${message}`, ...this.gptAudioLog].slice(0, 8);
        this.snackBar.open(message, 'Chiudi', { duration: 4500 });
        break;
      }
    }

    if (runToken !== this.gptTranslationRunToken) {
      return;
    }
    this.bulkGeneratingPoiAudios = false;
    this.generatingPoiAudioId = null;
    this.loadOpenAiTranslationStatus();
    this.loadOpenAiTranslationSummary();
    this.snackBar.open('Generazione audio terminata', 'OK', { duration: 2600 });
  }

  async generateMissingGptPoiAudiosForCatalog(): Promise<void> {
    if (!this.canGenerateCatalogGptPoiAudios) {
      return;
    }

    const targetLanguage = this.gptAudioForm.controls.targetLanguage.value;
    const overwrite = this.gptAudioForm.controls.overwrite.value;
    const runToken = ++this.gptTranslationRunToken;
    this.bulkGeneratingPoiAudios = true;
    this.resetGptAudioProgress();
    this.gptAudioLog = [];

    const jobs: Array<{ cityId: string; row: OpenAiPoiTranslationStatus }> = [];
    for (const city of this.catalogCities) {
      if (runToken !== this.gptTranslationRunToken) {
        return;
      }
      try {
        const rows = await firstValueFrom(this.auth.listOpenAiPoiTranslationStatus(city.id, targetLanguage));
        rows
          .filter((row) => this.isPoiTranslationTextReady(row.translation) && (overwrite || !row.hasAudio))
          .forEach((row) => jobs.push({ cityId: city.id, row }));
      } catch (error) {
        const message = this.dashboardErrorMessage(error, 'Impossibile leggere lo stato audio del catalogo');
        this.bulkGeneratingPoiAudios = false;
        this.snackBar.open(message, 'Chiudi', { duration: 4500 });
        return;
      }
    }

    if (!jobs.length) {
      this.bulkGeneratingPoiAudios = false;
      this.snackBar.open('Nessun audio generabile per la lingua selezionata', 'OK', { duration: 3000 });
      return;
    }

    this.resetGptAudioProgress(jobs.length);
    for (const job of jobs) {
      if (runToken !== this.gptTranslationRunToken) {
        return;
      }
      this.generatingPoiAudioId = job.row.poiId;
      try {
        const response = await firstValueFrom(
          this.auth.generateCatalogPoiAudioWithOpenAi(job.row.poiId, {
            cityId: job.cityId,
            targetLanguage,
            overwrite
          })
        );
        if (runToken !== this.gptTranslationRunToken) {
          return;
        }
        this.applyOpenAiAudioResponse(response);
        this.gptAudioProgressDone += 1;
        this.gptAudioLog = [`${job.row.name}: ${response.skipped ? 'audio gia presente' : 'audio generato'}`, ...this.gptAudioLog].slice(0, 8);
      } catch (error) {
        const message = this.dashboardErrorMessage(error, 'Generazione audio catalogo interrotta');
        this.gptAudioLog = [`${job.row.name}: ${message}`, ...this.gptAudioLog].slice(0, 8);
        this.snackBar.open(message, 'Chiudi', { duration: 4500 });
        break;
      }
    }

    if (runToken !== this.gptTranslationRunToken) {
      return;
    }
    this.bulkGeneratingPoiAudios = false;
    this.generatingPoiAudioId = null;
    this.loadOpenAiTranslationStatus();
    this.loadOpenAiTranslationSummary();
    this.snackBar.open('Generazione audio catalogo terminata', 'OK', { duration: 2800 });
  }

  async generateAllMissingGptPoiAudios(): Promise<void> {
    if (!this.canGenerateAllGptPoiAudios) {
      return;
    }

    const overwrite = this.gptAudioForm.controls.overwrite.value;
    const runToken = ++this.gptTranslationRunToken;
    this.bulkGeneratingPoiAudios = true;
    this.resetGptAudioProgress();
    this.gptAudioLog = [];

    const jobs: Array<{ cityId: string; language: AudioEditorLanguage; row: OpenAiPoiTranslationStatus }> = [];
    for (const language of this.audioLanguages.map((item) => item.code)) {
      for (const city of this.catalogCities) {
        if (runToken !== this.gptTranslationRunToken) {
          return;
        }
        try {
          const rows = await firstValueFrom(this.auth.listOpenAiPoiTranslationStatus(city.id, language));
          rows
            .filter((row) => this.isPoiTranslationTextReady(row.translation) && (overwrite || !row.hasAudio))
            .forEach((row) => jobs.push({ cityId: city.id, language, row }));
        } catch (error) {
          const message = this.dashboardErrorMessage(error, 'Impossibile leggere lo stato audio completo');
          this.bulkGeneratingPoiAudios = false;
          this.snackBar.open(message, 'Chiudi', { duration: 4500 });
          return;
        }
      }
    }

    if (!jobs.length) {
      this.bulkGeneratingPoiAudios = false;
      this.snackBar.open('Nessun audio generabile nel catalogo', 'OK', { duration: 3000 });
      return;
    }

    this.resetGptAudioProgress(jobs.length);
    for (const job of jobs) {
      if (runToken !== this.gptTranslationRunToken) {
        return;
      }
      this.generatingPoiAudioId = job.row.poiId;
      try {
        const response = await firstValueFrom(
          this.auth.generateCatalogPoiAudioWithOpenAi(job.row.poiId, {
            cityId: job.cityId,
            targetLanguage: job.language,
            overwrite
          })
        );
        if (runToken !== this.gptTranslationRunToken) {
          return;
        }
        this.applyOpenAiAudioResponse(response);
        this.gptAudioProgressDone += 1;
        const languageLabel = this.audioLanguages.find((item) => item.code === job.language)?.label || job.language.toUpperCase();
        this.gptAudioLog = [
          `${job.row.name} (${languageLabel}): ${response.skipped ? 'audio gia presente' : 'audio generato'}`,
          ...this.gptAudioLog
        ].slice(0, 8);
      } catch (error) {
        const message = this.dashboardErrorMessage(error, 'Generazione audio completa interrotta');
        this.gptAudioLog = [`${job.row.name}: ${message}`, ...this.gptAudioLog].slice(0, 8);
        this.snackBar.open(message, 'Chiudi', { duration: 4500 });
        break;
      }
    }

    if (runToken !== this.gptTranslationRunToken) {
      return;
    }
    this.bulkGeneratingPoiAudios = false;
    this.generatingPoiAudioId = null;
    this.loadOpenAiTranslationStatus();
    this.loadOpenAiTranslationSummary();
    this.snackBar.open('Generazione audio completa terminata', 'OK', { duration: 2800 });
  }

  gptMissingFieldsLabel(fields: string[] | null | undefined): string {
    if (!fields?.length) {
      return 'Completa';
    }

    const labels: Record<string, string> = {
      descriptionShort: 'descrizione breve',
      descriptionLong: 'descrizione lunga'
    };
    return fields.map((field) => labels[field] || field).join(', ');
  }

  partnerRequestContactName(request: DashboardPartnerRequest): string {
    return `${request.contactFirstName || ''} ${request.contactLastName || ''}`.trim() || request.contactEmail;
  }

  partnerRequestAddress(request: DashboardPartnerRequest): string {
    const line1 = [request.addressStreet, request.addressNumber].filter(Boolean).join(' ');
    const cityLine = [request.addressPostalCode, request.addressCity, request.addressProvince].filter(Boolean).join(' ');
    const areaLine = [request.addressRegion, request.addressCountry].filter(Boolean).join(', ');
    return [line1, cityLine, areaLine].filter(Boolean).join(' - ');
  }

  onPaymentsStructureFilterChange(structureId: string): void {
    if (!this.canManageUsers) {
      return;
    }

    this.selectedPaymentsStructureId = String(structureId || '').trim();
    this.loadPayments();
  }

  registerStructure(): void {
    if (!this.canManageUsers) {
      return;
    }

    if (this.structureForm.invalid || this.creatingStructure) {
      this.structureForm.markAllAsTouched();
      return;
    }

    this.creatingStructure = true;
    const { name, street, streetNumber, city, postalCode, province, country } = this.structureForm.getRawValue();
    this.auth
      .createStructure(
        name.trim(),
        street.trim(),
        streetNumber.trim(),
        city.trim(),
        postalCode.trim(),
        province.trim() || null,
        country.trim() || null
      )
      .subscribe({
      next: () => {
        this.creatingStructure = false;
        this.structureForm.reset({
          name: '',
          street: '',
          streetNumber: '',
          city: '',
          postalCode: '',
          province: '',
          country: 'Italia'
        });
        this.showStructureSection = false;
        this.snackBar.open('Struttura registrata con successo', 'OK', { duration: 3000 });
        this.loadStructures();
      },
      error: (error: { error?: { message?: string } }) => {
        this.creatingStructure = false;
        const message = error?.error?.message || 'Errore registrazione struttura';
        this.snackBar.open(message, 'Chiudi', { duration: 3500 });
      }
      });
  }

  editStructure(structure: DashboardStructure): void {
    this.editingStructureId = structure.id;
    this.structureEditForm.reset({
      name: structure.name || '',
      street: structure.street || '',
      streetNumber: structure.streetNumber || '',
      city: structure.city || '',
      postalCode: structure.postalCode || '',
      province: structure.province || '',
      country: structure.country || 'Italia'
    });
    this.showStructureSection = false;
  }

  cancelStructureEdit(): void {
    this.editingStructureId = null;
    this.updatingStructure = false;
    this.structureEditForm.reset({
      name: '',
      street: '',
      streetNumber: '',
      city: '',
      postalCode: '',
      province: '',
      country: 'Italia'
    });
  }

  updateStructure(): void {
    if (!this.canManageUsers || !this.editingStructureId || this.updatingStructure || this.structureEditForm.invalid) {
      this.structureEditForm.markAllAsTouched();
      return;
    }

    const { name, street, streetNumber, city, postalCode, province, country } = this.structureEditForm.getRawValue();
    this.updatingStructure = true;
    this.auth
      .updateStructure(
        this.editingStructureId,
        name.trim(),
        street.trim(),
        streetNumber.trim(),
        city.trim(),
        postalCode.trim(),
        province.trim() || null,
        country.trim() || null
      )
      .subscribe({
        next: () => {
          this.updatingStructure = false;
          this.snackBar.open('Struttura aggiornata con successo', 'OK', { duration: 2800 });
          this.cancelStructureEdit();
          this.loadStructures();
          this.loadUsers();
        },
        error: (error: { error?: { message?: string } }) => {
          this.updatingStructure = false;
          const message = error?.error?.message || 'Errore aggiornamento struttura';
          this.snackBar.open(message, 'Chiudi', { duration: 3500 });
        }
      });
  }

  deleteStructure(structure: DashboardStructure): void {
    if (!this.canManageUsers || this.deletingStructureId) {
      return;
    }

    const confirmed = window.confirm(
      `Eliminare la struttura "${structure.name}"? La riga restera nello storico, ma non sara piu visibile nelle liste operative.`
    );
    if (!confirmed) {
      return;
    }

    this.deletingStructureId = structure.id;
    this.auth.deleteStructure(structure.id).subscribe({
      next: () => {
        this.deletingStructureId = null;
        this.structures = this.structures.filter((item) => item.id !== structure.id);
        if (this.editingStructureId === structure.id) {
          this.cancelStructureEdit();
        }
        if (this.selectedUsersStructureFilterId === structure.id) {
          this.clearUsersStructureFilter();
        }
        if (this.selectedPaymentsStructureId === structure.id) {
          this.selectedPaymentsStructureId = '';
        }
        this.discountCodes = this.discountCodes.filter((item) => item.structureId !== structure.id);
        this.rebuildDiscountCodesIndex();
        this.snackBar.open('Struttura eliminata', 'OK', { duration: 2400 });
        this.loadUsers();
        this.loadDiscountCodes();
      },
      error: (error: { error?: { message?: string } }) => {
        this.deletingStructureId = null;
        const message = error?.error?.message || 'Errore eliminazione struttura';
        this.snackBar.open(message, 'Chiudi', { duration: 3200 });
      }
    });
  }

  loadDiscountCodes(): void {
    if (!this.canViewDiscountCodes || this.loadingDiscountCodes) {
      return;
    }

    const structureIdFilter = this.canManageUsers ? undefined : this.managedStructureId || undefined;
    if (this.isFacilityManager && !structureIdFilter) {
      this.discountCodes = [];
      this.rebuildDiscountCodesIndex();
      return;
    }

    this.loadingDiscountCodes = true;
    this.auth.listDiscountCodes(structureIdFilter).subscribe({
      next: (rows) => {
        this.loadingDiscountCodes = false;
        this.discountCodes = rows.map((row) => this.normalizeDiscountCodeRow(row));
        this.rebuildDiscountCodesIndex();
        this.scrollHighlightedDiscountCodeIntoView();
      },
      error: (error: { error?: { message?: string } }) => {
        this.loadingDiscountCodes = false;
        const message = error?.error?.message || 'Errore caricamento codici sconto';
        this.snackBar.open(message, 'Chiudi', { duration: 3500 });
      }
    });
  }

  toggleDiscountCodeCreateSection(): void {
    if (!this.canManageUsers || !this.createDiscountCodeDialog) {
      return;
    }
    if (!this.structures.length) {
      this.snackBar.open('Devi creare prima una struttura', 'Chiudi', { duration: 3000 });
      return;
    }
    if (!this.catalogCities.length && !this.loadingCatalogCities) {
      this.loadCatalogCities();
    }
    this.startCreateDiscountCode();
    this.createDiscountCodeDialogRef?.close();
    this.createDiscountCodeDialogRef = this.dialog.open(this.createDiscountCodeDialog, {
      width: '760px',
      maxWidth: '95vw'
    });
    this.createDiscountCodeDialogRef.afterClosed().subscribe(() => {
      this.createDiscountCodeDialogRef = undefined;
      this.creatingDiscountCode = false;
      this.startCreateDiscountCode();
    });
  }

  closeCreateDiscountCodeDialog(): void {
    this.createDiscountCodeDialogRef?.close();
    this.createDiscountCodeDialogRef = undefined;
    this.creatingDiscountCode = false;
    this.startCreateDiscountCode();
  }

  startCreateDiscountCode(): void {
    this.discountCodeCreateForm.reset({
      structureId: this.structures[0]?.id || '',
      applyTo: 'bundle',
      cityIds: this.catalogCities[0]?.id ? [this.catalogCities[0].id] : [],
      code: '',
      userDiscountPercent: 0,
      structureFixedAmount: 0,
      expiresAt: this.defaultDiscountCodeExpiryInput()
    });
  }

  generateDiscountCodeForCreate(): void {
    if (!this.canManageUsers || this.creatingDiscountCode) {
      return;
    }

    this.auth.generateStructureInviteCode().subscribe({
      next: (inviteCode) => {
        this.discountCodeCreateForm.controls.code.setValue(inviteCode);
        this.discountCodeCreateForm.controls.code.markAsDirty();
      },
      error: (error: { error?: { message?: string } }) => {
        const message = error?.error?.message || 'Errore generazione codice';
        this.snackBar.open(message, 'Chiudi', { duration: 3200 });
      }
    });
  }

  createDiscountCode(): void {
    if (!this.canManageUsers || this.creatingDiscountCode || this.discountCodeCreateForm.invalid) {
      this.discountCodeCreateForm.markAllAsTouched();
      return;
    }

    const {
      structureId,
      applyTo,
      cityIds,
      code,
      userDiscountPercent,
      structureFixedAmount,
      expiresAt
    } = this.discountCodeCreateForm.getRawValue();
    const normalizedCode = this.normalizeStructureInviteCode(code || '');
    if (!normalizedCode) {
      this.discountCodeCreateForm.controls.code.markAsTouched();
      this.snackBar.open('Codice obbligatorio', 'Chiudi', { duration: 2800 });
      return;
    }
    const expiresAtIso = this.toIsoDateTime(expiresAt);
    if (!expiresAtIso) {
      this.discountCodeCreateForm.controls.expiresAt.markAsTouched();
      this.snackBar.open('Scadenza non valida', 'Chiudi', { duration: 2800 });
      return;
    }
    const normalizedCityIds = this.normalizeSelectedCityIds(cityIds);
    if (!normalizedCityIds.length) {
      this.discountCodeCreateForm.controls.cityIds.markAsTouched();
      this.snackBar.open('Seleziona almeno una città', 'Chiudi', { duration: 2800 });
      return;
    }

    this.creatingDiscountCode = true;
    this.auth
      .createDiscountCode(
        structureId,
        applyTo,
        normalizedCityIds,
        this.normalizePercent(userDiscountPercent),
        this.normalizeEuroAmount(structureFixedAmount),
        expiresAtIso,
        normalizedCode
      )
      .subscribe({
        next: (created) => {
          this.creatingDiscountCode = false;
          this.discountCodes = [this.normalizeDiscountCodeRow(created), ...this.discountCodes];
          this.rebuildDiscountCodesIndex();
          this.snackBar.open(`Codice ${created.code} creato`, 'OK', { duration: 2600 });
          this.closeCreateDiscountCodeDialog();
          this.loadStructures();
        },
        error: (error: { error?: { message?: string } }) => {
          this.creatingDiscountCode = false;
          const message = error?.error?.message || 'Errore creazione codice sconto';
          this.snackBar.open(message, 'Chiudi', { duration: 3500 });
        }
      });
  }

  editDiscountCode(discountCode: DashboardDiscountCode): void {
    if (!this.catalogCities.length && !this.loadingCatalogCities) {
      this.loadCatalogCities();
    }
    this.editingDiscountCodeId = discountCode.id;
    const selectedCityIds = this.normalizeSelectedCityIds(discountCode.cityIds || []);
    const fallbackCityId = discountCode.cityId || this.catalogCities[0]?.id || '';
    this.discountCodeEditForm.reset({
      applyTo: discountCode.applyTo || 'bundle',
      cityIds: selectedCityIds.length ? selectedCityIds : fallbackCityId ? [fallbackCityId] : [],
      userDiscountPercent: this.normalizePercent(discountCode.userDiscountPercentApplied),
      structureFixedAmount: this.normalizeEuroAmount(discountCode.structureFixedAmountApplied),
      expiresAt: this.isoToInputDateTime(discountCode.expiresAt)
    });

    if (!this.editDiscountCodeDialog) {
      return;
    }
    this.editDiscountCodeDialogRef?.close();
    this.editDiscountCodeDialogRef = this.dialog.open(this.editDiscountCodeDialog, {
      width: '760px',
      maxWidth: '95vw'
    });
  }

  closeEditDiscountCodeDialog(): void {
    this.editDiscountCodeDialogRef?.close();
    this.editDiscountCodeDialogRef = undefined;
    this.editingDiscountCodeId = null;
    this.updatingDiscountCode = false;
    this.discountCodeEditForm.reset({
      applyTo: 'bundle',
      cityIds: this.catalogCities[0]?.id ? [this.catalogCities[0].id] : [],
      userDiscountPercent: 0,
      structureFixedAmount: 0,
      expiresAt: ''
    });
  }

  saveDiscountCodeEdit(): void {
    if (!this.canManageUsers || !this.editingDiscountCodeId || this.updatingDiscountCode || this.discountCodeEditForm.invalid) {
      this.discountCodeEditForm.markAllAsTouched();
      return;
    }

    const { applyTo, cityIds, userDiscountPercent, structureFixedAmount, expiresAt } = this.discountCodeEditForm.getRawValue();
    const expiresAtIso = this.toIsoDateTime(expiresAt);
    if (!expiresAtIso) {
      this.discountCodeEditForm.controls.expiresAt.markAsTouched();
      this.snackBar.open('Scadenza non valida', 'Chiudi', { duration: 2800 });
      return;
    }
    const normalizedCityIds = this.normalizeSelectedCityIds(cityIds);
    if (!normalizedCityIds.length) {
      this.discountCodeEditForm.controls.cityIds.markAsTouched();
      this.snackBar.open('Seleziona almeno una città', 'Chiudi', { duration: 2800 });
      return;
    }

    this.updatingDiscountCode = true;
    this.savingDiscountCodeId = this.editingDiscountCodeId;
    this.auth
      .updateDiscountCode(
        this.editingDiscountCodeId,
        applyTo,
        normalizedCityIds,
        this.normalizePercent(userDiscountPercent),
        this.normalizeEuroAmount(structureFixedAmount),
        expiresAtIso
      )
      .subscribe({
        next: (updated) => {
          this.updatingDiscountCode = false;
          this.savingDiscountCodeId = null;
          this.discountCodes = this.discountCodes.map((item) =>
            item.id === updated.id ? this.normalizeDiscountCodeRow(updated) : item
          );
          this.rebuildDiscountCodesIndex();
          this.snackBar.open(`Codice ${updated.code} aggiornato`, 'OK', { duration: 2600 });
          this.closeEditDiscountCodeDialog();
        },
        error: (error: { error?: { message?: string } }) => {
          this.updatingDiscountCode = false;
          this.savingDiscountCodeId = null;
          const message = error?.error?.message || 'Errore aggiornamento codice sconto';
          this.snackBar.open(message, 'Chiudi', { duration: 3500 });
        }
      });
  }

  deleteDiscountCode(discountCode: DashboardDiscountCode): void {
    if (!this.canManageUsers || this.deletingDiscountCodeId !== null) {
      return;
    }

    const confirmed = window.confirm(`Eliminare il codice ${discountCode.code}?`);
    if (!confirmed) {
      return;
    }

    this.deletingDiscountCodeId = discountCode.id;
    this.auth.deleteDiscountCode(discountCode.id).subscribe({
      next: () => {
        this.deletingDiscountCodeId = null;
        this.discountCodes = this.discountCodes.filter((item) => item.id !== discountCode.id);
        this.rebuildDiscountCodesIndex();
        this.snackBar.open(`Codice ${discountCode.code} eliminato`, 'OK', { duration: 2400 });
      },
      error: (error: { error?: { message?: string } }) => {
        this.deletingDiscountCodeId = null;
        const message = error?.error?.message || 'Errore eliminazione codice sconto';
        this.snackBar.open(message, 'Chiudi', { duration: 3200 });
      }
    });
  }

  ensureCatalogLoaded(): void {
    if (!this.catalogCities.length && !this.loadingCatalogCities) {
      this.loadCatalogCities();
      return;
    }

    if (!this.ensureCatalogSelectedCity()) {
      return;
    }

    if (
      this.selectedCatalogCityId &&
      !this.loadingCatalogPois &&
      (this.lastLoadedCatalogPoisCityId !== this.selectedCatalogCityId || !this.catalogPois.length)
    ) {
      this.loadCatalogPois(this.selectedCatalogCityId);
    }
  }

  loadCatalogCities(): void {
    if (!this.canManageCatalog || this.loadingCatalogCities) {
      return;
    }

    this.loadingCatalogCities = true;
    this.auth.listCatalogCities().subscribe({
      next: (rows) => {
        this.loadingCatalogCities = false;
        this.hasLoadedCatalogCitiesOnce = true;
        this.catalogCities = rows;
        const firstCityId = this.catalogCities[0]?.id || '';
        const createCityIds = this.normalizeSelectedCityIds(this.discountCodeCreateForm.controls.cityIds.value);
        const nextCreateCityIds = createCityIds.filter((cityId) => this.catalogCities.some((city) => city.id === cityId));
        if (!nextCreateCityIds.length && firstCityId) {
          this.discountCodeCreateForm.controls.cityIds.setValue([firstCityId]);
        } else if (nextCreateCityIds.length !== createCityIds.length) {
          this.discountCodeCreateForm.controls.cityIds.setValue(nextCreateCityIds);
        }
        const editCityIds = this.normalizeSelectedCityIds(this.discountCodeEditForm.controls.cityIds.value);
        const nextEditCityIds = editCityIds.filter((cityId) => this.catalogCities.some((city) => city.id === cityId));
        if (!nextEditCityIds.length && firstCityId) {
          this.discountCodeEditForm.controls.cityIds.setValue([firstCityId]);
        } else if (nextEditCityIds.length !== editCityIds.length) {
          this.discountCodeEditForm.controls.cityIds.setValue(nextEditCityIds);
        }
        const partnerCityIds = this.normalizeSelectedCityIds(this.partnerRequestApprovalForm.controls.cityIds.value);
        const nextPartnerCityIds = partnerCityIds.filter((cityId) => this.catalogCities.some((city) => city.id === cityId));
        if (!nextPartnerCityIds.length && firstCityId) {
          this.partnerRequestApprovalForm.controls.cityIds.setValue([firstCityId]);
        } else if (nextPartnerCityIds.length !== partnerCityIds.length) {
          this.partnerRequestApprovalForm.controls.cityIds.setValue(nextPartnerCityIds);
        }

        const hasSelection = this.ensureCatalogSelectedCity();
        if (hasSelection) {
          this.loadCatalogPois(this.selectedCatalogCityId, { force: true });
        }
        if (this.activeSection === 'gptTranslations') {
          this.ensureActiveGptCitySelection();
          this.loadOpenAiTranslationStatus();
        }
      },
      error: (error: { error?: { message?: string } }) => {
        this.loadingCatalogCities = false;
        const message = error?.error?.message || 'Errore caricamento città';
        this.snackBar.open(message, 'Chiudi', { duration: 3500 });
      }
    });
  }

  loadCatalogPois(cityId: string, options: { force?: boolean } = {}): void {
    if (!this.canManageCatalog || !cityId) {
      return;
    }

    const force = Boolean(options.force);
    if (!force && this.lastLoadedCatalogPoisCityId === cityId && this.catalogPois.length) {
      return;
    }

    const requestToken = ++this.catalogPoisRequestToken;
    this.loadingCatalogPois = true;
    this.auth.listCatalogPoisByCity(cityId).subscribe({
      next: (rows) => {
        if (requestToken !== this.catalogPoisRequestToken) {
          return;
        }
        this.loadingCatalogPois = false;
        this.lastLoadedCatalogPoisCityId = cityId;
        const dedupedById = new Map<string, DashboardCatalogPoi>();
        rows.forEach((row) => {
          if (!dedupedById.has(row.id)) {
            dedupedById.set(row.id, row);
          }
        });
        this.catalogPois = Array.from(dedupedById.values());
        this.preloadAudioDurationsForPois(this.catalogPois);
      },
      error: (error: { error?: { message?: string } }) => {
        if (requestToken !== this.catalogPoisRequestToken) {
          return;
        }
        this.loadingCatalogPois = false;
        const message = error?.error?.message || 'Errore caricamento luoghi di interesse';
        this.snackBar.open(message, 'Chiudi', { duration: 3500 });
      }
    });
  }

  onCatalogCityFilterChange(cityId: string, options: { force?: boolean } = {}): void {
    this.selectedCatalogCityId = cityId;
    if (!cityId) {
      this.catalogPois = [];
      this.lastLoadedCatalogPoisCityId = '';
      this.catalogPoisRequestToken += 1;
      this.loadingCatalogPois = false;
      return;
    }

    if (!this.editingCatalogPoiId) {
      this.catalogPoiForm.controls.cityId.setValue(cityId);
    }
    this.loadCatalogPois(cityId, { force: Boolean(options.force) });
  }

  startCreateCatalogCity(): void {
    this.editingCatalogCityId = null;
    this.editingCatalogCityIsDefault = false;
    this.catalogCityForm.reset({
      name: '',
      region: this.fixedCreateCityRegion,
      bundlePrice: 0,
      heroImage: '',
      isPublished: true,
      translations: {}
    });
    this.catalogCityForm.controls.region.disable({ emitEvent: false });
  }

  editCatalogCity(city: DashboardCatalogCity): void {
    this.editingCatalogCityId = city.id;
    this.editingCatalogCityIsDefault = city.isDefault;
    this.catalogCityEditForm.reset({
      name: city.name,
      region: city.region,
      bundlePrice: city.bundlePrice,
      heroImage: city.heroImage,
      isPublished: this.isCatalogItemPublished(city.publicationStatus),
      translations: {}
    });

    if (!this.editCatalogCityDialog) {
      return;
    }
    this.editCatalogCityDialogRef?.close();
    this.editCatalogCityDialogRef = this.dialog.open(this.editCatalogCityDialog, {
      width: '900px',
      maxWidth: '95vw'
    });
  }

  saveCatalogCity(): void {
    if (!this.canManageCatalog || this.savingCatalogCity || this.catalogCityForm.invalid) {
      this.catalogCityForm.markAllAsTouched();
      return;
    }

    const payload = this.toCatalogCityPayload(this.catalogCityForm.getRawValue(), false);
    this.savingCatalogCity = true;
    this.auth.createCatalogCity(payload).subscribe({
      next: (city) => {
        this.savingCatalogCity = false;
        this.selectedCatalogCityId = city.id;
        this.snackBar.open('Città creata', 'OK', { duration: 2400 });
        this.closeCreateCatalogCityDialog();
        this.loadCatalogCities();
      },
      error: (error: { error?: { message?: string } }) => {
        this.savingCatalogCity = false;
        const message = error?.error?.message || 'Errore salvataggio città';
        this.snackBar.open(message, 'Chiudi', { duration: 3500 });
      }
    });
  }

  closeCatalogCityEditDialog(): void {
    this.editCatalogCityDialogRef?.close();
    this.editCatalogCityDialogRef = undefined;
    this.editingCatalogCityId = null;
    this.uploadingCatalogCityEditImage = false;
    this.catalogCityEditForm.reset({
      name: '',
      region: '',
      bundlePrice: 0,
      heroImage: '',
      isPublished: false,
      translations: {}
    });
  }

  saveCatalogCityEdit(): void {
    if (!this.canManageCatalog || !this.editingCatalogCityId || this.savingCatalogCity || this.catalogCityEditForm.invalid) {
      this.catalogCityEditForm.markAllAsTouched();
      return;
    }

    const payload = this.toCatalogCityPayload(this.catalogCityEditForm.getRawValue(), this.editingCatalogCityIsDefault);
    this.savingCatalogCity = true;
    this.auth.updateCatalogCity(this.editingCatalogCityId, payload).subscribe({
      next: () => {
        this.savingCatalogCity = false;
        this.snackBar.open('Città aggiornata', 'OK', { duration: 2400 });
        this.closeCatalogCityEditDialog();
        this.loadCatalogCities();
      },
      error: (error: { error?: { message?: string } }) => {
        this.savingCatalogCity = false;
        const message = error?.error?.message || 'Errore aggiornamento città';
        this.snackBar.open(message, 'Chiudi', { duration: 3500 });
      }
    });
  }

  deleteCatalogCity(city: DashboardCatalogCity): void {
    if (!this.canManageCatalog || this.deletingCatalogCityId) {
      return;
    }

    const confirmed = window.confirm(
      `Eliminare la città "${city.name}"? Verranno eliminati anche i luoghi di interesse collegati.`
    );
    if (!confirmed) {
      return;
    }

    this.deletingCatalogCityId = city.id;
    this.auth.deleteCatalogCity(city.id).subscribe({
      next: () => {
        this.deletingCatalogCityId = null;
        if (this.editingCatalogCityId === city.id) {
          this.closeCatalogCityEditDialog();
        }
        if (this.selectedCatalogCityId === city.id) {
          this.selectedCatalogCityId = '';
          this.catalogPois = [];
          this.lastLoadedCatalogPoisCityId = '';
          this.catalogPoisRequestToken += 1;
          this.loadingCatalogPois = false;
        }
        this.snackBar.open('Città eliminata', 'OK', { duration: 2400 });
        this.loadCatalogCities();
      },
      error: (error: { error?: { message?: string } }) => {
        this.deletingCatalogCityId = null;
        const message = error?.error?.message || 'Errore eliminazione città';
        this.snackBar.open(message, 'Chiudi', { duration: 3500 });
      }
    });
  }

  startCreateCatalogPoi(): void {
    this.editingCatalogPoiId = null;
    this.resetCatalogPoiTranslationAudioUploadState('create');
    this.catalogPoiForm.reset({
      cityId: this.selectedCatalogCityId || '',
      name: '',
      address: '',
      lat: 0,
      lng: 0,
      category: this.poiCategoryOptions[0],
      descriptionShort: '',
      descriptionLong: '',
      imageUrl: '',
      audioUrl: '',
      priceSingle: 0,
      durationSec: 60,
      isPublished: false,
      translations: this.emptyCatalogPoiTranslationsFormValue()
    });
  }

  editCatalogPoi(poi: DashboardCatalogPoi): void {
    this.editingCatalogPoiId = poi.id;
    this.resetCatalogPoiTranslationAudioUploadState('edit');
    if (this.selectedCatalogCityId !== poi.cityId) {
      this.selectedCatalogCityId = poi.cityId;
      this.loadCatalogPois(poi.cityId);
    }
    this.catalogPoiEditForm.reset({
      cityId: poi.cityId,
      name: poi.name,
      address: poi.address || '',
      lat: poi.lat,
      lng: poi.lng,
      category: poi.category,
      descriptionShort: poi.descriptionShort,
      descriptionLong: poi.descriptionLong,
      imageUrl: poi.imageUrl,
      audioUrl: poi.audioUrl || '',
      priceSingle: poi.priceSingle,
      durationSec: poi.durationSec,
      isPublished: this.isCatalogItemPublished(poi.publicationStatus),
      translations: this.catalogPoiTranslationsFormValue(poi.translations)
    });

    if (!this.editCatalogPoiDialog) {
      return;
    }
    this.editCatalogPoiDialogRef?.close();
    this.editCatalogPoiDialogRef = this.dialog.open(this.editCatalogPoiDialog, {
      width: '980px',
      maxWidth: '96vw'
    });
  }

  saveCatalogPoi(): void {
    if (!this.canManageCatalog || this.savingCatalogPoi || this.catalogPoiForm.invalid) {
      this.catalogPoiForm.markAllAsTouched();
      return;
    }

    const payload = this.toCatalogPoiPayload(this.catalogPoiForm.getRawValue());
    this.savingCatalogPoi = true;
    this.auth.createCatalogPoi(payload).subscribe({
      next: (poi) => {
        this.savingCatalogPoi = false;
        this.snackBar.open('Punto interesse creato', 'OK', { duration: 2400 });
        this.selectedCatalogCityId = poi.cityId;
        this.closeCreateCatalogPoiDialog();
        this.loadCatalogCities();
        this.loadCatalogPois(poi.cityId, { force: true });
      },
      error: (error: { error?: { message?: string } }) => {
        this.savingCatalogPoi = false;
        const message = error?.error?.message || 'Errore salvataggio luogo di interesse';
        this.snackBar.open(message, 'Chiudi', { duration: 3500 });
      }
    });
  }

  closeCatalogPoiEditDialog(): void {
    this.editCatalogPoiDialogRef?.close();
    this.editCatalogPoiDialogRef = undefined;
    this.editingCatalogPoiId = null;
    this.uploadingCatalogPoiEditImage = false;
    this.uploadingCatalogPoiEditAudio = false;
    this.resetCatalogPoiTranslationAudioUploadState('edit');
    this.catalogPoiEditForm.reset({
      cityId: this.selectedCatalogCityId || '',
      name: '',
      address: '',
      lat: 0,
      lng: 0,
      category: this.poiCategoryOptions[0],
      descriptionShort: '',
      descriptionLong: '',
      imageUrl: '',
      audioUrl: '',
      priceSingle: 0,
      durationSec: 60,
      isPublished: false,
      translations: this.emptyCatalogPoiTranslationsFormValue()
    });
  }

  saveCatalogPoiEdit(): void {
    if (!this.canManageCatalog || !this.editingCatalogPoiId || this.savingCatalogPoi || this.catalogPoiEditForm.invalid) {
      this.catalogPoiEditForm.markAllAsTouched();
      return;
    }

    const payload = this.toCatalogPoiPayload(this.catalogPoiEditForm.getRawValue());
    this.savingCatalogPoi = true;
    this.auth.updateCatalogPoi(this.editingCatalogPoiId, payload).subscribe({
      next: (poi) => {
        this.savingCatalogPoi = false;
        this.snackBar.open('Punto interesse aggiornato', 'OK', { duration: 2400 });
        this.selectedCatalogCityId = poi.cityId;
        this.closeCatalogPoiEditDialog();
        this.loadCatalogCities();
        this.loadCatalogPois(poi.cityId, { force: true });
      },
      error: (error: { error?: { message?: string } }) => {
        this.savingCatalogPoi = false;
        const message = error?.error?.message || 'Errore aggiornamento luogo di interesse';
        this.snackBar.open(message, 'Chiudi', { duration: 3500 });
      }
    });
  }

  deleteCatalogPoi(poi: DashboardCatalogPoi): void {
    if (!this.canManageCatalog || this.deletingCatalogPoiId) {
      return;
    }

    const confirmed = window.confirm(`Eliminare il luogo di interesse "${poi.name}"?`);
    if (!confirmed) {
      return;
    }

    this.deletingCatalogPoiId = poi.id;
    this.auth.deleteCatalogPoi(poi.id).subscribe({
      next: () => {
        this.deletingCatalogPoiId = null;
        if (this.editingCatalogPoiId === poi.id) {
          this.closeCatalogPoiEditDialog();
        }
        this.snackBar.open('Luogo di interesse eliminato', 'OK', { duration: 2400 });
        this.loadCatalogCities();
        this.loadCatalogPois(poi.cityId, { force: true });
      },
      error: (error: { error?: { message?: string } }) => {
        this.deletingCatalogPoiId = null;
        const message = error?.error?.message || 'Errore eliminazione luogo di interesse';
        this.snackBar.open(message, 'Chiudi', { duration: 3500 });
      }
    });
  }

  onCatalogAudioFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target?.files?.[0];
    if (!file) {
      return;
    }
    if (this.isFileLargerThan(file, this.maxCatalogAudioUploadBytes, 'audio')) {
      target.value = '';
      return;
    }

    const fileDurationPromise = this.readAudioDurationFromFile(file);
    const mediaTarget = this.resolvePoiMediaTarget(this.catalogPoiForm.controls.cityId.value);
    if (!mediaTarget) {
      this.snackBar.open('Seleziona prima una città per caricare l audio', 'Chiudi', { duration: 3200 });
      target.value = '';
      return;
    }

    this.uploadCatalogPoiAudio(file, mediaTarget, (audioUrl) => {
      this.catalogPoiForm.controls.audioUrl.setValue(audioUrl);
      this.catalogPoiForm.controls.audioUrl.markAsDirty();
      this.applyDetectedDurationToControl(
        fileDurationPromise,
        this.catalogPoiForm.controls.durationSec,
        this.catalogPoiForm.controls.audioUrl.value
      );
    }, () => {
      this.uploadingCatalogAudio = true;
    }, () => {
      this.uploadingCatalogAudio = false;
      target.value = '';
    });
  }

  onCatalogImageFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target?.files?.[0];
    if (!file) {
      return;
    }
    if (this.isFileLargerThan(file, this.maxCatalogImageUploadBytes, 'immagine')) {
      target.value = '';
      return;
    }

    const mediaTarget = this.resolvePoiMediaTarget(this.catalogPoiForm.controls.cityId.value);
    if (!mediaTarget) {
      this.snackBar.open('Seleziona prima una città per caricare l immagine', 'Chiudi', { duration: 3200 });
      target.value = '';
      return;
    }

    this.uploadCatalogImage(file, mediaTarget, (imageUrl) => {
      this.catalogPoiForm.controls.imageUrl.setValue(imageUrl);
      this.catalogPoiForm.controls.imageUrl.markAsDirty();
    }, () => {
      this.uploadingCatalogImage = true;
    }, () => {
      this.uploadingCatalogImage = false;
      target.value = '';
    });
  }

  onCatalogCityImageFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target?.files?.[0];
    if (!file) {
      return;
    }
    if (this.isFileLargerThan(file, this.maxCatalogImageUploadBytes, 'immagine')) {
      target.value = '';
      return;
    }

    const cityName = this.catalogCityForm.controls.name.value.trim();
    if (!cityName) {
      this.snackBar.open('Inserisci prima il nome città', 'Chiudi', { duration: 3200 });
      target.value = '';
      return;
    }

    this.uploadCatalogImage(file, { cityName }, (imageUrl) => {
      this.catalogCityForm.controls.heroImage.setValue(imageUrl);
      this.catalogCityForm.controls.heroImage.markAsDirty();
    }, () => {
      this.uploadingCatalogCityImage = true;
    }, () => {
      this.uploadingCatalogCityImage = false;
      target.value = '';
    });
  }

  onCatalogCityEditImageFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target?.files?.[0];
    if (!file) {
      return;
    }
    if (this.isFileLargerThan(file, this.maxCatalogImageUploadBytes, 'immagine')) {
      target.value = '';
      return;
    }

    const cityName = this.catalogCityEditForm.controls.name.value.trim();
    const mediaTarget: CatalogMediaTarget = this.editingCatalogCityId
      ? { cityId: this.editingCatalogCityId }
      : { cityName };
    if (!mediaTarget.cityId && !mediaTarget.cityName) {
      this.snackBar.open('Nome città non valido per upload immagine', 'Chiudi', { duration: 3200 });
      target.value = '';
      return;
    }

    this.uploadCatalogImage(file, mediaTarget, (imageUrl) => {
      this.catalogCityEditForm.controls.heroImage.setValue(imageUrl);
      this.catalogCityEditForm.controls.heroImage.markAsDirty();
    }, () => {
      this.uploadingCatalogCityEditImage = true;
    }, () => {
      this.uploadingCatalogCityEditImage = false;
      target.value = '';
    });
  }

  onCatalogPoiEditImageFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target?.files?.[0];
    if (!file) {
      return;
    }
    if (this.isFileLargerThan(file, this.maxCatalogImageUploadBytes, 'immagine')) {
      target.value = '';
      return;
    }

    const mediaTarget = this.resolvePoiMediaTarget(this.catalogPoiEditForm.controls.cityId.value);
    if (!mediaTarget) {
      this.snackBar.open('Seleziona prima una città per caricare l immagine', 'Chiudi', { duration: 3200 });
      target.value = '';
      return;
    }

    this.uploadCatalogImage(file, mediaTarget, (imageUrl) => {
      this.catalogPoiEditForm.controls.imageUrl.setValue(imageUrl);
      this.catalogPoiEditForm.controls.imageUrl.markAsDirty();
    }, () => {
      this.uploadingCatalogPoiEditImage = true;
    }, () => {
      this.uploadingCatalogPoiEditImage = false;
      target.value = '';
    });
  }

  onCatalogPoiEditAudioFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target?.files?.[0];
    if (!file) {
      return;
    }
    if (this.isFileLargerThan(file, this.maxCatalogAudioUploadBytes, 'audio')) {
      target.value = '';
      return;
    }

    const fileDurationPromise = this.readAudioDurationFromFile(file);
    const mediaTarget = this.resolvePoiMediaTarget(this.catalogPoiEditForm.controls.cityId.value);
    if (!mediaTarget) {
      this.snackBar.open('Seleziona prima una città per caricare l audio', 'Chiudi', { duration: 3200 });
      target.value = '';
      return;
    }

    this.uploadCatalogPoiAudio(file, mediaTarget, (audioUrl) => {
      this.catalogPoiEditForm.controls.audioUrl.setValue(audioUrl);
      this.catalogPoiEditForm.controls.audioUrl.markAsDirty();
      this.applyDetectedDurationToControl(
        fileDurationPromise,
        this.catalogPoiEditForm.controls.durationSec,
        this.catalogPoiEditForm.controls.audioUrl.value
      );
    }, () => {
      this.uploadingCatalogPoiEditAudio = true;
    }, () => {
      this.uploadingCatalogPoiEditAudio = false;
      target.value = '';
    });
  }

  onCatalogPoiTranslationAudioFileSelected(event: Event, language: ContentEditorLanguage, target: 'create' | 'edit'): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) {
      return;
    }
    if (this.isFileLargerThan(file, this.maxCatalogAudioUploadBytes, 'audio')) {
      input.value = '';
      return;
    }

    const form = this.catalogPoiFormForTarget(target);
    const fileDurationPromise = this.readAudioDurationFromFile(file);
    const mediaTarget = this.resolvePoiMediaTarget(form.controls.cityId.value);
    if (!mediaTarget) {
      this.snackBar.open('Seleziona prima una città per caricare l audio', 'Chiudi', { duration: 3200 });
      input.value = '';
      return;
    }

    this.uploadCatalogPoiAudio(file, mediaTarget, (audioUrl) => {
      const audioControl = this.catalogPoiTranslationAudioControl(target, language);
      audioControl.setValue(audioUrl);
      audioControl.markAsDirty();
      this.applyDetectedDurationToControl(fileDurationPromise, form.controls.durationSec, audioUrl);
    }, () => {
      this.setCatalogPoiTranslationAudioUploading(target, language, true);
    }, () => {
      this.setCatalogPoiTranslationAudioUploading(target, language, false);
      input.value = '';
    });
  }

  clearCatalogCityImage(): void {
    this.catalogCityForm.controls.heroImage.setValue('');
    this.catalogCityForm.controls.heroImage.markAsDirty();
  }

  clearCatalogCityEditImage(): void {
    this.catalogCityEditForm.controls.heroImage.setValue('');
    this.catalogCityEditForm.controls.heroImage.markAsDirty();
  }

  clearCatalogPoiImage(): void {
    this.catalogPoiForm.controls.imageUrl.setValue('');
    this.catalogPoiForm.controls.imageUrl.markAsDirty();
  }

  clearCatalogPoiEditImage(): void {
    this.catalogPoiEditForm.controls.imageUrl.setValue('');
    this.catalogPoiEditForm.controls.imageUrl.markAsDirty();
  }

  clearCatalogPoiAudio(): void {
    this.catalogPoiForm.controls.audioUrl.setValue('');
    this.catalogPoiForm.controls.audioUrl.markAsDirty();
  }

  clearCatalogPoiEditAudio(): void {
    this.catalogPoiEditForm.controls.audioUrl.setValue('');
    this.catalogPoiEditForm.controls.audioUrl.markAsDirty();
  }

  clearCatalogPoiTranslationAudio(language: ContentEditorLanguage, target: 'create' | 'edit'): void {
    const audioControl = this.catalogPoiTranslationAudioControl(target, language);
    audioControl.setValue('');
    audioControl.markAsDirty();
  }

  catalogPoiTranslationAudioUrl(language: ContentEditorLanguage, target: 'create' | 'edit'): string {
    return this.catalogPoiTranslationAudioControl(target, language).value;
  }

  isCatalogPoiTranslationAudioUploading(language: ContentEditorLanguage, target: 'create' | 'edit'): boolean {
    return target === 'edit'
      ? this.uploadingCatalogPoiEditTranslationAudio[language]
      : this.uploadingCatalogPoiTranslationAudio[language];
  }

  hasUserDraftChanges(user: DashboardUserRow): boolean {
    if (this.isReadOnlyAppUser(user)) {
      return false;
    }
    if (user.role === 'admin') {
      return false;
    }

    const nextInviteCode = this.getNextInviteCodeForSave(user);
    const currentInviteCode = this.getCurrentInviteCode(user);
    return nextInviteCode !== currentInviteCode;
  }

  canSaveUser(user: DashboardUserRow): boolean {
    if (this.isReadOnlyAppUser(user)) {
      return false;
    }
    if (!this.canManageUsers) {
      return false;
    }
    if (this.savingUserId !== null) {
      return false;
    }
    if (!this.hasUserDraftChanges(user)) {
      return false;
    }

    const nextInviteCode = this.getNextInviteCodeForSave(user);
    if (nextInviteCode !== null && nextInviteCode.length !== 6) {
      return false;
    }

    if (this.roleNeedsStructure(user.role) && !nextInviteCode) {
      return false;
    }

    return true;
  }

  saveUserChanges(user: DashboardUserRow): void {
    if (this.isReadOnlyAppUser(user)) {
      return;
    }
    if (!this.canManageUsers || this.savingUserId) {
      return;
    }

    const nextInviteCode = this.getNextInviteCodeForSave(user);

    if (nextInviteCode !== null && nextInviteCode.length !== 6) {
      this.snackBar.open('Il codice struttura deve avere 6 caratteri alfanumerici', 'Chiudi', { duration: 3200 });
      return;
    }

    if (this.roleNeedsStructure(user.role) && !nextInviteCode) {
      this.snackBar.open('Per un gestore devi inserire un codice struttura valido', 'Chiudi', { duration: 3200 });
      return;
    }
    if (!this.hasUserDraftChanges(user)) {
      return;
    }

    this.savingUserId = user.id;
    this.auth.updateUserStructure(user.id, null, nextInviteCode).subscribe({
      next: (updated) => {
        this.savingUserId = null;
        this.users = this.users.map((item) => (item.id === updated.id ? updated : item));
        this.structureInviteCodeDraftByUserId[updated.id] = updated.structureInviteCode || '';
        this.snackBar.open(
          `Utente aggiornato: ${this.displayName(updated.firstName, updated.lastName, updated.email)}`,
          'OK',
          {
            duration: 2400
          }
        );
        this.loadStructures();
      },
      error: (error: { error?: { message?: string } }) => {
        this.savingUserId = null;
        this.structureInviteCodeDraftByUserId[user.id] = user.structureInviteCode || '';
        const message = error?.error?.message || 'Errore durante il salvataggio utente';
        this.snackBar.open(message, 'Chiudi', { duration: 3200 });
      }
    });
  }

  sendPasswordReset(user: DashboardUserRow): void {
    if (this.isReadOnlyAppUser(user)) {
      return;
    }
    if (!this.canManageUsers || this.resettingPasswordUserId || !user.isRegistered) {
      return;
    }

    this.resettingPasswordUserId = user.id;
    this.auth.sendUserPasswordReset(user.id, window.location.origin).subscribe({
      next: () => {
        this.resettingPasswordUserId = null;
        this.snackBar.open(`Email reset password inviata a ${user.email}`, 'OK', {
          duration: 3200
        });
      },
      error: (error: { error?: { message?: string } }) => {
        this.resettingPasswordUserId = null;
        const message = error?.error?.message || 'Errore invio reset password';
        this.snackBar.open(message, 'Chiudi', { duration: 3500 });
      }
    });
  }

  deleteUser(user: DashboardUserRow): void {
    if (this.isReadOnlyAppUser(user)) {
      return;
    }
    if (!this.canManageUsers || this.deletingUserId) {
      return;
    }

    const confirmed = window.confirm(`Eliminare l'utente ${this.displayName(user.firstName, user.lastName, user.email)}?`);
    if (!confirmed) {
      return;
    }

    this.deletingUserId = user.id;
    this.auth.deleteUser(user.id).subscribe({
      next: () => {
        this.deletingUserId = null;
        this.users = this.users.filter((item) => item.id !== user.id);
        delete this.structureInviteCodeDraftByUserId[user.id];
        this.snackBar.open('Utente eliminato', 'OK', { duration: 2400 });
        this.loadStructures();
      },
      error: (error: { error?: { message?: string } }) => {
        this.deletingUserId = null;
        const message = error?.error?.message || 'Errore eliminazione utente';
        this.snackBar.open(message, 'Chiudi', { duration: 3200 });
      }
    });
  }

  impersonate(user: DashboardUserRow): void {
    if (this.isReadOnlyAppUser(user)) {
      return;
    }
    if (!this.canManageUsers || this.impersonatingUserId) {
      return;
    }

    this.impersonatingUserId = user.id;
    this.auth.impersonateUser(user.id).subscribe({
      next: () => {
        this.impersonatingUserId = null;
        this.syncDashboardDataForCurrentRole();
        this.snackBar.open(`Stai navigando come ${this.displayName(user.firstName, user.lastName, user.email)}`, 'OK', {
          duration: 2400
        });
      },
      error: (error: { error?: { message?: string } }) => {
        this.impersonatingUserId = null;
        const message = error?.error?.message || 'Errore durante impersonazione';
        this.snackBar.open(message, 'Chiudi', { duration: 3200 });
      }
    });
  }

  exitImpersonation(): void {
    this.auth.exitImpersonation().subscribe({
      next: () => {
        this.syncDashboardDataForCurrentRole();
        this.snackBar.open('Tornato all account admin', 'OK', { duration: 2400 });
      },
      error: (error: { error?: { message?: string } }) => {
        const message = error?.error?.message || 'Impossibile uscire dalla modalita impersonazione';
        this.snackBar.open(message, 'Chiudi', { duration: 3200 });
      }
    });
  }

  async logout(): Promise<void> {
    if (!(await this.confirmGptTranslationContextChange())) {
      return;
    }
    this.cancelActiveGptTranslationForContextChange();

    this.auth.logout().subscribe(() => {
      this.isAuthenticated = false;
      this.users = [];
      this.structures = [];
      this.discountCodes = [];
      this.discountCodesByStructureId = {};
      this.discountCodeGroups = [];
      this.associatedUsers = [];
      this.payments = [];
      this.partnerRequests = [];
      this.partnerEmailSettings = null;
      this.payPalSettings = null;
      this.openAiTranslationSettings = null;
      this.openAiTranslationStatusRows = [];
      this.openAiTranslationSummary = null;
      this.privacyPolicySettings = null;
      this.appCacheSettings = null;
      this.privacyPolicyTranslations = this.emptyPrivacyPolicyTranslations();
      this.privacyPolicySelectedLanguage = 'it';
      this.privacyPolicyTranslateOverwrite = false;
      this.activeGlobalSettingsTab = 'privacyPolicy';
      this.activeGptTranslationsTab = 'texts';
      this.privacyPolicyTranslationUsage = { inputTokens: 0, outputTokens: 0, totalTokens: 0 };
      this.privacyPolicyTranslationLog = [];
      this.selectedGptTranslationPoiId = '';
      this.resetGptTranslationProgress();
      this.resetGptAudioProgress();
      this.paymentsSummary = {
        totalPayments: 0,
        totalCollected: 0,
        totalDiscountAmount: 0,
        totalStructureEarnings: 0
      };
      this.catalogCities = [];
      this.hasLoadedCatalogCitiesOnce = false;
      this.catalogPois = [];
      this.selectedCatalogCityId = '';
      this.lastLoadedCatalogPoisCityId = '';
      this.catalogPoisRequestToken = 0;
      this.openAiTranslationStatusRequestToken = 0;
      this.openAiTranslationSummaryRequestToken = 0;
      this.confirmedGptTranslationLanguage = 'en';
      this.confirmedGptTranslationOverwrite = false;
      this.confirmedGptAudioLanguage = 'it';
      this.confirmedGptAudioOverwrite = false;
      this.catalogTab = 'cities';
      this.editingCatalogCityId = null;
      this.editingCatalogPoiId = null;
      this.editingCatalogCityIsDefault = false;
      this.createCatalogCityDialogRef?.close();
      this.createCatalogPoiDialogRef?.close();
      this.editCatalogCityDialogRef?.close();
      this.editCatalogPoiDialogRef?.close();
      this.createDiscountCodeDialogRef?.close();
      this.editDiscountCodeDialogRef?.close();
      this.partnerRequestApprovalDialogRef?.close();
      this.catalogPoiAudioPlayerDialogRef?.close();
      this.poiMapPickerDialogRef?.close();
      this.createCatalogCityDialogRef = undefined;
      this.createCatalogPoiDialogRef = undefined;
      this.editCatalogCityDialogRef = undefined;
      this.editCatalogPoiDialogRef = undefined;
      this.createDiscountCodeDialogRef = undefined;
      this.editDiscountCodeDialogRef = undefined;
      this.partnerRequestApprovalDialogRef = undefined;
      this.catalogPoiAudioPlayerDialogRef = undefined;
      this.poiMapPickerDialogRef = undefined;
      this.audioPlayerPoiName = '';
      this.audioPlayerFileName = '';
      this.audioPlayerUrl = '';
      this.mapPickerTarget = null;
      this.mapPickerTargetLabel = '';
      this.mapPickerLoading = false;
      this.mapPickerMapReady = false;
      this.mapPickerResults = [];
      this.mapPickerSelectedLat = null;
      this.mapPickerSelectedLng = null;
      this.destroyPoiMap();
      this.lastInvite = null;
      this.loggingIn = false;
      this.inviting = false;
      this.creatingUser = false;
      this.loadingUsers = false;
      this.loadingStructures = false;
      this.loadingAssociatedUsers = false;
      this.loadingPayments = false;
      this.loadingPartnerRequests = false;
      this.loadingPayPalSettings = false;
      this.loadingOpenAiTranslationSettings = false;
      this.loadingOpenAiTranslationStatus = false;
      this.loadingOpenAiTranslationSummary = false;
      this.loadingPrivacyPolicySettings = false;
      this.loadingAppCacheSettings = false;
      this.creatingStructure = false;
      this.updatingStructure = false;
      this.loadingDiscountCodes = false;
      this.creatingDiscountCode = false;
      this.updatingDiscountCode = false;
      this.savingPayPalSettings = false;
      this.savingOpenAiTranslationSettings = false;
      this.previewingOpenAiVoice = false;
      this.cancelOpenAiVoicePreview();
      this.savingPrivacyPolicySettings = false;
      this.bumpingAppCacheVersion = false;
      this.translatingPrivacyPolicy = false;
      this.bulkTranslatingPois = false;
      this.bulkGeneratingPoiAudios = false;
      this.testingPayPalSettings = false;
      this.loadingCatalogCities = false;
      this.loadingCatalogPois = false;
      this.savingCatalogCity = false;
      this.savingCatalogPoi = false;
      this.uploadingCatalogAudio = false;
      this.uploadingCatalogCityImage = false;
      this.uploadingCatalogImage = false;
      this.resetCatalogPoiTranslationAudioUploadState('create');
      this.uploadingCatalogCityEditImage = false;
      this.uploadingCatalogPoiEditImage = false;
      this.uploadingCatalogPoiEditAudio = false;
      this.resetCatalogPoiTranslationAudioUploadState('edit');
      this.deletingCatalogCityId = null;
      this.deletingCatalogPoiId = null;
      this.partnerRequestApprovalTarget = null;
      this.approvingPartnerRequestId = null;
      this.rejectingPartnerRequestId = null;
      this.deletingPartnerRequestId = null;
      this.previewingPartnerRequestId = null;
      this.savingUserId = null;
      this.savingDiscountCodeId = null;
      this.deletingDiscountCodeId = null;
      this.deletingStructureId = null;
      this.resettingPasswordUserId = null;
      this.deletingUserId = null;
      this.impersonatingUserId = null;
      this.translatingPoiId = null;
      this.generatingPoiAudioId = null;
      this.activeSection = 'users';
      this.showInviteSection = false;
      this.showCreateUserSection = false;
      this.showStructureSection = false;
      this.editingStructureId = null;
      this.editingDiscountCodeId = null;
      Object.keys(this.audioDurationByUrl).forEach((audioUrl) => {
        delete this.audioDurationByUrl[audioUrl];
      });
      this.pendingAudioDurationUrls.clear();
      this.invalidAudioDurationUrls.clear();
      Object.keys(this.structureInviteCodeDraftByUserId).forEach((userId) => {
        delete this.structureInviteCodeDraftByUserId[userId];
      });
      this.loginForm.reset();
      this.inviteForm.reset({
        firstName: '',
        lastName: '',
        email: '',
        role: 'facility_manager',
        structureId: this.noStructureValue
      });
      this.createUserForm.reset({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'user',
        structureId: this.noStructureValue
      });
      this.structureForm.reset({
        name: '',
        street: '',
        streetNumber: '',
        city: '',
        postalCode: '',
        province: '',
        country: 'Italia'
      });
      this.structureEditForm.reset({
        name: '',
        street: '',
        streetNumber: '',
        city: '',
        postalCode: '',
        province: '',
        country: 'Italia'
      });
      this.catalogCityForm.reset({
        name: '',
        region: this.fixedCreateCityRegion,
        bundlePrice: 0,
        heroImage: '',
        isPublished: true,
        translations: {}
      });
      this.catalogCityForm.controls.region.disable({ emitEvent: false });
      this.discountCodeCreateForm.reset({
        structureId: '',
        applyTo: 'bundle',
        cityIds: [],
        code: '',
        userDiscountPercent: 0,
        structureFixedAmount: 0,
        expiresAt: ''
      });
      this.discountCodeEditForm.reset({
        applyTo: 'bundle',
        cityIds: [],
        userDiscountPercent: 0,
        structureFixedAmount: 0,
        expiresAt: ''
      });
      this.payPalForm.reset({
        isEnabled: false,
        mode: 'sandbox',
        clientId: '',
        clientSecret: '',
        merchantId: '',
        merchantEmail: '',
        brandName: 'Walk Around',
        webhookId: ''
      });
      this.openAiTranslationSettingsForm.reset({
        apiKey: '',
        model: 'gpt-4o-mini',
        ttsModel: 'gpt-4o-mini-tts',
        ttsVoice: 'alloy',
        ttsInstructions: 'Narrazione chiara, naturale e professionale per una audioguida turistica. Ritmo medio, tono coinvolgente e pronuncia curata dei nomi propri italiani.'
      });
      this.gptTranslationForm.reset({
        cityId: '',
        targetLanguage: 'en',
        poiId: '',
        overwrite: false
      });
      this.gptAudioForm.reset({
        cityId: '',
        targetLanguage: 'it',
        poiId: '',
        overwrite: false
      });
      this.catalogCityEditForm.reset({
        name: '',
        region: '',
        bundlePrice: 0,
        heroImage: '',
        translations: {}
      });
      this.catalogPoiForm.reset({
        cityId: '',
        name: '',
        lat: 0,
        lng: 0,
        category: this.poiCategoryOptions[0],
        descriptionShort: '',
        descriptionLong: '',
        imageUrl: '',
        audioUrl: '',
        priceSingle: 0,
        durationSec: 60,
        translations: this.emptyCatalogPoiTranslationsFormValue()
      });
      this.catalogPoiEditForm.reset({
        cityId: '',
        name: '',
        lat: 0,
        lng: 0,
        category: this.poiCategoryOptions[0],
        descriptionShort: '',
        descriptionLong: '',
        imageUrl: '',
        audioUrl: '',
        priceSingle: 0,
        durationSec: 60,
        translations: this.emptyCatalogPoiTranslationsFormValue()
      });
      this.poiMapSearchForm.reset({
        query: ''
      });
      void this.router.navigate(['/dashboard']);
    });
  }

  roleLabel(role: UserRole): string {
    if (role === 'admin') {
      return 'Admin';
    }
    if (role === 'facility_manager') {
      return 'Gestore struttura';
    }
    return 'Utente normale';
  }

  isReadOnlyAppUser(user: DashboardUserRow): boolean {
    return user.accountType === 'app';
  }

  userAssociations(user: DashboardUserRow): DashboardUserAssociation[] {
    const associations = Array.isArray(user.associatedStructures) ? user.associatedStructures : [];
    if (associations.length) {
      return associations;
    }

    if (user.structureId || user.structureName) {
      return [
        {
          structureId: user.structureId || '',
          structureName: user.structureName || null,
          structureAddress: user.structureAddress || null,
          inviteCode: user.structureInviteCode || null,
          status: 'assigned',
          associatedAt: user.createdAt || null,
          usedAt: null,
          updatedAt: user.updatedAt || null
        }
      ];
    }

    return [];
  }

  userUnlockedCities(user: DashboardUserRow): Array<{ cityId: string; cityName: string | null; unlockedAt: string | null }> {
    return Array.isArray(user.unlockedCities) ? user.unlockedCities : [];
  }

  userUnlockedPois(user: DashboardUserRow): Array<{
    poiId: string;
    poiName: string | null;
    cityId: string;
    cityName: string | null;
    unlockedAt: string | null;
  }> {
    return Array.isArray(user.unlockedPois) ? user.unlockedPois : [];
  }

  userAssociationStatusLabel(status: DashboardUserAssociation['status']): string {
    if (status === 'active') {
      return 'Attivo';
    }
    if (status === 'used') {
      return 'Usato';
    }
    if (status === 'expired') {
      return 'Scaduto';
    }
    if (status === 'assigned') {
      return 'Assegnata';
    }
    return 'Non valido';
  }

  userAssociationStatusClass(status: DashboardUserAssociation['status']): string {
    if (status === 'active' || status === 'assigned') {
      return 'association-status association-status-active';
    }
    if (status === 'used') {
      return 'association-status association-status-used';
    }
    if (status === 'expired') {
      return 'association-status association-status-expired';
    }
    return 'association-status association-status-invalid';
  }

  userAssociationStatusTooltip(status: DashboardUserAssociation['status']): string {
    if (status === 'assigned') {
      return 'Assegnata: il codice è collegato all\'utente ma non è ancora stato riscattato.';
    }
    if (status === 'used') {
      return 'Usato: il codice è già stato riscattato e ha già generato lo sblocco.';
    }
    if (status === 'active') {
      return 'Attivo: codice valido e disponibile.';
    }
    if (status === 'expired') {
      return 'Scaduto: codice non più utilizzabile.';
    }
    return 'Non valido: codice non riconosciuto o non associabile.';
  }

  openUsersForStructure(structure: DashboardStructure): void {
    if (!this.canManageUsers) {
      return;
    }
    this.selectedUsersStructureFilterId = structure.id;
    this.selectSection('users');
  }

  clearUsersStructureFilter(): void {
    this.selectedUsersStructureFilterId = null;
  }

  displayName(firstName: string, lastName: string, email = ''): string {
    const fullName = `${firstName || ''} ${lastName || ''}`.trim();
    return fullName || email;
  }

  formatStructureAddress(structure: DashboardStructure): string {
    if (structure.street && structure.streetNumber && structure.city && structure.postalCode) {
      const provincePart = structure.province ? ` (${structure.province})` : '';
      const countryPart = structure.country ? `, ${structure.country}` : '';
      return `${structure.street} ${structure.streetNumber}, ${structure.postalCode} ${structure.city}${provincePart}${countryPart}`;
    }

    return structure.address;
  }

  formatDateTime(value: string | null | undefined): string {
    if (!value) {
      return '-';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '-';
    }

    return this.italianDateTimeFormatter.format(date);
  }

  discountCodeExpiryStatus(value: string | null | undefined): 'active' | 'expired' | 'unknown' {
    if (!value) {
      return 'unknown';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return 'unknown';
    }

    return date.getTime() > Date.now() ? 'active' : 'expired';
  }

  formatCurrency(value: number | null | undefined): string {
    const amount = Number(value);
    if (!Number.isFinite(amount)) {
      return '-';
    }
    return this.italianCurrencyFormatter.format(amount);
  }

  audioFileNameFromUrl(audioUrl: string | null | undefined): string {
    const normalized = this.normalizeAudioUrl(audioUrl);
    if (!normalized) {
      return '-';
    }

    const cleanPath = normalized.split('?')[0].split('#')[0];
    const segments = cleanPath.split('/').filter(Boolean);
    const fileName = segments.length ? segments[segments.length - 1] : cleanPath;
    if (!fileName) {
      return '-';
    }

    try {
      return decodeURIComponent(fileName);
    } catch {
      return fileName;
    }
  }

  formatCatalogPoiDuration(poi: DashboardCatalogPoi): string {
    const normalizedAudioUrl = this.normalizeAudioUrl(poi.audioUrl);
    if (!normalizedAudioUrl) {
      return '-';
    }

    if (normalizedAudioUrl && this.invalidAudioDurationUrls.has(normalizedAudioUrl)) {
      return 'Audio non valido';
    }
    if (this.pendingAudioDurationUrls.has(normalizedAudioUrl)) {
      return '...';
    }

    const durationSec = this.resolvePoiDurationSeconds(poi);
    if (!Number.isFinite(durationSec) || durationSec === null || durationSec <= 0) {
      return '-';
    }

    const safeSeconds = Math.round(durationSec);
    const minutes = Math.floor(safeSeconds / 60);
    const seconds = safeSeconds % 60;
    return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
  }

  openCatalogPoiAudioPlayer(poi: DashboardCatalogPoi): void {
    const normalizedAudioUrl = this.normalizeAudioUrl(poi.audioUrl);
    if (!normalizedAudioUrl || !this.catalogPoiAudioPlayerDialog) {
      this.snackBar.open('Nessun audio disponibile per questo luogo', 'Chiudi', { duration: 2600 });
      return;
    }

    this.audioPlayerPoiName = poi.name;
    this.audioPlayerUrl = normalizedAudioUrl;
    this.audioPlayerFileName = this.audioFileNameFromUrl(normalizedAudioUrl);
    this.catalogPoiAudioPlayerDialogRef?.close();
    this.catalogPoiAudioPlayerDialogRef = this.dialog.open(this.catalogPoiAudioPlayerDialog, {
      width: '640px',
      maxWidth: '95vw'
    });
    this.catalogPoiAudioPlayerDialogRef.afterClosed().subscribe(() => {
      this.audioPlayerPoiName = '';
      this.audioPlayerFileName = '';
      this.audioPlayerUrl = '';
    });
  }

  closeCatalogPoiAudioPlayer(): void {
    this.catalogPoiAudioPlayerDialogRef?.close();
    this.catalogPoiAudioPlayerDialogRef = undefined;
    this.audioPlayerPoiName = '';
    this.audioPlayerFileName = '';
    this.audioPlayerUrl = '';
  }

  cityDisplayName(cityId: string): string {
    const city = this.catalogCities.find((item) => item.id === cityId);
    return city ? city.name : cityId;
  }

  poiCategoryOptionsFor(currentValue: string | null | undefined): string[] {
    const current = String(currentValue || '').trim();
    if (!current || this.poiCategoryOptions.includes(current)) {
      return this.poiCategoryOptions;
    }
    return [...this.poiCategoryOptions, current];
  }

  paymentTargetLabel(payment: DashboardPaymentRow): string {
    if (payment.targetName) {
      return payment.targetName;
    }
    if (payment.type === 'bundle') {
      return payment.cityName || payment.cityId || 'Città';
    }
    return payment.poiName || payment.poiId || 'Luogo';
  }

  trackByPaymentId(_index: number, payment: DashboardPaymentRow): number {
    return payment.id;
  }

  trackByCatalogPoiId(_index: number, poi: DashboardCatalogPoi): string {
    return poi.id;
  }

  trackByPartnerRequestId(_index: number, request: DashboardPartnerRequest): number {
    return request.id;
  }

  structureCodes(structureId: string): DashboardDiscountCode[] {
    return this.discountCodesByStructureId[structureId] || [];
  }

  discountCodeApplyToLabel(applyTo: DiscountCodeApplyTo): string {
    return applyTo === 'bundle' ? 'Pacchetto città' : 'Luogo singolo';
  }

  discountCodeCitiesLabel(discountCode: DashboardDiscountCode): string {
    const names = Array.isArray(discountCode.cityNames) ? discountCode.cityNames.filter(Boolean) : [];
    if (names.length) {
      return names.join(', ');
    }
    const ids = Array.isArray(discountCode.cityIds) ? discountCode.cityIds.filter(Boolean) : [];
    if (ids.length) {
      return ids.map((cityId) => this.cityDisplayName(cityId) || cityId).join(', ');
    }
    if (discountCode.cityName) {
      return discountCode.cityName;
    }
    if (discountCode.cityId) {
      return this.cityDisplayName(discountCode.cityId) || discountCode.cityId;
    }
    return 'Tutte';
  }

  refreshAll(): void {
    this.loadStructures();
    this.loadUsers();
    if (this.activeSection === 'discounts' || this.activeSection === 'structures') {
      this.loadDiscountCodes();
    }
    if (this.activeSection === 'partnerRequests' && this.canManageUsers) {
      this.loadPartnerRequests();
    }
    if (this.activeSection === 'partnerEmails' && this.canManagePartnerEmails) {
      this.loadPartnerEmailSettings(true);
    }
    if (this.activeSection === 'payments') {
      this.loadPayments();
    }
    if (this.activeSection === 'paypal') {
      this.loadPayPalSettings();
    }
    if (this.activeSection === 'gptTranslations') {
      this.ensureGptTranslationsLoaded();
    }
    if (this.activeSection === 'globalSettings') {
      this.ensureGlobalSettingsLoaded(true);
    }
    if (this.activeSection === 'catalog') {
      this.loadCatalogCities();
    }
  }

  private showDashboardMessagesFromQuery(): void {
    const query = this.route.snapshot.queryParamMap;
    let consumed = false;
    if (query.get('alreadyRegistered') === '1') {
      this.snackBar.open('Utente gia registrato. Effettua il login.', 'OK', { duration: 3200 });
      consumed = true;
    } else if (query.get('registered') === '1') {
      this.snackBar.open('Registrazione completata. Ora effettua il login.', 'OK', { duration: 3200 });
      consumed = true;
    } else if (query.get('passwordReset') === '1') {
      this.snackBar.open('Password aggiornata. Effettua il login.', 'OK', { duration: 3200 });
      consumed = true;
    }

    if (consumed) {
      void this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {},
        replaceUrl: true
      });
    }
  }

  private readStoredActiveSection(): DashboardSection {
    try {
      const stored = localStorage.getItem(DASHBOARD_ACTIVE_SECTION_KEY) as DashboardSection | null;
      const isKnownSection =
        this.sections.some((section) => section.id === stored) ||
        this.managerSections.some((section) => section.id === stored);
      return isKnownSection && stored ? stored : 'users';
    } catch {
      return 'users';
    }
  }

  private storeActiveSection(section: DashboardSection): void {
    try {
      localStorage.setItem(DASHBOARD_ACTIVE_SECTION_KEY, section);
    } catch {
      // Section persistence is only a UI convenience.
    }
  }

  private applyPayPalSettingsToForm(settings: DashboardPayPalSettings): void {
    this.payPalForm.setValue({
      isEnabled: Boolean(settings.isEnabled),
      mode: settings.mode === 'live' ? 'live' : 'sandbox',
      clientId: settings.clientId || '',
      clientSecret: settings.clientSecret || '',
      merchantId: settings.merchantId || '',
      merchantEmail: settings.merchantEmail || '',
      brandName: settings.brandName || 'Walk Around',
      webhookId: settings.webhookId || ''
    });
    this.payPalForm.markAsPristine();
    this.payPalForm.markAsUntouched();
  }

  private toCatalogCityPayload(
    value: {
      name: string;
      region: string;
      bundlePrice: number;
      heroImage: string;
      isPublished: boolean;
    },
    isDefault: boolean
  ): CatalogCityInput {
    return {
      name: value.name.trim(),
      region: value.region.trim(),
      bundlePrice: Number(value.bundlePrice),
      heroImage: value.heroImage.trim(),
      isDefault: Boolean(isDefault),
      publicationStatus: value.isPublished ? 'published' : 'draft',
      translations: {}
    };
  }

  private toCatalogPoiPayload(value: {
    cityId: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    category: string;
    descriptionShort: string;
    descriptionLong: string;
    imageUrl: string;
    audioUrl: string;
    priceSingle: number;
    durationSec: number;
    isPublished: boolean;
    translations: CatalogPoiTranslationsFormValue;
  }): CatalogPoiInput {
    const normalizedAudioUrl = value.audioUrl.trim();
    const cachedDuration = this.audioDurationByUrl[normalizedAudioUrl];
    const resolvedDuration = Number.isFinite(cachedDuration) && cachedDuration > 0
      ? cachedDuration
      : Number(value.durationSec);

    return {
      cityId: value.cityId,
      name: value.name.trim(),
      address: value.address.trim(),
      lat: Number(value.lat),
      lng: Number(value.lng),
      category: value.category.trim(),
      descriptionShort: value.descriptionShort.trim(),
      descriptionLong: value.descriptionLong.trim(),
      imageUrl: value.imageUrl.trim(),
      audioUrl: normalizedAudioUrl,
      priceSingle: Number(value.priceSingle),
      durationSec: Math.max(1, Math.round(resolvedDuration)),
      publicationStatus: value.isPublished ? 'published' : 'draft',
      translations: this.buildCatalogPoiTranslationsPayload(value.translations)
    };
  }

  private emptyCatalogPoiTranslationsFormValue(): CatalogPoiTranslationsFormValue {
    return {
      en: {
        descriptionShort: '',
        descriptionLong: '',
        audioUrl: ''
      },
      fr: {
        descriptionShort: '',
        descriptionLong: '',
        audioUrl: ''
      },
      es: {
        descriptionShort: '',
        descriptionLong: '',
        audioUrl: ''
      },
      de: {
        descriptionShort: '',
        descriptionLong: '',
        audioUrl: ''
      },
      pl: {
        descriptionShort: '',
        descriptionLong: '',
        audioUrl: ''
      }
    };
  }

  private catalogPoiTranslationsFormValue(translations: PoiTranslations | null | undefined): CatalogPoiTranslationsFormValue {
    return {
      en: {
        descriptionShort: String(translations?.en?.descriptionShort || ''),
        descriptionLong: String(translations?.en?.descriptionLong || ''),
        audioUrl: String(translations?.en?.audioUrl || '')
      },
      fr: {
        descriptionShort: String(translations?.fr?.descriptionShort || ''),
        descriptionLong: String(translations?.fr?.descriptionLong || ''),
        audioUrl: String(translations?.fr?.audioUrl || '')
      },
      es: {
        descriptionShort: String(translations?.es?.descriptionShort || ''),
        descriptionLong: String(translations?.es?.descriptionLong || ''),
        audioUrl: String(translations?.es?.audioUrl || '')
      },
      de: {
        descriptionShort: String(translations?.de?.descriptionShort || ''),
        descriptionLong: String(translations?.de?.descriptionLong || ''),
        audioUrl: String(translations?.de?.audioUrl || '')
      },
      pl: {
        descriptionShort: String(translations?.pl?.descriptionShort || ''),
        descriptionLong: String(translations?.pl?.descriptionLong || ''),
        audioUrl: String(translations?.pl?.audioUrl || '')
      }
    };
  }

  private buildCatalogPoiTranslationsPayload(value: CatalogPoiTranslationsFormValue): PoiTranslations | undefined {
    const translations: PoiTranslations = {};

    this.contentLanguages.forEach(({ code }) => {
      const descriptionShort = this.normalizeTranslationValue(value?.[code]?.descriptionShort);
      const descriptionLong = this.normalizeTranslationValue(value?.[code]?.descriptionLong);
      const audioUrl = this.normalizeTranslationValue(value?.[code]?.audioUrl);

      if (descriptionShort || descriptionLong || audioUrl) {
        translations[code] = {
          ...(descriptionShort ? { descriptionShort } : {}),
          ...(descriptionLong ? { descriptionLong } : {}),
          ...(audioUrl ? { audioUrl } : {})
        };
      }
    });

    return Object.keys(translations).length ? translations : undefined;
  }

  private normalizeTranslationValue(value: string | null | undefined): string | undefined {
    const normalized = String(value || '').trim();
    return normalized || undefined;
  }

  private applyPrivacyPolicySettings(settings: DashboardPrivacyPolicySettings): void {
    this.privacyPolicySettings = settings;
    this.privacyPolicyTranslations = this.emptyPrivacyPolicyTranslations(settings.translations);
    this.syncPrivacyPolicyEditor();
  }

  private syncPrivacyPolicyEditor(): void {
    window.setTimeout(() => {
      const editor = this.privacyPolicyEditor?.nativeElement;
      if (!editor) {
        return;
      }

      editor.innerHTML = this.privacyPolicyTranslations[this.privacyPolicySelectedLanguage] || '';
    });
  }

  private capturePrivacyPolicyEditorContent(): void {
    const editor = this.privacyPolicyEditor?.nativeElement;
    if (!editor) {
      return;
    }

    this.privacyPolicyTranslations[this.privacyPolicySelectedLanguage] = editor.innerHTML.trim();
  }

  private emptyPrivacyPolicyTranslations(source?: PrivacyPolicyTranslations | null): Record<PrivacyPolicyLanguage, string> {
    return this.privacyPolicyLanguages.reduce(
      (acc, language) => {
        acc[language.code] = String(source?.[language.code] || '');
        return acc;
      },
      {} as Record<PrivacyPolicyLanguage, string>
    );
  }

  private privacyPolicyLanguageLabel(language: PrivacyPolicyLanguage): string {
    return this.privacyPolicyLanguages.find((item) => item.code === language)?.label || language.toUpperCase();
  }

  private plainTextToPrivacyHtml(value: string): string {
    return String(value || '')
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)
      .map((paragraph) => `<p>${this.escapeHtml(paragraph).replace(/\n/g, '<br>')}</p>`)
      .join('');
  }

  private escapeHtml(value: string): string {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  private ensureGptTranslationCitySelection(): string {
    return this.ensureGptCitySelection('texts');
  }

  private ensureGptAudioCitySelection(): string {
    return this.ensureGptCitySelection('audio');
  }

  private ensureActiveGptCitySelection(): string {
    return this.activeGptTranslationsTab === 'audio' ? this.ensureGptAudioCitySelection() : this.ensureGptTranslationCitySelection();
  }

  private ensureGptCitySelection(tab: 'texts' | 'audio'): string {
    const form = tab === 'audio' ? this.gptAudioForm : this.gptTranslationForm;
    if (!this.catalogCities.length) {
      form.controls.cityId.setValue('', { emitEvent: false });
      return '';
    }

    const currentCityId = form.controls.cityId.value;
    const currentIsValid = Boolean(currentCityId && this.catalogCities.some((city) => city.id === currentCityId));
    const selectedCatalogCityIsValid = Boolean(
      this.selectedCatalogCityId && this.catalogCities.some((city) => city.id === this.selectedCatalogCityId)
    );
    const nextCityId = currentIsValid
      ? currentCityId
      : selectedCatalogCityIsValid
      ? this.selectedCatalogCityId
      : this.catalogCities[0]?.id || '';

    if (nextCityId !== currentCityId) {
      form.controls.cityId.setValue(nextCityId, { emitEvent: false });
    }
    if (nextCityId && this.selectedCatalogCityId !== nextCityId) {
      this.selectedCatalogCityId = nextCityId;
    }

    return nextCityId;
  }

  private ensureSelectedGptTranslationPoi(): void {
    const form = this.activeGptTranslationsTab === 'audio' ? this.gptAudioForm : this.gptTranslationForm;
    const selectedPoiId = form.controls.poiId.value;
    const selectedStillExists = Boolean(selectedPoiId && this.openAiTranslationStatusRows.some((row) => row.poiId === selectedPoiId));
    if (selectedStillExists) {
      this.selectedGptTranslationPoiId = selectedPoiId;
      return;
    }

    const firstMissing = this.openAiTranslationStatusRows.find((row) => !row.isComplete);
    const nextPoiId = firstMissing?.poiId || this.openAiTranslationStatusRows[0]?.poiId || '';
    this.selectedGptTranslationPoiId = nextPoiId;
    form.controls.poiId.setValue(nextPoiId, { emitEvent: false });
  }

  private resetGptTranslationProgress(total = 0): void {
    this.gptTranslationProgressTotal = total;
    this.gptTranslationProgressDone = 0;
    this.gptTranslationUsage = {
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0
    };
    this.gptTranslationLog = [];
  }

  private resetGptAudioProgress(total = 0): void {
    this.gptAudioProgressTotal = total;
    this.gptAudioProgressDone = 0;
    this.gptAudioLog = [];
  }

  private async confirmGptTranslationContextChange(): Promise<boolean> {
    if (!this.hasActiveGptTranslation) {
      return true;
    }

    if (!this.gptTranslationInterruptDialog) {
      return window.confirm("C'e una operazione GPT in corso. Vuoi continuare e interrompere l'avanzamento?");
    }

    if (this.gptTranslationInterruptDialogRef) {
      return (await firstValueFrom(this.gptTranslationInterruptDialogRef.afterClosed())) === true;
    }

    this.gptTranslationInterruptDialogRef = this.dialog.open(this.gptTranslationInterruptDialog, {
      width: 'min(430px, calc(100vw - 32px))',
      disableClose: true,
      autoFocus: false,
      restoreFocus: false
    });

    const confirmed = (await firstValueFrom(this.gptTranslationInterruptDialogRef.afterClosed())) === true;
    this.gptTranslationInterruptDialogRef = undefined;
    return confirmed;
  }

  private cancelActiveGptTranslationForContextChange(): void {
    if (!this.hasActiveGptTranslation) {
      return;
    }

    this.gptTranslationRunToken += 1;
    this.bulkTranslatingPois = false;
    this.bulkGeneratingPoiAudios = false;
    this.translatingPoiId = null;
    this.generatingPoiAudioId = null;
    this.gptTranslationLog = ['Operazione GPT interrotta dal cambio contesto', ...this.gptTranslationLog].slice(0, 8);
    this.gptAudioLog = ['Operazione GPT interrotta dal cambio contesto', ...this.gptAudioLog].slice(0, 8);
  }

  private applyOpenAiTranslationResponse(response: OpenAiTranslatePoiResponse): void {
    const index = this.catalogPois.findIndex((poi) => poi.id === response.poi.id);
    if (index < 0) {
      return;
    }

    const nextPois = [...this.catalogPois];
    nextPois[index] = response.poi;
    this.catalogPois = nextPois;
  }

  private applyOpenAiAudioResponse(response: OpenAiGeneratePoiAudioResponse): void {
    const index = this.catalogPois.findIndex((poi) => poi.id === response.poi.id);
    if (index < 0) {
      return;
    }

    const nextPois = [...this.catalogPois];
    nextPois[index] = response.poi;
    this.catalogPois = nextPois;
  }

  private isPoiTranslationTextReady(translation: PoiTranslationFields | null | undefined): boolean {
    return Boolean(String(translation?.descriptionLong || '').trim() || String(translation?.descriptionShort || '').trim());
  }

  private addGptTranslationUsage(usage: OpenAiTranslationUsage | null | undefined): void {
    this.gptTranslationUsage = {
      inputTokens: this.gptTranslationUsage.inputTokens + Number(usage?.inputTokens || 0),
      outputTokens: this.gptTranslationUsage.outputTokens + Number(usage?.outputTokens || 0),
      totalTokens: this.gptTranslationUsage.totalTokens + Number(usage?.totalTokens || 0)
    };
  }

  private dashboardErrorMessage(error: unknown, fallback: string): string {
    const candidate = error as { error?: { message?: string }; message?: string };
    return candidate?.error?.message || candidate?.message || fallback;
  }

  private async resolveDashboardErrorMessage(error: unknown, fallback: string): Promise<string> {
    const candidate = error as { error?: Blob | { message?: string }; message?: string };
    if (candidate?.error instanceof Blob) {
      try {
        const text = await candidate.error.text();
        const parsed = JSON.parse(text) as { message?: string };
        return parsed.message || fallback;
      } catch {
        return fallback;
      }
    }

    return this.dashboardErrorMessage(error, fallback);
  }

  private playOpenAiVoicePreview(audioBlob: Blob): void {
    this.stopOpenAiVoicePreview();
    const objectUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(objectUrl);
    this.openAiVoicePreviewUrl = objectUrl;
    this.openAiVoicePreviewAudio = audio;
    audio.onended = () => this.stopOpenAiVoicePreview();
    audio.onerror = () => {
      this.stopOpenAiVoicePreview();
      this.snackBar.open('Impossibile riprodurre l anteprima voce', 'Chiudi', { duration: 3600 });
    };
    audio.play().catch(() => {
      this.stopOpenAiVoicePreview();
      this.snackBar.open('Il browser ha bloccato la riproduzione dell anteprima', 'Chiudi', { duration: 3600 });
    });
  }

  private cancelOpenAiVoicePreview(): void {
    this.openAiVoicePreviewRequestToken += 1;
    this.previewingOpenAiVoice = false;
    this.stopOpenAiVoicePreview();
  }

  private stopOpenAiVoicePreview(): void {
    if (this.openAiVoicePreviewAudio) {
      const audio = this.openAiVoicePreviewAudio;
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
      audio.src = '';
      this.openAiVoicePreviewAudio = null;
    }
    if (this.openAiVoicePreviewUrl) {
      URL.revokeObjectURL(this.openAiVoicePreviewUrl);
      this.openAiVoicePreviewUrl = null;
    }
  }

  private sortPartnerRequests(rows: DashboardPartnerRequest[]): DashboardPartnerRequest[] {
    return [...rows].sort((left, right) => {
      const priority = (status: DashboardPartnerRequest['status']): number => {
        if (status === 'pending') {
          return 0;
        }
        if (status === 'approved') {
          return 1;
        }
        if (status === 'rejected') {
          return 2;
        }
        return 3;
      };

      const byStatus = priority(left.status) - priority(right.status);
      if (byStatus !== 0) {
        return byStatus;
      }

      const rightDate = Date.parse(right.createdAt || '');
      const leftDate = Date.parse(left.createdAt || '');
      if (Number.isFinite(rightDate) && Number.isFinite(leftDate) && rightDate !== leftDate) {
        return rightDate - leftDate;
      }

      return right.id - left.id;
    });
  }

  private catalogPoiFormForTarget(target: 'create' | 'edit') {
    return target === 'edit' ? this.catalogPoiEditForm : this.catalogPoiForm;
  }

  private catalogPoiTranslationAudioControl(target: 'create' | 'edit', language: ContentEditorLanguage) {
    return this.catalogPoiFormForTarget(target).controls.translations.controls[language].controls.audioUrl;
  }

  private hasCatalogPoiTranslationAudioUploadInProgress(target: 'create' | 'edit'): boolean {
    return this.contentLanguages.some(({ code }) => this.isCatalogPoiTranslationAudioUploading(code, target));
  }

  private resetCatalogPoiTranslationAudioUploadState(target: 'create' | 'edit'): void {
    this.contentLanguages.forEach(({ code }) => {
      this.setCatalogPoiTranslationAudioUploading(target, code, false);
    });
  }

  private setCatalogPoiTranslationAudioUploading(target: 'create' | 'edit', language: ContentEditorLanguage, value: boolean): void {
    if (target === 'edit') {
      this.uploadingCatalogPoiEditTranslationAudio[language] = value;
      return;
    }

    this.uploadingCatalogPoiTranslationAudio[language] = value;
  }

  private async initializePoiMap(): Promise<void> {
    try {
      await this.ensureLeafletLoaded();
    } catch (_error) {
      this.mapPickerMapReady = false;
      this.snackBar.open('Impossibile caricare la mappa interattiva', 'Chiudi', { duration: 3500 });
      return;
    }

    const mapElement = this.poiMapCanvas?.nativeElement;
    const leaflet = (window as unknown as { L?: any }).L;
    if (!mapElement || !leaflet) {
      this.mapPickerMapReady = false;
      return;
    }

    this.destroyPoiMap();

    this.poiMapInstance = leaflet.map(mapElement, {
      zoomControl: true,
      attributionControl: true
    });
    leaflet
      .tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap'
      })
      .addTo(this.poiMapInstance);

    const markerIcon = leaflet.divIcon({
      className: 'poi-map-pin',
      html:
        '<span style="display:block;width:16px;height:16px;border-radius:50%;background:#d7302f;border:2px solid #fff;box-shadow:0 0 0 2px rgba(125,26,26,.36);"></span>',
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    this.poiMapMarker = leaflet.marker([this.mapPickerSelectedLat ?? 41.902782, this.mapPickerSelectedLng ?? 12.496366], {
      draggable: true,
      icon: markerIcon
    });
    this.poiMapMarker.addTo(this.poiMapInstance);

    this.poiMapMarker.on('dragend', () => {
      const position = this.poiMapMarker.getLatLng();
      this.mapPickerSelectedLat = Number(position.lat);
      this.mapPickerSelectedLng = Number(position.lng);
    });

    this.poiMapInstance.on('click', (event: { latlng?: { lat: number; lng: number } }) => {
      if (!event?.latlng) {
        return;
      }
      this.updatePoiMapMarker(event.latlng.lat, event.latlng.lng, false);
    });

    this.updatePoiMapMarker(this.mapPickerSelectedLat ?? 41.902782, this.mapPickerSelectedLng ?? 12.496366, true);
    this.mapPickerMapReady = true;

    setTimeout(() => {
      this.poiMapInstance?.invalidateSize();
    }, 80);
  }

  private updatePoiMapMarker(lat: number, lng: number, centerMap: boolean): void {
    this.mapPickerSelectedLat = Number(lat);
    this.mapPickerSelectedLng = Number(lng);

    if (this.poiMapMarker) {
      this.poiMapMarker.setLatLng([lat, lng]);
    }
    if (centerMap && this.poiMapInstance) {
      this.poiMapInstance.setView([lat, lng], 16);
    }
  }

  private destroyPoiMap(): void {
    if (this.poiMapInstance) {
      this.poiMapInstance.off();
      this.poiMapInstance.remove();
    }
    this.poiMapInstance = null;
    this.poiMapMarker = null;
    this.mapPickerMapReady = false;
  }

  private ensureLeafletLoaded(): Promise<void> {
    const leafletFromWindow = (window as unknown as { L?: any }).L;
    if (leafletFromWindow) {
      return Promise.resolve();
    }

    if (this.leafletLoaderPromise) {
      return this.leafletLoaderPromise;
    }

    this.leafletLoaderPromise = new Promise<void>((resolve, reject) => {
      const existingScript = document.querySelector('script[data-leaflet-script="1"]') as HTMLScriptElement | null;
      const onResolve = (): void => resolve();
      const onReject = (): void => reject(new Error('Leaflet non disponibile'));

      if (!document.querySelector('link[data-leaflet-css="1"]')) {
        const leafletCss = document.createElement('link');
        leafletCss.setAttribute('data-leaflet-css', '1');
        leafletCss.rel = 'stylesheet';
        leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(leafletCss);
      }

      if (existingScript) {
        if ((window as unknown as { L?: any }).L) {
          onResolve();
          return;
        }
        existingScript.addEventListener('load', onResolve, { once: true });
        existingScript.addEventListener('error', onReject, { once: true });
        return;
      }

      const leafletScript = document.createElement('script');
      leafletScript.setAttribute('data-leaflet-script', '1');
      leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      leafletScript.async = true;
      leafletScript.defer = true;
      leafletScript.addEventListener('load', onResolve, { once: true });
      leafletScript.addEventListener('error', onReject, { once: true });
      document.body.appendChild(leafletScript);
    });

    return this.leafletLoaderPromise;
  }

  private uploadCatalogImage(
    file: File,
    target: CatalogMediaTarget,
    onSuccess: (imageUrl: string) => void,
    onStart: () => void,
    onFinally: () => void
  ): void {
    onStart();
    this.readFileAsDataUrl(file)
      .then((dataUrl) => {
        const base64 = String(dataUrl).split(',')[1] || '';
        return firstValueFrom(this.auth.uploadCatalogPoiImage(file.name, file.type || 'image/jpeg', base64, target));
      })
      .then((response) => {
        if (!response?.imageUrl) {
          throw new Error('Upload immagine non riuscito');
        }
        onSuccess(response.imageUrl);
      })
      .catch((error: { error?: { message?: string }; message?: string }) => {
        const message = error?.error?.message || error?.message || 'Errore upload immagine';
        this.snackBar.open(message, 'Chiudi', { duration: 3500 });
      })
      .finally(onFinally);
  }

  private uploadCatalogPoiAudio(
    file: File,
    target: CatalogMediaTarget,
    onSuccess: (audioUrl: string) => void,
    onStart: () => void,
    onFinally: () => void
  ): void {
    onStart();
    this.readFileAsDataUrl(file)
      .then((dataUrl) => {
        const base64 = String(dataUrl).split(',')[1] || '';
        return firstValueFrom(this.auth.uploadCatalogPoiAudio(file.name, file.type || 'audio/mpeg', base64, target));
      })
      .then((response) => {
        if (!response?.audioUrl) {
          throw new Error('Upload audio non riuscito');
        }
        onSuccess(response.audioUrl);
      })
      .catch((error: { error?: { message?: string }; message?: string }) => {
        const message = error?.error?.message || error?.message || 'Errore upload audio';
        this.snackBar.open(message, 'Chiudi', { duration: 3500 });
      })
      .finally(onFinally);
  }

  private readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('Impossibile leggere il file selezionato'));
      reader.readAsDataURL(file);
    });
  }

  private readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('Impossibile leggere il file selezionato'));
      reader.readAsText(file);
    });
  }

  private isFileLargerThan(file: File, maxBytes: number, mediaLabel: 'audio' | 'immagine'): boolean {
    if (file.size <= maxBytes) {
      return false;
    }

    const maxMb = Math.round((maxBytes / (1024 * 1024)) * 10) / 10;
    this.snackBar.open(`File ${mediaLabel} troppo grande (max ${maxMb}MB)`, 'Chiudi', { duration: 3500 });
    return true;
  }

  private normalizeAudioUrl(audioUrl: string | null | undefined): string {
    return String(audioUrl || '').trim();
  }

  private resolvePoiDurationSeconds(poi: DashboardCatalogPoi): number | null {
    const normalizedAudioUrl = this.normalizeAudioUrl(poi.audioUrl);
    if (!normalizedAudioUrl) {
      return null;
    }
    if (this.invalidAudioDurationUrls.has(normalizedAudioUrl)) {
      return null;
    }

    const cachedDuration = this.audioDurationByUrl[normalizedAudioUrl];
    if (Number.isFinite(cachedDuration) && cachedDuration > 0) {
      return Math.round(cachedDuration);
    }

    return null;
  }

  private preloadAudioDurationsForPois(pois: DashboardCatalogPoi[]): void {
    const uniqueAudioUrls = new Set<string>();
    pois.forEach((poi) => {
      const normalizedAudioUrl = this.normalizeAudioUrl(poi.audioUrl);
      if (normalizedAudioUrl) {
        uniqueAudioUrls.add(normalizedAudioUrl);
      }
    });

    uniqueAudioUrls.forEach((audioUrl) => {
      if (this.pendingAudioDurationUrls.has(audioUrl)) {
        return;
      }
      if (this.invalidAudioDurationUrls.has(audioUrl)) {
        return;
      }
      const cachedDuration = this.audioDurationByUrl[audioUrl];
      if (Number.isFinite(cachedDuration) && cachedDuration > 0) {
        return;
      }

      this.pendingAudioDurationUrls.add(audioUrl);
      this.readAudioDurationFromUrl(audioUrl)
        .then((durationSec) => {
          if (!durationSec || !Number.isFinite(durationSec) || durationSec <= 0) {
            this.invalidAudioDurationUrls.add(audioUrl);
            delete this.audioDurationByUrl[audioUrl];
            return;
          }
          this.invalidAudioDurationUrls.delete(audioUrl);
          this.audioDurationByUrl[audioUrl] = Math.round(durationSec);
        })
        .finally(() => {
          this.pendingAudioDurationUrls.delete(audioUrl);
        });
    });
  }

  private applyDetectedDurationToControl(
    durationPromise: Promise<number | null>,
    control: { setValue: (value: number) => void; markAsDirty: () => void },
    audioUrl: string | null | undefined
  ): void {
    durationPromise
      .then((durationSec) => {
        if (!durationSec || !Number.isFinite(durationSec) || durationSec <= 0) {
          return;
        }

        const roundedDuration = Math.max(1, Math.round(durationSec));
        control.setValue(roundedDuration);
        control.markAsDirty();
        const normalizedAudioUrl = this.normalizeAudioUrl(audioUrl);
        if (normalizedAudioUrl) {
          this.invalidAudioDurationUrls.delete(normalizedAudioUrl);
          this.audioDurationByUrl[normalizedAudioUrl] = roundedDuration;
        }
      })
      .catch(() => {
        // Ignore local metadata read errors: upload result remains valid.
      });
  }

  private readAudioDurationFromFile(file: File): Promise<number | null> {
    return new Promise((resolve) => {
      const objectUrl = URL.createObjectURL(file);
      const audioElement = new Audio();

      const cleanup = (result: number | null): void => {
        audioElement.onloadedmetadata = null;
        audioElement.onerror = null;
        URL.revokeObjectURL(objectUrl);
        resolve(result);
      };

      audioElement.preload = 'metadata';
      audioElement.onloadedmetadata = () => {
        cleanup(Number(audioElement.duration || 0));
      };
      audioElement.onerror = () => cleanup(null);
      audioElement.src = objectUrl;
    });
  }

  private readAudioDurationFromUrl(audioUrl: string): Promise<number | null> {
    return new Promise((resolve) => {
      const audioElement = new Audio();
      const onDone = (duration: number | null): void => {
        audioElement.onloadedmetadata = null;
        audioElement.onerror = null;
        resolve(duration);
      };

      audioElement.preload = 'metadata';
      audioElement.onloadedmetadata = () => {
        onDone(Number(audioElement.duration || 0));
      };
      audioElement.onerror = () => onDone(null);
      audioElement.src = audioUrl;
    });
  }

  onStructureInviteCodeDraftChange(userId: string, value: string): void {
    this.structureInviteCodeDraftByUserId[userId] = this.normalizeStructureInviteCode(value);
  }

  private getCurrentInviteCode(user: DashboardUserRow): string | null {
    const currentCode = (user.structureInviteCode || '').trim().toUpperCase();
    return currentCode || null;
  }

  private getNextInviteCodeForSave(user: DashboardUserRow): string | null {
    const draft = this.normalizeStructureInviteCode(this.structureInviteCodeDraftByUserId[user.id] || '');
    return draft || null;
  }

  private normalizeStructureInviteCode(value: string): string {
    return (value || '')
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase()
      .slice(0, 6);
  }

  private roleNeedsStructure(role: UserRole): boolean {
    return role === 'facility_manager';
  }

  private userHasStructureAssociation(user: DashboardUserRow, structureId: string): boolean {
    if (!structureId) {
      return true;
    }
    if (user.structureId === structureId) {
      return true;
    }
    const associations = Array.isArray(user.associatedStructures) ? user.associatedStructures : [];
    return associations.some((item) => item.structureId === structureId);
  }

  private ensureCatalogSelectedCity(): boolean {
    if (!this.catalogCities.length) {
      this.selectedCatalogCityId = '';
      this.catalogPoiForm.controls.cityId.setValue('');
      this.catalogPois = [];
      this.lastLoadedCatalogPoisCityId = '';
      this.catalogPoisRequestToken += 1;
      this.loadingCatalogPois = false;
      return false;
    }

    const selectedStillValid = this.catalogCities.some((city) => city.id === this.selectedCatalogCityId);
    if (!selectedStillValid) {
      this.selectedCatalogCityId = this.catalogCities[0]?.id || '';
    }

    this.catalogPoiForm.controls.cityId.setValue(this.selectedCatalogCityId);
    return !!this.selectedCatalogCityId;
  }

  private resolvePoiMediaTarget(cityIdRaw: string | null | undefined): CatalogMediaTarget | null {
    const cityId = String(cityIdRaw || '').trim();
    if (!cityId) {
      return null;
    }
    return { cityId };
  }

  private rebuildDiscountCodesIndex(): void {
    const groupedMap = this.discountCodes.reduce(
      (acc, item) => {
        if (!acc[item.structureId]) {
          acc[item.structureId] = {
            structureId: item.structureId,
            structureName: item.structureName || null,
            structureAddress: item.structureAddress || null,
            codes: []
          };
        }
        acc[item.structureId].codes.push(item);
        return acc;
      },
      {} as Record<string, DiscountCodesByStructureGroup>
    );

    this.discountCodeGroups = Object.values(groupedMap).sort((a, b) =>
      String(a.structureName || '').localeCompare(String(b.structureName || ''), 'it-IT')
    );

    this.discountCodesByStructureId = this.discountCodeGroups.reduce(
      (acc, group) => {
        acc[group.structureId] = group.codes;
        return acc;
      },
      {} as Record<string, DashboardDiscountCode[]>
    );
  }

  private scrollHighlightedDiscountCodeIntoView(): void {
    if (!this.highlightedDiscountCodeId && !this.highlightedDiscountStructureId) {
      return;
    }

    window.setTimeout(() => {
      const targetId = this.highlightedDiscountCodeId
        ? `discount-code-${this.highlightedDiscountCodeId}`
        : this.highlightedDiscountStructureId
          ? `discount-structure-${this.highlightedDiscountStructureId}`
          : '';
      if (!targetId) {
        return;
      }
      document.getElementById(targetId)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, 120);
  }

  private normalizeSelectedCityIds(cityIdsRaw: readonly string[] | null | undefined): string[] {
    if (!Array.isArray(cityIdsRaw)) {
      return [];
    }

    const deduped = new Set<string>();
    cityIdsRaw.forEach((cityIdRaw) => {
      const cityId = String(cityIdRaw || '').trim();
      if (cityId) {
        deduped.add(cityId);
      }
    });
    return Array.from(deduped);
  }

  private normalizeDiscountCodeRow(row: DashboardDiscountCode): DashboardDiscountCode {
    const cityIds = this.normalizeSelectedCityIds(row.cityIds || []);
    const cityNames = Array.isArray(row.cityNames)
      ? row.cityNames.map((name) => String(name || '').trim()).filter(Boolean)
      : [];
    const fallbackCityId = row.cityId ? String(row.cityId).trim() : '';
    const fallbackCityName = row.cityName ? String(row.cityName).trim() : '';

    const normalizedCityIds = cityIds.length ? cityIds : fallbackCityId ? [fallbackCityId] : [];
    const normalizedCityNames = cityNames.length ? cityNames : fallbackCityName ? [fallbackCityName] : [];

    return {
      ...row,
      cityId: normalizedCityIds[0] || null,
      cityName: normalizedCityNames[0] || null,
      cityIds: normalizedCityIds,
      cityNames: normalizedCityNames
    };
  }

  private defaultDiscountCodeExpiryInput(): string {
    const date = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    return this.isoToInputDateTime(date.toISOString());
  }

  private isoToInputDateTime(value: string | null | undefined): string {
    if (!value) {
      return '';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '';
    }

    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return localDate.toISOString().slice(0, 16);
  }

  private toIsoDateTime(value: string): string | null {
    const normalized = String(value || '').trim();
    if (!normalized) {
      return null;
    }
    const date = new Date(normalized);
    if (Number.isNaN(date.getTime())) {
      return null;
    }
    return date.toISOString();
  }

  openNativeDateTimePicker(input: HTMLInputElement | null | undefined): void {
    if (!input) {
      return;
    }

    const pickerInput = input as HTMLInputElement & { showPicker?: () => void };
    if (typeof pickerInput.showPicker === 'function') {
      pickerInput.showPicker();
      return;
    }

    input.focus();
    input.click();
  }

  private normalizePercent(value: number): number {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
      return 0;
    }
    const clamped = Math.max(0, Math.min(100, numericValue));
    return Math.round(clamped * 100) / 100;
  }

  private normalizeEuroAmount(value: number): number {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
      return 0;
    }
    const clamped = Math.max(0, Math.min(10000, numericValue));
    return Math.round(clamped * 100) / 100;
  }
}
