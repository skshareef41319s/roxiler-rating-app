const app = require('./app');
const prisma = require('./prisma');
const userRoutes = require('./routes/user');

const PORT = process.env.PORT || 4000;

app.use('/user', userRoutes);
app.listen(PORT, () => {
console.log(`API running on http://localhost:${PORT}`);
});


process.on('SIGINT', async () => {
await prisma.$disconnect();
process.exit(0);
});