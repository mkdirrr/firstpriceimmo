'use client';

import { useEffect, useState } from 'react';
import AdminPropertyForm from '@/components/AdminPropertyForm';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

type Property = {
  id: string;
  title: string;
  description: string;
  category: string;
  transactionType: string;
  price: number;
  status: string;
  imageUrls?: string[];
};

export default function AdminPropertyEditPage({ params }: { params: { id: string } }) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProperty() {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`${API_BASE}/api/properties/${params.id}`);

        if (!response.ok) {
          setError('Property not found.');
          return;
        }

        const data = await response.json();
        setProperty(data);
      } catch {
        setError('Unable to load property details.');
      } finally {
        setLoading(false);
      }
    }

    loadProperty();
  }, [params.id]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {loading ? (
        <div className="card p-10 text-center text-brand-400">
          <svg className="animate-spin h-5 w-5 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading property details...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-10 text-center text-rose-700">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {error}
        </div>
      ) : property ? (
        <>
          <div>
            <p className="section-title">Edit Listing</p>
            <h1 className="mt-1 text-2xl font-bold text-brand-900">{property.title}</h1>
            <p className="mt-1 text-sm text-brand-500">Update the listing details and save changes.</p>
          </div>
          <AdminPropertyForm
            initialData={{
              id: property.id,
              title: property.title,
              description: property.description,
              category: property.category,
              transactionType: property.transactionType,
              imageUrls: property.imageUrls ?? [],
              status: property.status,
            }}
            onSaved={() => undefined}
          />
        </>
      ) : null}
    </div>
  );
}
