import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("123456", 12);

  const student = await prisma.user.create({
    data: {
      name: "Abdullah Al Rony",
      email: "student@codezyne.com",
      phone: "+8801710699394",
      password,
      role: "STUDENT",
      avatarUrl: "https://i.pravatar.cc/150?img=12",
    },
  });

  await prisma.user.createMany({
    data: [
      { name: "Admin User", email: "admin@codezyne.com", password, role: "ADMIN" },
      { name: "Tanvir Ahmed", email: "teacher@codezyne.com", password, role: "TEACHER" },
    ],
  });

  const categories = await Promise.all([
    prisma.category.create({ data: { name: "IELTS", slug: "ielts" } }),
    prisma.category.create({ data: { name: "Web Development", slug: "web-development" } }),
    prisma.category.create({ data: { name: "Spoken English", slug: "spoken-english" } }),
    prisma.category.create({ data: { name: "Freelancing", slug: "freelancing" } }),
  ]);

  const courses = await Promise.all([
    prisma.course.create({
      data: {
        title: "IELTS Complete Preparation",
        slug: "ielts-complete-preparation",
        description: "Reading, Writing, Listening and Speaking complete preparation with mock tests.",
        thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
        price: 4500,
        level: "INTERMEDIATE",
        duration: "8 weeks",
        rating: 4.8,
        students: 1250,
        categoryId: categories[0].id,
        lessons: {
          create: [
            { title: "IELTS Course Introduction", type: "VIDEO", duration: "12 min", isFree: true, order: 1 },
            { title: "Reading Strategy", type: "VIDEO", duration: "35 min", order: 2 },
            { title: "Speaking Live Practice", type: "LIVE", duration: "60 min", order: 3 },
            { title: "Mock Test 01", type: "QUIZ", duration: "90 min", order: 4 },
          ],
        },
      },
    }),
    prisma.course.create({
      data: {
        title: "MERN Stack Full Course",
        slug: "mern-stack-full-course",
        description: "Build production-ready websites with MongoDB, Express, React and Node.js.",
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
        price: 8000,
        level: "ADVANCED",
        duration: "12 weeks",
        rating: 4.9,
        students: 980,
        categoryId: categories[1].id,
        lessons: {
          create: [
            { title: "Frontend Setup", type: "VIDEO", duration: "25 min", isFree: true, order: 1 },
            { title: "Backend API", type: "VIDEO", duration: "40 min", order: 2 },
            { title: "MongoDB Integration", type: "VIDEO", duration: "32 min", order: 3 },
          ],
        },
      },
    }),
    prisma.course.create({
      data: {
        title: "Spoken English Masterclass",
        slug: "spoken-english-masterclass",
        description: "Daily speaking practice, vocabulary, fluency and confidence building.",
        thumbnail: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d",
        price: 2500,
        level: "BEGINNER",
        duration: "6 weeks",
        rating: 4.7,
        students: 2100,
        categoryId: categories[2].id,
        lessons: {
          create: [
            { title: "Basic Conversation", type: "VIDEO", duration: "20 min", isFree: true, order: 1 },
            { title: "Pronunciation Practice", type: "LIVE", duration: "45 min", order: 2 },
          ],
        },
      },
    }),
  ]);

  await prisma.enrollment.createMany({
    data: [
      { userId: student.id, courseId: courses[0].id, progress: 42 },
      { userId: student.id, courseId: courses[1].id, progress: 18 },
    ],
  });

  console.log("✅ Seed completed");
  console.log("Student login: student@codezyne.com / 123456");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
