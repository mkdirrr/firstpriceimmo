import ContactForm from '../../../components/ContactForm';
import ImageGallery from '../../../components/ImageGallery';
import { fetchProperty } from '@/lib/api';

export default async function PropertyDetailsPage({ params }: { params: { id: string } }) {
  let property;
  try {
    property = await fetchProperty(params.id);
  } catch (error) {
    return (
      <div className="page-container py-20 text-center">
        <div className="mx-auto max-w-md">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <h1 className="text-3xl font-bold text-brand-900">Propriété introuvable</h1>
          <p className="mt-4 text-brand-500">Veuillez retourner à la liste des annonces et choisir un autre bien.</p>
          <a href="/" className="btn-primary mt-8 inline-flex">Retour aux annonces</a>
        </div>
      </div>
    );
  }
  const images = (property.imageUrls && property.imageUrls.length > 0) 
    ? property.imageUrls 
    : ['https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80'];

  const categoryColors: Record<string, string> = {
    HOUSES: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    VILLAS: 'bg-gold-50 text-gold-700 border-gold-200',
    TERRAIN: 'bg-brand-50 text-brand-700 border-brand-200',
  };

  return (
    <div className="page-container py-10">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-brand-400">
        <a href="/" className="hover:text-brand-700 transition-colors">Annonces</a>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        <span className="text-brand-600 font-medium">{property.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        {/* Main content */}
        <div className="space-y-6">
          {/* Image Gallery */}
          <ImageGallery 
            images={images} 
            title={property.title} 
            categoryNode={
              <>
                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-sm ${categoryColors[property.category] || 'bg-brand-50 text-brand-700 border-brand-200'}`}>
                  {property.category}
                </span>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold text-white ${property.transactionType === 'SALE' ? 'bg-brand-800' : 'bg-gold-500'}`}>
                  {property.transactionType === 'SALE' ? 'À vendre' : 'À louer'}
                </span>
              </>
            } 
          />

          {/* Details */}
          <div className="card p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-brand-900">{property.title}</h1>
                <p className="mt-2 text-sm text-brand-500 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  Emplacement premium
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-brand-100 pt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-500 mb-3">Description</h3>
              <p className="text-brand-600 leading-relaxed">{property.description}</p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-cream-100 p-4">
                <p className="text-xs uppercase tracking-wider text-brand-400">Statut</p>
                <p className="mt-1 text-lg font-bold text-brand-800">{property.status}</p>
              </div>
              <div className="rounded-xl bg-cream-100 p-4">
                <p className="text-xs uppercase tracking-wider text-brand-400">Mis en ligne le</p>
                <p className="mt-1 text-lg font-bold text-brand-800">{new Date(property.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <ContactForm propertyId={property.id} />

          {/* Agent Card */}
          <div className="card p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-500 mb-4">Agent responsable</h3>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center">
                <img src="/logo.svg" alt="First Price Immo" className="h-full w-full object-contain" />
              </div>
              <div>
                <p className="font-bold text-brand-900">First Price Immo Team</p>
                <p className="text-xs text-brand-500">Spécialiste immobilier premium</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-brand-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                +1 (555) 123-4567
              </div>
              <div className="flex items-center gap-2 text-sm text-brand-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                hello@firstpriceimmo.com
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
