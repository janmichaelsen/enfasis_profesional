const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('--- Iniciando siembra de datos (Seed) ---')

  // 1. Limpiar datos previos (Opcional, para no duplicar)
  await prisma.package.deleteMany({})
  await prisma.user.deleteMany({})

  // 2. Crear Usuarios
  const admin = await prisma.user.create({
    data: {
      name: 'Conserje Manuel',
      email: 'manuel@edificio.com',
      role: 'CONCIERGE',
    },
  })

  const resident = await prisma.user.create({
    data: {
      name: 'Felipe Residente',
      email: 'felipe@departamento.com',
      role: 'RESIDENT',
    },
  })

  console.log('✅ Usuarios creados')

  // 3. Crear Paquetes
  await prisma.package.create({
    data: {
      trackingId: 'TRK-001-PENDING',
      description: 'Caja Grande - Amazon',
      status: 'PENDING',
      weight: 2.5,
      recipientId: resident.id,
    },
  })

  await prisma.package.create({
    data: {
      trackingId: 'TRK-002-DELIVERED',
      description: 'Sobre - Mercado Libre',
      status: 'DELIVERED',
      weight: 0.5,
      recipientId: resident.id,
    },
  })

  console.log('✅ Paquetes de prueba creados')
  console.log('--- Siembra completada con éxito ---')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
