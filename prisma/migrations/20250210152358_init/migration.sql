/*
  Warnings:

  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Task";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Localidad" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "codPostal" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Formato" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Direccion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "calle" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "localidadId" INTEGER NOT NULL,
    "cineId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Cine" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Entrada_precio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "precio" REAL NOT NULL,
    "cineId" INTEGER NOT NULL,
    "turno" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Sala" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numero" INTEGER NOT NULL,
    "capacidad" INTEGER NOT NULL,
    "formatoId" INTEGER NOT NULL,
    "cineId" INTEGER NOT NULL
);
