import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding roles...");
  const roles = ["Student", "Faculty", "Admin", "SuperAdmin"];
  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    });
  }

  console.log("Seeding design stages...");
  const stages = [
    "Architectural Design I",
    "Architectural Design II",
    "Architectural Design III",
    "Integrated Design I",
    "Integrated Design II",
    "Integrated Design III",
    "Thesis Project",
  ];
  for (const stageName of stages) {
    // Note: Design_stage doesn't have a unique constraint on name in the provided schema
    // but it's good practice to avoid duplicates in seed.
    const exists = await prisma.design_stage.findFirst({
      where: { name: stageName },
    });
    if (!exists) {
      await prisma.design_stage.create({
        data: { name: stageName },
      });
    }
  }

  // Create sample users
  console.log("Seeding sample users...");

  // Get roles
  const adminRole = await prisma.role.findUnique({ where: { name: "Admin" } });
  const facultyRole = await prisma.role.findUnique({
    where: { name: "Faculty" },
  });
  const studentRole = await prisma.role.findUnique({
    where: { name: "Student" },
  });

  // Create Admin User
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@archit.edu" },
    update: {},
    create: {
      first_name: "Admin",
      last_name: "User",
      email: "admin@archit.edu",
      password: adminPassword,
      roleId: adminRole?.id,
      status: "active",
    },
  });

  // Create Faculty User
  const facultyPassword = await bcrypt.hash("faculty123", 10);
  await prisma.user.upsert({
    where: { email: "faculty@archit.edu" },
    update: {},
    create: {
      first_name: "John",
      last_name: "Professor",
      email: "faculty@archit.edu",
      password: facultyPassword,
      roleId: facultyRole?.id,
      status: "active",
    },
  });

  // Create Student User
  const studentPassword = await bcrypt.hash("student123", 10);
  await prisma.user.upsert({
    where: { email: "student@archit.edu" },
    update: {},
    create: {
      first_name: "Jane",
      last_name: "Student",
      email: "student@archit.edu",
      password: studentPassword,
      roleId: studentRole?.id,
      status: "active",
    },
  });

  console.log("Seed completed successfully.");
  console.log("\n🔐 Sample Login Credentials:");
  console.log("   Admin:   admin@archit.edu / admin123");
  console.log("   Faculty: faculty@archit.edu / faculty123");
  console.log("   Student: student@archit.edu / student123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
