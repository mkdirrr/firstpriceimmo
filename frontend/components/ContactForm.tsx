'use client';

import { useState } from 'react';
import { submitContactLead } from '../lib/api';

export default function ContactForm({ propertyId }: { propertyId: string }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('idle');
    setError('');

    try {
      await submitContactLead({ name, email, phone, propertyId });
      setStatus('success');
      setName('');
      setEmail('');
      setPhone('');
    } catch (err) {
      setStatus('error');
      setError('Impossible d’envoyer le message. Veuillez réessayer plus tard.');
    }
  }

  return (
    <form className="card p-6 space-y-5" onSubmit={handleSubmit}>
      <div className="flex items-center gap-2 pb-2 border-b border-brand-100">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-50 text-gold-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        </div>
        <h2 className="text-base font-bold text-brand-900">Contacter l’Agence</h2>
      </div>

      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-500">Nom complet</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="John Doe"
          required
          className="mt-1.5 w-full"
        />
      </label>

      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-500">Adresse e-mail</span>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="john@example.com"
          required
          className="mt-1.5 w-full"
        />
      </label>

      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-500">Numéro de téléphone</span>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          type="tel"
          placeholder="+33 6 12 34 56 78"
          required
          className="mt-1.5 w-full"
        />
      </label>

      {status === 'success' && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 border border-emerald-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          Votre message a été envoyé avec succès !
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-800 border border-rose-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {error}
        </div>
      )}

      <button type="submit" className="btn-gold w-full">
        Envoyer le message
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
      </button>
    </form>
  );
}
