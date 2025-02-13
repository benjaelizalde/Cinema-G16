const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Eliminar todos los registros de las tablas
  await prisma.localidad.deleteMany({});
  await prisma.formato.deleteMany({});
  // Agrega más tablas si es necesario

  console.log('Registros eliminados');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });