/*
  Warnings:

  - You are about to drop the column `turno` on the `EntradaPrecio` table. All the data in the column will be lost.
  - Added the required column `turnoId` to the `EntradaPrecio` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Turno" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "descripcion" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EntradaPrecio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "precio" REAL NOT NULL,
    "cineId" INTEGER NOT NULL,
    "turnoId" INTEGER NOT NULL
);
INSERT INTO "new_EntradaPrecio" ("cineId", "id", "precio") SELECT "cineId", "id", "precio" FROM "EntradaPrecio";
DROP TABLE "EntradaPrecio";
ALTER TABLE "new_EntradaPrecio" RENAME TO "EntradaPrecio";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
