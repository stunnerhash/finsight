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
        budgeted: 800,
        spent: 456.78,
        color: 'bg-blue-500',
        userId: user.id,
      },
    }),
    prisma.budgetCategory.upsert({
      where: { id: 2 },
      update: {},
      create: {
        name: 'Transportation',
        budgeted: 400,
        spent: 267.34,
        color: 'bg-green-500',
        userId: user.id,
      },
    }),
    prisma.budgetCategory.upsert({
      where: { id: 3 },
      update: {},
      create: {
        name: 'Entertainment',
        budgeted: 300,
        spent: 145.99,
        color: 'bg-purple-500',
        userId: user.id,
      },
    }),
    prisma.budgetCategory.upsert({
      where: { id: 4 },
      update: {},
      create: {
        name: 'Shopping',
        budgeted: 500,
        spent: 289.45,
        color: 'bg-orange-500',
        userId: user.id,
      },
    }),
    prisma.budgetCategory.upsert({
      where: { id: 5 },
      update: {},
      create: {
        name: 'Utilities',
        budgeted: 300,
        spent: 245.67,
        color: 'bg-red-500',
        userId: user.id,
      },
    }),
    prisma.budgetCategory.upsert({
      where: { id: 6 },
      update: {},
      create: {
        name: 'Healthcare',
        budgeted: 200,
        spent: 89.23,
        color: 'bg-pink-500',
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
        amount: -125.50,
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
        amount: 5000.00,
        type: 'income',
        userId: user.id,
        categoryId: 1, // Food (for income, category doesn't matter much)
      },
    }),
    prisma.transaction.upsert({
      where: { id: 3 },
      update: {},
      create: {
        title: 'Netflix Subscription',
        amount: -15.99,
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
        amount: -75.20,
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
        amount: -89.45,
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
