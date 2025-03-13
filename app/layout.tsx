/*
 * @Description: 
 * @Date: 2025-03-13 10:57:54
 * @LastEditTime: 2025-03-13 17:15:24
 */
import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers/Providers';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
let googlkey: any = process.env.NEXT_PUBLIC_KEY
export const metadata: Metadata = {
  title: 'AeroNyx Web3 Platform',
  description: 'Deploy nodes, stake tokens, and earn rewards on the SOON network',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <script src={`https://maps.googleapis.com/maps/api/js?key=${googlkey}&language=en`}></script>
      </head>
      <body className={`${inter.variable} font-sans bg-background text-foreground`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
