import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (req, {params}) => {
  const { id } = await params;

  try {
    const cine = await prisma.cine.findUnique({
      where: { id: parseInt(id) },
      include: {
        salas: true,
      },
    });

    if (!cine) {
      return NextResponse.json({ error: "Cine no encontrado" }, { status: 404 });
    }

    return NextResponse.json(cine);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener las salas" }, { status: 500 });
  }
};

export const POST = async (req, {params}) => {
  const { id } = await params;
  const { numero, capacidad, formatoId } = await req.json();

  try {
    const newSala = await prisma.sala.create({
      data: {
        numero: parseInt(numero),
        capacidad: parseInt(capacidad),
        formatoId: parseInt(formatoId),
        cineId: parseInt(id),
      },
    });

    return NextResponse.json(newSala);
  } catch (error) {
    console.error("Error al crear la sala:", error);
    return NextResponse.json({ error: "Error al crear la sala", details: error.message }, { status: 500 });
  }
};