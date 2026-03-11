import { prisma } from "./src/config/db";

async function run() {
  const resources = await prisma.resource.findMany({
    where: { 
      status: 'archived'
    }
  });
  
  for (const r of resources) {
    if (r.file_path && r.file_path.includes('archive')) {
      const fileName = r.file_path.split('\\').pop() || r.file_path.split('/').pop() || '';
      const newPath = `src\\storage\\${fileName}`;
      await prisma.resource.update({
        where: { id: r.id },
        data: { file_path: newPath, status: 'student' }
      });
      console.log(`Updated ${r.id} to ${newPath}`);
    }
  }
}

run().catch(console.error).finally(() => prisma.$disconnect());
