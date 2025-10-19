# Jendie Speed Governor — Backend (Express + Prisma + PostgreSQL + JWT)

This is a starter backend scaffold for **Jendie Speed Governor Inventory System** using:
- Node.js + Express
- Prisma ORM (PostgreSQL)
- JWT Authentication
- Bcrypt for password hashing

## What I included
- Models: User, Dealer, Inventory, Sale (Prisma schema)
- Routes & controllers: auth, dealers, inventory, sales
- Middleware: auth (JWT)
- Example `.env` file (you must verify encoded values)

## Setup (on your machine)

1. Extract the ZIP.
2. Install dependencies:
```bash
cd jendie-backend
npm install
```

3. Prisma setup & DB migration:
- The project includes a `prisma/schema.prisma`. Before running migrations ensure `DATABASE_URL` in `.env` is correct.
- If you need to change raw DB credentials, edit `.env` and set DATABASE_URL accordingly.
```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. Start the dev server:
```bash
npm run dev
```

API base: `http://localhost:4000/api`

## Notes about the provided `.env`
I encoded special characters in the password and spaces in DB name. Current `.env` uses:

- DB name: `Jendie Inventory` (encoded as `Jendie%20Inventory`)
- DB user: `Kennedy`
- DB password (encoded): `inventory%402025...`  (the '@' -> `%40`)

If your real password differs, update `.env` and re-run Prisma commands.

## Useful commands
- Create an admin user (example via curl):
```bash
curl -X POST http://localhost:4000/api/auth/register -H "Content-Type: application/json" -d '{"name":"Admin","email":"admin@example.com","password":"pass123","role":"admin"}'
```

- Login to get JWT:
```bash
curl -X POST http://localhost:4000/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@example.com","password":"pass123"}'
```

