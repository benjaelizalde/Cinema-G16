const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Crear cines
  // const cines = await prisma.cine.createMany({
  //   data: [
  //     {nombre: "Cinema Ocho"},
  //     {nombre: "Cinema City"},
  //   ],
  // });

  // await prisma.direccion.createMany({
  //   data: [
  //     {calle: "Calle 8", numero: 981, localidadId: 19, cineId: 1},
  //     {calle: "Calle 50", numero: 723, localidadId: 19, cineId: 2},
  //   ],
  // });

  // await prisma.sala.createMany({
  //   data: [
  //     { numero: 1, capacidad: 100, formatoId:13, cineId: 1 },
  //     { numero: 2, capacidad: 150, formatoId:14, cineId: 1 },
  //     { numero: 1, capacidad: 200, formatoId:13, cineId: 2 },
  //     { numero: 2, capacidad: 100, formatoId:14, cineId: 2 },
  //   ],
  // });

  // await prisma.entradaPrecio.createMany({
  //   data: [
  //     { precio: 200, cineId: 1, turnoId: 1 },
  //     { precio: 250, cineId: 1, turnoId: 2 },
  //     { precio: 300, cineId: 1, turnoId: 3 },
  //     { precio: 350, cineId: 1, turnoId: 4 },
  //     { precio: 150, cineId: 2, turnoId: 1 },
  //     { precio: 200, cineId: 2, turnoId: 2 },
  //     { precio: 250, cineId: 2, turnoId: 3 },
  //     { precio: 300, cineId: 2, turnoId: 4 },
  //   ],
  // });

  // console.log({ cines });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
