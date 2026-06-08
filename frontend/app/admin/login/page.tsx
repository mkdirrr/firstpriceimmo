'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdmin } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    ),
    title: 'Annonces immobilières',
    desc: 'Ajoutez, modifiez et gérez toutes les annonces. Téléchargez des images, fixez les prix et contrôlez la disponibilité.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    ),
    title: 'Gestion des prospects',
    desc: 'Suivez et répondez aux demandes de clients. Consultez les contacts liés à des biens spécifiques.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>
    ),
    title: 'Tableau de bord analytique',
    desc: 'Obtenez des statistiques en temps réel sur les biens, les annonces actives, les prospects reçus et les performances de l’équipe.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    ),
    title: 'Annuaire de l’équipe',
    desc: 'Gérez employés et agents. Voyez qui a ajouté quels biens et surveillez l’activité de l’équipe.',
  },
];

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const data = await loginAdmin({ email, password });
      login(data.token, data.user);
      router.push('/admin');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Connexion échouée. Veuillez réessayer.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-full flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl grid gap-8 lg:grid-cols-2 lg:gap-12 items-start">
        {/* LEFT — Login Form */}
        <div className="order-2 lg:order-1">
          {/* Sign in to enter badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold-200 bg-gold-50 px-4 py-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold-600"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span className="text-xs font-bold uppercase tracking-wider text-gold-700">Connexion requise</span>
          </div>

          {/* Logo */}
          <div className="mb-6 text-center lg:text-left">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-800 to-brand-600 text-white mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <p className="text-xs uppercase tracking-[0.35em] text-brand-500 font-semibold">Portail Admin</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-brand-900">Se connecter au tableau de bord</h1>
            <p className="mt-2 text-sm text-brand-500">
              Entrez vos identifiants pour accéder aux outils de gestion.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          <form className="card p-6 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-500 mb-1.5">Adresse e-mail</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@firstpriceimmo.com"
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-500 mb-1.5">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
                className="w-full"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full disabled:opacity-60"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                   Connexion en cours…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Se connecter
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                </span>
              )}
            </button>
          </form>

          <p className="mt-6 text-center lg:text-left text-xs text-brand-400">
            <a href="/" className="hover:text-brand-600 transition-colors">← Retour au site</a>
          </p>
        </div>

        {/* RIGHT — Info Panel */}
        <div className="order-1 lg:order-2">
          <div className="card p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-50 text-gold-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              </div>
              <h2 className="text-base font-bold text-brand-900">Ce que vous pouvez faire</h2>
            </div>

            <div className="space-y-5">
              {features.map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 mt-0.5">
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-brand-900">{f.title}</h3>
                    <p className="mt-0.5 text-xs leading-relaxed text-brand-500">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* How to Add Properties */}
            <div className="mt-6 rounded-xl bg-brand-800 p-5 text-white">
              <div className="flex items-center gap-2 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                <h3 className="text-sm font-bold">Comment ajouter un bien</h3>
              </div>
              <ol className="space-y-2 text-xs text-brand-200 list-decimal list-inside">
                <li>Connectez-vous avec vos identifiants admin.</li>
                <li>Allez dans <strong className="text-white">Propriétés</strong> dans la barre latérale.</li>
                <li>Remplissez le formulaire <strong className="text-white">Ajouter une propriété</strong>.</li>
                <li>Téléchargez des images, fixez le prix, la catégorie et le type de transaction.</li>
                <li>Cliquez sur <strong className="text-white">Créer la propriété</strong> — elle est publiée instantanément.</li>
              </ol>
            </div>

            {/* Quick Tips */}
            <div className="mt-4 rounded-xl border border-brand-100 bg-cream-100 p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold-500"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-700">Astuces rapides</h3>
              </div>
              <ul className="space-y-1.5 text-xs text-brand-500">
                <li className="flex items-start gap-2">
                  <span className="text-gold-500 mt-0.5">•</span>
                  Passez un bien en <strong className="text-brand-700">Inactif</strong> pour le masquer du site sans le supprimer.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold-500 mt-0.5">•</span>
                  Les nouveaux prospects apparaissent en temps réel sur la page <strong className="text-brand-700">Prospects</strong> avec les coordonnées du client.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold-500 mt-0.5">•</span>
                  Vous pouvez télécharger jusqu’à <strong className="text-brand-700">6 images</strong> par annonce.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
