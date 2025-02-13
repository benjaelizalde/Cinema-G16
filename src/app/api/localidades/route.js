import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export const GET = async () => {
  const localidades = await prisma.localidad.findMany();
  return NextResponse.json(localidades);
};