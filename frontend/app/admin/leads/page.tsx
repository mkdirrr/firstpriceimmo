'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { updateLeadStatus, deleteLead } from '@/lib/api';

type ContactLead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  notes: string | null;
  propertyId: string;
  createdAt: string;
  property?: {
    id: string;
    title?: string;
  };
};

export default function AdminLeadsPage() {
  const { token } = useAuth();
  const [leads, setLeads] = useState<ContactLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    if (!token) return;
    try {
      await updateLeadStatus(id, { status: newStatus }, token);
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
    } catch (err: any) {
      alert(err.message || 'Impossible de mettre à jour le statut.');
    }
  };

  const handleUpdateNotes = async (id: string, newNotes: string) => {
    if (!token) return;
    try {
      await updateLeadStatus(id, { notes: newNotes }, token);
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, notes: newNotes } : l)));
    } catch (err: any) {
      alert(err.message || 'Impossible de mettre à jour les notes.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce prospect ?')) return;
    try {
      await deleteLead(id, token);
      setLeads((prev) => prev.filter((l) => l.id !== id));
    } catch (err: any) {
      alert(err.message || 'Impossible de supprimer ce prospect.');
    }
  };

  useEffect(() => {
    if (!token) {
      setError('Token admin introuvable. Veuillez vous connecter.');
      setLoading(false);
      return;
    }

    const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

    fetch(`${API_BASE}/contacts`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        if (!response.ok) {
          const data = await response.json().catch(() => null);
          throw new Error(data?.error || 'Impossible de charger les prospects');
        }
        return response.json();
      })
      .then((data: ContactLead[]) => setLeads(data))
      .catch((err) => setError(err.message || 'Impossible de charger les données.'))
      .finally(() => setLoading(false));
  }, [token]);

  const filtered = leads.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.email.toLowerCase().includes(search.toLowerCase()) ||
    (l.property?.title || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="section-title">Demandes</p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-brand-900">Prospects clients</h1>
          <p className="mt-1 text-sm text-brand-500">Gérez votre CRM et le cycle de vie de chaque client.</p>
        </div>
        <span className="rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-700 self-start">
          {leads.length} total
        </span>
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, email ou propriété..."
            className="w-full pl-9"
          />
        </div>
      </div>

      {/* Grid view instead of table for better CRM feel */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <div className="col-span-full p-10 text-center text-brand-400">Chargement des prospects…</div>
        ) : error ? (
          <div className="col-span-full p-10 text-center text-rose-700 bg-rose-50 rounded-xl">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full p-10 text-center">Aucun résultat.</div>
        ) : (
          filtered.map((lead) => (
            <div key={lead.id} className="card p-5 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-brand-900">{lead.name}</h3>
                  <a href={`mailto:${lead.email}`} className="text-sm text-gold-600 hover:underline block">{lead.email}</a>
                  <p className="text-sm text-brand-500">{lead.phone}</p>
                </div>
                <button
                  onClick={() => handleDelete(lead.id)}
                  className="text-rose-400 hover:text-rose-600"
                  title="Supprimer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </div>

              <div className="bg-cream-100 p-3 rounded-lg text-sm">
                <p className="font-semibold text-brand-700 mb-1">Propriété d'intérêt :</p>
                {lead.property?.title ? (
                  <a href={`/property/${lead.propertyId}`} target="_blank" rel="noopener noreferrer" className="text-brand-900 hover:underline font-medium">
                    {lead.property.title}
                  </a>
                ) : (
                  <span className="text-brand-400">Inconnue</span>
                )}
                <p className="text-xs text-brand-400 mt-2">Créé le {new Date(lead.createdAt).toLocaleDateString()}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-500 mb-1">Statut du lead</label>
                <select
                  value={lead.status}
                  onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                  className="w-full text-sm py-1.5"
                >
                  <option value="PENDING">Nouveau (En attente)</option>
                  <option value="IN_PROGRESS">En cours (Contacté)</option>
                  <option value="COMPLETED">Traité (Conclu)</option>
                  <option value="LOST">Perdu</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-500 mb-1">Notes internes</label>
                <textarea
                  className="w-full text-sm"
                  rows={3}
                  placeholder="Ajouter des notes..."
                  defaultValue={lead.notes || ''}
                  onBlur={(e) => {
                    if (e.target.value !== (lead.notes || '')) {
                      handleUpdateNotes(lead.id, e.target.value);
                    }
                  }}
                />
                <p className="text-[10px] text-brand-400 mt-1">Sauvegardé automatiquement.</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
