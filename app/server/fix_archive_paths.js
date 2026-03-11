const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const resources = await prisma.resource.findMany({
    where: { 
      status: 'archived'
    }
  });
  
  for (const r of resources) {
    if (r.file_path && !r.file_path.includes('src')) {
      // If it was "storage\archive\file.ext", we change it to "src\storage\archive\file.ext"
      const newPath = r.file_path.replace('storage', 'src\\\\storage');
      await prisma.resource.update({
        where: { id: r.id },
        data: { file_path: newPath }
      });
      console.log('Updated to', newPath);
    }
  }
}

run().catch(console.error).finally(() => prisma.$disconnect());
