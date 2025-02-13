import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async () => {
  try {
    const formatos = await prisma.formato.findMany();
    return NextResponse.json(formatos);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener los formatos" }, { status: 500 });
  }
};