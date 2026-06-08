'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchTransactions, createTransaction, updateTransaction, deleteTransaction } from '@/lib/api';

type Transaction = {
  id: string;
  propertyId: string;
  amount: number;
  status: string;
  closingDate: string | null;
  agent: { id: string; name: string };
  property?: { id: string; title: string };
};

export default function AdminTransactionsPage() {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Basic form state for creating a new transaction (could be expanded)
  const [newPropId, setNewPropId] = useState('');
  const [newAmount, setNewAmount] = useState('');

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await fetchTransactions(token);
      setTransactions(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des transactions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      await createTransaction({ propertyId: newPropId, amount: Number(newAmount) }, token);
      setNewPropId('');
      setNewAmount('');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Impossible de créer la transaction');
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    if (!token) return;
    try {
      await updateTransaction(id, { status }, token);
      setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    } catch (err: any) {
      alert(err.message || 'Erreur de mise à jour');
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (!confirm('Supprimer cette transaction ?')) return;
    try {
      await deleteTransaction(id, token);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la suppression');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="section-title">Opérations</p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-brand-900">Suivi des Transactions</h1>
          <p className="mt-1 text-sm text-brand-500">Supervisez l'état d'avancement des ventes et des locations.</p>
        </div>
      </div>

      <div className="card p-6 bg-cream-50 border-gold-200">
        <h3 className="text-sm font-bold text-brand-900 mb-3">Nouvelle transaction</h3>
        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="ID de la propriété"
            value={newPropId}
            onChange={(e) => setNewPropId(e.target.value)}
            className="flex-1"
            required
          />
          <input
            type="number"
            placeholder="Montant (€)"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            className="flex-1"
            required
          />
          <button type="submit" className="btn-primary">Ajouter</button>
        </form>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-brand-400">Chargement…</div>
        ) : error ? (
          <div className="p-10 text-center text-rose-700 bg-rose-50">{error}</div>
        ) : transactions.length === 0 ? (
          <div className="p-10 text-center text-brand-500">Aucune transaction trouvée.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-cream-100">
                <tr>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-brand-500">Propriété</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-brand-500">Montant</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-brand-500">Agent</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-brand-500">Statut</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-brand-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-50">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-cream-100/50">
                    <td className="px-5 py-3.5 text-sm font-semibold text-brand-900">
                      {t.property?.title || <span className="text-brand-300">{t.propertyId.slice(0, 8)}</span>}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gold-700 font-bold">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(t.amount)}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-brand-500">{t.agent.name}</td>
                    <td className="px-5 py-3.5 text-sm">
                      <select
                        value={t.status}
                        onChange={(e) => handleUpdateStatus(t.id, e.target.value)}
                        className="text-xs py-1 px-2 rounded border-brand-200"
                      >
                        <option value="PENDING">En attente</option>
                        <option value="UNDER_CONTRACT">Sous contrat</option>
                        <option value="CLOSED">Conclu</option>
                        <option value="CANCELLED">Annulé</option>
                      </select>
                    </td>
                    <td className="px-5 py-3.5 text-sm">
                      <button onClick={() => handleDelete(t.id)} className="text-rose-400 hover:text-rose-600">Supprimer</button>
                    </td>
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
