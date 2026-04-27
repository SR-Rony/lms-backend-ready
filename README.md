# LMS Backend Ready

Production-style starter backend for Expo React Native LMS app.

## Stack

- Node.js
- Express
- TypeScript
- Prisma ORM
- SQLite for local seed data
- JWT Auth
- Helmet, CORS, rate limit

## Setup

```bash
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

Or one command:

```bash
cp .env.example .env
npm run setup
npm run dev
```

API will run at:

```txt
http://localhost:5000
```

For Android emulator use:

```txt
http://10.0.2.2:5000
```

For physical phone, use your computer LAN IP, example:

```txt
http://192.168.0.100:5000
```

## Seed Login

```txt
student@codezyne.com
123456
```

## Main APIs

### Register

POST `/api/auth/register`

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "phone": "+8801700000000",
  "password": "123456"
}
```

### Login

POST `/api/auth/login`

```json
{
  "email": "student@codezyne.com",
  "password": "123456"
}
```

### Me

GET `/api/auth/me`

Header:

```txt
Authorization: Bearer YOUR_TOKEN
```

### Courses

GET `/api/courses`

### Categories

GET `/api/categories`

### Course Details

GET `/api/courses/ielts-complete-preparation`

### Dashboard

GET `/api/dashboard`

Header required.

### My Courses

GET `/api/my-courses`

Header required.

### Enroll

POST `/api/enroll`

```json
{
  "courseId": "COURSE_ID"
}
```

### Update Progress

PATCH `/api/progress/ENROLLMENT_ID`

```json
{
  "progress": 75
}
```

## Production Notes

For production, change SQLite to PostgreSQL or MySQL in `prisma/schema.prisma` and update `DATABASE_URL`.
