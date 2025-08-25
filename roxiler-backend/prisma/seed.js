require('dotenv').config();
const prisma = require('../src/prisma');
const bcrypt = require('bcryptjs');

async function main() {
  const adminEmail = 'admin@roxiler.com';
  const ownerEmail = 'owner@shop.com';

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: 'Administrator Account XXXXXXXXXXXXXXXXXX',
      email: adminEmail,
      address: 'Admin Block, Pune',
      password: await bcrypt.hash('Admin@123', 10),
      role: 'ADMIN'
    }
  });

  const owner = await prisma.user.upsert({
    where: { email: ownerEmail },
    update: {},
    create: {
      name: 'Primary Store Owner XXXXXXXXXXXXXXXX',
      email: ownerEmail,
      address: 'MG Road, Pune',
      password: await bcrypt.hash('Owner@123', 10),
      role: 'OWNER'
    }
  });

  await prisma.store.upsert({
    where: { email: 'blue@mart.com' },
    update: {},
    create: {
      name: 'Blue Mart',
      email: 'blue@mart.com',
      address: 'City Center, Pune',
      ownerId: owner.id
    }
  });

  console.log('✅ Seed data inserted');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
