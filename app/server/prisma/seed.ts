import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

  console.log("Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
