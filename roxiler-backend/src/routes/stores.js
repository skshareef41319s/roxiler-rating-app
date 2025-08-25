const router = require('express').Router();
const prisma = require('../prisma');
const { authRequired } = require('../middleware/auth');
const { validationResult, body } = require('express-validator');
const bcrypt = require('bcryptjs');

// Middleware: only logged-in users can use these routes
router.use(authRequired);

/**
 * GET /stores
 * List stores with search, sorting, overall rating, and current user's rating
 */
router.get('/', async (req, res) => {
  try {
    const { name, address, sortBy = 'name', order = 'asc' } = req.query;

    const where = {
      AND: [
        name ? { name: { contains: String(name), mode: 'insensitive' } } : {},
        address ? { address: { contains: String(address), mode: 'insensitive' } } : {}
      ]
    };

    const stores = await prisma.store.findMany({
      where,
      include: { ratings: true },
      orderBy: {
        [sortBy]: order.toLowerCase() === 'desc' ? 'desc' : 'asc'
      }
    });

    const mapped = stores.map(s => {
      const all = s.ratings;
      const avg = all.length
        ? all.reduce((a, r) => a + r.score, 0) / all.length
        : 0;
      const mine = all.find(r => r.userId === req.user.id)?.score || null;
      return {
        id: s.id,
        name: s.name,
        address: s.address,
        overallRating: Number(avg.toFixed(2)),
        myRating: mine
      };
    });

    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /stores/:storeId/rate
 * Submit or update a rating (1–5) for a store
 */
router.post(
  '/:storeId/rate',
  [
    body('score')
      .isInt({ min: 1, max: 5 })
      .withMessage('Score must be an integer between 1 and 5')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      const storeId = Number(req.params.storeId);
      const { score } = req.body;

      const store = await prisma.store.findUnique({ where: { id: storeId } });
      if (!store) return res.status(404).json({ message: 'Store not found' });

      const rating = await prisma.rating.upsert({
        where: {
          userId_storeId: { userId: req.user.id, storeId }
        },
        update: { score },
        create: { score, userId: req.user.id, storeId }
      });

      res.json(rating);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

/**
 * PUT /stores/me/password
 * Update password for the logged-in user
 */
router.put(
  '/me/password',
  [
    body('password')
      .isLength({ min: 8, max: 16 })
      .withMessage('Password must be 8–16 characters long')
      .matches(/[A-Z]/)
      .withMessage('Password must include at least one uppercase letter')
      .matches(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/)
      .withMessage('Password must include at least one special character')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      const hash = await bcrypt.hash(req.body.password, 10);

      await prisma.user.update({
        where: { id: req.user.id },
        data: { password: hash }
      });

      res.json({ ok: true, message: 'Password updated successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
