import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-brand-100 bg-white">
      <div className="page-container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center">
              <img src="/logo.svg" alt="First Price Immo" className="h-24 w-auto -ml-2" />
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-brand-500">
              Votre partenaire de confiance pour trouver des propriétés premium. Nous connectons les rêves aux adresses.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-900">Explorer</h4>
            <ul className="mt-4 space-y-2.5">
              <li><Link href="/" className="text-sm text-brand-500 hover:text-brand-800 transition-colors">Toutes les annonces</Link></li>
              <li><Link href="/" className="text-sm text-brand-500 hover:text-brand-800 transition-colors">Maisons à vendre</Link></li>
              <li><Link href="/" className="text-sm text-brand-500 hover:text-brand-800 transition-colors">Villas à louer</Link></li>
              <li><Link href="/" className="text-sm text-brand-500 hover:text-brand-800 transition-colors">Terrains</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-900">Société</h4>
            <ul className="mt-4 space-y-2.5">
              <li><span className="text-sm text-brand-500">À propos</span></li>
              <li><span className="text-sm text-brand-500">Notre équipe</span></li>
              <li><span className="text-sm text-brand-500">Carrières</span></li>
              <li><span className="text-sm text-brand-500">Contact</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-900">Nous contacter</h4>
            <ul className="mt-4 space-y-2.5">
              <li className="flex items-center gap-2 text-sm text-brand-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                hello@firstpriceimmo.com
              </li>
              <li className="flex items-center gap-2 text-sm text-brand-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2 text-sm text-brand-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                123 Luxury Ave, Suite 100
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-brand-100 pt-8 sm:flex-row">
          <p className="text-xs text-brand-400">
            © {new Date().getFullYear()} First Price Immo. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-brand-400 hover:text-brand-600 cursor-pointer transition-colors">Politique de confidentialité</span>
            <span className="text-xs text-brand-400 hover:text-brand-600 cursor-pointer transition-colors">Conditions d’utilisation</span>
            <Link href="/admin/login" className="text-xs text-brand-400 hover:text-brand-600 transition-colors">Portail Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
