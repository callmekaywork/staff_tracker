// import { email } from './../node_modules/zod/src/v4/core/regexes';

import NextAuth, { DefaultSession } from 'next-auth';

type UserRole = 'admin' | 'staff';

type UserData = {
  id: string;
  email: string;
  role?: string;
  firstname?: string | null;
  lastname?: string | null;
  image?: string | null;
};

declare module '@auth/core/types' {
  interface AdapterUser {
    id: number;
    firstname?: string | null;
    lastname?: string | null;
    email: string;
    role?: string;
  }
}

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    role?: string;
    firstname?: string | null;
    lastname?: string | null;
    image?: string | null;
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id: string;
    role: string;
  }
}

declare module 'next-auth' {
  interface User {
    role?: string;
  }

  interface Session {
    user: {
      id: string;
      role?: string;
    } & DefaultSession['user'];
  }
}

type AdapterSession = {
  sessionToken: string;
  userId: string;
  expires: Date;
};

type AssistanceRecord = z.infer<typeof assistanceRecordSchema>;
