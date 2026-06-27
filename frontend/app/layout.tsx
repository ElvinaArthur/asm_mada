import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import '../src/styles/globals.css';
import { Providers } from '@/components/Providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins'
});

export const metadata: Metadata = {
  title: 'ASM Alumni - Association des Sociologues Malagasy',
  description: "Plateforme officielle de l'Association des Sociologues Malagasy",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${poppins.variable}`}>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
