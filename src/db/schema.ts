import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  numeric,
  primaryKey,
  foreignKey,
  unique,
  check,
  boolean,
  uuid,
} from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';
import type { AdapterAccountType } from 'next-auth/adapters';
import { sql } from 'drizzle-orm';

const id = nanoid(50);

export const users = pgTable('users', {
  id: text('uID')
    .primaryKey()
    .$defaultFn(() => id)
    .unique(),
  firstname: text('firstname'),
  lastname: text('lastname'),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role')
    .$type<'admin' | 'staff' | 'user'>()
    .notNull()
    .default('staff'),
  image: text('image'),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
});

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
);

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { withTimezone: true }).notNull(),
});

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ]
);

export const authenticators = pgTable(
  'authenticator',
  {
    credentialID: text('credentialID').notNull().unique(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    providerAccountId: text('providerAccountId').notNull(),
    credentialPublicKey: text('credentialPublicKey').notNull(),
    counter: integer('counter').notNull(),
    credentialDeviceType: text('credentialDeviceType').notNull(),
    credentialBackedUp: boolean('credentialBackedUp').notNull(),
    transports: text('transports'),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ]
);

export const assistanceRecords = pgTable('assistance_records', {
  id: serial('id').primaryKey(),

  institutionName: varchar('institution_name', { length: 255 }).notNull(),
  institutionType: varchar('institution_type', { length: 100 }).notNull(),

  contactPerson: varchar('contact_person', { length: 255 }),
  emailAddress: varchar('email_address', { length: 255 }),
  phoneNumber: varchar('phone_number', { length: 50 }),

  beneficiaryName: varchar('beneficiary_name', { length: 255 }),
  disability: boolean('disability').default(false),
  disabilityType: varchar('disability_type', { length: 255 }),

  race: varchar('race', { length: 100 }),
  gender: varchar('gender', { length: 50 }),
  geoType: varchar('geo_type', { length: 50 }), // "urban" or "rural"
  ageRange: varchar('age_range', { length: 50 }),

  needsIdentified: text('needs_identified'),
  assistanceGiven: text('assistance_given'),
  valueRating: integer('value_rating'), // e.g. 1–10 scale

  dateAssisted: timestamp('date_assisted'),
  userResponsible: varchar('user_responsible', { length: 255 }),
  provinceOrState: varchar('province_state', { length: 100 }),

  createdAt: timestamp('created_at').defaultNow(),
});
