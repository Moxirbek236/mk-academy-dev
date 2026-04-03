import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';

// Fix Node 25 experimental localStorage issue
if (typeof window === 'undefined') {
  // @ts-ignore
  delete global.localStorage;
  // @ts-ignore
  delete global.sessionStorage;
}

export const metadata: Metadata = {
  title: 'MK Academy - CEFR Platform',
  description: 'Learn vocabulary and complete tasks',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MK Academy',
  },
};

export const viewport: Viewport = {
  themeColor: '#3D855A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning>
        <div className="min-h-screen bg-[#242424] flex justify-center text-gray-900 font-sans">
          <div className="w-full max-w-md min-h-screen bg-[#F4F7F5] relative shadow-2xl overflow-hidden pb-24 border-x border-[#333] flex flex-col">
            <Header />
            
            <div className="bg-[#F4F7F5] rounded-t-[32px] -mt-10 px-5 pt-8 z-10 relative flex-1 pb-24 shadow-[0_-8px_20px_rgba(0,0,0,0.02)] overflow-y-auto">
              {children}
            </div>

            <BottomNav />
          </div>
        </div>
      </body>
    </html>
  );
}
