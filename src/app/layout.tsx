import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';

import { ThemeProvider } from '@/components/theme-provider';
import { SessionProvider } from 'next-auth/react';

const dmSans = DM_Sans({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Staff Tracker',
  description: 'made by a third party',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.className} antialiased`}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
