import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const POST = async (req, { params }) => {
  const { id } = await params;
  const { calle, numero, localidadId } = await req.json();

  try {
    const newDireccion = await prisma.direccion.create({
      data: {
        calle,
        numero: parseInt(numero),
        cineId: parseInt(id),
        localidadId: parseInt(localidadId),
      },
    });

    return NextResponse.json(newDireccion, { status: 201 });
  } catch (error) {
    console.error("Error al crear la dirección:", error);
    return NextResponse.json({ error: "Error al crear la dirección", details: error.message }, { status: 500 });
  }
};

export const PUT = async (req, { params }) => {
  const { id } = await params;
  const { calle, numero, localidadId } = await req.json();

  try {
    // Obtener la dirección existente del cine
    const direccionExistente = await prisma.direccion.findFirst({
      where: { cineId: parseInt(id) },
    });

    if (!direccionExistente) {
      return NextResponse.json({ error: "Dirección no encontrada" }, { status: 404 });
    }

    // Actualizar la dirección existente
    const updatedDireccion = await prisma.direccion.update({
      where: { id: direccionExistente.id },
      data: {
        calle,
        numero: parseInt(numero),
        localidadId: parseInt(localidadId),
      },
    });

    return NextResponse.json(updatedDireccion, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar la dirección:", error);
    return NextResponse.json({ error: "Error al actualizar la dirección", details: error.message }, { status: 500 });
  }
};