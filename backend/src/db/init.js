import { pool } from './pool.js';
import { citiesSeed, hotelCodesSeed, poisSeed } from './seed-data.js';

async function createSchema(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS cities (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      region TEXT NOT NULL,
      bundle_price NUMERIC(10,2) NOT NULL,
      hero_image TEXT NOT NULL,
      is_default BOOLEAN NOT NULL DEFAULT FALSE
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS pois (
      id TEXT PRIMARY KEY,
      city_id TEXT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      lat DOUBLE PRECISION NOT NULL,
      lng DOUBLE PRECISION NOT NULL,
      category TEXT NOT NULL,
      description_short TEXT NOT NULL,
      description_long TEXT NOT NULL,
      image_url TEXT NOT NULL,
      audio_url TEXT NOT NULL,
      price_single NUMERIC(10,2) NOT NULL,
      duration_sec INTEGER NOT NULL
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS purchases (
      id BIGSERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('single', 'bundle')),
      city_id TEXT REFERENCES cities(id) ON DELETE CASCADE,
      poi_id TEXT REFERENCES pois(id) ON DELETE CASCADE,
      amount NUMERIC(10,2) NOT NULL,
      purchased_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
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
    CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
  `);

  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_purchases_city_id ON purchases(city_id);
  `);

  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_purchases_poi_id ON purchases(poi_id);
  `);
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
          bundle_price = EXCLUDED.bundle_price,
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
          $12
        )
        ON CONFLICT (id) DO UPDATE SET
          city_id = EXCLUDED.city_id,
          name = EXCLUDED.name,
          lat = EXCLUDED.lat,
          lng = EXCLUDED.lng,
          category = EXCLUDED.category,
          description_short = EXCLUDED.description_short,
          description_long = EXCLUDED.description_long,
          image_url = EXCLUDED.image_url,
          audio_url = EXCLUDED.audio_url,
          price_single = EXCLUDED.price_single,
          duration_sec = EXCLUDED.duration_sec
      `,
      [
        poi.id,
        poi.cityId,
        poi.name,
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

export async function initDatabase() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await createSchema(client);
    await seedCities(client);
    await seedPois(client);
    await seedHotelCodes(client);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
