const router = require('express').Router();
const prisma = require('../prisma');
const bcrypt = require('bcryptjs');
const { authRequired } = require('../middleware/auth');

// Get all stores + average rating + my rating
router.get('/stores', authRequired, async (req, res) => {
  try {
    const stores = await prisma.store.findMany({
      include: { ratings: true },
    });

    const result = stores.map((store) => {
      const averageRating =
        store.ratings.length > 0
          ? store.ratings.reduce((acc, r) => acc + r.score, 0) / store.ratings.length
          : 0;

      const myRating = store.ratings.find((r) => r.userId === req.user.id)?.score || null;

      return {
        id: store.id,
        name: store.name,
        averageRating: parseFloat(averageRating.toFixed(2)),
        myRating,
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit/update a rating
router.post('/rate/:storeId', authRequired, async (req, res) => {
  try {
    const { score } = req.body;
    const storeId = parseInt(req.params.storeId);

    if (!score || score < 1 || score > 5) {
      return res.status(400).json({ message: 'Score must be between 1 and 5' });
    }

    const rating = await prisma.rating.upsert({
      where: { userId_storeId: { userId: req.user.id, storeId } },
      update: { score },
      create: { score, userId: req.user.id, storeId },
    });

    res.json(rating);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update password
router.put('/update-password', authRequired, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword)
    return res.status(400).json({ message: 'Both old and new passwords are required' });

  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) return res.status(400).json({ message: 'Old password is incorrect' });

    const hash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: user.id }, data: { password: hash } });

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
