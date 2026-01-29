import { z } from 'zod';
import { db } from '@/db';
import { assistanceRecords } from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { IncomingHttpHeaders } from 'node:http';
import { ORPCError, os } from '@orpc/server';
import { assistanceRecordSchema } from '@/db/validators';

// export const assistanceRouter = router({ getAll: publicProcedure.query(async () => { const records = await db.select().from(assistanceRecords); // Optionally validate with Zod before returning return records.map(r => assistanceRecordSchema.parse(r)); }),

export const createReport = os
  .$context<{ headers: IncomingHttpHeaders }>()
  .input(
    assistanceRecordSchema.omit({
      disabilityType: true,
      race: true,
      gender: true,
      ageRange: true,
      needsIdentified: true,
      assistanceGiven: true,
      valueRating: true,
      userResponsible: true,
      provinceOrState: true,
    })
  )
  .handler(async ({ input, context }) => {
    // your create code here
    const cReport = await db
      .insert(assistanceRecords)
      .values({
        institutionName: input.institutionName,
        institutionType: input.institutionType,
        contactPerson: input.contactPerson,
        emailAddress: input.emailAddress,
        phoneNumber: input.phoneNumber,
        disability: input.disability,
        geoType: input.geoType,
      })
      .returning();

    return cReport;
  });

export const getAllReports = os.handler(async () => {
  const getdata = await db.select().from(assistanceRecords);

  return getdata;
});

export const router = {
  reports: {
    create: createReport,
    getall: getAllReports,
  },
};
