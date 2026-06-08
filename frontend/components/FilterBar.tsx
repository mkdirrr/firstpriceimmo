'use client';

import { useMemo } from 'react';

type FilterBarProps = {
  category: string;
  transactionType: string;
  onChange: (filters: { category: string; transactionType: string }) => void;
};

export default function FilterBar({ category, transactionType, onChange }: FilterBarProps) {
  const categories = useMemo(() => ['ALL', 'HOUSES', 'VILLAS', 'TERRAIN'], []);
  const types = useMemo(() => ['ALL', 'SALE', 'RENT'], []);

  return (
    <div className="card p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-2 text-brand-800">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
          <span className="text-sm font-semibold">Filtrer les annonces</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-500">Catégorie</span>
            <select
              value={category}
              onChange={(event) => onChange({ category: event.target.value, transactionType })}
              className="mt-1.5 w-full"
            >
              {categories.map((item) => (
                <option key={item} value={item === 'ALL' ? '' : item}>
                  {item === 'ALL' ? 'Toutes catégories' : item === 'HOUSES' ? 'Maisons' : item === 'VILLAS' ? 'Villas' : 'Terrains'}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-500">Transaction</span>
            <select
              value={transactionType}
              onChange={(event) => onChange({ category, transactionType: event.target.value })}
              className="mt-1.5 w-full"
            >
              {types.map((item) => (
                <option key={item} value={item === 'ALL' ? '' : item}>
                  {item === 'ALL' ? 'Tous types' : item === 'SALE' ? 'À vendre' : 'À louer'}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}
