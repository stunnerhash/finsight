const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create a user
  const user = await prisma.user.upsert({
    where: { email: 'john.doe@example.com' },
    update: {},
    create: {
      email: 'john.doe@example.com',
      name: 'John Doe',
    },
  });

  console.log('✅ Created user:', user.name);

  // Create budget categories
  const budgetCategories = await Promise.all([
    prisma.budgetCategory.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: 'Food',
        budgeted: 8000,
        spent: 0,
        color: 'bg-blue-500',
        userId: user.id,
      },
    }),
    prisma.budgetCategory.upsert({
      where: { id: 2 },
      update: {},
      create: {
        name: 'Transportation',
        budgeted: 4000,
        spent: 0,
        color: 'bg-green-500',
        userId: user.id,
      },
    }),
    prisma.budgetCategory.upsert({
      where: { id: 3 },
      update: {},
      create: {
        name: 'Entertainment',
        budgeted: 3000,
        spent: 0,
        color: 'bg-purple-500',
        userId: user.id,
      },
    }),
    prisma.budgetCategory.upsert({
      where: { id: 4 },
      update: {},
      create: {
        name: 'Shopping',
        budgeted: 5000,
        spent: 0,
        color: 'bg-orange-500',
        userId: user.id,
      },
    }),
    prisma.budgetCategory.upsert({
      where: { id: 5 },
      update: {},
      create: {
        name: 'Utilities',
        budgeted: 3000,
        spent: 0,
        color: 'bg-red-500',
        userId: user.id,
      },
    }),
    prisma.budgetCategory.upsert({
      where: { id: 6 },
      update: {},
      create: {
        name: 'Healthcare',
        budgeted: 2000,
        spent: 0,
        color: 'bg-pink-500',
        userId: user.id,
      },
    }),
    prisma.budgetCategory.upsert({
      where: { id: 7 },
      update: {},
      create: {
        name: 'Other',
        budgeted: 6000,
        spent: 0,
        color: 'bg-green-500',
        userId: user.id,
      },
    }),
  ]);

  console.log('✅ Created budget categories:', budgetCategories.length);

  // Create transactions
  const transactions = await Promise.all([
    prisma.transaction.upsert({
      where: { id: 1 },
      update: {},
      create: {
        title: 'Grocery Store',
        amount: 1250,
        type: 'expense',
        userId: user.id,
        categoryId: 1, // Food
      },
    }),
    prisma.transaction.upsert({
      where: { id: 2 },
      update: {},
      create: {
        title: 'Salary Deposit',
        amount: 15000.00,
        type: 'income',
        userId: user.id,
        // No category for income
      },
    }),
    prisma.transaction.upsert({
      where: { id: 3 },
      update: {},
      create: {
        title: 'Netflix Subscription',
        amount: 1500,
        type: 'expense',
        userId: user.id,
        categoryId: 3, // Entertainment
      },
    }),
    prisma.transaction.upsert({
      where: { id: 4 },
      update: {},
      create: {
        title: 'Gas Station',
        amount: 7500,
        type: 'expense',
        userId: user.id,
        categoryId: 2, // Transportation
      },
    }),
    prisma.transaction.upsert({
      where: { id: 5 },
      update: {},
      create: {
        title: 'Restaurant',
        amount: 4900,
        type: 'expense',
        userId: user.id,
        categoryId: 1, // Food
      },
    }),
  ]);

  console.log('✅ Created transactions:', transactions.length);

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
