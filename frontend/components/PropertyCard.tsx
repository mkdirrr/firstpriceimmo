import Link from 'next/link';

type PropertyCardProps = {
  property: {
    id: string;
    title: string;
    description: string;
    category: string;
    transactionType: string;
    price: number;
    imageUrls?: string[];
    status?: string;
  };
};

const categoryColors: Record<string, string> = {
  HOUSES: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  VILLAS: 'bg-gold-50 text-gold-700 border-gold-200',
  TERRAIN: 'bg-brand-50 text-brand-700 border-brand-200',
};

const typeColors: Record<string, string> = {
  SALE: 'bg-brand-800 text-white',
  RENT: 'bg-gold-500 text-white',
};

export default function PropertyCard({ property }: PropertyCardProps) {
  const image =
    property.imageUrls?.[0] ??
    'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80';

  const categoryClass = categoryColors[property.category] || 'bg-brand-50 text-brand-700 border-brand-200';
  const typeClass = typeColors[property.transactionType] || 'bg-brand-800 text-white';

  return (
    <article className="group card-hover overflow-hidden">
      <div className="relative h-60 overflow-hidden">
        <img
          src={image}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Badges */}
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur-sm ${categoryClass}`}>
            {property.category}
          </span>
        </div>
        <div className="absolute right-4 top-4">
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold tracking-wide shadow-sm ${typeClass}`}>
            {property.transactionType === 'SALE' ? 'À vendre' : 'À louer'}
          </span>
        </div>

        {property.status === 'INACTIVE' && (
          <div className="absolute inset-0 flex items-center justify-center bg-brand-900/60 backdrop-blur-[2px]">
            <span className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
              Inactif
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h2 className="text-lg font-bold leading-snug tracking-tight text-brand-900 line-clamp-2">
            {property.title}
          </h2>
        </div>

        <p className="mb-5 text-sm leading-relaxed text-brand-500 line-clamp-2">
          {property.description.length > 120 ? property.description.slice(0, 120) + '…' : property.description}
        </p>

        <div className="flex items-center justify-between gap-3">
          <Link
            href={`/property/${property.id}`}
            className="btn-primary text-xs px-5 py-2.5 group/btn"
          >
            Voir les détails
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:scale-110"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>

          <span className="text-xs text-brand-400 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Ajouté récemment
          </span>
        </div>
      </div>
    </article>
  );
}
