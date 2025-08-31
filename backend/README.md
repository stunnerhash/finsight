# Backend Setup

## Database Configuration

To connect to your Supabase database, you need to create a `.env` file in the backend directory with your database URL.

1. Create a `.env` file in the `backend/` directory:
```bash
touch backend/.env
```

2. Add your Supabase database URL to the `.env` file:
```
DATABASE_URL="postgresql://username:password@db.edsippjchpbajrsrjrey.supabase.co:5432/postgres"
```

Replace `username`, `password`, and the database URL with your actual Supabase credentials.

## Getting Your Supabase Database URL

1. Go to your Supabase project dashboard
2. Navigate to Settings > Database
3. Copy the "Connection string" or "URI" 
4. Replace the placeholder in the `.env` file

## Running the Backend

1. Install dependencies:
```bash
cd backend
npm install
```

2. Run database migrations:
```bash
npx prisma migrate dev
```

3. Seed the database (optional):
```bash
npm run seed
```

4. Start the development server:
```bash
npm run dev
```

The server will run on `http://localhost:3000`

## API Endpoints

- `GET /api/budget/categories` - Get budget categories
- `GET /api/budget/stats` - Get financial statistics
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Add a new transaction
