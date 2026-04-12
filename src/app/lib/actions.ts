"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// Acción para GUARDAR un nuevo paquete
export async function createPackage(formData: FormData) {
  const trackingId = formData.get("trackingId") as string
  const description = formData.get("description") as string
  const weight = formData.get("weight") ? parseFloat(formData.get("weight") as string) : null

  try {
    await prisma.package.create({
      data: {
        trackingId,
        description,
        weight,
        status: "RECEIVED",
      },
    })
    
    // Forzamos a Next.js a refrescar los datos del dashboard
    revalidatePath("/dashboard")
  } catch (error) {
    console.error("Error al crear paquete:", error)
    throw new Error("No se pudo registrar el paquete")
  }
}

// Acción para ENTREGAR un paquete existente
export async function deliverPackage(packageId: string) {
  try {
    await prisma.package.update({
      where: { id: packageId },
      data: { 
        status: "DELIVERED",
        // Aquí podrías agregar una fecha de entrega si tuvieras el campo:
        // deliveredAt: new Date() 
      },
    })
    
    revalidatePath("/dashboard")
  } catch (error) {
    console.error("Error al actualizar estado:", error)
    throw new Error("No se pudo marcar como entregado")
  }
}