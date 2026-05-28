import { env } from '../config/env.js';
import { hashPassword } from '../auth/security.js';
import { pool } from './pool.js';
import { getPoiAddress, poiAddressesById } from './poi-addresses.js';
import { citiesSeed, hotelCodesSeed, poisSeed } from './seed-data.js';
import { DEFAULT_PARTNER_EMAIL_SETTINGS } from '../services/partner-email-templates.js';

const DB_INIT_LOCK_NAMESPACE = 7518401;
const DB_INIT_LOCK_KEY = 1;
const DB_INIT_MAX_ATTEMPTS = 3;
const DEADLOCK_DETECTED_CODE = '40P01';

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function createSchema(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS cities (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      region TEXT NOT NULL,
      bundle_price NUMERIC(10,2) NOT NULL,
      hero_image TEXT NOT NULL,
      is_default BOOLEAN NOT NULL DEFAULT FALSE,
      publication_status TEXT NOT NULL DEFAULT 'published',
      translations JSONB NOT NULL DEFAULT '{}'::jsonb
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS pois (
      id TEXT PRIMARY KEY,
      city_id TEXT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      address TEXT NOT NULL DEFAULT '',
      lat DOUBLE PRECISION NOT NULL,
      lng DOUBLE PRECISION NOT NULL,
      category TEXT NOT NULL,
      description_short TEXT NOT NULL,
      description_long TEXT NOT NULL,
      image_url TEXT NOT NULL,
      audio_url TEXT NOT NULL,
      price_single NUMERIC(10,2) NOT NULL,
      duration_sec INTEGER NOT NULL,
      publication_status TEXT NOT NULL DEFAULT 'published',
      translations JSONB NOT NULL DEFAULT '{}'::jsonb
    );
  `);

  await client.query(`
    ALTER TABLE cities
    ADD COLUMN IF NOT EXISTS translations JSONB;
  `);
  await client.query(`
    UPDATE cities
    SET translations = '{}'::jsonb
    WHERE translations IS NULL;
  `);
  await client.query(`
    ALTER TABLE cities
    ALTER COLUMN translations SET DEFAULT '{}'::jsonb;
  `);
  await client.query(`
    ALTER TABLE cities
    ALTER COLUMN translations SET NOT NULL;
  `);
  await client.query(`
    ALTER TABLE cities
    ADD COLUMN IF NOT EXISTS publication_status TEXT;
  `);
  await client.query(`
    UPDATE cities
    SET publication_status = 'published'
    WHERE publication_status IS NULL
      OR publication_status NOT IN ('published', 'draft');
  `);
  await client.query(`
    ALTER TABLE cities
    ALTER COLUMN publication_status SET DEFAULT 'published';
  `);
  await client.query(`
    ALTER TABLE cities
    ALTER COLUMN publication_status SET NOT NULL;
  `);
  await client.query(`
    ALTER TABLE cities
    DROP CONSTRAINT IF EXISTS cities_publication_status_check;
  `);
  await client.query(`
    ALTER TABLE cities
    ADD CONSTRAINT cities_publication_status_check CHECK (publication_status IN ('published', 'draft'));
  `);

  await client.query(`
    ALTER TABLE pois
    ADD COLUMN IF NOT EXISTS address TEXT;
  `);
  await client.query(`
    UPDATE pois
    SET address = ''
    WHERE address IS NULL;
  `);
  await client.query(`
    ALTER TABLE pois
    ALTER COLUMN address SET DEFAULT '';
  `);
  await client.query(`
    ALTER TABLE pois
    ALTER COLUMN address SET NOT NULL;
  `);

  await client.query(`
    ALTER TABLE pois
    ADD COLUMN IF NOT EXISTS translations JSONB;
  `);
  await client.query(`
    UPDATE pois
    SET translations = '{}'::jsonb
    WHERE translations IS NULL;
  `);
  await client.query(`
    ALTER TABLE pois
    ALTER COLUMN translations SET DEFAULT '{}'::jsonb;
  `);
  await client.query(`
    ALTER TABLE pois
    ALTER COLUMN translations SET NOT NULL;
  `);
  await client.query(`
    ALTER TABLE pois
    ADD COLUMN IF NOT EXISTS publication_status TEXT;
  `);
  await client.query(`
    UPDATE pois
    SET publication_status = 'published'
    WHERE publication_status IS NULL
      OR publication_status NOT IN ('published', 'draft');
  `);
  await client.query(`
    ALTER TABLE pois
    ALTER COLUMN publication_status SET DEFAULT 'published';
  `);
  await client.query(`
    ALTER TABLE pois
    ALTER COLUMN publication_status SET NOT NULL;
  `);
  await client.query(`
    ALTER TABLE pois
    DROP CONSTRAINT IF EXISTS pois_publication_status_check;
  `);
  await client.query(`
    ALTER TABLE pois
    ADD CONSTRAINT pois_publication_status_check CHECK (publication_status IN ('published', 'draft'));
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS purchases (
      id BIGSERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('single', 'bundle')),
      city_id TEXT REFERENCES cities(id) ON DELETE CASCADE,
      poi_id TEXT REFERENCES pois(id) ON DELETE CASCADE,
      amount NUMERIC(10,2) NOT NULL,
      base_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
      discount_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
      discount_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
      final_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
      structure_id TEXT,
      invite_code TEXT,
      structure_fixed_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
      structure_earning_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
      purchased_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS partner_registration_requests (
      id BIGSERIAL PRIMARY KEY,
      structure_name TEXT NOT NULL,
      structure_type TEXT,
      vat_number TEXT,
      contact_first_name TEXT NOT NULL,
      contact_last_name TEXT NOT NULL,
      contact_email TEXT NOT NULL,
      contact_phone TEXT NOT NULL,
      website TEXT,
      address_street TEXT NOT NULL,
      address_number TEXT,
      address_city TEXT NOT NULL,
      address_postal_code TEXT,
      address_province TEXT,
      address_region TEXT,
      address_country TEXT NOT NULL DEFAULT 'Italia',
      rooms_count INTEGER,
      notes TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      pdf_release_status TEXT NOT NULL DEFAULT 'pending',
      deleted SMALLINT NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS hotel_codes (
      code TEXT PRIMARY KEY,
      city_id TEXT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
      is_active BOOLEAN NOT NULL DEFAULT TRUE
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS dashboard_structures (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      address_street TEXT,
      address_number TEXT,
      address_city TEXT,
      address_postal_code TEXT,
      address_province TEXT,
      address_country TEXT,
      invite_code TEXT UNIQUE,
      user_discount_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
      structure_share_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
      structure_fixed_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
      deleted SMALLINT NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await client.query(`
    ALTER TABLE dashboard_structures
    ADD COLUMN IF NOT EXISTS address_street TEXT;
  `);
  await client.query(`
    ALTER TABLE dashboard_structures
    ADD COLUMN IF NOT EXISTS address_number TEXT;
  `);
  await client.query(`
    ALTER TABLE dashboard_structures
    ADD COLUMN IF NOT EXISTS address_city TEXT;
  `);
  await client.query(`
    ALTER TABLE dashboard_structures
    ADD COLUMN IF NOT EXISTS address_postal_code TEXT;
  `);
  await client.query(`
    ALTER TABLE dashboard_structures
    ADD COLUMN IF NOT EXISTS address_province TEXT;
  `);
  await client.query(`
    ALTER TABLE dashboard_structures
    ADD COLUMN IF NOT EXISTS address_country TEXT;
  `);
  await client.query(`
    ALTER TABLE dashboard_structures
    ADD COLUMN IF NOT EXISTS user_discount_percent NUMERIC(5,2);
  `);
  await client.query(`
    ALTER TABLE dashboard_structures
    ADD COLUMN IF NOT EXISTS structure_share_percent NUMERIC(5,2);
  `);
  await client.query(`
    ALTER TABLE dashboard_structures
    ADD COLUMN IF NOT EXISTS structure_fixed_amount NUMERIC(10,2);
  `);
  await client.query(`
    ALTER TABLE dashboard_structures
    ADD COLUMN IF NOT EXISTS invite_code TEXT;
  `);
  await client.query(`
    ALTER TABLE dashboard_structures
    ADD COLUMN IF NOT EXISTS deleted SMALLINT;
  `);
  await client.query(`UPDATE dashboard_structures SET deleted = 0 WHERE deleted IS NULL;`);
  await client.query(`ALTER TABLE dashboard_structures ALTER COLUMN deleted SET DEFAULT 0;`);
  await client.query(`ALTER TABLE dashboard_structures ALTER COLUMN deleted SET NOT NULL;`);
  await client.query(`ALTER TABLE dashboard_structures DROP CONSTRAINT IF EXISTS dashboard_structures_deleted_check;`);
  await client.query(`
    ALTER TABLE dashboard_structures
    ADD CONSTRAINT dashboard_structures_deleted_check CHECK (deleted IN (0, 1));
  `);
  await client.query(`
    UPDATE dashboard_structures
    SET user_discount_percent = 0
    WHERE user_discount_percent IS NULL;
  `);
  await client.query(`
    UPDATE dashboard_structures
    SET structure_share_percent = 0
    WHERE structure_share_percent IS NULL;
  `);
  await client.query(`
    UPDATE dashboard_structures
    SET structure_fixed_amount = 0
    WHERE structure_fixed_amount IS NULL;
  `);
  await client.query(`
    ALTER TABLE dashboard_structures
    ALTER COLUMN user_discount_percent SET DEFAULT 0;
  `);
  await client.query(`
    ALTER TABLE dashboard_structures
    ALTER COLUMN structure_share_percent SET DEFAULT 0;
  `);
  await client.query(`
    ALTER TABLE dashboard_structures
    ALTER COLUMN structure_fixed_amount SET DEFAULT 0;
  `);
  await client.query(`
    ALTER TABLE dashboard_structures
    ALTER COLUMN user_discount_percent SET NOT NULL;
  `);
  await client.query(`
    ALTER TABLE dashboard_structures
    ALTER COLUMN structure_share_percent SET NOT NULL;
  `);
  await client.query(`
    ALTER TABLE dashboard_structures
    ALTER COLUMN structure_fixed_amount SET NOT NULL;
  `);
  await client.query(`
    ALTER TABLE dashboard_structures
    ALTER COLUMN invite_code DROP NOT NULL;
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS dashboard_structure_discount_codes (
      id BIGSERIAL PRIMARY KEY,
      structure_id TEXT NOT NULL REFERENCES dashboard_structures(id) ON DELETE CASCADE,
      code TEXT NOT NULL UNIQUE,
      apply_to TEXT NOT NULL DEFAULT 'bundle' CHECK (apply_to IN ('single', 'bundle')),
      city_id TEXT REFERENCES cities(id) ON DELETE SET NULL,
      user_discount_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
      user_discount_percent_single NUMERIC(5,2) NOT NULL DEFAULT 0,
      user_discount_percent_bundle NUMERIC(5,2) NOT NULL DEFAULT 0,
      structure_fixed_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
      structure_fixed_amount_single NUMERIC(10,2) NOT NULL DEFAULT 0,
      structure_fixed_amount_bundle NUMERIC(10,2) NOT NULL DEFAULT 0,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  await client.query(`
    ALTER TABLE dashboard_structure_discount_codes
    ADD COLUMN IF NOT EXISTS structure_id TEXT;
  `);
  await client.query(`
    ALTER TABLE dashboard_structure_discount_codes
    ADD COLUMN IF NOT EXISTS code TEXT;
  `);
  await client.query(`
    ALTER TABLE dashboard_structure_discount_codes
    ADD COLUMN IF NOT EXISTS apply_to TEXT;
  `);
  await client.query(`
    ALTER TABLE dashboard_structure_discount_codes
    ADD COLUMN IF NOT EXISTS city_id TEXT;
  `);
  await client.query(`
    CREATE TABLE IF NOT EXISTS dashboard_structure_discount_code_cities (
      discount_code_id BIGINT NOT NULL REFERENCES dashboard_structure_discount_codes(id) ON DELETE CASCADE,
      city_id TEXT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (discount_code_id, city_id)
    );
  `);
  await client.query(`
    ALTER TABLE dashboard_structure_discount_codes
    ADD COLUMN IF NOT EXISTS user_discount_percent NUMERIC(5,2);
  `);
  await client.query(`
    ALTER TABLE dashboard_structure_discount_codes
    ADD COLUMN IF NOT EXISTS structure_fixed_amount NUMERIC(10,2);
  `);
  await client.query(`
    ALTER TABLE dashboard_structure_discount_codes
    ADD COLUMN IF NOT EXISTS user_discount_percent_single NUMERIC(5,2);
  `);
  await client.query(`
    ALTER TABLE dashboard_structure_discount_codes
    ADD COLUMN IF NOT EXISTS user_discount_percent_bundle NUMERIC(5,2);
  `);
  await client.query(`
    ALTER TABLE dashboard_structure_discount_codes
    ADD COLUMN IF NOT EXISTS structure_fixed_amount_single NUMERIC(10,2);
  `);
  await client.query(`
    ALTER TABLE dashboard_structure_discount_codes
    ADD COLUMN IF NOT EXISTS structure_fixed_amount_bundle NUMERIC(10,2);
  `);
  await client.query(`
    ALTER TABLE dashboard_structure_discount_codes
    ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;
  `);
  await client.query(`
    ALTER TABLE dashboard_structure_discount_codes
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
  `);
  await client.query(`
    ALTER TABLE dashboard_structure_discount_codes
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
  `);
  await client.query(`
    UPDATE dashboard_structure_discount_codes
    SET user_discount_percent = 0
    WHERE user_discount_percent IS NULL;
  `);
  await client.query(`
    UPDATE dashboard_structure_discount_codes
    SET structure_fixed_amount = 0
    WHERE structure_fixed_amount IS NULL;
  `);
  await client.query(`
    UPDATE dashboard_structure_discount_codes
    SET user_discount_percent_single = COALESCE(user_discount_percent, 0)
    WHERE user_discount_percent_single IS NULL;
  `);
  await client.query(`
    UPDATE dashboard_structure_discount_codes
    SET user_discount_percent_bundle = COALESCE(user_discount_percent, 0)
    WHERE user_discount_percent_bundle IS NULL;
  `);
  await client.query(`
    UPDATE dashboard_structure_discount_codes
    SET structure_fixed_amount_single = COALESCE(structure_fixed_amount, 0)
    WHERE structure_fixed_amount_single IS NULL;
  `);
  await client.query(`
    UPDATE dashboard_structure_discount_codes
    SET structure_fixed_amount_bundle = COALESCE(structure_fixed_amount, 0)
    WHERE structure_fixed_amount_bundle IS NULL;
  `);
  await client.query(`
    UPDATE dashboard_structure_discount_codes
    SET apply_to = CASE
      WHEN COALESCE(user_discount_percent_single, 0) > 0 OR COALESCE(structure_fixed_amount_single, 0) > 0
        THEN 'single'
      ELSE 'bundle'
    END
    WHERE apply_to IS NULL OR apply_to NOT IN ('single', 'bundle');
  `);
  await client.query(`
    ALTER TABLE dashboard_structure_discount_codes
    ALTER COLUMN apply_to SET DEFAULT 'bundle';
  `);
  await client.query(`
    ALTER TABLE dashboard_structure_discount_codes
    ALTER COLUMN apply_to SET NOT NULL;
  `);
  await client.query(`
    ALTER TABLE dashboard_structure_discount_codes
    DROP CONSTRAINT IF EXISTS dashboard_structure_discount_codes_apply_to_check;
  `);
  await client.query(`
    ALTER TABLE dashboard_structure_discount_codes
    ADD CONSTRAINT dashboard_structure_discount_codes_apply_to_check CHECK (apply_to IN ('single', 'bundle'));
  `);
  await client.query(`
    ALTER TABLE dashboard_structure_discount_codes
    DROP CONSTRAINT IF EXISTS dashboard_structure_discount_codes_city_id_fkey;
  `);
  await client.query(`
    ALTER TABLE dashboard_structure_discount_codes
    ADD CONSTRAINT dashboard_structure_discount_codes_city_id_fkey
    FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE SET NULL;
  `);
  await client.query(`
    INSERT INTO dashboard_structure_discount_code_cities (discount_code_id, city_id)
    SELECT d.id, d.city_id
    FROM dashboard_structure_discount_codes d
    JOIN cities c ON c.id = d.city_id
    WHERE d.city_id IS NOT NULL
    ON CONFLICT (discount_code_id, city_id) DO NOTHING;
  `);
  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_dashboard_discount_code_cities_discount_code_id
    ON dashboard_structure_discount_code_cities(discount_code_id);
  `);
  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_dashboard_discount_code_cities_city_id
    ON dashboard_structure_discount_code_cities(city_id);
  `);
  await client.query(`
    ALTER TABLE dashboard_structure_discount_codes
    ALTER COLUMN user_discount_percent SET DEFAULT 0;
  `);
  await client.query(`
    ALTER TABLE dashboard_structure_discount_codes
    ALTER COLUMN user_discount_percent_single SET DEFAULT 0;
  `);
  await client.query(`
    ALTER TABLE dashboard_structure_discount_codes
    ALTER COLUMN user_discount_percent_bundle SET DEFAULT 0;
  `);
  await client.query(`
    ALTER TABLE dashboard_structure_discount_codes
    ALTER COLUMN structure_fixed_amount SET DEFAULT 0;
  `);
  await client.query(`
    ALTER TABLE dashboard_structure_discount_codes
    ALTER COLUMN structure_fixed_amount_single SET DEFAULT 0;
  `);
  await client.query(`
    ALTER TABLE dashboard_structure_discount_codes
    ALTER COLUMN structure_fixed_amount_bundle SET DEFAULT 0;
  `);
  await client.query(`
    ALTER TABLE dashboard_structure_discount_codes
    ALTER COLUMN user_discount_percent SET NOT NULL;
  `);
  await client.query(`
    ALTER TABLE dashboard_structure_discount_codes
    ALTER COLUMN user_discount_percent_single SET NOT NULL;
  `);
  await client.query(`
    ALTER TABLE dashboard_structure_discount_codes
    ALTER COLUMN user_discount_percent_bundle SET NOT NULL;
  `);
  await client.query(`
    ALTER TABLE dashboard_structure_discount_codes
    ALTER COLUMN structure_fixed_amount SET NOT NULL;
  `);
  await client.query(`
    ALTER TABLE dashboard_structure_discount_codes
    ALTER COLUMN structure_fixed_amount_single SET NOT NULL;
  `);
  await client.query(`
    ALTER TABLE dashboard_structure_discount_codes
    ALTER COLUMN structure_fixed_amount_bundle SET NOT NULL;
  `);
  await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS uq_dashboard_discount_codes_upper ON dashboard_structure_discount_codes(UPPER(code));`);
  await client.query(`
    ALTER TABLE partner_registration_requests
    ADD COLUMN IF NOT EXISTS approved_structure_id TEXT REFERENCES dashboard_structures(id) ON DELETE SET NULL;
  `);
  await client.query(`
    ALTER TABLE partner_registration_requests
    ADD COLUMN IF NOT EXISTS approved_discount_code_id BIGINT REFERENCES dashboard_structure_discount_codes(id) ON DELETE SET NULL;
  `);
  await client.query(`
    ALTER TABLE partner_registration_requests
    ADD COLUMN IF NOT EXISTS approval_email_sent_at TIMESTAMPTZ;
  `);
  await client.query(`
    ALTER TABLE partner_registration_requests
    ADD COLUMN IF NOT EXISTS deleted SMALLINT;
  `);
  await client.query(`UPDATE partner_registration_requests SET deleted = 0 WHERE deleted IS NULL;`);
  await client.query(`ALTER TABLE partner_registration_requests ALTER COLUMN deleted SET DEFAULT 0;`);
  await client.query(`ALTER TABLE partner_registration_requests ALTER COLUMN deleted SET NOT NULL;`);
  await client.query(`ALTER TABLE partner_registration_requests DROP CONSTRAINT IF EXISTS partner_registration_requests_deleted_check;`);
  await client.query(`
    ALTER TABLE partner_registration_requests
    ADD CONSTRAINT partner_registration_requests_deleted_check CHECK (deleted IN (0, 1));
  `);
  await client.query(`
    INSERT INTO dashboard_structure_discount_codes (
      structure_id,
      code,
      user_discount_percent,
      user_discount_percent_single,
      user_discount_percent_bundle,
      structure_fixed_amount,
      structure_fixed_amount_single,
      structure_fixed_amount_bundle,
      expires_at,
      created_at,
      updated_at
    )
    SELECT
      s.id,
      UPPER(TRIM(s.invite_code)),
      COALESCE(s.user_discount_percent, 0),
      COALESCE(s.user_discount_percent, 0),
      COALESCE(s.user_discount_percent, 0),
      COALESCE(s.structure_fixed_amount, 0),
      COALESCE(s.structure_fixed_amount, 0),
      COALESCE(s.structure_fixed_amount, 0),
      NOW() + INTERVAL '10 years',
      COALESCE(s.created_at, NOW()),
      NOW()
    FROM dashboard_structures s
    WHERE s.invite_code IS NOT NULL
      AND TRIM(s.invite_code) <> ''
      AND NOT EXISTS (
        SELECT 1
        FROM dashboard_structure_discount_codes d
        WHERE UPPER(d.code) = UPPER(TRIM(s.invite_code))
      );
  `);

  await client.query(`
    ALTER TABLE purchases
    ADD COLUMN IF NOT EXISTS base_amount NUMERIC(10,2);
  `);
  await client.query(`
    ALTER TABLE purchases
    ADD COLUMN IF NOT EXISTS discount_percent NUMERIC(5,2);
  `);
  await client.query(`
    ALTER TABLE purchases
    ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(10,2);
  `);
  await client.query(`
    ALTER TABLE purchases
    ADD COLUMN IF NOT EXISTS final_amount NUMERIC(10,2);
  `);
  await client.query(`
    ALTER TABLE purchases
    ADD COLUMN IF NOT EXISTS structure_id TEXT;
  `);
  await client.query(`
    ALTER TABLE purchases
    ADD COLUMN IF NOT EXISTS invite_code TEXT;
  `);
  await client.query(`
    ALTER TABLE purchases
    ADD COLUMN IF NOT EXISTS structure_fixed_amount NUMERIC(10,2);
  `);
  await client.query(`
    ALTER TABLE purchases
    ADD COLUMN IF NOT EXISTS structure_earning_amount NUMERIC(10,2);
  `);
  await client.query(`
    ALTER TABLE purchases
    ADD COLUMN IF NOT EXISTS payment_method TEXT;
  `);
  await client.query(`
    ALTER TABLE purchases
    ADD COLUMN IF NOT EXISTS payment_provider TEXT;
  `);
  await client.query(`
    ALTER TABLE purchases
    ADD COLUMN IF NOT EXISTS payment_status TEXT;
  `);
  await client.query(`
    ALTER TABLE purchases
    ADD COLUMN IF NOT EXISTS payment_order_id TEXT;
  `);
  await client.query(`
    ALTER TABLE purchases
    ADD COLUMN IF NOT EXISTS payment_capture_id TEXT;
  `);
  await client.query(`
    ALTER TABLE purchases
    ADD COLUMN IF NOT EXISTS payment_environment TEXT;
  `);
  await client.query(`
    ALTER TABLE purchases
    ADD COLUMN IF NOT EXISTS payer_email TEXT;
  `);
  await client.query(`
    ALTER TABLE purchases
    ADD COLUMN IF NOT EXISTS payer_id TEXT;
  `);
  await client.query(`
    ALTER TABLE purchases
    ADD COLUMN IF NOT EXISTS payer_first_name TEXT;
  `);
  await client.query(`
    ALTER TABLE purchases
    ADD COLUMN IF NOT EXISTS payer_last_name TEXT;
  `);
  await client.query(`
    ALTER TABLE purchases
    ADD COLUMN IF NOT EXISTS payer_country_code TEXT;
  `);
  await client.query(`
    ALTER TABLE purchases
    ADD COLUMN IF NOT EXISTS payer_phone TEXT;
  `);
  await client.query(`
    ALTER TABLE purchases
    ADD COLUMN IF NOT EXISTS payer_address TEXT;
  `);
  await client.query(`UPDATE purchases SET base_amount = amount WHERE base_amount IS NULL;`);
  await client.query(`UPDATE purchases SET discount_percent = 0 WHERE discount_percent IS NULL;`);
  await client.query(`UPDATE purchases SET discount_amount = 0 WHERE discount_amount IS NULL;`);
  await client.query(`UPDATE purchases SET final_amount = amount WHERE final_amount IS NULL;`);
  await client.query(`UPDATE purchases SET structure_fixed_amount = 0 WHERE structure_fixed_amount IS NULL;`);
  await client.query(`UPDATE purchases SET structure_earning_amount = 0 WHERE structure_earning_amount IS NULL;`);
  await client.query(`UPDATE purchases SET payment_method = 'Legacy' WHERE payment_method IS NULL OR TRIM(payment_method) = '';`);
  await client.query(
    `UPDATE purchases SET payment_provider = 'Non disponibile' WHERE payment_provider IS NULL OR TRIM(payment_provider) = '';`
  );
  await client.query(`UPDATE purchases SET payment_status = 'completed' WHERE payment_status IS NULL OR TRIM(payment_status) = '';`);
  await client.query(`
    UPDATE purchases
    SET structure_earning_amount = structure_fixed_amount
    WHERE COALESCE(structure_earning_amount, 0) <> COALESCE(structure_fixed_amount, 0);
  `);
  await client.query(`ALTER TABLE purchases ALTER COLUMN base_amount SET DEFAULT 0;`);
  await client.query(`ALTER TABLE purchases ALTER COLUMN discount_percent SET DEFAULT 0;`);
  await client.query(`ALTER TABLE purchases ALTER COLUMN discount_amount SET DEFAULT 0;`);
  await client.query(`ALTER TABLE purchases ALTER COLUMN final_amount SET DEFAULT 0;`);
  await client.query(`ALTER TABLE purchases ALTER COLUMN structure_fixed_amount SET DEFAULT 0;`);
  await client.query(`ALTER TABLE purchases ALTER COLUMN structure_earning_amount SET DEFAULT 0;`);
  await client.query(`ALTER TABLE purchases ALTER COLUMN payment_method SET DEFAULT 'PayPal';`);
  await client.query(`ALTER TABLE purchases ALTER COLUMN payment_provider SET DEFAULT 'PayPal';`);
  await client.query(`ALTER TABLE purchases ALTER COLUMN payment_status SET DEFAULT 'completed';`);
  await client.query(`ALTER TABLE purchases ALTER COLUMN base_amount SET NOT NULL;`);
  await client.query(`ALTER TABLE purchases ALTER COLUMN discount_percent SET NOT NULL;`);
  await client.query(`ALTER TABLE purchases ALTER COLUMN discount_amount SET NOT NULL;`);
  await client.query(`ALTER TABLE purchases ALTER COLUMN final_amount SET NOT NULL;`);
  await client.query(`ALTER TABLE purchases ALTER COLUMN structure_fixed_amount SET NOT NULL;`);
  await client.query(`ALTER TABLE purchases ALTER COLUMN structure_earning_amount SET NOT NULL;`);
  await client.query(`ALTER TABLE purchases ALTER COLUMN payment_method SET NOT NULL;`);
  await client.query(`ALTER TABLE purchases ALTER COLUMN payment_provider SET NOT NULL;`);
  await client.query(`ALTER TABLE purchases ALTER COLUMN payment_status SET NOT NULL;`);
  await client.query(`ALTER TABLE purchases DROP CONSTRAINT IF EXISTS purchases_structure_id_fkey;`);
  await client.query(`
    ALTER TABLE purchases
    ADD CONSTRAINT purchases_structure_id_fkey
    FOREIGN KEY (structure_id) REFERENCES dashboard_structures(id) ON DELETE SET NULL;
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS dashboard_users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL DEFAULT '',
      first_name TEXT NOT NULL DEFAULT '',
      last_name TEXT NOT NULL DEFAULT '',
      facility_name TEXT,
      structure_id TEXT REFERENCES dashboard_structures(id) ON DELETE SET NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL,
      is_registered BOOLEAN NOT NULL DEFAULT TRUE,
      invited_by TEXT REFERENCES dashboard_users(id) ON DELETE SET NULL,
      deleted SMALLINT NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await client.query(`UPDATE dashboard_users SET role = 'facility_manager' WHERE role = 'member';`);
  await client.query(`ALTER TABLE dashboard_users DROP CONSTRAINT IF EXISTS dashboard_users_role_check;`);
  await client.query(`
    ALTER TABLE dashboard_users
    ADD CONSTRAINT dashboard_users_role_check CHECK (role IN ('admin', 'facility_manager', 'user'));
  `);
  await client.query(`
    ALTER TABLE dashboard_users
    ADD COLUMN IF NOT EXISTS name TEXT;
  `);
  await client.query(`UPDATE dashboard_users SET name = '' WHERE name IS NULL;`);
  await client.query(`ALTER TABLE dashboard_users ALTER COLUMN name SET DEFAULT '';`);
  await client.query(`ALTER TABLE dashboard_users ALTER COLUMN name SET NOT NULL;`);
  await client.query(`
    ALTER TABLE dashboard_users
    ADD COLUMN IF NOT EXISTS first_name TEXT;
  `);
  await client.query(`
    ALTER TABLE dashboard_users
    ADD COLUMN IF NOT EXISTS last_name TEXT;
  `);
  await client.query(`
    ALTER TABLE dashboard_users
    ADD COLUMN IF NOT EXISTS facility_name TEXT;
  `);
  await client.query(`
    UPDATE dashboard_users
    SET first_name = COALESCE(NULLIF(TRIM(first_name), ''), NULLIF(TRIM(name), ''), '')
    WHERE first_name IS NULL OR TRIM(first_name) = '';
  `);
  await client.query(`UPDATE dashboard_users SET last_name = '' WHERE last_name IS NULL;`);
  await client.query(`ALTER TABLE dashboard_users ALTER COLUMN first_name SET DEFAULT '';`);
  await client.query(`ALTER TABLE dashboard_users ALTER COLUMN first_name SET NOT NULL;`);
  await client.query(`ALTER TABLE dashboard_users ALTER COLUMN last_name SET DEFAULT '';`);
  await client.query(`ALTER TABLE dashboard_users ALTER COLUMN last_name SET NOT NULL;`);
  await client.query(`
    ALTER TABLE dashboard_users
    ADD COLUMN IF NOT EXISTS structure_id TEXT;
  `);
  await client.query(`
    ALTER TABLE dashboard_users
    ADD COLUMN IF NOT EXISTS deleted SMALLINT;
  `);
  await client.query(`UPDATE dashboard_users SET deleted = 0 WHERE deleted IS NULL;`);
  await client.query(`ALTER TABLE dashboard_users ALTER COLUMN deleted SET DEFAULT 0;`);
  await client.query(`ALTER TABLE dashboard_users ALTER COLUMN deleted SET NOT NULL;`);
  await client.query(`ALTER TABLE dashboard_users DROP CONSTRAINT IF EXISTS dashboard_users_deleted_check;`);
  await client.query(`
    ALTER TABLE dashboard_users
    ADD CONSTRAINT dashboard_users_deleted_check CHECK (deleted IN (0, 1));
  `);
  await client.query(`ALTER TABLE dashboard_users DROP CONSTRAINT IF EXISTS dashboard_users_structure_id_fkey;`);
  await client.query(`
    ALTER TABLE dashboard_users
    ADD CONSTRAINT dashboard_users_structure_id_fkey
    FOREIGN KEY (structure_id) REFERENCES dashboard_structures(id) ON DELETE SET NULL;
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS dashboard_paypal_settings (
      id SMALLINT PRIMARY KEY,
      is_enabled BOOLEAN NOT NULL DEFAULT FALSE,
      mode TEXT NOT NULL DEFAULT 'sandbox',
      client_id TEXT,
      client_secret TEXT,
      merchant_id TEXT,
      merchant_email TEXT,
      brand_name TEXT NOT NULL DEFAULT 'Walk Around',
      webhook_id TEXT,
      currency_code TEXT NOT NULL DEFAULT 'EUR',
      last_verified_at TIMESTAMPTZ,
      last_verification_status TEXT NOT NULL DEFAULT 'incomplete',
      last_verification_error TEXT,
      updated_by TEXT REFERENCES dashboard_users(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  await client.query(`
    ALTER TABLE dashboard_paypal_settings
    DROP CONSTRAINT IF EXISTS dashboard_paypal_settings_mode_check;
  `);
  await client.query(`
    ALTER TABLE dashboard_paypal_settings
    ADD CONSTRAINT dashboard_paypal_settings_mode_check CHECK (mode IN ('sandbox', 'live'));
  `);
  await client.query(`
    INSERT INTO dashboard_paypal_settings (
      id,
      is_enabled,
      mode,
      brand_name,
      currency_code,
      last_verification_status
    )
    VALUES (1, FALSE, 'sandbox', 'Walk Around', 'EUR', 'incomplete')
    ON CONFLICT (id) DO NOTHING;
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS dashboard_openai_translation_settings (
      id SMALLINT PRIMARY KEY,
      api_key TEXT,
      model TEXT NOT NULL DEFAULT 'gpt-4o-mini',
      tts_model TEXT NOT NULL DEFAULT 'gpt-4o-mini-tts',
      tts_voice TEXT NOT NULL DEFAULT 'alloy',
      tts_instructions TEXT NOT NULL DEFAULT 'Narrazione chiara, naturale e professionale per una audioguida turistica. Ritmo medio, tono coinvolgente e pronuncia curata dei nomi propri italiani.',
      updated_by TEXT REFERENCES dashboard_users(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  await client.query(`
    ALTER TABLE dashboard_openai_translation_settings
    ADD COLUMN IF NOT EXISTS tts_model TEXT NOT NULL DEFAULT 'gpt-4o-mini-tts';
  `);
  await client.query(`
    ALTER TABLE dashboard_openai_translation_settings
    ADD COLUMN IF NOT EXISTS tts_voice TEXT NOT NULL DEFAULT 'alloy';
  `);
  await client.query(`
    ALTER TABLE dashboard_openai_translation_settings
    ADD COLUMN IF NOT EXISTS tts_instructions TEXT NOT NULL DEFAULT 'Narrazione chiara, naturale e professionale per una audioguida turistica. Ritmo medio, tono coinvolgente e pronuncia curata dei nomi propri italiani.';
  `);
  await client.query(`
    ALTER TABLE dashboard_openai_translation_settings
    DROP CONSTRAINT IF EXISTS dashboard_openai_translation_settings_singleton;
  `);
  await client.query(`
    ALTER TABLE dashboard_openai_translation_settings
    ADD CONSTRAINT dashboard_openai_translation_settings_singleton CHECK (id = 1);
  `);
  await client.query(`
    INSERT INTO dashboard_openai_translation_settings (id, model)
    VALUES (1, 'gpt-4o-mini')
    ON CONFLICT (id) DO NOTHING;
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS dashboard_app_cache_settings (
      id SMALLINT PRIMARY KEY,
      cache_version TEXT NOT NULL DEFAULT '1',
      updated_by TEXT REFERENCES dashboard_users(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  await client.query(`
    ALTER TABLE dashboard_app_cache_settings
    DROP CONSTRAINT IF EXISTS dashboard_app_cache_settings_singleton;
  `);
  await client.query(`
    ALTER TABLE dashboard_app_cache_settings
    ADD CONSTRAINT dashboard_app_cache_settings_singleton CHECK (id = 1);
  `);
  await client.query(`
    INSERT INTO dashboard_app_cache_settings (id, cache_version)
    VALUES (1, '1')
    ON CONFLICT (id) DO NOTHING;
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS dashboard_email_settings (
      id SMALLINT PRIMARY KEY,
      smtp_host TEXT NOT NULL DEFAULT '',
      smtp_port INTEGER NOT NULL DEFAULT 465,
      smtp_secure BOOLEAN NOT NULL DEFAULT TRUE,
      smtp_user TEXT NOT NULL DEFAULT '',
      smtp_password TEXT NOT NULL DEFAULT '',
      smtp_from TEXT NOT NULL DEFAULT '',
      last_tested_at TIMESTAMPTZ,
      last_test_status TEXT NOT NULL DEFAULT 'untested',
      last_test_error TEXT,
      updated_by TEXT REFERENCES dashboard_users(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  await client.query(`ALTER TABLE dashboard_email_settings ADD COLUMN IF NOT EXISTS smtp_host TEXT;`);
  await client.query(`ALTER TABLE dashboard_email_settings ADD COLUMN IF NOT EXISTS smtp_port INTEGER;`);
  await client.query(`ALTER TABLE dashboard_email_settings ADD COLUMN IF NOT EXISTS smtp_secure BOOLEAN;`);
  await client.query(`ALTER TABLE dashboard_email_settings ADD COLUMN IF NOT EXISTS smtp_user TEXT;`);
  await client.query(`ALTER TABLE dashboard_email_settings ADD COLUMN IF NOT EXISTS smtp_password TEXT;`);
  await client.query(`ALTER TABLE dashboard_email_settings ADD COLUMN IF NOT EXISTS smtp_from TEXT;`);
  await client.query(`ALTER TABLE dashboard_email_settings ADD COLUMN IF NOT EXISTS last_tested_at TIMESTAMPTZ;`);
  await client.query(`ALTER TABLE dashboard_email_settings ADD COLUMN IF NOT EXISTS last_test_status TEXT;`);
  await client.query(`ALTER TABLE dashboard_email_settings ADD COLUMN IF NOT EXISTS last_test_error TEXT;`);
  await client.query(`ALTER TABLE dashboard_email_settings ADD COLUMN IF NOT EXISTS updated_by TEXT REFERENCES dashboard_users(id) ON DELETE SET NULL;`);
  await client.query(`ALTER TABLE dashboard_email_settings ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`);
  await client.query(`ALTER TABLE dashboard_email_settings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`);
  await client.query(`
    ALTER TABLE dashboard_email_settings
    DROP CONSTRAINT IF EXISTS dashboard_email_settings_singleton;
  `);
  await client.query(`
    ALTER TABLE dashboard_email_settings
    ADD CONSTRAINT dashboard_email_settings_singleton CHECK (id = 1);
  `);
  await client.query(
    `
      INSERT INTO dashboard_email_settings (
        id,
        smtp_host,
        smtp_port,
        smtp_secure,
        smtp_user,
        smtp_password,
        smtp_from
      )
      VALUES (1, $1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO NOTHING;
    `,
    [env.smtp.host, env.smtp.port, env.smtp.secure, env.smtp.user, env.smtp.password, env.smtp.from]
  );
  await client.query(
    `
      UPDATE dashboard_email_settings
      SET smtp_host = $1
      WHERE smtp_host IS NULL OR smtp_host = '';
    `,
    [env.smtp.host]
  );
  await client.query(
    `
      UPDATE dashboard_email_settings
      SET smtp_port = $1
      WHERE smtp_port IS NULL OR smtp_port < 1 OR smtp_port > 65535;
    `,
    [env.smtp.port]
  );
  await client.query(
    `
      UPDATE dashboard_email_settings
      SET smtp_secure = $1
      WHERE smtp_secure IS NULL;
    `,
    [env.smtp.secure]
  );
  await client.query(
    `
      UPDATE dashboard_email_settings
      SET smtp_user = $1
      WHERE smtp_user IS NULL;
    `,
    [env.smtp.user]
  );
  await client.query(
    `
      UPDATE dashboard_email_settings
      SET smtp_password = $1
      WHERE smtp_password IS NULL;
    `,
    [env.smtp.password]
  );
  await client.query(
    `
      UPDATE dashboard_email_settings
      SET smtp_from = $1
      WHERE smtp_from IS NULL OR smtp_from = '';
    `,
    [env.smtp.from]
  );
  await client.query(
    `
      UPDATE dashboard_email_settings
      SET last_test_status = 'untested'
      WHERE last_test_status IS NULL OR last_test_status = '';
    `
  );
  await client.query(`ALTER TABLE dashboard_email_settings ALTER COLUMN smtp_host SET DEFAULT '';`);
  await client.query(`ALTER TABLE dashboard_email_settings ALTER COLUMN smtp_port SET DEFAULT 465;`);
  await client.query(`ALTER TABLE dashboard_email_settings ALTER COLUMN smtp_secure SET DEFAULT TRUE;`);
  await client.query(`ALTER TABLE dashboard_email_settings ALTER COLUMN smtp_user SET DEFAULT '';`);
  await client.query(`ALTER TABLE dashboard_email_settings ALTER COLUMN smtp_password SET DEFAULT '';`);
  await client.query(`ALTER TABLE dashboard_email_settings ALTER COLUMN smtp_from SET DEFAULT '';`);
  await client.query(`ALTER TABLE dashboard_email_settings ALTER COLUMN last_test_status SET DEFAULT 'untested';`);
  await client.query(`ALTER TABLE dashboard_email_settings ALTER COLUMN smtp_host SET NOT NULL;`);
  await client.query(`ALTER TABLE dashboard_email_settings ALTER COLUMN smtp_port SET NOT NULL;`);
  await client.query(`ALTER TABLE dashboard_email_settings ALTER COLUMN smtp_secure SET NOT NULL;`);
  await client.query(`ALTER TABLE dashboard_email_settings ALTER COLUMN smtp_user SET NOT NULL;`);
  await client.query(`ALTER TABLE dashboard_email_settings ALTER COLUMN smtp_password SET NOT NULL;`);
  await client.query(`ALTER TABLE dashboard_email_settings ALTER COLUMN smtp_from SET NOT NULL;`);
  await client.query(`ALTER TABLE dashboard_email_settings ALTER COLUMN last_test_status SET NOT NULL;`);

  await client.query(`
    CREATE TABLE IF NOT EXISTS dashboard_notification_settings (
      id SMALLINT PRIMARY KEY,
      partner_request_enabled BOOLEAN NOT NULL DEFAULT TRUE,
      partner_request_recipients TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
      payment_enabled BOOLEAN NOT NULL DEFAULT TRUE,
      payment_recipients TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
      updated_by TEXT REFERENCES dashboard_users(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  await client.query(`ALTER TABLE dashboard_notification_settings ADD COLUMN IF NOT EXISTS partner_request_enabled BOOLEAN;`);
  await client.query(`ALTER TABLE dashboard_notification_settings ADD COLUMN IF NOT EXISTS partner_request_recipients TEXT[];`);
  await client.query(`ALTER TABLE dashboard_notification_settings ADD COLUMN IF NOT EXISTS payment_enabled BOOLEAN;`);
  await client.query(`ALTER TABLE dashboard_notification_settings ADD COLUMN IF NOT EXISTS payment_recipients TEXT[];`);
  await client.query(`ALTER TABLE dashboard_notification_settings ADD COLUMN IF NOT EXISTS updated_by TEXT REFERENCES dashboard_users(id) ON DELETE SET NULL;`);
  await client.query(`ALTER TABLE dashboard_notification_settings ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`);
  await client.query(`ALTER TABLE dashboard_notification_settings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`);
  await client.query(`
    ALTER TABLE dashboard_notification_settings
    DROP CONSTRAINT IF EXISTS dashboard_notification_settings_singleton;
  `);
  await client.query(`
    ALTER TABLE dashboard_notification_settings
    ADD CONSTRAINT dashboard_notification_settings_singleton CHECK (id = 1);
  `);
  const defaultNotificationRecipients = [String(env.auth.adminEmail || '').trim().toLowerCase()].filter(Boolean);
  await client.query(
    `
      INSERT INTO dashboard_notification_settings (
        id,
        partner_request_enabled,
        partner_request_recipients,
        payment_enabled,
        payment_recipients
      )
      VALUES (1, TRUE, $1::TEXT[], TRUE, $1::TEXT[])
      ON CONFLICT (id) DO NOTHING;
    `,
    [defaultNotificationRecipients]
  );
  await client.query(
    `
      UPDATE dashboard_notification_settings
      SET partner_request_enabled = TRUE
      WHERE partner_request_enabled IS NULL;
    `
  );
  await client.query(
    `
      UPDATE dashboard_notification_settings
      SET payment_enabled = TRUE
      WHERE payment_enabled IS NULL;
    `
  );
  await client.query(
    `
      UPDATE dashboard_notification_settings
      SET partner_request_recipients = $1::TEXT[]
      WHERE partner_request_recipients IS NULL;
    `,
    [defaultNotificationRecipients]
  );
  await client.query(
    `
      UPDATE dashboard_notification_settings
      SET payment_recipients = $1::TEXT[]
      WHERE payment_recipients IS NULL;
    `,
    [defaultNotificationRecipients]
  );
  await client.query(`ALTER TABLE dashboard_notification_settings ALTER COLUMN partner_request_enabled SET DEFAULT TRUE;`);
  await client.query(`ALTER TABLE dashboard_notification_settings ALTER COLUMN partner_request_recipients SET DEFAULT ARRAY[]::TEXT[];`);
  await client.query(`ALTER TABLE dashboard_notification_settings ALTER COLUMN payment_enabled SET DEFAULT TRUE;`);
  await client.query(`ALTER TABLE dashboard_notification_settings ALTER COLUMN payment_recipients SET DEFAULT ARRAY[]::TEXT[];`);
  await client.query(`ALTER TABLE dashboard_notification_settings ALTER COLUMN partner_request_enabled SET NOT NULL;`);
  await client.query(`ALTER TABLE dashboard_notification_settings ALTER COLUMN partner_request_recipients SET NOT NULL;`);
  await client.query(`ALTER TABLE dashboard_notification_settings ALTER COLUMN payment_enabled SET NOT NULL;`);
  await client.query(`ALTER TABLE dashboard_notification_settings ALTER COLUMN payment_recipients SET NOT NULL;`);

  await client.query(`
    CREATE TABLE IF NOT EXISTS dashboard_partner_email_settings (
      id SMALLINT PRIMARY KEY,
      approval_subject TEXT NOT NULL,
      approval_body TEXT NOT NULL,
      rejection_subject TEXT NOT NULL,
      rejection_body TEXT NOT NULL,
      updated_by TEXT REFERENCES dashboard_users(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  await client.query(`
    ALTER TABLE dashboard_partner_email_settings
    DROP CONSTRAINT IF EXISTS dashboard_partner_email_settings_singleton;
  `);
  await client.query(`
    ALTER TABLE dashboard_partner_email_settings
    ADD CONSTRAINT dashboard_partner_email_settings_singleton CHECK (id = 1);
  `);
  await client.query(
    `
      INSERT INTO dashboard_partner_email_settings (
        id,
        approval_subject,
        approval_body,
        rejection_subject,
        rejection_body
      )
      VALUES (1, $1, $2, $3, $4)
      ON CONFLICT (id) DO NOTHING;
    `,
    [
      DEFAULT_PARTNER_EMAIL_SETTINGS.approvalSubject,
      DEFAULT_PARTNER_EMAIL_SETTINGS.approvalBody,
      DEFAULT_PARTNER_EMAIL_SETTINGS.rejectionSubject,
      DEFAULT_PARTNER_EMAIL_SETTINGS.rejectionBody
    ]
  );

  await client.query(`
    CREATE TABLE IF NOT EXISTS dashboard_privacy_policy_settings (
      id SMALLINT PRIMARY KEY,
      translations JSONB NOT NULL DEFAULT '{}'::jsonb,
      updated_by TEXT REFERENCES dashboard_users(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  await client.query(`
    ALTER TABLE dashboard_privacy_policy_settings
    DROP CONSTRAINT IF EXISTS dashboard_privacy_policy_settings_singleton;
  `);
  await client.query(`
    ALTER TABLE dashboard_privacy_policy_settings
    ADD CONSTRAINT dashboard_privacy_policy_settings_singleton CHECK (id = 1);
  `);
  await client.query(`
    INSERT INTO dashboard_privacy_policy_settings (id, translations)
    VALUES (1, '{}'::jsonb)
    ON CONFLICT (id) DO NOTHING;
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS dashboard_invites (
      id BIGSERIAL PRIMARY KEY,
      email TEXT NOT NULL,
      user_id TEXT NOT NULL REFERENCES dashboard_users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE,
      invited_by TEXT REFERENCES dashboard_users(id) ON DELETE SET NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      used_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS dashboard_password_resets (
      id BIGSERIAL PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES dashboard_users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE,
      requested_by TEXT REFERENCES dashboard_users(id) ON DELETE SET NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      used_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS dashboard_sessions (
      token_hash TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES dashboard_users(id) ON DELETE CASCADE,
      impersonated_by_user_id TEXT REFERENCES dashboard_users(id) ON DELETE SET NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS app_users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      first_name TEXT NOT NULL DEFAULT '',
      last_name TEXT NOT NULL DEFAULT '',
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS app_sessions (
      token_hash TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS app_password_resets (
      id BIGSERIAL PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMPTZ NOT NULL,
      used_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS app_user_structure_links (
      user_id TEXT PRIMARY KEY,
      structure_id TEXT NOT NULL REFERENCES dashboard_structures(id) ON DELETE CASCADE,
      discount_code_id BIGINT REFERENCES dashboard_structure_discount_codes(id) ON DELETE SET NULL,
      invite_code TEXT NOT NULL,
      associated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  await client.query(`
    ALTER TABLE app_user_structure_links
    ADD COLUMN IF NOT EXISTS discount_code_id BIGINT;
  `);
  await client.query(`
    ALTER TABLE app_user_structure_links
    ADD COLUMN IF NOT EXISTS invite_code TEXT;
  `);
  await client.query(`ALTER TABLE app_user_structure_links DROP CONSTRAINT IF EXISTS app_user_structure_links_discount_code_id_fkey;`);
  await client.query(`
    ALTER TABLE app_user_structure_links
    ADD CONSTRAINT app_user_structure_links_discount_code_id_fkey
    FOREIGN KEY (discount_code_id) REFERENCES dashboard_structure_discount_codes(id) ON DELETE SET NULL;
  `);
  await client.query(`
    UPDATE app_user_structure_links l
    SET discount_code_id = d.id
    FROM dashboard_structure_discount_codes d
    WHERE l.discount_code_id IS NULL
      AND l.invite_code IS NOT NULL
      AND UPPER(l.invite_code) = UPPER(d.code);
  `);
  await client.query(`
    UPDATE app_user_structure_links
    SET invite_code = UPPER(TRIM(invite_code))
    WHERE invite_code IS NOT NULL
      AND invite_code <> UPPER(TRIM(invite_code));
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS app_user_discount_code_uses (
      id BIGSERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      discount_code_id BIGINT REFERENCES dashboard_structure_discount_codes(id) ON DELETE SET NULL,
      structure_id TEXT REFERENCES dashboard_structures(id) ON DELETE SET NULL,
      invite_code TEXT NOT NULL,
      purchase_type TEXT NOT NULL CHECK (purchase_type IN ('single', 'bundle')),
      used_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  await client.query(`
    ALTER TABLE app_user_discount_code_uses
    ADD COLUMN IF NOT EXISTS discount_code_id BIGINT;
  `);
  await client.query(`
    ALTER TABLE app_user_discount_code_uses
    ADD COLUMN IF NOT EXISTS structure_id TEXT;
  `);
  await client.query(`
    ALTER TABLE app_user_discount_code_uses
    ADD COLUMN IF NOT EXISTS invite_code TEXT;
  `);
  await client.query(`
    ALTER TABLE app_user_discount_code_uses
    ADD COLUMN IF NOT EXISTS purchase_type TEXT;
  `);
  await client.query(`
    ALTER TABLE app_user_discount_code_uses
    ADD COLUMN IF NOT EXISTS used_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
  `);
  await client.query(`ALTER TABLE app_user_discount_code_uses DROP CONSTRAINT IF EXISTS app_user_discount_code_uses_discount_code_id_fkey;`);
  await client.query(`
    ALTER TABLE app_user_discount_code_uses
    ADD CONSTRAINT app_user_discount_code_uses_discount_code_id_fkey
    FOREIGN KEY (discount_code_id) REFERENCES dashboard_structure_discount_codes(id) ON DELETE SET NULL;
  `);
  await client.query(`ALTER TABLE app_user_discount_code_uses DROP CONSTRAINT IF EXISTS app_user_discount_code_uses_structure_id_fkey;`);
  await client.query(`
    ALTER TABLE app_user_discount_code_uses
    ADD CONSTRAINT app_user_discount_code_uses_structure_id_fkey
    FOREIGN KEY (structure_id) REFERENCES dashboard_structures(id) ON DELETE SET NULL;
  `);
  await client.query(`
    UPDATE app_user_discount_code_uses
    SET invite_code = UPPER(TRIM(invite_code))
    WHERE invite_code IS NOT NULL
      AND invite_code <> UPPER(TRIM(invite_code));
  `);
  await client.query(`
    UPDATE app_user_discount_code_uses u
    SET invite_code = UPPER(TRIM(dc.code))
    FROM dashboard_structure_discount_codes dc
    WHERE (u.invite_code IS NULL OR TRIM(u.invite_code) = '')
      AND u.discount_code_id = dc.id;
  `);
  await client.query(`
    DELETE FROM app_user_discount_code_uses
    WHERE invite_code IS NULL OR TRIM(invite_code) = '';
  `);
  await client.query(`
    UPDATE app_user_discount_code_uses
    SET purchase_type = 'single'
    WHERE purchase_type IS NULL OR purchase_type NOT IN ('single', 'bundle');
  `);
  await client.query(`
    ALTER TABLE app_user_discount_code_uses
    ALTER COLUMN invite_code SET NOT NULL;
  `);
  await client.query(`
    ALTER TABLE app_user_discount_code_uses
    ALTER COLUMN purchase_type SET NOT NULL;
  `);
  await client.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS uq_app_user_discount_code_uses_user_code
    ON app_user_discount_code_uses(user_id, invite_code);
  `);
  await client.query(`
    INSERT INTO app_user_discount_code_uses (
      user_id,
      discount_code_id,
      structure_id,
      invite_code,
      purchase_type,
      used_at
    )
    SELECT DISTINCT ON (p.user_id, UPPER(TRIM(p.invite_code)))
      p.user_id,
      d.id,
      COALESCE(p.structure_id, d.structure_id),
      UPPER(TRIM(p.invite_code)),
      p.type,
      p.purchased_at
    FROM purchases p
    LEFT JOIN dashboard_structure_discount_codes d ON UPPER(d.code) = UPPER(TRIM(p.invite_code))
    WHERE p.invite_code IS NOT NULL
      AND TRIM(p.invite_code) <> ''
    ORDER BY p.user_id, UPPER(TRIM(p.invite_code)), p.purchased_at ASC, p.id ASC
    ON CONFLICT (user_id, invite_code) DO NOTHING;
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS paypal_checkout_orders (
      id BIGSERIAL PRIMARY KEY,
      paypal_order_id TEXT NOT NULL UNIQUE,
      user_id TEXT NOT NULL,
      checkout_context TEXT NOT NULL CHECK (checkout_context IN ('single', 'bundle', 'cart')),
      status TEXT NOT NULL DEFAULT 'created',
      currency_code TEXT NOT NULL DEFAULT 'EUR',
      mode TEXT NOT NULL DEFAULT 'sandbox',
      city_id TEXT REFERENCES cities(id) ON DELETE SET NULL,
      poi_id TEXT REFERENCES pois(id) ON DELETE SET NULL,
      base_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
      discount_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
      discount_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
      final_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
      structure_id TEXT REFERENCES dashboard_structures(id) ON DELETE SET NULL,
      invite_code TEXT,
      structure_fixed_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
      structure_earning_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
      purchase_items JSONB NOT NULL DEFAULT '[]'::jsonb,
      capture_payload JSONB,
      payer_email TEXT,
      payer_id TEXT,
      payer_first_name TEXT,
      payer_last_name TEXT,
      payer_country_code TEXT,
      payer_phone TEXT,
      payer_address TEXT,
      capture_id TEXT,
      error_message TEXT,
      captured_at TIMESTAMPTZ,
      expires_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  await client.query(`
    ALTER TABLE paypal_checkout_orders
    DROP CONSTRAINT IF EXISTS paypal_checkout_orders_mode_check;
  `);
  await client.query(`
    ALTER TABLE paypal_checkout_orders
    ADD CONSTRAINT paypal_checkout_orders_mode_check CHECK (mode IN ('sandbox', 'live'));
  `);

  await client.query(`
    ALTER TABLE dashboard_sessions
    ADD COLUMN IF NOT EXISTS impersonated_by_user_id TEXT REFERENCES dashboard_users(id) ON DELETE SET NULL;
  `);

  await client.query(`CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_cities_publication_status ON cities(publication_status);`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_pois_city_publication_status ON pois(city_id, publication_status);`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_purchases_city_id ON purchases(city_id);`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_purchases_poi_id ON purchases(poi_id);`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_purchases_structure_id ON purchases(structure_id);`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_purchases_payment_order_id ON purchases(payment_order_id);`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_dashboard_invites_user_id ON dashboard_invites(user_id);`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_dashboard_invites_expires_at ON dashboard_invites(expires_at);`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_dashboard_password_resets_user_id ON dashboard_password_resets(user_id);`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_dashboard_password_resets_expires_at ON dashboard_password_resets(expires_at);`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_dashboard_sessions_user_id ON dashboard_sessions(user_id);`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_dashboard_sessions_expires_at ON dashboard_sessions(expires_at);`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_app_sessions_user_id ON app_sessions(user_id);`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_app_sessions_expires_at ON app_sessions(expires_at);`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_app_password_resets_user_id ON app_password_resets(user_id);`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_app_password_resets_expires_at ON app_password_resets(expires_at);`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_dashboard_users_structure_id ON dashboard_users(structure_id);`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_dashboard_users_deleted ON dashboard_users(deleted);`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_dashboard_structures_created_at ON dashboard_structures(created_at);`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_dashboard_structures_deleted ON dashboard_structures(deleted);`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_partner_registration_requests_deleted ON partner_registration_requests(deleted);`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_app_user_structure_links_structure_id ON app_user_structure_links(structure_id);`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_app_user_structure_links_discount_code_id ON app_user_structure_links(discount_code_id);`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_app_user_discount_code_uses_user_id ON app_user_discount_code_uses(user_id);`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_app_user_discount_code_uses_discount_code_id ON app_user_discount_code_uses(discount_code_id);`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_app_user_discount_code_uses_structure_id ON app_user_discount_code_uses(structure_id);`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_dashboard_discount_codes_structure_id ON dashboard_structure_discount_codes(structure_id);`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_dashboard_discount_codes_expires_at ON dashboard_structure_discount_codes(expires_at);`);
  await client.query(
    `CREATE INDEX IF NOT EXISTS idx_dashboard_sessions_impersonated_by ON dashboard_sessions(impersonated_by_user_id);`
  );
  await client.query(`CREATE INDEX IF NOT EXISTS idx_dashboard_paypal_settings_updated_by ON dashboard_paypal_settings(updated_by);`);
  await client.query(
    `CREATE INDEX IF NOT EXISTS idx_dashboard_openai_translation_settings_updated_by ON dashboard_openai_translation_settings(updated_by);`
  );
  await client.query(
    `CREATE INDEX IF NOT EXISTS idx_dashboard_app_cache_settings_updated_by ON dashboard_app_cache_settings(updated_by);`
  );
  await client.query(
    `CREATE INDEX IF NOT EXISTS idx_dashboard_email_settings_updated_by ON dashboard_email_settings(updated_by);`
  );
  await client.query(
    `CREATE INDEX IF NOT EXISTS idx_dashboard_notification_settings_updated_by ON dashboard_notification_settings(updated_by);`
  );
  await client.query(
    `CREATE INDEX IF NOT EXISTS idx_dashboard_partner_email_settings_updated_by ON dashboard_partner_email_settings(updated_by);`
  );
  await client.query(
    `CREATE INDEX IF NOT EXISTS idx_dashboard_privacy_policy_settings_updated_by ON dashboard_privacy_policy_settings(updated_by);`
  );
  await client.query(`CREATE INDEX IF NOT EXISTS idx_paypal_checkout_orders_user_id ON paypal_checkout_orders(user_id);`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_paypal_checkout_orders_status ON paypal_checkout_orders(status);`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_paypal_checkout_orders_invite_code ON paypal_checkout_orders(invite_code);`);
}

async function seedCities(client) {
  for (const city of citiesSeed) {
    await client.query(
      `
        INSERT INTO cities (id, name, region, bundle_price, hero_image, is_default)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          region = EXCLUDED.region,
          hero_image = EXCLUDED.hero_image,
          is_default = EXCLUDED.is_default
      `,
      [city.id, city.name, city.region, city.bundlePrice, city.heroImage, city.isDefault]
    );
  }
}

async function seedPois(client) {
  for (const poi of poisSeed) {
    await client.query(
      `
        INSERT INTO pois (
          id,
          city_id,
          name,
          address,
          lat,
          lng,
          category,
          description_short,
          description_long,
          image_url,
          audio_url,
          price_single,
          duration_sec
        ) VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9,
          $10,
          $11,
          $12,
          $13
        )
        ON CONFLICT (id) DO UPDATE SET
          city_id = EXCLUDED.city_id,
          name = EXCLUDED.name,
          address = EXCLUDED.address,
          lat = EXCLUDED.lat,
          lng = EXCLUDED.lng,
          category = EXCLUDED.category,
          description_short = EXCLUDED.description_short,
          description_long = EXCLUDED.description_long,
          image_url = EXCLUDED.image_url,
          audio_url = EXCLUDED.audio_url,
          duration_sec = EXCLUDED.duration_sec
      `,
      [
        poi.id,
        poi.cityId,
        poi.name,
        getPoiAddress(poi),
        poi.lat,
        poi.lng,
        poi.category,
        poi.descriptionShort,
        poi.descriptionLong,
        poi.imageUrl,
        poi.audioUrl,
        poi.priceSingle,
        poi.durationSec
      ]
    );
  }
}

async function syncPoiAddresses(client) {
  const poisResult = await client.query(`
    SELECT id, city_id, name, address
    FROM pois
  `);

  for (const poi of poisResult.rows) {
    const address = getPoiAddress(poi);
    if (!address) {
      continue;
    }

    await client.query(
      `
        UPDATE pois
        SET address = $2
        WHERE id = $1
          AND address IS DISTINCT FROM $2
      `,
      [poi.id, address]
    );
  }
}

async function seedHotelCodes(client) {
  for (const hotelCode of hotelCodesSeed) {
    await client.query(
      `
        INSERT INTO hotel_codes (code, city_id, is_active)
        VALUES ($1, $2, $3)
        ON CONFLICT (code) DO UPDATE SET
          city_id = EXCLUDED.city_id,
          is_active = EXCLUDED.is_active
      `,
      [hotelCode.code, hotelCode.cityId, hotelCode.isActive]
    );
  }
}

async function seedAdminUser(client) {
  const adminName = 'Admin';
  const adminFirstName = 'Admin';
  const adminLastName = 'User';
  const adminEmail = env.auth.adminEmail.toLowerCase();
  const adminHash = await hashPassword(env.auth.adminPassword);

  await client.query(
    `
      INSERT INTO dashboard_users (
        id,
        name,
        first_name,
        last_name,
        facility_name,
        structure_id,
        email,
        password_hash,
        role,
        is_registered,
        updated_at
      )
      VALUES ('usr_admin_default', $1, $2, $3, NULL, NULL, $4, $5, 'admin', TRUE, NOW())
      ON CONFLICT (email) DO UPDATE SET
        name = CASE
          WHEN dashboard_users.name IS NULL OR dashboard_users.name = '' THEN EXCLUDED.name
          ELSE dashboard_users.name
        END,
        first_name = CASE
          WHEN dashboard_users.first_name IS NULL OR dashboard_users.first_name = '' THEN EXCLUDED.first_name
          ELSE dashboard_users.first_name
        END,
        last_name = CASE
          WHEN dashboard_users.last_name IS NULL OR dashboard_users.last_name = '' THEN EXCLUDED.last_name
          ELSE dashboard_users.last_name
        END,
        structure_id = CASE
          WHEN EXCLUDED.role = 'admin' THEN NULL
          ELSE dashboard_users.structure_id
        END,
        password_hash = EXCLUDED.password_hash,
        role = 'admin',
        is_registered = TRUE,
        updated_at = NOW()
    `,
    [adminName, adminFirstName, adminLastName, adminEmail, adminHash]
  );
}

async function shouldSeedCatalogData(client) {
  if (env.db.seedMode === 'always') {
    return true;
  }
  if (env.db.seedMode === 'never') {
    return false;
  }

  const countsResult = await client.query(
    `
      SELECT
        (SELECT COUNT(*)::INT FROM cities) AS cities_count,
        (SELECT COUNT(*)::INT FROM pois) AS pois_count,
        (SELECT COUNT(*)::INT FROM hotel_codes) AS hotel_codes_count
    `
  );

  const row = countsResult.rows[0] || {};
  const citiesCount = Number(row.cities_count || 0);
  const poisCount = Number(row.pois_count || 0);
  const hotelCodesCount = Number(row.hotel_codes_count || 0);
  return citiesCount === 0 && poisCount === 0 && hotelCodesCount === 0;
}

export async function initDatabase() {
  const client = await pool.connect();
  let lockAcquired = false;
  try {
    await client.query('SELECT pg_advisory_lock($1, $2)', [DB_INIT_LOCK_NAMESPACE, DB_INIT_LOCK_KEY]);
    lockAcquired = true;

    for (let attempt = 1; attempt <= DB_INIT_MAX_ATTEMPTS; attempt += 1) {
      let shouldRollback = false;
      try {
        await client.query('BEGIN');
        shouldRollback = true;
        await createSchema(client);
        await seedAdminUser(client);
        if (await shouldSeedCatalogData(client)) {
          await seedCities(client);
          await seedPois(client);
          await seedHotelCodes(client);
        }
        await syncPoiAddresses(client);
        await client.query('COMMIT');
        shouldRollback = false;
        return;
      } catch (error) {
        if (shouldRollback) {
          try {
            await client.query('ROLLBACK');
          } catch (rollbackError) {
            console.error('Failed to roll back database initialization', rollbackError);
          }
        }

        if (error?.code !== DEADLOCK_DETECTED_CODE || attempt === DB_INIT_MAX_ATTEMPTS) {
          throw error;
        }

        console.warn(`Database initialization deadlock detected; retrying (${attempt}/${DB_INIT_MAX_ATTEMPTS})`);
        await wait(250 * attempt);
      }
    }
  } finally {
    if (lockAcquired) {
      try {
        await client.query('SELECT pg_advisory_unlock($1, $2)', [DB_INIT_LOCK_NAMESPACE, DB_INIT_LOCK_KEY]);
      } catch (unlockError) {
        console.error('Failed to release database initialization lock', unlockError);
      }
    }
    client.release();
  }
}
