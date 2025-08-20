import type { Metadata } from 'next';
import './globals.css';
import { AdminProvider } from '@/contexts/admin-provider';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/header';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import VantaBackground from '@/components/VantaBackground';

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
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased min-h-screen bg-background')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AdminProvider>
            <div className="relative min-h-screen flex flex-col">
              {/* Background glitch */}
              <div className="fixed inset-0 z-0">
            

                {/* <VantaBackground
                  highlightColor={0xa7861e}
                  midtoneColor={0xff1f00}
                  lowlightColor={0x2d00ff}
                  baseColor={0xffebeb}
                  blurFactor={0.6}
                  speed={1}
                  zoom={1}
                  mouseControls={true}
                  touchControls={true}
                  gyroControls={false}
                  minHeight={200.0}
                  minWidth={200.0}
                /> */}
              </div>

              {/* Foreground content */}
              <div className="relative z-10 flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 container mx-auto px-4 py-8">
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
