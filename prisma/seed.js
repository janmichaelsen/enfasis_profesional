const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('--- Iniciando siembra de datos (Seed) ---')

  // Se borran solo los paquetes para la demo
  await prisma.package.deleteMany({})

  // Acceso como conserje (Jan)
  await prisma.user.upsert({
    where: { email: 'jmichaelsenthiel@gmail.com' },
    update: { role: 'CONCIERGE' },
    create: {
      email: 'jmichaelsenthiel@gmail.com',
      name: 'Jan',
      role: 'CONCIERGE',
    },
  })

  // Tu acceso real como CONCIERGE (Sin punto)
  await prisma.user.upsert({
    where: { email: 'felipealvarezmer@gmail.com' },
    update: { role: 'CONCIERGE' },
    create: {
      name: 'Felipe Conserje',
      email: 'felipealvarezmer@gmail.com',
      role: 'CONCIERGE',
    },
  })

  console.log('Usuarios sincronizados con roles correctos')

  // Paquetes de ejemplo para demo
  await prisma.package.createMany({
    data: [
      {
        trackingId: 'TRK-001-AMZ',
        description: 'Caja Grande - Amazon',
        department: '402',
        type: 'REGULAR',
        status: 'RECEIVED',
        weight: 2.5,
      },
      {
        trackingId: 'TRK-003-FOOD',
        description: 'Pedido Supermercado',
        department: '1201',
        type: 'PERISHABLE',
        status: 'RECEIVED',
        weight: 5.0,
      }
    ]
  })

  console.log('Datos de encomiendas listos para la Prueba 1')
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