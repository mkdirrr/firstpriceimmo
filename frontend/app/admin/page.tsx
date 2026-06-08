'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { fetchDashboardStats, DashboardStats } from '@/lib/api';

function StatCard({
  title,
  value,
  icon,
  trend,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color: 'brand' | 'gold' | 'emerald' | 'rose';
}) {
  const colorMap = {
    brand: 'from-brand-700 to-brand-600',
    gold: 'from-gold-500 to-gold-400',
    emerald: 'from-emerald-600 to-emerald-500',
    rose: 'from-rose-500 to-rose-400',
  };
  const bgMap = {
    brand: 'bg-brand-50 text-brand-700',
    gold: 'bg-gold-50 text-gold-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    rose: 'bg-rose-50 text-rose-700',
  };

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bgMap[color]}`}>
          {icon}
        </div>
        {trend && (
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
            {trend}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-extrabold text-brand-900">{value}</p>
        <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-brand-400">{title}</p>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetchDashboardStats(token)
      .then((data) => setStats(data))
      .catch(() => setError('Impossible de charger les données du tableau de bord.'))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <p className="section-title">Vue d’ensemble</p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-brand-900">Tableau de bord</h1>
        <p className="mt-1 text-sm text-brand-500">Bienvenue ! Voici ce qui se passe dans votre agence.</p>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {error}
        </div>
      )}

      {/* Stats Grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="h-10 w-10 rounded-xl bg-brand-100" />
              <div className="mt-4 h-8 w-20 rounded-lg bg-brand-100" />
              <div className="mt-2 h-4 w-24 rounded bg-brand-50" />
            </div>
          ))}
        </div>
      ) : stats ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Propriétés totales"
            value={stats.totalProperties}
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}
            color="brand"
          />
          <StatCard
            title="Annonces actives"
            value={stats.activeProperties}
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
            trend="En ligne"
            color="emerald"
          />
          <StatCard
            title="Prospects totaux"
            value={stats.totalLeads}
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
            color="gold"
          />
          <StatCard
            title="Membres de l’équipe"
            value={stats.totalUsers}
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
            color="rose"
          />
        </div>
      ) : null}

      {/* Breakdown + Recent */}
      {stats && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Breakdown */}
          <div className="card p-6">
            <h3 className="text-sm font-bold text-brand-900 mb-4">Répartition des biens</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-brand-500">À vendre</span>
                  <span className="font-semibold text-brand-800">{stats.saleProperties}</span>
                </div>
                <div className="h-2 rounded-full bg-brand-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand-600 transition-all"
                    style={{ width: `${stats.totalProperties ? (stats.saleProperties / stats.totalProperties) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-brand-500">À louer</span>
                  <span className="font-semibold text-brand-800">{stats.rentProperties}</span>
                </div>
                <div className="h-2 rounded-full bg-brand-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gold-400 transition-all"
                    style={{ width: `${stats.totalProperties ? (stats.rentProperties / stats.totalProperties) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-brand-500">Inactifs</span>
                  <span className="font-semibold text-brand-800">{stats.totalProperties - stats.activeProperties}</span>
                </div>
                <div className="h-2 rounded-full bg-brand-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand-300 transition-all"
                    style={{ width: `${stats.totalProperties ? ((stats.totalProperties - stats.activeProperties) / stats.totalProperties) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Properties */}
          <div className="card p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-brand-900">Biens récents</h3>
              <Link href="/admin/properties" className="text-xs font-semibold text-gold-600 hover:text-gold-700">
                Voir tout →
              </Link>
            </div>
            <div className="space-y-3">
              {stats.recentProperties.length === 0 ? (
                <p className="text-sm text-brand-400">Aucun bien pour le moment.</p>
              ) : (
                stats.recentProperties.map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded-xl bg-cream-100 px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-brand-900 truncate">{p.title}</p>
                      <p className="text-xs text-brand-400">{p.category} • {p.status}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recent Leads */}
      {stats && stats.recentLeads.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-brand-900">Prospects récents</h3>
            <Link href="/admin/leads" className="text-xs font-semibold text-gold-600 hover:text-gold-700">
              Voir tout →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-brand-100">
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-brand-400">Nom</th>
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-brand-400">Propriété</th>
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-brand-400">Date</th>
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-brand-400">Téléphone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-50">
                {stats.recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-cream-100/50 transition-colors">
                    <td className="py-3 text-sm font-medium text-brand-900">{lead.name}</td>
                    <td className="py-3 text-sm text-brand-500">{lead.property?.title ?? lead.propertyId}</td>
                    <td className="py-3 text-sm text-brand-400 whitespace-nowrap">{new Date(lead.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 text-sm text-brand-500 max-w-xs truncate">{lead.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
