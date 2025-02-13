import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (req, { params }) => {
  const { id } = await params;

  try {
    const cine = await prisma.cine.findUnique({
      where: { id: parseInt(id) },
      include: {
        direccion: {
          include: {
            localidad: true,
          },
        },
      },
    });
    return NextResponse.json(cine);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener el cine" }, { status: 500 });
  }
};

export const PUT = async (req, { params }) => {
  const { id } = await params;
  const { nombre } = await req.json();

  try {
    const updatedCine = await prisma.cine.update({
      where: { id: parseInt(id) },
      data: { nombre },
    });

    return NextResponse.json(updatedCine, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar el cine:", error);
    return NextResponse.json({ error: "Error al actualizar el cine", details: error.message }, { status: 500 });
  }
};

export const DELETE = async (req, { params }) => {
  const { id } = await params;

  try {
    await prisma.cine.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Cine eliminado correctamente" }, { status: 200 });
  } catch (error) {
    console.error("Error al eliminar el cine:", error);
    return NextResponse.json({ error: "Error al eliminar el cine", details: error.message }, { status: 500 });
  }
};