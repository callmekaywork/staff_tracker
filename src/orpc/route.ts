import { z } from 'zod';
import { db } from '@/db';
import { assistanceRecords } from '@/db/schema';
import type { IncomingHttpHeaders } from 'node:http';
import { ORPCError, os } from '@orpc/server';
import { assistanceRecordSchema } from '@/db/validators';
import { eq } from 'drizzle-orm';

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

export const deleteReport = os
  .$context<{ headers: IncomingHttpHeaders }>()
  .input(z.object({ id: z.number() }))
  .handler(async ({ input, context }) => {
    // Perform delete
    console.log(input.id);
    const deleted = await db
      .delete(assistanceRecords)
      .where(eq(assistanceRecords.id, input.id))
      .returning(); // optional: return the deleted row(s)
    // Return a simple success object or the deleted record
    return { success: deleted.length > 0, deleted };
  });

export const getAllReports = os.handler(async () => {
  const getdata = await db.select().from(assistanceRecords);

  return getdata;
});

export const router = {
  reports: {
    create: createReport,
    delete: deleteReport,
    getall: getAllReports,
  },
};
