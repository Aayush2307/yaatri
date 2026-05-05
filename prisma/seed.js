const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.temple.count();
  if (existing > 0) {
    return;
  }

  const temples = await prisma.temple.createMany({
    data: [
      {
        name: 'Kashi Vishwanath',
        location: 'Varanasi',
        state: 'Uttar Pradesh',
        openingTime: '03:00',
        closingTime: '23:00',
        description: 'One of the most sacred Shiva temples on the Ganga.',
      },
      {
        name: 'Kedarnath',
        location: 'Rudraprayag',
        state: 'Uttarakhand',
        openingTime: '04:00',
        closingTime: '21:00',
        description: 'Himalayan Jyotirlinga temple, open seasonally.',
      },
      {
        name: 'Somnath',
        location: 'Veraval',
        state: 'Gujarat',
        openingTime: '06:00',
        closingTime: '22:00',
        description: 'Ancient Jyotirlinga on the western coast.',
      },
    ],
  });

  if (temples.count > 0) {
    const allTemples = await prisma.temple.findMany({ take: 3, orderBy: { name: 'asc' } });
    const today = new Date();

    for (const temple of allTemples) {
      await prisma.muhurat.createMany({
        data: [
          {
            templeId: temple.id,
            date: today,
            startTime: '05:30',
            endTime: '06:15',
            notes: 'Brahma muhurat window',
          },
          {
            templeId: temple.id,
            date: today,
            startTime: '09:30',
            endTime: '10:15',
            notes: 'Morning darshan window',
          },
        ],
      });
    }
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
