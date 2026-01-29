import { z } from 'zod';

export const assistanceRecordSchema = z.object({
  institutionName: z.string().min(1).max(255),
  institutionType: z.string().min(1).max(100),

  contactPerson: z.string().max(255).optional(),
  emailAddress: z.string().email().max(255).optional(),
  phoneNumber: z.string().max(50).optional(),

  beneficiaryName: z.string().max(255).optional(),
  disability: z.boolean().default(false),
  disabilityType: z.string().max(255).optional(),

  race: z.string().max(100).optional(),
  gender: z.string().max(50).optional(),
  geoType: z.enum(['urban', 'rural']).optional(),
  ageRange: z.string().max(50).optional(),

  needsIdentified: z.string().optional(),
  assistanceGiven: z.string().optional(),
  valueRating: z.number().int().min(1).max(10).optional(),

  dateAssisted: z.coerce.date().optional(), // coerce allows strings to be parsed into Date
  userResponsible: z.string().max(255).optional(),
  provinceOrState: z.string().max(100).optional(),

  createdAt: z.coerce.date().default(() => new Date()),
});
