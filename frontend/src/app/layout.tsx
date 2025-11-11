'use client';

import React from 'react';
import { AuthProvider } from '@/providers/AuthProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Supercar Finance - Instant Pre-Approvals</title>
        <meta
          name="description"
          content="Get pre-approved for exotic car financing in 60 seconds with multiple lender options."
        />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
