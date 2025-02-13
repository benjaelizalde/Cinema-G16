-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Direccion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "calle" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "localidadId" INTEGER NOT NULL,
    "cineId" INTEGER NOT NULL,
    CONSTRAINT "Direccion_localidadId_fkey" FOREIGN KEY ("localidadId") REFERENCES "Localidad" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Direccion_cineId_fkey" FOREIGN KEY ("cineId") REFERENCES "Cine" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Direccion" ("calle", "cineId", "id", "localidadId", "numero") SELECT "calle", "cineId", "id", "localidadId", "numero" FROM "Direccion";
DROP TABLE "Direccion";
ALTER TABLE "new_Direccion" RENAME TO "Direccion";
CREATE TABLE "new_EntradaPrecio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "precio" REAL NOT NULL,
    "cineId" INTEGER NOT NULL,
    "turnoId" INTEGER NOT NULL,
    CONSTRAINT "EntradaPrecio_cineId_fkey" FOREIGN KEY ("cineId") REFERENCES "Cine" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EntradaPrecio_turnoId_fkey" FOREIGN KEY ("turnoId") REFERENCES "Turno" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_EntradaPrecio" ("cineId", "id", "precio", "turnoId") SELECT "cineId", "id", "precio", "turnoId" FROM "EntradaPrecio";
DROP TABLE "EntradaPrecio";
ALTER TABLE "new_EntradaPrecio" RENAME TO "EntradaPrecio";
CREATE TABLE "new_Sala" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numero" INTEGER NOT NULL,
    "capacidad" INTEGER NOT NULL,
    "formatoId" INTEGER NOT NULL,
    "cineId" INTEGER NOT NULL,
    CONSTRAINT "Sala_formatoId_fkey" FOREIGN KEY ("formatoId") REFERENCES "Formato" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Sala_cineId_fkey" FOREIGN KEY ("cineId") REFERENCES "Cine" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Sala" ("capacidad", "cineId", "formatoId", "id", "numero") SELECT "capacidad", "cineId", "formatoId", "id", "numero" FROM "Sala";
DROP TABLE "Sala";
ALTER TABLE "new_Sala" RENAME TO "Sala";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
