import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./dashboard-client";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string; role?: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const resolvedParams = await searchParams;
  const lang = resolvedParams.lang || "es";
  const userRole = (session.user as any).role || resolvedParams.role || "RESIDENT";

  // Obtenemos los paquetes iniciales desde la base de datos
  const packages = await prisma.package.findMany({
    where: userRole === "RESIDENT" ? { recipient: { email: session.user?.email } } : {},
    orderBy: { createdAt: "desc" },
  });

  return (
    <DashboardClient
      userName={session.user?.name || "Usuario"}
      userRole={userRole}
      userId={session.user?.id || ""}
      initialPackages={JSON.parse(JSON.stringify(packages))}
    />
  );
}