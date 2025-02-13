import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async () => {
  try {
    const turnos = await prisma.turno.findMany();
    return NextResponse.json(turnos);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener los formatos" }, { status: 500 });
  }
};