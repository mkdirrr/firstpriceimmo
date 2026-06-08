'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchUsers } from '@/lib/api';

type UserItem = {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  propertyCount: number;
};

export default function AdminUsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Token admin introuvable. Veuillez vous connecter.');
      setLoading(false);
      return;
    }

    fetchUsers(token)
      .then((data: any) => setUsers(data))
      .catch((err) => setError(err.message || 'Impossible de charger les membres.'))
      .finally(() => setLoading(false));
  }, [token]);

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const roleBadge = (role: string) => {
    if (role === 'ADMIN') return <span className="inline-flex items-center rounded-full bg-brand-800 px-2.5 py-0.5 text-xs font-semibold text-white">Admin</span>;
    return <span className="inline-flex items-center rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-semibold text-brand-600">Utilisateur</span>;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="section-title">Équipe</p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-brand-900">Employés</h1>
          <p className="mt-1 text-sm text-brand-500">Gérez les membres de votre équipe et suivez leur activité.</p>
        </div>
        <span className="rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-700 self-start">
          {users.length} membres
        </span>
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom ou email..."
            className="w-full pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-brand-400">
            <svg className="animate-spin h-5 w-5 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Chargement de l’équipe…
          </div>
        ) : error ? (
          <div className="p-10 text-center text-rose-700 bg-rose-50">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3 text-brand-300"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <p className="text-brand-500 font-medium">{search ? 'Aucun résultat.' : 'Aucun membre trouvé.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-cream-100">
                <tr>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-brand-500">Membre</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-brand-500">Rôle</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-brand-500">Propriétés</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-brand-500">Inscription</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-50">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-cream-100/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-400 text-white text-sm font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-brand-900">{user.name}</p>
                          <p className="text-xs text-brand-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">{roleBadge(user.role)}</td>
                    <td className="px-5 py-3.5 text-sm text-brand-700 font-semibold">{user.propertyCount}</td>
                    <td className="px-5 py-3.5 text-sm text-brand-400 whitespace-nowrap">{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
