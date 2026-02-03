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
  const roles = ["Student", "Faculty", "Admin", "DepartmentHead", "SuperAdmin"];
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
    "Others",
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

  // Create SuperAdmin User
  const superAdminRole = await prisma.role.findUnique({
    where: { name: "SuperAdmin" },
  });
  const superAdminPassword = await bcrypt.hash("Fuad@abdela3833", 10);
  // Delete existing SuperAdmin to ensure clean credentials
  await prisma.user.deleteMany({
    where: { email: "fuadabdela95@gmail.com" },
  });

  await prisma.user.create({
    data: {
      name: "System Developer",
      first_name: "Super",
      last_name: "Admin",
      email: "fuadabdela95@gmail.com",
      password: superAdminPassword,
      roleId: superAdminRole?.id,
      status: "active",
      emailVerified: true,
      accounts: {
        create: {
          id: `acc_${Date.now()}_super`,
          providerId: "credential",
          accountId: "fuadabdela95@gmail.com",
          password: superAdminPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    },
  });

  // Create Admin User
  const adminPassword = await bcrypt.hash("Fuad@ab5659", 10);

  await prisma.user.upsert({
    where: { email: "fuadabdela63@gmail.com" },
    update: {},
    create: {
      name: "Admin User",
      first_name: "Fuad",
      last_name: "Abdela",
      email: "fuadabdela63@gmail.com",
      password: adminPassword,
      roleId: adminRole?.id,
      status: "active",
      emailVerified: true,
      accounts: {
        create: {
          id: "acc_admin",
          providerId: "credential",
          accountId: "fuadabdela95@gmail.com",
          password: adminPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    },
  });

  // Create Faculty User
  const facultyPassword = await bcrypt.hash("faculty123", 10);
  await prisma.user.upsert({
    where: { email: "faculty@archit.edu" },
    update: {},
    create: {
      name: "John Professor",
      first_name: "John",
      last_name: "Professor",
      email: "faculty@archit.edu",
      password: facultyPassword,
      roleId: facultyRole?.id,
      status: "active",
      emailVerified: true,
      accounts: {
        create: {
          id: "acc_faculty",
          providerId: "credential",
          accountId: "faculty@archit.edu",
          password: facultyPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    },
  });

  // Create Student User
  const studentPassword = await bcrypt.hash("student123", 10);
  await prisma.user.upsert({
    where: { email: "student@archit.edu" },
    update: {},
    create: {
      name: "Jane Student",
      first_name: "Jane",
      last_name: "Student",
      email: "student@archit.edu",
      password: studentPassword,
      roleId: studentRole?.id,
      status: "active",
      emailVerified: true,
      accounts: {
        create: {
          id: "acc_student",
          providerId: "credential",
          accountId: "student@archit.edu",
          password: studentPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    },
  });

  // Create sample resources
  console.log("Seeding sample resources...");
  const stage1 = await prisma.design_stage.findFirst({
    where: { name: "Architectural Design I" },
  });
  const facultyUser = await prisma.user.findUnique({
    where: { email: "faculty@archit.edu" },
  });

  const sampleResources = [
    {
      title: "Modern Housing Project",
      author: "Ar. Smith",
      keywords: ["housing", "modern", "residential"],
      forYearStudents: 1,
      file_path: "storage/sample1.pdf",
      file_type: "application/pdf",
      file_size: 1024 * 1024 * 2,
      uploader_id: facultyUser?.id,
      design_stage_id: stage1?.id,
      status: "student",
      download_count: 15,
      priority_tag: "Faculty Upload",
    },
    {
      title: "Sustainable Urban Design",
      author: "Ar. Jane Doe",
      keywords: ["urban", "sustainable", "green"],
      forYearStudents: 2,
      file_path: "storage/sample2.pdf",
      file_type: "application/pdf",
      file_size: 1024 * 1024 * 5,
      uploader_id: facultyUser?.id,
      design_stage_id: stage1?.id,
      status: "student",
      download_count: 50,
    },
    {
      title: "Cultural Center Concept",
      author: "Student A",
      keywords: ["culture", "concept", "sketch"],
      forYearStudents: 3,
      file_path: "storage/sample3.pdf",
      file_type: "application/pdf",
      file_size: 1024 * 1024 * 1,
      uploader_id: facultyUser?.id,
      design_stage_id: stage1?.id,
      status: "student",
      download_count: 10,
    },
    {
      title: "Hospital Design Standards",
      author: "Ar. Health",
      keywords: ["hospital", "medical", "planning"],
      forYearStudents: 4,
      file_path: "storage/sample4.pdf",
      file_type: "application/pdf",
      file_size: 1024 * 1024 * 8,
      uploader_id: facultyUser?.id,
      design_stage_id: stage1?.id,
      status: "student",
      download_count: 100,
      priority_tag: "Featured",
    },
  ];

  for (const r of sampleResources) {
    // Basic check to avoid duplicates on title
    const exists = await prisma.resource.findFirst({
      where: { title: r.title },
    });
    if (!exists) {
      await prisma.resource.create({ data: r });
    }
  }

  console.log("Seed completed successfully.");
  console.log("\n🔐 Sample Login Credentials:");
  console.log("   SuperAdmin: fuadabdela95@gmail.com / Fuad@abdela3833");
  console.log("   Admin:      fuadabdela63@gmail.com / Fuad@ab5659");
  console.log("   Faculty:    faculty@archit.edu / faculty123");
  console.log("   Student:    student@archit.edu / student123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
