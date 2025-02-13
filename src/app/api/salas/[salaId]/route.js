import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (req, { params }) => {
    const { salaId } = await params;

    try {
        const sala = await prisma.sala.findUnique({
            where: {
                id: parseInt(salaId),
            },
        });

        if (!sala) {
            return NextResponse.json({ error: "Sala no encontrada" }, { status: 404 });
        }

        return NextResponse.json(sala);
    } catch (error) {
        console.error("Error al obtener la sala:", error);
        return NextResponse.json({ error: "Error al obtener la sala", details: error.message }, { status: 500 });
    }
};

export const PUT = async (req, { params }) => {
  const { salaId } = await params;
  const { capacidad, formatoId } = await req.json();

  try {
    const updatedSala = await prisma.sala.update({
      where: {
        id: parseInt(salaId),
      },
      data: {
        capacidad: parseInt(capacidad),
        formatoId: parseInt(formatoId),
      },
    });

    return NextResponse.json(updatedSala);
  } catch (error) {
    console.error("Error al modificar la sala:", error);
    return NextResponse.json({ error: "Error al modificar la sala", details: error.message }, { status: 500 });
  }
};

export const DELETE = async (req, { params }) => {
  const { salaId } = await params;

  try {
    await prisma.sala.delete({
      where: {
        id: Number(salaId),
      },
    });

    return NextResponse.json({ message: "Sala eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la sala:", error);
    return NextResponse.json({ error: "Error al eliminar la sala", details: error.message }, { status: 500 });
  }
};