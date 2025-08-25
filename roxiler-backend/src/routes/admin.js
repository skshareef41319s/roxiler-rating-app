const router = require("express").Router();
const prisma = require("../prisma");
const bcrypt = require("bcryptjs");
const { authRequired, requireRole } = require("../middleware/auth");
const {
  nameRule,
  addressRule,
  emailRule,
  passwordRule,
} = require("../utils/validators");
const { validationResult, body } = require("express-validator");

router.use(authRequired, requireRole("ADMIN"));

/**
 * DASHBOARD STATS
 */
router.get("/dashboard", async (req, res) => {
  try {
    const [users, stores, ratings] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.rating.count(),
    ]);
    res.json({ totalUsers: users, totalStores: stores, totalRatings: ratings });
  } catch (err) {
    console.error("Admin dashboard error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

/**
 * CREATE USER (Admin can create ADMIN/USER/OWNER)
 */
router.post(
  "/users",
  [
    nameRule,
    emailRule,
    addressRule,
    passwordRule,
    body("role").isIn(["ADMIN", "USER", "OWNER"]),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, address, password, role } = req.body;
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ message: "Email already in use" });

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, address, password: hash, role },
    });

    res.status(201).json({ id: user.id });
  }
);

/**
 * LIST USERS
 */
router.get("/users", async (req, res) => {
  const { name, email, address, role, sortBy = "name", order = "asc" } =
    req.query;
  const where = {
    AND: [
      name ? { name: { contains: String(name), mode: "insensitive" } } : {},
      email ? { email: { contains: String(email), mode: "insensitive" } } : {},
      address
        ? { address: { contains: String(address), mode: "insensitive" } }
        : {},
      role ? { role: String(role).toUpperCase() } : {},
    ],
  };

  const users = await prisma.user.findMany({
    where,
    orderBy: { [sortBy]: order.toLowerCase() === "desc" ? "desc" : "asc" },
  });

  res.json(
    users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      address: u.address,
      role: u.role,
    }))
  );
});

/**
 * USER DETAILS (if OWNER include average rating across their stores)
 */
router.get("/users/:id", async (req, res) => {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({
    where: { id },
    include: { stores: { include: { ratings: true } } },
  });
  if (!user) return res.status(404).json({ message: "Not found" });

  let ownerAverage = null;
  if (user.role === "OWNER") {
    const allScores = user.stores.flatMap((s) =>
      s.ratings.map((r) => r.score)
    );
    if (allScores.length) {
      ownerAverage = Number(
        (
          allScores.reduce((a, b) => a + b, 0) / allScores.length
        ).toFixed(2)
      );
    }
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    address: user.address,
    role: user.role,
    ownerAverage,
  });
});

/**
 * CREATE STORE
 */
router.post(
  "/stores",
  [
    body("name").isString().isLength({ min: 1 }),
    emailRule,
    body("address").isString().isLength({ max: 400 }),
    body("ownerId").optional().isInt(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, address, ownerId } = req.body;
    const exists = await prisma.store.findUnique({ where: { email } });
    if (exists)
      return res.status(409).json({ message: "Store email already exists" });

    const store = await prisma.store.create({
      data: {
        name,
        email,
        address,
        ownerId: ownerId ? parseInt(ownerId, 10) : null, // ✅ FIXED
      },
    });
    res.status(201).json(store);
  }
);


/**
 * LIST STORES (with ratings + owner info)
 */
router.get("/stores", async (req, res) => {
  try {
    const stores = await prisma.store.findMany({
      include: {
        ratings: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
        owner: { select: { id: true, name: true, email: true } },
      },
    });

    const formatted = stores.map((s) => {
      const avg = s.ratings.length
        ? s.ratings.reduce((a, b) => a + b.score, 0) / s.ratings.length
        : 0;
      return {
        id: s.id,
        name: s.name,
        email: s.email,
        address: s.address,
        ownerName: s.owner?.name || "N/A",
        rating: Number(avg.toFixed(2)),
        ratings: s.ratings.map((r) => ({
          id: r.id,
          score: r.score,
          userName: r.user?.name || "Anonymous",
        })),
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error("Fetch stores error:", err);
    res.status(500).json({ message: "Failed to fetch stores" });
  }
});

/**
 * DELETE USER (cannot delete admin, cleans up stores + ratings)
 */
router.delete("/users/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { ratings: true, stores: true },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "ADMIN")
      return res.status(403).json({ message: "Cannot delete admin" });

    // Delete related ratings
    await prisma.rating.deleteMany({ where: { userId: id } });

    // If OWNER → delete their stores + ratings
    if (user.role === "OWNER") {
      for (const store of user.stores) {
        await prisma.rating.deleteMany({ where: { storeId: store.id } });
        await prisma.store.delete({ where: { id: store.id } });
      }
    }

    // Delete user
    await prisma.user.delete({ where: { id } });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

/**
 * DELETE STORE (with ratings)
 */
router.delete("/stores/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const store = await prisma.store.findUnique({ where: { id } });
    if (!store) return res.status(404).json({ message: "Store not found" });

    // Delete ratings first
    await prisma.rating.deleteMany({ where: { storeId: id } });

    // Delete store
    await prisma.store.delete({ where: { id } });
    res.json({ message: "Store deleted successfully" });
  } catch (err) {
    console.error("Delete store error:", err);
    res.status(500).json({ message: "Failed to delete store" });
  }
});

module.exports = router;
