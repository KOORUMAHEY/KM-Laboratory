import type { Metadata } from 'next';
import './globals.css';
import { AdminProvider } from '@/contexts/admin-provider';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/header';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: "KM's Laboratory",
  description: 'A portal to monitor and manage lab statuses.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Playfair+Display:wght@700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased min-h-screen bg-background text-foreground')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AdminProvider>
            <div className="relative min-h-screen flex flex-col">
              {/* Background glitch */}
              <div className="fixed inset-0 z-0"></div>

              {/* Foreground content */}
              <div className="relative z-10 flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">
                  {children}
                </main>
              </div>
            </div>
            <Toaster />
          </AdminProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
