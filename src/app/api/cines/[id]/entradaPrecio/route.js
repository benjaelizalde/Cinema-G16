import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (req, { params }) => {
  const { id } = await params;

  try {
    const preciosEntrada = await prisma.entradaPrecio.findMany({
      where: { cineId: parseInt(id) },
    });

    return NextResponse.json(preciosEntrada, { status: 200 });
  } catch (error) {
    console.error("Error al obtener los precios de entrada:", error);
    return NextResponse.json({ error: "Error al obtener los precios de entrada", details: error.message }, { status: 500 });
  }
};

export const POST = async (req, { params }) => {
  const { id } = await params;
  const { turnoId, precio } = await req.json();

  try {
    const newPrecioEntrada = await prisma.entradaPrecio.create({
      data: {
        turnoId: parseInt(turnoId),
        precio: parseFloat(precio),
        cineId: parseInt(id),
      },
    });

    return NextResponse.json(newPrecioEntrada, { status: 201 });
  } catch (error) {
    console.error("Error al crear el precio de entrada:", error);
    return NextResponse.json({ error: "Error al crear el precio de entrada", details: error.message }, { status: 500 });
  }
};

export const PUT = async (req, { params }) => {
  const { id } = await params;
  const { turnoId, precio } = await req.json();

  try {
    const updatedPrecioEntrada = await prisma.entradaPrecio.updateMany({
      where: {
        cineId: parseInt(id),
        turnoId: parseInt(turnoId),
      },
      data: {
        precio: parseFloat(precio),
      },
    });

    return NextResponse.json(updatedPrecioEntrada, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar el precio de entrada:", error);
    return NextResponse.json({ error: "Error al actualizar el precio de entrada", details: error.message }, { status: 500 });
  }
};