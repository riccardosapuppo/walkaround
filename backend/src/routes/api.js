import express from 'express';
import { z } from 'zod';
import { pool } from '../db/pool.js';

const router = express.Router();

function mapCity(row) {
  return {
    id: row.id,
    name: row.name,
    region: row.region,
    bundlePrice: Number(row.bundle_price),
    heroImage: row.hero_image,
    isDefault: row.is_default
  };
}

function mapPoi(row) {
  return {
    id: row.id,
    cityId: row.city_id,
    name: row.name,
    lat: Number(row.lat),
    lng: Number(row.lng),
    category: row.category,
    descriptionShort: row.description_short,
    descriptionLong: row.description_long,
    imageUrl: row.image_url,
    audioUrl: row.audio_url,
    priceSingle: Number(row.price_single),
    durationSec: row.duration_sec
  };
}

const purchaseSchema = z.object({
  userId: z.string().min(2),
  type: z.literal('bundle'),
  cityId: z.string().min(2)
});

router.get('/cities', async (_req, res, next) => {
  try {
    const result = await pool.query(
      `
      SELECT c.*, COUNT(p.id)::int AS poi_count
      FROM cities c
      LEFT JOIN pois p ON p.city_id = c.id
      GROUP BY c.id
      ORDER BY c.is_default DESC, c.name ASC
      `
    );

    const data = result.rows.map((row) => ({
      ...mapCity(row),
      poiCount: row.poi_count
    }));

    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/cities/:cityId/pois', async (req, res, next) => {
  const { cityId } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT *
      FROM pois
      WHERE city_id = $1
      ORDER BY name ASC
      `,
      [cityId]
    );

    res.json(result.rows.map(mapPoi));
  } catch (error) {
    next(error);
  }
});

router.get('/pois/:poiId', async (req, res, next) => {
  const { poiId } = req.params;

  try {
    const result = await pool.query('SELECT * FROM pois WHERE id = $1 LIMIT 1', [poiId]);
    if (!result.rowCount) {
      return res.status(404).json({ message: 'POI not found' });
    }

    return res.json(mapPoi(result.rows[0]));
  } catch (error) {
    return next(error);
  }
});

router.post('/purchase', async (req, res, next) => {
  const parsed = purchaseSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid payload', errors: parsed.error.flatten() });
  }

  const payload = parsed.data;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const cityQuery = await client.query('SELECT id, bundle_price FROM cities WHERE id = $1 LIMIT 1', [payload.cityId]);
    if (!cityQuery.rowCount) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'City not found' });
    }

    const city = cityQuery.rows[0];

    const alreadyBundle = await client.query(
      `
      SELECT 1
      FROM purchases
      WHERE user_id = $1 AND type = 'bundle' AND city_id = $2
      LIMIT 1
      `,
      [payload.userId, city.id]
    );

    if (alreadyBundle.rowCount) {
      await client.query('ROLLBACK');
      return res.json({ purchased: true, alreadyPurchased: true, type: 'bundle', cityId: city.id });
    }

    await client.query(
      `
      INSERT INTO purchases (user_id, type, city_id, amount)
      VALUES ($1, 'bundle', $2, $3)
      `,
      [payload.userId, city.id, city.bundle_price]
    );

    await client.query('COMMIT');
    return res.json({
      purchased: true,
      type: 'bundle',
      cityId: city.id,
      amount: Number(city.bundle_price)
    });
  } catch (error) {
    await client.query('ROLLBACK');
    return next(error);
  } finally {
    client.release();
  }
});

router.get('/me/purchases', async (req, res, next) => {
  const userId = String(req.query.userId || '').trim();
  if (!userId) {
    return res.status(400).json({ message: 'Missing userId query parameter' });
  }

  try {
    const [purchases, unlockedPois] = await Promise.all([
      pool.query(
        `
        SELECT id, user_id, type, city_id, poi_id, amount, purchased_at
        FROM purchases
        WHERE user_id = $1
        ORDER BY purchased_at DESC
        `,
        [userId]
      ),
      pool.query(
        `
        SELECT DISTINCT p.id
        FROM pois p
        JOIN purchases b
          ON b.user_id = $1
         AND b.type = 'bundle'
         AND b.city_id = p.city_id
        `,
        [userId]
      )
    ]);

    const raw = purchases.rows.map((row) => ({
      id: Number(row.id),
      userId: row.user_id,
      type: row.type,
      cityId: row.city_id,
      poiId: row.poi_id,
      amount: Number(row.amount),
      purchasedAt: row.purchased_at
    }));

    const unlockedPoiIds = unlockedPois.rows.map((row) => row.id);
    const unlockedCityIds = Array.from(new Set(raw.filter((item) => item.type === 'bundle').map((item) => item.cityId)));

    return res.json({
      items: raw,
      unlockedPoiIds,
      unlockedCityIds
    });
  } catch (error) {
    return next(error);
  }
});

const hotelValidateSchema = z.object({
  code: z.string().min(2),
  userId: z.string().min(2)
});

router.post('/hotel/validate', async (req, res, next) => {
  const parsed = hotelValidateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid payload', errors: parsed.error.flatten() });
  }

  const payload = parsed.data;
  const normalizedCode = payload.code.trim().toUpperCase();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const codeResult = await client.query(
      `
      SELECT hc.code, hc.city_id, c.name, c.bundle_price
      FROM hotel_codes hc
      JOIN cities c ON c.id = hc.city_id
      WHERE hc.code = $1 AND hc.is_active = TRUE
      LIMIT 1
      `,
      [normalizedCode]
    );

    if (!codeResult.rowCount) {
      await client.query('ROLLBACK');
      return res.status(404).json({ valid: false, message: 'Codice hotel non valido' });
    }

    const codeRow = codeResult.rows[0];
    const exists = await client.query(
      `
      SELECT 1
      FROM purchases
      WHERE user_id = $1
        AND type = 'bundle'
        AND city_id = $2
      LIMIT 1
      `,
      [payload.userId, codeRow.city_id]
    );

    if (!exists.rowCount) {
      await client.query(
        `
        INSERT INTO purchases (user_id, type, city_id, amount)
        VALUES ($1, 'bundle', $2, 0)
        `,
        [payload.userId, codeRow.city_id]
      );
    }

    await client.query('COMMIT');

    return res.json({
      valid: true,
      unlocked: {
        type: 'bundle',
        cityId: codeRow.city_id,
        cityName: codeRow.name,
        amount: 0
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    return next(error);
  } finally {
    client.release();
  }
});

export { router as apiRouter };
