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

type ResponseType = {
  questionId: string;
  formId: string;
  value: string;
};

type QuestionsAnswerType = {
  value: string;
  questionId: string;
  type: string;
};

type AnswersType = {
  id: string;
  responseId: string;
  questionId: string;
  value: string;
};

type Answer = {
  id: string;
  questionId: string;
  value: string;
  label: string;
};

type ResponseAnswerType = {
  id: string;
  formId: string;
  submittedAt: Date | null;
  submittedBy: string | null;
  answers: Answer[];
};

// answers: {
//         id: string;
//         questionId: string;
//         value: string;
//         label: string;
//     }[];
//     id: string;
//     formId: string;
//     submittedAt: Date | null;
//     submittedBy: string | null;
// }[]
