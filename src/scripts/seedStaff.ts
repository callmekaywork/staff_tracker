import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { users } from '../db/schema';
import bcrypt from 'bcrypt';

import dotenv from 'dotenv';
import { nanoid } from 'nanoid';
dotenv.config();

const db = drizzle(`${process.env.DATABASE_URL!}`);

export const staffAccounts = [
  {
    firstname: 'Seniors',
    lastname: 'Mokae',
    email: 'seniors@paradiseskillsdev.co.za',
    password: 'Seniors@000',
  },
  {
    firstname: 'Boipelo Innocentia',
    lastname: 'Solwane',
    email: 'boipelo@deemarafoundation.org',
    password: 'Boipelo@000',
  },
  {
    firstname: 'Tharollo',
    lastname: 'Mosolotsane',
    email: 'tharollo@ikhaya.org.za',
    password: 'Tharollo@000',
  },
  {
    firstname: 'Lebogang',
    lastname: 'Liphadzi',
    email: 'lebogang@paradiseskillsdev.co.za',
    password: 'Liphadzi@000',
  },
  {
    firstname: 'Velaphi',
    lastname: 'Ngomani',
    email: 'velaphi@ikhaya.org.za',
    password: 'Velaphi@000',
  },
  {
    firstname: 'Tshegofatso',
    lastname: 'Molale',
    email: 'tshegofatso@deesholding.co.za',
    password: 'Tshegofatso@000',
  },
  {
    firstname: 'Molahlehi',
    lastname: 'Mofokeng',
    email: 'molahlehi@ikhaya.org.za',
    password: 'Molahlehi@000',
  },
  {
    firstname: 'Kabelo',
    lastname: 'Mabasa',
    email: 'kabelo@ikhaya.org.za',
    password: 'Kabelo@000',
  },
  {
    firstname: 'Thembaloyolo',
    lastname: 'Tsikila',
    email: 'thembaloyolo@deemara.com',
    password: 'Thembaloyolo@000',
  },
  {
    firstname: 'Molotjwa',
    lastname: 'Mothapo',
    email: 'ngwako@deesholding.co.za',
    password: 'Molotjwa@000',
  },
  {
    firstname: 'Malwande',
    lastname: 'Mbele',
    email: 'malwande@deesholding.co.za',
    password: 'Malwande@000',
  },
  {
    firstname: 'Karabo',
    lastname: 'Segele',
    email: 'karabo@deesholding.co.za',
    password: 'Karabo@000',
  },
  {
    firstname: 'Mathibedi',
    lastname: 'Mohapi',
    email: 'mohapi@deesholding.co.za',
    password: 'Mathibedi@000',
  },
  {
    firstname: 'April',
    lastname: 'Koalepe',
    email: 'april@deesholding.co.za',
    password: 'April@000',
  },
  {
    firstname: 'Ntokozo',
    lastname: 'Rakosa',
    email: 'ntokozo@deesholding.co.za',
    password: 'Ntokozo@000',
  },
  {
    firstname: 'Zipho',
    lastname: 'Nogula',
    email: 'zipho@deesholding.co.za',
    password: 'Zipho@000',
  },
  {
    firstname: 'Innocia',
    lastname: 'Manganyi',
    email: 'innocia@deesholding.co.za',
    password: 'Innocia@000',
  },
  {
    firstname: 'Tiyiselani',
    lastname: 'Hlungwane',
    email: 'tiyiselani@deesholding.co.za',
    password: 'Tiyiselani@000',
  },
];

async function seedStaff() {
  // if nothing hash the password
  for (const entry of staffAccounts) {
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, `${entry.email}`));

    if (existing.length > 0) {
      console.log('Staff already exists');
    } else {
      // staffAccounts.map(async (entry) => {
      const hash = await bcrypt.hash(`${entry.password}`, 10);
      await db.insert(users).values({
        id: nanoid(),
        firstname: `${entry.firstname}`,
        lastname: `${entry.lastname}`,
        email: `${entry.email}`,
        role: 'staff',
        password: `${hash}`,
      });
    }
  }

  console.log('Staff seeded');
}

seedStaff().catch((err) => {
  console.error('❌ Seeding Staff failed:', err);
  process.exit(1);
});
