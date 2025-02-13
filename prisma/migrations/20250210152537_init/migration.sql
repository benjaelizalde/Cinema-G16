/*
  Warnings:

  - You are about to drop the `Entrada_precio` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Entrada_precio";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "EntradaPrecio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "precio" REAL NOT NULL,
    "cineId" INTEGER NOT NULL,
    "turno" TEXT NOT NULL
);
