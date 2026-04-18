"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"


// Busca automáticamente al residente del departamento y le asigna el paquete
export async function createPackage(formData: FormData) {
  const trackingId = formData.get("trackingId") as string
  const description = formData.get("description") as string
  const department = formData.get("department") as string
  const type = (formData.get("type") as string) || "REGULAR"
  const weight = formData.get("weight") ? parseFloat(formData.get("weight") as string) : null

  if (!trackingId || !department) {
    throw new Error("Tracking ID y Departamento son obligatorios")
  }

  try {
    // Buscar al residente asignado a este departamento
    const resident = await prisma.user.findFirst({
      where: {
        department: department,
        role: "RESIDENT",
      },
    })

    await prisma.package.create({
      data: {
        trackingId,
        description,
        department,
        type: type as any,
        weight,
        status: "RECEIVED",
        // Si encontramos un residente en ese depto, se le asigna automáticamente
        recipientId: resident?.id || null,
      },
    })

    revalidatePath("/dashboard")
  } catch (error) {
    console.error("Error al crear paquete:", error)
    throw new Error("No se pudo registrar el paquete")
  }
}


export async function deliverPackage(packageId: string) {
  try {
    await prisma.package.update({
      where: { id: packageId },
      data: {
        status: "DELIVERED",
        deliveredAt: new Date(),
      },
    })

    revalidatePath("/dashboard")
  } catch (error) {
    console.error("Error al actualizar estado:", error)
    throw new Error("No se pudo marcar como entregado")
  }
}