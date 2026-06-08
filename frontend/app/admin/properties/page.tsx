'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminPropertyForm from '@/components/AdminPropertyForm';
import { fetchProperties, deleteProperty } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

type Property = {
  id: string;
  title: string;
  category: string;
  transactionType: string;
  price: number;
  status: string;
  createdAt?: string;
};

export default function AdminPropertiesPage() {
  const { token } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [error, setError] = useState('');
  const [isLoadingProperties, setIsLoadingProperties] = useState(true);
  const [search, setSearch] = useState('');

  async function loadProperties() {
    setIsLoadingProperties(true);
    setError('');
    try {
      const data = await fetchProperties();
      setProperties(data);
    } catch (err) {
      setError('Impossible de charger les propriétés.');
    } finally {
      setIsLoadingProperties(false);
    }
  }

  useEffect(() => {
    loadProperties();
  }, []);

  async function handleDelete(id: string) {
    if (!token) {
      setError('Admin token unavailable. Please login again.');
      return;
    }
    if (!confirm('Supprimer ce bien ? Cette action est irréversible.')) return;
    try {
      await deleteProperty(id, token);
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError('Impossible de supprimer ce bien.');
    }
  }

  const filtered = properties.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const statusBadge = (status: string) => {
    if (status === 'ACTIVE') return <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">Actif</span>;
    return <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-600 border border-brand-200">Inactif</span>;
  };

  const typeBadge = (type: string) => {
    if (type === 'SALE') return <span className="text-xs font-semibold text-brand-700">À vendre</span>;
    return <span className="text-xs font-semibold text-gold-600">À louer</span>;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="section-title">Inventaire</p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-brand-900">Annonces immobilières</h1>
          <p className="mt-1 text-sm text-brand-500">Gérez toutes vos annonces en un seul endroit.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-700">
            {properties.length} total
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* List */}
        <div className="space-y-4">
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher des propriétés..."
                  className="w-full pl-9"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          <div className="card overflow-hidden">
            {isLoadingProperties ? (
              <div className="p-8 text-center text-brand-400">
                <svg className="animate-spin h-5 w-5 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Chargement des propriétés…
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3 text-brand-300"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                <p className="text-brand-500 font-medium">{search ? 'Aucun résultat.' : 'Aucun bien pour le moment.'}</p>
                <p className="text-sm text-brand-400 mt-1">{search ? 'Essayez un autre terme.' : 'Ajoutez votre premier bien via le formulaire.'}</p>
              </div>
            ) : (
              <div className="divide-y divide-brand-50">
                {filtered.map((property) => (
                  <div key={property.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between hover:bg-cream-100/50 transition-colors">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-brand-900">{property.title}</h3>
                        {statusBadge(property.status)}
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-brand-400">
                        <span>{property.category}</span>
                        <span>•</span>
                        {typeBadge(property.transactionType)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/admin/properties/${property.id}`}
                        className="inline-flex items-center gap-1 rounded-lg bg-brand-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-900 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Modifier
                      </Link>
                      <button
                        onClick={() => handleDelete(property.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Form */}
        <div>
          <AdminPropertyForm onSaved={loadProperties} />
        </div>
      </div>
    </div>
  );
}
