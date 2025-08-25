const router = require('express').Router();
const prisma = require('../prisma');
const bcrypt = require('bcryptjs');
const { authRequired, requireRole } = require('../middleware/auth');

router.use(authRequired, requireRole('OWNER'));

// Owner dashboard — list stores with raters
router.get('/dashboard', async (req, res) => {
  try {
    const stores = await prisma.store.findMany({
      where: { ownerId: req.user.id },
      include: { ratings: { include: { user: true } } },
    });

    const result = stores.map((store) => {
      const averageRating =
        store.ratings.length > 0
          ? store.ratings.reduce((acc, r) => acc + r.score, 0) / store.ratings.length
          : 0;

      const raters = store.ratings.map((r) => ({
        id: r.user.id,
        name: r.user.name,
        email: r.user.email,
        score: r.score,
      }));

      return {
        id: store.id,
        name: store.name,
        averageRating: parseFloat(averageRating.toFixed(2)),
        raters,
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update password for owner
router.put('/update-password', authRequired, requireRole('OWNER'), async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword)
    return res.status(400).json({ message: 'Both old and new passwords are required' });

  try {
    const owner = await prisma.user.findUnique({ where: { id: req.user.id } });

    const valid = await bcrypt.compare(oldPassword, owner.password);
    if (!valid) return res.status(400).json({ message: 'Old password is incorrect' });

    const hash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: owner.id }, data: { password: hash } });

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
