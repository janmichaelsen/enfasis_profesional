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

  // 3. Crear Paquetes con los nuevos campos
  await prisma.package.create({
    data: {
      trackingId: 'TRK-001-AMZ',
      description: 'Caja Grande - Amazon',
      department: '402',
      type: 'REGULAR',
      status: 'RECEIVED',
      weight: 2.5,
      recipientId: resident.id,
    },
  })

  await prisma.package.create({
    data: {
      trackingId: 'TRK-002-ML',
      description: 'Sobre - Mercado Libre',
      department: '402',
      type: 'REGULAR',
      status: 'DELIVERED',
      weight: 0.5,
      deliveredAt: new Date(),
      recipientId: resident.id,
    },
  })

  await prisma.package.create({
    data: {
      trackingId: 'TRK-003-FOOD',
      description: 'Pedido Supermercado - Perecedero',
      department: '1201',
      type: 'PERISHABLE',
      status: 'RECEIVED',
      weight: 5.0,
    },
  })

  await prisma.package.create({
    data: {
      trackingId: 'TRK-004-URG',
      description: 'Documentos Legales Urgentes',
      department: '803',
      type: 'URGENT',
      status: 'RECEIVED',
      weight: 0.3,
    },
  })

  console.log('✅ Paquetes de prueba creados (Regular, Perecedero, Urgente)')
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
