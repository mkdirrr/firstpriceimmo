import '../styles/globals.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import type { ReactNode } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Providers from '../components/Providers';

export const metadata = {
  title: 'First Price Immo | Agence Immobilière Premium',
  description: 'Découvrez des maisons de luxe, des villas et des terrains d\'investissement premium. Votre partenaire de confiance pour trouver la propriété idéale.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-cream-50 text-brand-900 antialiased">
        <Providers>
          <Navbar />
          <main className="min-h-[calc(100vh-4rem)] pt-24">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
