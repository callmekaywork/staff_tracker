import { z } from 'zod';
import { db } from '@/db';
import {
  accounts,
  assistanceRecords,
  tasks,
  users,
  userStatus,
} from '@/db/schema';
import type { IncomingHttpHeaders } from 'node:http';
import { ORPCError, os } from '@orpc/server';
import { assistanceRecordSchema, checkLoginSchema } from '@/db/validators';
import { eq } from 'drizzle-orm';
import { signIn, signOut } from '@/auth';
import { auth } from '@/auth';

import { cookies } from 'next/headers';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// export const assistanceRouter = router({ getAll: publicProcedure.query(async () => { const records = await db.select().from(assistanceRecords); // Optionally validate with Zod before returning return records.map(r => assistanceRecordSchema.parse(r)); }),

// Auth
export const authLogin = os
  .$context<{ headers: IncomingHttpHeaders }>()
  .input(checkLoginSchema)
  .handler(async ({ input, context }) => {
    // Perform delete
    // try {
    //   const res = await signIn('credentials', {
    //     redirect: false,
    //     email: input.email,
    //     password: input.password,
    //   });
    //   if (res?.error) {
    //     throw new Error(res.error);
    //   }
    //   return res;
    //   // const res = await signIn('credentials', {
    //   //   redirect: false,
    //   //   email: input.email,
    //   //   password: input.password,
    //   //   // callbackUrl: "/dashboard",
    //   // });
    //   console.log('is it getting here', input);
    //   // if (session?.error) {
    //   //   // window.location.href = "/"; // ✅ triggers middleware with fresh cookies
    //   //   console.log('check errors');
    //   //   return { error: res.error };
    //   // }
    //   // return { success: true };
    // } catch (err) {
    //   return { error: `Unexpected error during sign-in.: ${err}` };
    // }
  });

export const authCheckemail = os
  .$context<{ headers: IncomingHttpHeaders }>()
  .input(z.object({ emailAddress: z.string() }))
  .handler(async ({ input, context }) => {
    // Perform delete
    const getdata = await db
      .select()
      .from(users)
      .where(eq(users.email, input.emailAddress));

    return getdata;
  });

export const authIsOnline = os.handler(async () => {
  const getdata = await db
    .select({
      userStatus, // all columns from userStatus
      user: users, // all columns from users, aliased as "user"
    })
    .from(userStatus)
    .innerJoin(users, eq(userStatus.userId, users.id)) // join condition
    .where(eq(userStatus.isOnline, true));

  return getdata;
});

// Reports

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
        beneficiaryName: input.beneficiaryName,
        geoType: input.geoType,
        dateAssisted: new Date(),
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
  return getdata.map((r) => ({
    ...r,
    dateAssisted: r.dateAssisted ? r.dateAssisted.toISOString() : null,
  }));
});

export const loginOutput = os
  .$context<{ headers: IncomingHttpHeaders }>()
  .input(LoginSchema)
  .handler(async ({ input }) => {
    const { email, password } = input;

    console.log(input);

    // 1. Validate user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
      .then((res) => res[0]);

    if (!user) throw new Error('Invalid credentials');

    // 2. Check accounts
    const check = await db
      .select()
      .from(accounts)
      .where(eq(accounts.userId, user.id))
      .limit(1);

    if (check.length > 0) {
      await db
        .update(accounts)
        .set({ session_state: 'updatedcredentials' })
        .where(eq(accounts.userId, user.id));
    } else {
      await db.insert(accounts).values({
        userId: user.id,
        type: 'email',
        provider: 'credentials',
        providerAccountId: user.id,
        session_state: 'newcredentials',
      });
    }

    // sign us in
    const checkSignIn = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (checkSignIn) {
      console.log('Sign in was successfull lets update the last login');

      await db.insert(userStatus).values({
        userId: user.id,
        company_position: user.role,
        loggedInAt: new Date(),
        isOnline: true,
      });
    }
    // 3. Return user object
    return {
      id: user.id,
      name: user.firstname,
      email: user.email,
      role: user.role,
    };
  });

export const whosLoggedIn = os.handler(async () => {
  // Example: get user + status by userId
  const result = await db
    .select({
      id: users.id,
      email: users.email,
      firstname: users.firstname,
      role: users.role,
      task_title: tasks.title,
      task_desc: tasks.description,
      task_started: tasks.startedAt,
      task_status: tasks.status,
      task_ended: tasks.endsAt,
      company_position: userStatus.company_position,
      loggedInAt: userStatus.loggedInAt,
      loggedOutAt: userStatus.loggedOutAt,
      isOnline: userStatus.isOnline,
    })
    .from(users)
    .leftJoin(userStatus, eq(users.id, userStatus.userId))
    .leftJoin(tasks, eq(users.id, tasks.userId))
    .where(eq(userStatus.isOnline, true));

  return result;
});

export const router = {
  auth: {
    email_check: authCheckemail,
    login: loginOutput,
    signout: os.handler(async () => {
      signOut();
    }),
  },
  reports: {
    create: createReport,
    delete: deleteReport,
    getall: getAllReports,
  },
  tasks: {
    whosonline: whosLoggedIn,
  },
  // server/auth.ts
};
function getServerSession(authOptions: any) {
  throw new Error('Function not implemented.');
}
