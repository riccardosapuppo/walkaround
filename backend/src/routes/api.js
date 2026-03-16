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
    cityId: z.string().min(2),
    ignoreDiscountCode: z.boolean().optional()
  }),
  z.object({
    userId: z.string().min(2),
    type: z.literal('single'),
    poiId: z.string().min(2),
    ignoreDiscountCode: z.boolean().optional()
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

function roundMoney(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return 0;
  }
  return Math.round(numeric * 100) / 100;
}

function clamp(value, min, max) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return min;
  }
  return Math.max(min, Math.min(max, numeric));
}

function normalizeInviteCode(value) {
  return String(value || '')
    .trim()
    .toUpperCase();
}

function normalizeDiscountApplyTo(value) {
  if (value === 'single' || value === 'bundle') {
    return value;
  }
  return null;
}

function normalizeTextArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  const unique = new Set();
  for (const item of value) {
    const normalized = String(item || '').trim();
    if (normalized) {
      unique.add(normalized);
    }
  }
  return Array.from(unique);
}

function discountCodeCityIds(row) {
  const normalizedArray = normalizeTextArray(row.city_ids);
  if (normalizedArray.length) {
    return normalizedArray;
  }
  const legacyCityId = String(row.city_id || '').trim();
  return legacyCityId ? [legacyCityId] : [];
}

function discountCodeCityNames(row) {
  const normalizedArray = normalizeTextArray(row.city_names);
  if (normalizedArray.length) {
    return normalizedArray;
  }
  const legacyCityName = String(row.city_name || '').trim();
  return legacyCityName ? [legacyCityName] : [];
}

function isDiscountCodeApplicableToTarget(row, purchaseType, targetCityId) {
  const applyTo = normalizeDiscountApplyTo(row.apply_to);
  if (applyTo && applyTo !== purchaseType) {
    return false;
  }

  const codeCityIds = discountCodeCityIds(row);
  if (codeCityIds.length && !codeCityIds.includes(String(targetCityId || '').trim())) {
    return false;
  }

  return true;
}

function resolveStructureDiscountValues(row, purchaseType) {
  const isBundle = purchaseType === 'bundle';
  const percentRaw = isBundle ? row.user_discount_percent_bundle : row.user_discount_percent_single;
  const fixedRaw = isBundle ? row.structure_fixed_amount_bundle : row.structure_fixed_amount_single;

  return {
    userDiscountPercent: clamp(percentRaw ?? row.user_discount_percent, 0, 100),
    structureFixedAmount: Math.max(0, roundMoney(fixedRaw ?? row.structure_fixed_amount))
  };
}

async function fetchUserStructurePricingContext(userId, purchaseType, targetCityId, client) {
  const result = await client.query(
    `
    SELECT
      l.structure_id,
      l.invite_code,
      dc.id AS discount_code_id,
      dc.code AS discount_code,
      dc.apply_to,
      dc.city_id,
      dc.city_name,
      dc.city_ids,
      dc.city_names,
      dc.user_discount_percent,
      dc.user_discount_percent_single,
      dc.user_discount_percent_bundle,
      dc.structure_fixed_amount,
      dc.structure_fixed_amount_single,
      dc.structure_fixed_amount_bundle
    FROM app_user_structure_links l
    LEFT JOIN LATERAL (
      SELECT
        d.id,
        d.code,
        d.apply_to,
        d.city_id,
        legacy_city.name AS city_name,
        COALESCE(city_links.city_ids, CASE WHEN d.city_id IS NOT NULL THEN ARRAY[d.city_id] ELSE ARRAY[]::TEXT[] END) AS city_ids,
        COALESCE(city_links.city_names, CASE WHEN legacy_city.name IS NOT NULL THEN ARRAY[legacy_city.name] ELSE ARRAY[]::TEXT[] END) AS city_names,
        d.user_discount_percent,
        d.user_discount_percent_single,
        d.user_discount_percent_bundle,
        d.structure_fixed_amount,
        d.structure_fixed_amount_single,
        d.structure_fixed_amount_bundle,
        d.updated_at
      FROM dashboard_structure_discount_codes d
      LEFT JOIN cities legacy_city ON legacy_city.id = d.city_id
      LEFT JOIN LATERAL (
        SELECT
          ARRAY_AGG(DISTINCT dcc.city_id ORDER BY dcc.city_id) AS city_ids,
          ARRAY_AGG(DISTINCT c.name ORDER BY c.name) AS city_names
        FROM dashboard_structure_discount_code_cities dcc
        JOIN cities c ON c.id = dcc.city_id
        WHERE dcc.discount_code_id = d.id
      ) city_links ON TRUE
      WHERE (
        (l.discount_code_id IS NOT NULL AND d.id = l.discount_code_id)
        OR (l.discount_code_id IS NULL AND UPPER(d.code) = UPPER(l.invite_code))
      )
        AND d.expires_at > NOW()
      ORDER BY
        CASE WHEN l.discount_code_id IS NOT NULL AND d.id = l.discount_code_id THEN 0 ELSE 1 END,
        d.updated_at DESC,
        d.id DESC
      LIMIT 1
    ) dc ON TRUE
    WHERE l.user_id = $1
    LIMIT 1
    `,
    [userId]
  );

  if (!result.rowCount) {
    return null;
  }

  const row = result.rows[0];
  if (!row.discount_code) {
    return null;
  }
  if (!isDiscountCodeApplicableToTarget(row, purchaseType, targetCityId)) {
    return null;
  }

  const inviteCode = normalizeInviteCode(row.discount_code || row.invite_code);
  if (!inviteCode) {
    return null;
  }

  const alreadyUsed = await client.query(
    `
    SELECT 1
    FROM app_user_discount_code_uses
    WHERE user_id = $1
      AND invite_code = $2
    LIMIT 1
    `,
    [userId, inviteCode]
  );
  if (alreadyUsed.rowCount) {
    return null;
  }

  const discountValues = resolveStructureDiscountValues(row, purchaseType);

  return {
    discountCodeId: row.discount_code_id ? Number(row.discount_code_id) : null,
    structureId: row.structure_id,
    applyTo: normalizeDiscountApplyTo(row.apply_to),
    cityId: discountCodeCityIds(row)[0] || null,
    cityName: discountCodeCityNames(row)[0] || null,
    cityIds: discountCodeCityIds(row),
    cityNames: discountCodeCityNames(row),
    inviteCode,
    userDiscountPercent: discountValues.userDiscountPercent,
    structureFixedAmount: discountValues.structureFixedAmount
  };
}

async function reserveDiscountCodeUsage(userId, purchaseType, structureContext, client) {
  if (!structureContext?.inviteCode) {
    return null;
  }

  const inviteCode = normalizeInviteCode(structureContext.inviteCode);
  if (!inviteCode) {
    return null;
  }

  const reserve = await client.query(
    `
    INSERT INTO app_user_discount_code_uses (
      user_id,
      discount_code_id,
      structure_id,
      invite_code,
      purchase_type,
      used_at
    )
    VALUES ($1, $2, $3, $4, $5, NOW())
    ON CONFLICT (user_id, invite_code) DO NOTHING
    RETURNING id
    `,
    [userId, structureContext.discountCodeId || null, structureContext.structureId || null, inviteCode, purchaseType]
  );

  if (!reserve.rowCount) {
    return null;
  }

  return {
    ...structureContext,
    inviteCode
  };
}

function buildPurchasePricing(baseAmountRaw, structureContext) {
  const baseAmount = Math.max(0, roundMoney(baseAmountRaw));
  const discountPercent = structureContext ? clamp(structureContext.userDiscountPercent, 0, 100) : 0;
  const discountAmount = roundMoney((baseAmount * discountPercent) / 100);
  const finalAmount = Math.max(0, roundMoney(baseAmount - discountAmount));
  const structureFixedAmount = structureContext ? Math.max(0, roundMoney(structureContext.structureFixedAmount)) : 0;
  const structureEarningAmount = structureContext ? structureFixedAmount : 0;

  return {
    baseAmount,
    discountPercent,
    discountAmount,
    finalAmount,
    structureFixedAmount,
    structureEarningAmount
  };
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
        SELECT
          id,
          amount,
          base_amount,
          discount_percent,
          discount_amount,
          final_amount,
          structure_id,
          invite_code,
          structure_fixed_amount,
          structure_earning_amount,
          purchased_at
        FROM purchases
        WHERE user_id = $1 AND type = 'bundle' AND city_id = $2
        ORDER BY purchased_at DESC, id DESC
        LIMIT 1
        `,
        [payload.userId, city.id]
      );

      if (alreadyBundle.rowCount) {
        await client.query('ROLLBACK');
        const existing = alreadyBundle.rows[0];
        return res.json({
          purchased: true,
          alreadyPurchased: true,
          type: 'bundle',
          cityId: city.id,
          amount: Number(existing.final_amount || existing.amount || 0),
          baseAmount: Number(existing.base_amount || existing.amount || 0),
          discountPercent: Number(existing.discount_percent || 0),
          discountAmount: Number(existing.discount_amount || 0),
          finalAmount: Number(existing.final_amount || existing.amount || 0),
          structureId: existing.structure_id || null,
          inviteCode: existing.invite_code || null,
          structureFixedAmount: Number(existing.structure_fixed_amount || 0),
          structureEarningAmount: Number(existing.structure_earning_amount || 0)
        });
      }

      const ignoreDiscountCode = Boolean(payload.ignoreDiscountCode);
      let structureContext = null;
      if (!ignoreDiscountCode) {
        structureContext = await fetchUserStructurePricingContext(payload.userId, 'bundle', city.id, client);
        structureContext = await reserveDiscountCodeUsage(payload.userId, 'bundle', structureContext, client);
      }
      const pricing = buildPurchasePricing(city.bundle_price, structureContext);
      await client.query(
        `
        INSERT INTO purchases (
          user_id,
          type,
          city_id,
          amount,
          base_amount,
          discount_percent,
          discount_amount,
          final_amount,
          structure_id,
          invite_code,
          structure_fixed_amount,
          structure_earning_amount
        )
        VALUES ($1, 'bundle', $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `,
        [
          payload.userId,
          city.id,
          pricing.finalAmount,
          pricing.baseAmount,
          pricing.discountPercent,
          pricing.discountAmount,
          pricing.finalAmount,
          structureContext?.structureId || null,
          structureContext?.inviteCode || null,
          pricing.structureFixedAmount,
          pricing.structureEarningAmount
        ]
      );

      await client.query('COMMIT');
      return res.json({
        purchased: true,
        type: 'bundle',
        cityId: city.id,
        amount: pricing.finalAmount,
        baseAmount: pricing.baseAmount,
        discountPercent: pricing.discountPercent,
        discountAmount: pricing.discountAmount,
        finalAmount: pricing.finalAmount,
        structureId: structureContext?.structureId || null,
        inviteCode: structureContext?.inviteCode || null,
        structureFixedAmount: pricing.structureFixedAmount,
        structureEarningAmount: pricing.structureEarningAmount
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
        SELECT id, amount, purchased_at
        FROM purchases
        WHERE user_id = $1 AND type = 'bundle' AND city_id = $2
        ORDER BY purchased_at DESC, id DESC
        LIMIT 1
        `,
        [payload.userId, poi.city_id]
      ),
      client.query(
        `
        SELECT
          id,
          amount,
          base_amount,
          discount_percent,
          discount_amount,
          final_amount,
          structure_id,
          invite_code,
          structure_fixed_amount,
          structure_earning_amount,
          purchased_at
        FROM purchases
        WHERE user_id = $1 AND type = 'single' AND poi_id = $2
        ORDER BY purchased_at DESC, id DESC
        LIMIT 1
        `,
        [payload.userId, poi.id]
      )
    ]);

    if (alreadyBundle.rowCount || alreadySingle.rowCount) {
      await client.query('ROLLBACK');
      const existing = alreadySingle.rowCount ? alreadySingle.rows[0] : null;
      return res.json({
        purchased: true,
        alreadyPurchased: true,
        type: 'single',
        cityId: poi.city_id,
        poiId: poi.id,
        amount: Number(existing?.final_amount || existing?.amount || 0),
        baseAmount: Number(existing?.base_amount || existing?.amount || 0),
        discountPercent: Number(existing?.discount_percent || 0),
        discountAmount: Number(existing?.discount_amount || 0),
        finalAmount: Number(existing?.final_amount || existing?.amount || 0),
        structureId: existing?.structure_id || null,
        inviteCode: existing?.invite_code || null,
        structureFixedAmount: Number(existing?.structure_fixed_amount || 0),
        structureEarningAmount: Number(existing?.structure_earning_amount || 0)
      });
    }

    const ignoreDiscountCode = Boolean(payload.ignoreDiscountCode);
    let structureContext = null;
    if (!ignoreDiscountCode) {
      structureContext = await fetchUserStructurePricingContext(payload.userId, 'single', poi.city_id, client);
      structureContext = await reserveDiscountCodeUsage(payload.userId, 'single', structureContext, client);
    }
    const pricing = buildPurchasePricing(poi.price_single, structureContext);
    await client.query(
      `
      INSERT INTO purchases (
        user_id,
        type,
        city_id,
        poi_id,
        amount,
        base_amount,
        discount_percent,
        discount_amount,
        final_amount,
        structure_id,
        invite_code,
        structure_fixed_amount,
        structure_earning_amount
      )
      VALUES ($1, 'single', $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      `,
      [
        payload.userId,
        poi.city_id,
        poi.id,
        pricing.finalAmount,
        pricing.baseAmount,
        pricing.discountPercent,
        pricing.discountAmount,
        pricing.finalAmount,
        structureContext?.structureId || null,
        structureContext?.inviteCode || null,
        pricing.structureFixedAmount,
        pricing.structureEarningAmount
      ]
    );

    await client.query('COMMIT');
    return res.json({
      purchased: true,
      type: 'single',
      cityId: poi.city_id,
      poiId: poi.id,
      amount: pricing.finalAmount,
      baseAmount: pricing.baseAmount,
      discountPercent: pricing.discountPercent,
      discountAmount: pricing.discountAmount,
      finalAmount: pricing.finalAmount,
      structureId: structureContext?.structureId || null,
      inviteCode: structureContext?.inviteCode || null,
      structureFixedAmount: pricing.structureFixedAmount,
      structureEarningAmount: pricing.structureEarningAmount
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
        SELECT
          id,
          user_id,
          type,
          city_id,
          poi_id,
          amount,
          base_amount,
          discount_percent,
          discount_amount,
          final_amount,
          structure_id,
          invite_code,
          structure_fixed_amount,
          structure_earning_amount,
          purchased_at
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
      baseAmount: Number(row.base_amount || row.amount || 0),
      discountPercent: Number(row.discount_percent || 0),
      discountAmount: Number(row.discount_amount || 0),
      finalAmount: Number(row.final_amount || row.amount || 0),
      structureId: row.structure_id || null,
      inviteCode: row.invite_code || null,
      structureFixedAmount: Number(row.structure_fixed_amount || 0),
      structureEarningAmount: Number(row.structure_earning_amount || 0),
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

const clearPurchasesSchema = z.object({
  userId: z.string().min(2)
});

router.delete('/me/purchases', async (req, res, next) => {
  const parsed = clearPurchasesSchema.safeParse({ userId: String(req.query.userId || '').trim() });
  if (!parsed.success) {
    return res.status(400).json({ message: 'Missing userId query parameter' });
  }

  try {
    const deleted = await pool.query(
      `
      DELETE FROM purchases
      WHERE user_id = $1
      RETURNING id
      `,
      [parsed.data.userId]
    );

    return res.json({
      cleared: true,
      deletedCount: deleted.rowCount || 0
    });
  } catch (error) {
    return next(error);
  }
});

const hotelValidateSchema = z
  .object({
    code: z.string().min(2),
    userId: z.string().min(2),
    targetType: z.enum(['single', 'bundle']).optional(),
    cityId: z.string().min(2).optional()
  })
  .refine((value) => !(value.targetType && !value.cityId), {
    message: 'cityId obbligatoria quando specifichi il target',
    path: ['cityId']
  });

const hotelAssociationQuerySchema = z.object({
  userId: z.string().min(2)
});

const hotelAssociationDeleteSchema = z.object({
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

    const discountCodeResult = await client.query(
      `
      SELECT
        dc.id,
        dc.code,
        dc.apply_to,
        dc.city_id,
        legacy_city.name AS city_name,
        COALESCE(city_links.city_ids, CASE WHEN dc.city_id IS NOT NULL THEN ARRAY[dc.city_id] ELSE ARRAY[]::TEXT[] END) AS city_ids,
        COALESCE(city_links.city_names, CASE WHEN legacy_city.name IS NOT NULL THEN ARRAY[legacy_city.name] ELSE ARRAY[]::TEXT[] END) AS city_names,
        dc.user_discount_percent,
        dc.user_discount_percent_single,
        dc.user_discount_percent_bundle,
        dc.structure_fixed_amount,
        dc.structure_fixed_amount_single,
        dc.structure_fixed_amount_bundle,
        dc.expires_at,
        (dc.expires_at > NOW()) AS is_active,
        s.id AS structure_id,
        s.name AS structure_name,
        s.address AS structure_address
      FROM dashboard_structure_discount_codes dc
      JOIN dashboard_structures s ON s.id = dc.structure_id
      LEFT JOIN cities legacy_city ON legacy_city.id = dc.city_id
      LEFT JOIN LATERAL (
        SELECT
          ARRAY_AGG(DISTINCT dcc.city_id ORDER BY dcc.city_id) AS city_ids,
          ARRAY_AGG(DISTINCT c.name ORDER BY c.name) AS city_names
        FROM dashboard_structure_discount_code_cities dcc
        JOIN cities c ON c.id = dcc.city_id
        WHERE dcc.discount_code_id = dc.id
      ) city_links ON TRUE
      WHERE UPPER(dc.code) = $1
      LIMIT 1
      `,
      [normalizedCode]
    );

    if (!discountCodeResult.rowCount) {
      await client.query('ROLLBACK');
      return res.status(404).json({ valid: false, message: 'Il codice inserito non esiste' });
    }

    const discountCode = discountCodeResult.rows[0];
    const normalizedDiscountCode = normalizeInviteCode(discountCode.code);
    const usedByUser = await client.query(
      `
      SELECT 1
      FROM app_user_discount_code_uses
      WHERE user_id = $1
        AND invite_code = $2
      LIMIT 1
      `,
      [payload.userId, normalizedDiscountCode]
    );
    if (usedByUser.rowCount) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        valid: false,
        codeStatus: 'used',
        message: 'Questo codice e già stato utilizzato per questo utente'
      });
    }

    if (!discountCode.is_active) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        valid: false,
        codeStatus: 'expired',
        message: 'Il codice inserito e scaduto'
      });
    }

    if (payload.targetType && payload.cityId) {
      const applicable = isDiscountCodeApplicableToTarget(discountCode, payload.targetType, payload.cityId);
      if (!applicable) {
        await client.query('ROLLBACK');
        return res.status(409).json({
          valid: false,
          codeStatus: 'invalid',
          message: 'Il codice non e applicabile a questo acquisto'
        });
      }
    }

    await client.query(
      `
      INSERT INTO app_user_structure_links (user_id, structure_id, discount_code_id, invite_code, associated_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      ON CONFLICT (user_id) DO UPDATE SET
        structure_id = EXCLUDED.structure_id,
        discount_code_id = EXCLUDED.discount_code_id,
        invite_code = EXCLUDED.invite_code,
        updated_at = NOW()
      `,
      [payload.userId, discountCode.structure_id, discountCode.id, normalizedDiscountCode]
    );

    await client.query('COMMIT');

    return res.json({
      valid: true,
      applied: true,
      message: 'Codice applicato',
      association: {
        structureId: discountCode.structure_id,
        structureName: discountCode.structure_name,
        structureAddress: discountCode.structure_address,
        inviteCode: normalizedDiscountCode,
        appliesTo: normalizeDiscountApplyTo(discountCode.apply_to) || 'bundle',
        cityId: discountCodeCityIds(discountCode)[0] || null,
        cityName: discountCodeCityNames(discountCode)[0] || null,
        cityIds: discountCodeCityIds(discountCode),
        cityNames: discountCodeCityNames(discountCode),
        userDiscountPercent: Number(
          (discountCode.apply_to === 'single'
            ? discountCode.user_discount_percent_single
            : discountCode.user_discount_percent_bundle) ||
            discountCode.user_discount_percent ||
            0
        ),
        userDiscountPercentSingle: Number(discountCode.user_discount_percent_single || discountCode.user_discount_percent || 0),
        userDiscountPercentBundle: Number(discountCode.user_discount_percent_bundle || discountCode.user_discount_percent || 0),
        structureFixedAmount: Number(
          (discountCode.apply_to === 'single'
            ? discountCode.structure_fixed_amount_single
            : discountCode.structure_fixed_amount_bundle) ||
            discountCode.structure_fixed_amount ||
            0
        ),
        structureFixedAmountSingle: Number(discountCode.structure_fixed_amount_single || discountCode.structure_fixed_amount || 0),
        structureFixedAmountBundle: Number(discountCode.structure_fixed_amount_bundle || discountCode.structure_fixed_amount || 0),
        codeStatus: 'valid',
        expiresAt: discountCode.expires_at
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    return next(error);
  } finally {
    client.release();
  }
});

router.get('/me/hotel-association', async (req, res, next) => {
  const parsed = hotelAssociationQuerySchema.safeParse({ userId: String(req.query.userId || '').trim() });
  if (!parsed.success) {
    return res.status(400).json({ message: 'Missing userId query parameter' });
  }

  const userId = parsed.data.userId;
  const client = await pool.connect();

  try {
    const result = await client.query(
      `
      SELECT
        l.user_id,
        l.structure_id,
        s.name AS structure_name,
        s.address AS structure_address,
        l.invite_code AS stored_invite_code,
        dc.id AS discount_code_id,
        dc.code AS discount_code,
        dc.apply_to,
        dc.city_id,
        dc.city_name,
        dc.city_ids,
        dc.city_names,
        dc.user_discount_percent,
        dc.user_discount_percent_single,
        dc.user_discount_percent_bundle,
        dc.structure_fixed_amount,
        dc.structure_fixed_amount_single,
        dc.structure_fixed_amount_bundle,
        dc.expires_at,
        usage.used_at AS code_used_at,
        CASE
          WHEN dc.id IS NULL THEN 'invalid'
          WHEN usage.used_at IS NOT NULL THEN 'used'
          WHEN dc.expires_at > NOW() THEN 'valid'
          ELSE 'expired'
        END AS code_status,
        l.associated_at,
        l.updated_at
      FROM app_user_structure_links l
      JOIN dashboard_structures s ON s.id = l.structure_id
      LEFT JOIN LATERAL (
        SELECT
          d.id,
          d.code,
          d.apply_to,
          d.city_id,
          legacy_city.name AS city_name,
          COALESCE(city_links.city_ids, CASE WHEN d.city_id IS NOT NULL THEN ARRAY[d.city_id] ELSE ARRAY[]::TEXT[] END) AS city_ids,
          COALESCE(city_links.city_names, CASE WHEN legacy_city.name IS NOT NULL THEN ARRAY[legacy_city.name] ELSE ARRAY[]::TEXT[] END) AS city_names,
          d.user_discount_percent,
          d.user_discount_percent_single,
          d.user_discount_percent_bundle,
          d.structure_fixed_amount,
          d.structure_fixed_amount_single,
          d.structure_fixed_amount_bundle,
          d.expires_at,
          d.updated_at
        FROM dashboard_structure_discount_codes d
        LEFT JOIN cities legacy_city ON legacy_city.id = d.city_id
        LEFT JOIN LATERAL (
          SELECT
            ARRAY_AGG(DISTINCT dcc.city_id ORDER BY dcc.city_id) AS city_ids,
            ARRAY_AGG(DISTINCT c.name ORDER BY c.name) AS city_names
          FROM dashboard_structure_discount_code_cities dcc
          JOIN cities c ON c.id = dcc.city_id
          WHERE dcc.discount_code_id = d.id
        ) city_links ON TRUE
        WHERE (
          (l.discount_code_id IS NOT NULL AND d.id = l.discount_code_id)
          OR (l.discount_code_id IS NULL AND UPPER(d.code) = UPPER(l.invite_code))
        )
        ORDER BY
          CASE WHEN l.discount_code_id IS NOT NULL AND d.id = l.discount_code_id THEN 0 ELSE 1 END,
          d.updated_at DESC,
          d.id DESC
        LIMIT 1
      ) dc ON TRUE
      LEFT JOIN LATERAL (
        SELECT u.used_at
        FROM app_user_discount_code_uses u
        WHERE u.user_id = l.user_id
          AND u.invite_code = UPPER(COALESCE(dc.code, l.invite_code))
        ORDER BY u.used_at DESC, u.id DESC
        LIMIT 1
      ) usage ON TRUE
      WHERE l.user_id = $1
      LIMIT 1
      `,
      [userId]
    );

    const usedCodesResult = await client.query(
      `
      SELECT
        u.invite_code,
        COALESCE(u.structure_id, dc.structure_id) AS structure_id,
        COALESCE(s.name, ds.name) AS structure_name,
        COALESCE(s.address, ds.address) AS structure_address,
        dc.apply_to,
        dc.city_id,
        COALESCE(code_city_links.city_ids, CASE WHEN dc.city_id IS NOT NULL THEN ARRAY[dc.city_id] ELSE ARRAY[]::TEXT[] END) AS city_ids,
        COALESCE(code_city_links.city_names, CASE WHEN legacy_city.name IS NOT NULL THEN ARRAY[legacy_city.name] ELSE ARRAY[]::TEXT[] END) AS city_names,
        legacy_city.name AS city_name,
        dc.expires_at,
        u.used_at
      FROM app_user_discount_code_uses u
      LEFT JOIN dashboard_structure_discount_codes dc ON dc.id = u.discount_code_id
      LEFT JOIN dashboard_structures s ON s.id = u.structure_id
      LEFT JOIN dashboard_structures ds ON ds.id = dc.structure_id
      LEFT JOIN cities legacy_city ON legacy_city.id = dc.city_id
      LEFT JOIN LATERAL (
        SELECT
          ARRAY_AGG(DISTINCT dcc.city_id ORDER BY dcc.city_id) AS city_ids,
          ARRAY_AGG(DISTINCT c.name ORDER BY c.name) AS city_names
        FROM dashboard_structure_discount_code_cities dcc
        JOIN cities c ON c.id = dcc.city_id
        WHERE dcc.discount_code_id = dc.id
      ) code_city_links ON TRUE
      WHERE u.user_id = $1
      ORDER BY u.used_at DESC, u.id DESC
      `,
      [userId]
    );

    const codeHistory = usedCodesResult.rows.map((row) => ({
      inviteCode: normalizeInviteCode(row.invite_code),
      structureId: row.structure_id || null,
      structureName: row.structure_name || null,
      structureAddress: row.structure_address || null,
      appliesTo: normalizeDiscountApplyTo(row.apply_to) || null,
      cityId: discountCodeCityIds(row)[0] || null,
      cityName: discountCodeCityNames(row)[0] || null,
      cityIds: discountCodeCityIds(row),
      cityNames: discountCodeCityNames(row),
      status: 'used',
      expiresAt: row.expires_at || null,
      activatedAt: null,
      usedAt: row.used_at || null
    }));

    if (!result.rowCount) {
      return res.json({ associated: false, codes: codeHistory });
    }

    const row = result.rows[0];
    const inviteCode = normalizeInviteCode(row.stored_invite_code || row.discount_code || '');
    const currentStatus = row.code_status || 'invalid';

    if (inviteCode && !codeHistory.some((item) => item.inviteCode === inviteCode)) {
      codeHistory.unshift({
        inviteCode,
        structureId: row.structure_id || null,
        structureName: row.structure_name || null,
        structureAddress: row.structure_address || null,
        appliesTo: normalizeDiscountApplyTo(row.apply_to) || null,
        cityId: discountCodeCityIds(row)[0] || null,
        cityName: discountCodeCityNames(row)[0] || null,
        cityIds: discountCodeCityIds(row),
        cityNames: discountCodeCityNames(row),
        status: currentStatus === 'valid' ? 'activated' : currentStatus,
        expiresAt: row.expires_at || null,
        activatedAt: row.associated_at || null,
        usedAt: row.code_used_at || null
      });
    }

    return res.json({
      associated: true,
      association: {
        userId: row.user_id,
        structureId: row.structure_id,
        structureName: row.structure_name,
        structureAddress: row.structure_address,
        inviteCode,
        appliesTo: normalizeDiscountApplyTo(row.apply_to) || 'bundle',
        cityId: discountCodeCityIds(row)[0] || null,
        cityName: discountCodeCityNames(row)[0] || null,
        cityIds: discountCodeCityIds(row),
        cityNames: discountCodeCityNames(row),
        userDiscountPercent: Number(
          (row.apply_to === 'single' ? row.user_discount_percent_single : row.user_discount_percent_bundle) ||
            row.user_discount_percent ||
            0
        ),
        userDiscountPercentSingle: Number(row.user_discount_percent_single || row.user_discount_percent || 0),
        userDiscountPercentBundle: Number(row.user_discount_percent_bundle || row.user_discount_percent || 0),
        structureFixedAmount: Number(
          (row.apply_to === 'single' ? row.structure_fixed_amount_single : row.structure_fixed_amount_bundle) ||
            row.structure_fixed_amount ||
            0
        ),
        structureFixedAmountSingle: Number(row.structure_fixed_amount_single || row.structure_fixed_amount || 0),
        structureFixedAmountBundle: Number(row.structure_fixed_amount_bundle || row.structure_fixed_amount || 0),
        codeStatus: currentStatus,
        expiresAt: row.expires_at || null,
        associatedAt: row.associated_at,
        updatedAt: row.updated_at,
        codeUsedAt: row.code_used_at || null
      },
      codes: codeHistory
    });
  } catch (error) {
    return next(error);
  } finally {
    client.release();
  }
});

router.delete('/hotel/association', async (req, res, next) => {
  const parsed = hotelAssociationDeleteSchema.safeParse({ userId: String(req.query.userId || '').trim() });
  if (!parsed.success) {
    return res.status(400).json({ message: 'Missing userId query parameter' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const associationResult = await client.query(
      `
      SELECT
        l.user_id,
        UPPER(COALESCE(dc.code, l.invite_code)) AS invite_code
      FROM app_user_structure_links l
      LEFT JOIN dashboard_structure_discount_codes dc ON dc.id = l.discount_code_id
      WHERE user_id = $1
      LIMIT 1
      FOR UPDATE OF l
      `,
      [parsed.data.userId]
    );

    if (!associationResult.rowCount) {
      await client.query('COMMIT');
      return res.json({
        removed: true,
        hadAssociation: false
      });
    }

    const currentInviteCode = normalizeInviteCode(associationResult.rows[0].invite_code);
    if (currentInviteCode) {
      const usedResult = await client.query(
        `
        SELECT 1
        FROM app_user_discount_code_uses
        WHERE user_id = $1
          AND invite_code = $2
        LIMIT 1
        `,
        [parsed.data.userId, currentInviteCode]
      );

      if (usedResult.rowCount) {
        await client.query('COMMIT');
        return res.status(409).json({
          removed: false,
          hadAssociation: true,
          message: 'Il codice è già stato usato e non può essere rimosso'
        });
      }
    }

    const deleteResult = await client.query(
      `
      DELETE FROM app_user_structure_links
      WHERE user_id = $1
      RETURNING user_id
      `,
      [parsed.data.userId]
    );

    await client.query('COMMIT');
    return res.json({
      removed: true,
      hadAssociation: deleteResult.rowCount > 0
    });
  } catch (error) {
    await client.query('ROLLBACK');
    return next(error);
  } finally {
    client.release();
  }
});

export { router as apiRouter };


