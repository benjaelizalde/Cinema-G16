import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async () => {
  try {
    const cines = await prisma.cine.findMany({
      include: {
        direccion: {
          include: {
            localidad: true,
          },
        },
      },
    });
    return NextResponse.json(cines);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener los cines" }, { status: 500 });
  }
};

export const POST = async (req) => {
  const { nombre } = await req.json();

  try {
    const newCine = await prisma.cine.create({
      data: {
        nombre,
      },
    });

    return NextResponse.json(newCine, { status: 201 });
  } catch (error) {
    console.error("Error al crear el cine:", error);
    return NextResponse.json({ error: "Error al crear el cine", details: error.message }, { status: 500 });
  }
};