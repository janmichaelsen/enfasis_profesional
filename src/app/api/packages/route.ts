import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

// GET /api/packages → devuelve paquetes según el rol del usuario
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const userRole = session.user.role;
    const userId = session.user.id;

    let packages;

    if (userRole === "CONCIERGE" || userRole === "ADMIN") {
      // Conserje → ve todos los paquetes
      packages = await prisma.package.findMany({
        orderBy: { createdAt: "desc" },
      });
    } else {
      // Residente → ve solo SUS paquetes
      packages = await prisma.package.findMany({
        where: { recipientId: userId },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json(packages);
  } catch (error) {
    console.error("Error al obtener paquetes:", error);
    return NextResponse.json(
      { error: "No se pudieron obtener los paquetes." },
      { status: 500 }
    );
  }
}
