const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('--- Iniciando siembra de datos (Seed) ---')


  // Se borran solo los paquetes para la demo
  await prisma.package.deleteMany({})

  // Acceso como conserje
  const me = await prisma.user.upsert({
    where: { email: 'jmichaelsenthiel@gmail.com' },
    update: { role: 'CONCIERGE' },
    create: {
      email: 'jmichaelsenthiel@gmail.com',
      name: 'Jan',
      role: 'CONCIERGE',
    },
  })

  // Usuario de apoyo para la DEMO
  const manuel = await prisma.user.upsert({
    where: { email: 'manuel@edificio.com' },
    update: { role: 'CONCIERGE' },
    create: {
      name: 'Conserje Manuel',
      email: 'manuel@edificio.com',
      role: 'CONCIERGE',
    },
  })

  // Usuario Residente para probar asignaciones
  const felipe = await prisma.user.upsert({
    where: { email: 'felipe@departamento.com' },
    update: { role: 'RESIDENT' },
    create: {
      name: 'Felipe Residente',
      email: 'felipe@departamento.com',
      role: 'RESIDENT',
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
        recipientId: felipe.id,
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
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })