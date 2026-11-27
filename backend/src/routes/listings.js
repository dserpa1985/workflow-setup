const express = require('express');
const { body, param, validationResult } = require('express-validator');
const db = require('../db');
const requireAuth = require('../middleware/auth');

const router = express.Router();

// Browse active listings
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT l.id, l.title, l.description, l.price_cents, l.status, l.created_at, l.updated_at,
              u.id AS seller_id, u.display_name AS seller_name
       FROM listings l
       JOIN users u ON l.seller_id = u.id
       WHERE l.status = 'active'
       ORDER BY l.created_at DESC`
    );
    return res.json({ listings: rows });
  } catch (err) {
    console.error('List fetch error:', err);
    return res.status(500).json({ error: 'Failed to load listings' });
  }
});

// Get single listing
router.get('/:id', [param('id').isUUID()], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { rows } = await db.query(
      `SELECT l.*, u.display_name AS seller_name
       FROM listings l
       JOIN users u ON l.seller_id = u.id
       WHERE l.id = $1`,
      [req.params.id]
    );
    if (!rows[0]) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    return res.json({ listing: rows[0] });
  } catch (err) {
    console.error('Single listing error:', err);
    return res.status(500).json({ error: 'Failed to load listing' });
  }
});

// Create listing (authenticated)
router.post(
  '/',
  requireAuth,
  [
    body('title').trim().isLength({ min: 2, max: 150 }),
    body('description').optional().isString(),
    body('price_cents').isInt({ min: 0 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description = '', price_cents } = req.body;
    try {
      const { rows } = await db.query(
        `INSERT INTO listings (seller_id, title, description, price_cents)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [req.user.id, title, description, price_cents]
      );
      return res.status(201).json({ listing: rows[0] });
    } catch (err) {
      console.error('Create listing error:', err);
      return res.status(500).json({ error: 'Failed to create listing' });
    }
  }
);

// Update own listing
router.patch(
  '/:id',
  requireAuth,
  [
    param('id').isUUID(),
    body('title').optional().trim().isLength({ min: 2, max: 150 }),
    body('description').optional().isString(),
    body('price_cents').optional().isInt({ min: 0 }),
    body('status').optional().isIn(['active', 'sold', 'archived']),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, price_cents, status } = req.body;
    try {
      const { rows } = await db.query(
        `UPDATE listings
         SET title = COALESCE($1, title),
             description = COALESCE($2, description),
             price_cents = COALESCE($3, price_cents),
             status = COALESCE($4, status),
             updated_at = NOW()
         WHERE id = $5 AND seller_id = $6
         RETURNING *`,
        [title ?? null, description ?? null, price_cents ?? null, status ?? null, req.params.id, req.user.id]
      );
      if (!rows[0]) {
        return res.status(404).json({ error: 'Listing not found or unauthorized' });
      }
      return res.json({ listing: rows[0] });
    } catch (err) {
      console.error('Update listing error:', err);
      return res.status(500).json({ error: 'Failed to update listing' });
    }
  }
);

// Delete own listing
router.delete('/:id', requireAuth, [param('id').isUUID()], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { rowCount } = await db.query(
      'DELETE FROM listings WHERE id = $1 AND seller_id = $2',
      [req.params.id, req.user.id]
    );
    if (!rowCount) {
      return res.status(404).json({ error: 'Listing not found or unauthorized' });
    }
    return res.status(204).send();
  } catch (err) {
    console.error('Delete listing error:', err);
    return res.status(500).json({ error: 'Failed to delete listing' });
  }
});

module.exports = router;
