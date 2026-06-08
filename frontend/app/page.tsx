'use client';

import { useEffect, useState } from 'react';
import FilterBar from '../components/FilterBar';
import PropertyCard from '../components/PropertyCard';
import { fetchProperties, PropertyFilter } from '../lib/api';

export default function HomePage() {
  const [filters, setFilters] = useState<PropertyFilter>({ category: '', transactionType: '' });
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    fetchProperties(filters)
      .then((data) => setProperties(data))
      .catch(() => setError('Impossible de charger les annonces.'))
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white">
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        <div className="relative page-container py-20 sm:py-28">
          <div className="max-w-3xl animate-slide-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold-300 backdrop-blur-sm mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400 animate-pulse" />
              Marché Immobilier Premium
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-[1.1]">
              Trouvez Votre Maison ou Investissement <span className="text-gold-400">Idéal</span>.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-brand-200">
              Parcourez notre sélection de maisons de luxe, villas splendides et terrains premium.
              Que vous achetiez ou louiez, nous simplifions votre parcours immobilier.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#listings" className="btn-gold">
                Voir les annonces
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
              <a href="#listings" className="inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-800/50 px-6 py-3 text-sm font-semibold text-brand-100 backdrop-blur-sm transition-all hover:bg-brand-700/50">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                Rechercher des biens
              </a>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: 'Propriétés', value: '500+', icon: <i className="bi bi-house"></i> },
              { label: 'Clients satisfaits', value: '1 200+', icon: <i className="bi bi-emoji-smile"></i> },
              { label: 'Villes', value: '25+', icon: <i className="bi bi-building"></i> },
              { label: 'Expérience', value: '15 ans', icon: <i className="bi bi-star"></i> },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-brand-400/20 bg-brand-800/30 p-4 backdrop-blur-sm">
                <div className="text-2xl">{stat.icon}</div>
                <div className="mt-2 text-xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-brand-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Listings Section */}
      <section id="listings" className="page-container py-14 sm:py-20">
        <div className="mb-10">
          <p className="section-title">Explorer</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-brand-900 sm:text-4xl">
            Annonces en vedette
          </h2>
          <p className="mt-3 max-w-2xl text-brand-500">
            Sélection de biens mise à jour quotidiennement. Utilisez les filtres ci-dessous pour trouver exactement ce que vous cherchez.
          </p>
        </div>

        <div className="space-y-6">
          <FilterBar
            category={filters.category ?? ''}
            transactionType={filters.transactionType ?? ''}
            onChange={(next) => setFilters((prev) => ({ ...prev, ...next }))}
          />

          {loading ? (
            <div className="card p-12 text-center">
              <div className="inline-flex items-center gap-3 text-brand-500">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Chargement des biens en cours…
              </div>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-10 text-center text-rose-700 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-brand-500">
                  Affichage de <span className="font-semibold text-brand-800">{properties.length}</span> bien(s)
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
              {properties.length === 0 && (
                <div className="card p-12 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-brand-300"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  <p className="text-brand-500 font-medium">Aucun bien ne correspond à vos filtres.</p>
                  <p className="text-sm text-brand-400 mt-1">Essayez d’ajuster vos critères de recherche.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="page-container pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-800 to-brand-700 px-8 py-14 text-center text-white sm:px-16">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold-400/20 blur-3xl" />
          <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-brand-400/20 blur-3xl" />
          <div className="relative">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Vous ne trouvez pas ce que vous cherchez ?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-brand-200">
              Nos agents ont accès à des biens hors marché et peuvent vous aider à trouver la propriété parfaite correspondant exactement à vos besoins.
            </p>
            <div className="mt-8">
              <a href="mailto:hello@firstpriceimmo.com" className="btn-gold">
                Contacter un agent
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
