import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

// GET /api/residents → lista de residentes (solo para conserje)
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "CONCIERGE" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const residents = await prisma.user.findMany({
      where: { role: "RESIDENT" },
      select: { id: true, name: true, email: true, department: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(residents);
  } catch (error) {
    console.error("Error al obtener residentes:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// PATCH /api/residents → asignar departamento (solo conserje)
export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "CONCIERGE" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { userId, department } = await request.json();

    if (!userId || !department) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { department },
      select: { id: true, name: true, department: true },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error al asignar departamento:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
