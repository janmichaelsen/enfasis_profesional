import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./dashboard-client";

export default async function DashboardPage() {
  // 1. Verificar sesión — si no hay login, redirigir
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id;
  const userRole = session.user.role || "RESIDENT";

  // 2. Obtener paquetes según el rol
  let allPackages: any[] = [];
  try {
    if (userRole === "CONCIERGE" || userRole === "ADMIN") {
      // El conserje ve TODOS los paquetes (inventario completo)
      const dbPackages = await prisma.package.findMany({
        orderBy: { createdAt: "desc" },
      });
      allPackages = dbPackages.map(serialize);
    } else {
      // El residente ve SOLO sus paquetes (los que tienen su ID como destinatario)
      const dbPackages = await prisma.package.findMany({
        where: { recipientId: userId },
        orderBy: { createdAt: "desc" },
      });
      allPackages = dbPackages.map(serialize);
    }
  } catch (error) {
    console.error("Error cargando paquetes:", error);
  }

  // 3. Pasar datos al componente cliente
  return (
    <DashboardClient
      userName={session.user.name || "Usuario"}
      userRole={userRole}
      userId={userId}
      initialPackages={allPackages}
    />
  );
}

// Serializar fechas para el componente cliente
function serialize(pkg: any) {
  return {
    ...pkg,
    createdAt: pkg.createdAt.toISOString(),
    updatedAt: pkg.updatedAt.toISOString(),
    deliveredAt: pkg.deliveredAt?.toISOString() || null,
  };
}