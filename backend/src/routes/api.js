import express from 'express';
import { z } from 'zod';
import { pool } from '../db/pool.js';

const router = express.Router();

function sanitizeText(value) {
  if (typeof value !== 'string' || value.length === 0) {
    return value;
  }

  let text = value
    .replace(/Ã /g, '\u00E0')
    .replace(/Ã¨/g, '\u00E8')
    .replace(/Ã©/g, '\u00E9')
    .replace(/Ã¬/g, '\u00EC')
    .replace(/Ã²/g, '\u00F2')
    .replace(/Ã¹/g, '\u00F9')
    .replace(/â€™/g, "'")
    .replace(/â€˜/g, "'")
    .replace(/â€œ/g, '"')
    .replace(/â€\u009D/g, '"')
    .replace(/â€”/g, '-')
    .replace(/â€“/g, '-');

  if (!text.includes('\uFFFD')) {
    return text;
  }

  // Fix common elisions and contractions first.
  text = text
    .replace(/([A-Za-zÀ-ÿ])\uFFFD(?=[A-Za-zÀ-ÿ])/g, "$1'")
    .replace(/\b\uFFFD(?=[A-Za-zÀ-ÿ])/g, "'");

  const replacements = [
    ['citt\uFFFD', 'citt\u00E0'],
    ['pi\uFFFD', 'pi\u00F9'],
    ['Pi\uFFFD', 'Pi\u00F9'],
    ['per\uFFFD', 'per\u00F2'],
    ['bens\uFFFD', 'bens\u00EC'],
    ['cos\uFFFD', 'cos\u00EC'],
    ['ci\uFFFD', 'ci\u00F2'],
    ['gi\uFFFD', 'gi\u00E0'],
    ['pu\uFFFD', 'pu\u00F2'],
    ['s\uFFFD', 's\u00EC'],
    ['l\uFFFD', 'l\u00EC'],
    ['caff\uFFFD', 'caff\u00E8'],
    ['Caff\uFFFD', 'Caff\u00E8'],
    ['sub\uFFFD', 'sub\u00EC'],
    ['contribu\uFFFD', 'contribu\u00EC'],
    ['colp\uFFFD', 'colp\u00EC'],
    ['fior\uFFFD', 'fior\u00EC'],
    ['battezz\uFFFD', 'battezz\u00F2'],
    ['catalog\uFFFD', 'catalog\u00F2'],
    ['celebr\uFFFD', 'celebr\u00F2'],
    ['confront\uFFFD', 'confront\u00F2'],
    ['cur\uFFFD', 'cur\u00F2'],
    ['entr\uFFFD', 'entr\u00F2'],
    ['inizi\uFFFD', 'inizi\u00F2'],
    ['lasci\uFFFD', 'lasci\u00F2'],
    ['limit\uFFFD', 'limit\u00F2'],
    ['riconquist\uFFFD', 'riconquist\u00F2'],
    ['ridisegn\uFFFD', 'ridisegn\u00F2'],
    ['rivoluzion\uFFFD', 'rivoluzion\u00F2'],
    ['soggiorn\uFFFD', 'soggiorn\u00F2'],
    ['studi\uFFFD', 'studi\u00F2'],
    ['torn\uFFFD', 'torn\u00F2'],
    ['trasform\uFFFD', 'trasform\u00F2'],
    ['Mundi\uFFFD', 'Mundi'],
    ['Dionisio\uFFFD', 'Dionisio'],
    ['Maniace\uFFFD', 'Maniace'],
    ['Annunciata\uFFFD', 'Annunciata'],
    ['Vermexio\uFFFD', 'Vermexio'],
    ['cavalleresche\uFFFD', 'cavalleresche'],
    ['acustico\uFFFD', 'acustico'],
    ['S\uFFFD', 'S']
  ];

  for (const [from, to] of replacements) {
    text = text.split(from).join(to);
  }

  text = text
    .replace(/([A-Za-zÀ-ÿ]+)it\uFFFD(?=[^A-Za-zÀ-ÿ]|$)/g, '$1it\u00E0')
    .replace(/([A-Za-zÀ-ÿ]+)et\uFFFD(?=[^A-Za-zÀ-ÿ]|$)/g, '$1et\u00E0')
    .replace(/([A-Za-zÀ-ÿ]+)t\uFFFD(?=[^A-Za-zÀ-ÿ]|$)/g, '$1t\u00E0')
    .replace(/\s\uFFFD\s/g, ' \u00E8 ')
    .replace(/\uFFFD/g, "'");

  return text;
}

function mapCity(row) {
  return {
    id: row.id,
    name: sanitizeText(row.name),
    region: sanitizeText(row.region),
    bundlePrice: Number(row.bundle_price),
    heroImage: row.hero_image,
    isDefault: row.is_default
  };
}

function mapPoi(row) {
  return {
    id: row.id,
    cityId: row.city_id,
    name: sanitizeText(row.name),
    lat: Number(row.lat),
    lng: Number(row.lng),
    category: sanitizeText(row.category),
    descriptionShort: sanitizeText(row.description_short),
    descriptionLong: sanitizeText(row.description_long),
    imageUrl: row.image_url,
    audioUrl: row.audio_url,
    priceSingle: Number(row.price_single),
    durationSec: row.duration_sec
  };
}

const purchaseSchema = z.discriminatedUnion('type', [
  z.object({
    userId: z.string().min(2),
    type: z.literal('bundle'),
    cityId: z.string().min(2)
  }),
  z.object({
    userId: z.string().min(2),
    type: z.literal('single'),
    poiId: z.string().min(2)
  })
]);

const unlockValidateSchema = z.discriminatedUnion('type', [
  z.object({
    code: z.string().min(1),
    userId: z.string().min(2),
    type: z.literal('bundle'),
    cityId: z.string().min(2)
  }),
  z.object({
    code: z.string().min(1),
    userId: z.string().min(2),
    type: z.literal('single'),
    poiId: z.string().min(2)
  })
]);

function getDailyUnlockCode(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Rome',
    day: '2-digit',
    month: '2-digit'
  }).formatToParts(now);

  const day = parts.find((part) => part.type === 'day')?.value || '01';
  const month = parts.find((part) => part.type === 'month')?.value || '01';

  return `tour${day}${month}`;
}

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

router.post('/unlock/validate', async (req, res, next) => {
  const parsed = unlockValidateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ valid: false, message: 'Invalid payload', errors: parsed.error.flatten() });
  }

  const payload = parsed.data;
  const expectedCode = getDailyUnlockCode();
  const normalizedCode = payload.code.trim().toLowerCase();

  if (normalizedCode !== expectedCode) {
    return res.status(403).json({ valid: false, message: 'Codice sblocco non valido' });
  }

  try {
    if (payload.type === 'bundle') {
      const cityResult = await pool.query('SELECT id, name, bundle_price FROM cities WHERE id = $1 LIMIT 1', [payload.cityId]);
      if (!cityResult.rowCount) {
        return res.status(404).json({ valid: false, message: 'City not found' });
      }

      const city = cityResult.rows[0];
      return res.json({
        valid: true,
        unlocked: {
          type: 'bundle',
          cityId: city.id,
          cityName: sanitizeText(city.name),
          amount: Number(city.bundle_price)
        }
      });
    }

    const poiResult = await pool.query('SELECT id, city_id, name, price_single FROM pois WHERE id = $1 LIMIT 1', [payload.poiId]);
    if (!poiResult.rowCount) {
      return res.status(404).json({ valid: false, message: 'POI not found' });
    }

    const poi = poiResult.rows[0];
    return res.json({
      valid: true,
      unlocked: {
        type: 'single',
        cityId: poi.city_id,
        poiId: poi.id,
        poiName: sanitizeText(poi.name),
        amount: Number(poi.price_single)
      }
    });
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

    if (payload.type === 'bundle') {
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
    }

    const poiQuery = await client.query('SELECT id, city_id, price_single FROM pois WHERE id = $1 LIMIT 1', [payload.poiId]);
    if (!poiQuery.rowCount) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'POI not found' });
    }

    const poi = poiQuery.rows[0];

    const [alreadyBundle, alreadySingle] = await Promise.all([
      client.query(
        `
        SELECT 1
        FROM purchases
        WHERE user_id = $1 AND type = 'bundle' AND city_id = $2
        LIMIT 1
        `,
        [payload.userId, poi.city_id]
      ),
      client.query(
        `
        SELECT 1
        FROM purchases
        WHERE user_id = $1 AND type = 'single' AND poi_id = $2
        LIMIT 1
        `,
        [payload.userId, poi.id]
      )
    ]);

    if (alreadyBundle.rowCount || alreadySingle.rowCount) {
      await client.query('ROLLBACK');
      return res.json({
        purchased: true,
        alreadyPurchased: true,
        type: 'single',
        cityId: poi.city_id,
        poiId: poi.id
      });
    }

    await client.query(
      `
      INSERT INTO purchases (user_id, type, city_id, poi_id, amount)
      VALUES ($1, 'single', $2, $3, $4)
      `,
      [payload.userId, poi.city_id, poi.id, poi.price_single]
    );

    await client.query('COMMIT');
    return res.json({
      purchased: true,
      type: 'single',
      cityId: poi.city_id,
      poiId: poi.id,
      amount: Number(poi.price_single)
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
        SELECT DISTINCT poi_id AS id
        FROM purchases
        WHERE user_id = $1
          AND type = 'single'
          AND poi_id IS NOT NULL
        UNION
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
        cityName: sanitizeText(codeRow.name),
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
