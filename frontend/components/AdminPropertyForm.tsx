'use client';

import { useMemo, useState, useCallback, useRef } from 'react';
import { createPropertyMultipart, updatePropertyMultipart } from '../lib/api';
import { useAuth } from '../context/AuthContext';

type AdminPropertyFormProps = {
  initialData?: {
    id?: string;
    title: string;
    description: string;
    category: string;
    transactionType: string;
    imageUrls?: string[];
    status: string;
  };
  onSaved: () => void;
};

const defaultForm = {
  title: '',
  description: '',
  category: 'HOUSES',
  transactionType: 'SALE',
  status: 'ACTIVE',
};

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export default function AdminPropertyForm({ initialData, onSaved }: AdminPropertyFormProps) {
  const { token } = useAuth();
  const [form, setForm] = useState({ ...defaultForm, ...initialData });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const existingImages = useMemo(() => initialData?.imageUrls ?? [], [initialData]);
  const totalNewSize = useMemo(
    () => selectedFiles.reduce((sum, f) => sum + f.size, 0),
    [selectedFiles]
  );

  function updateField(key: keyof typeof form, value: string | number) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addFiles(fileArray: File[]) {
    const imageFiles = fileArray.filter((f) => f.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    setSelectedFiles((prev) => {
      const combined = [...prev, ...imageFiles];
      // Deduplicate by name+size+lastModified
      const seen = new Set<string>();
      return combined.filter((f) => {
        const key = `${f.name}-${f.size}-${f.lastModified}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    });

    setPreviewUrls((prev) => {
      const newUrls = imageFiles.map((file) => URL.createObjectURL(file));
      return [...prev, ...newUrls];
    });
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    addFiles(Array.from(files));
    // Reset input so the same file can be selected again if removed
    event.target.value = '';
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  function removeFile(index: number) {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => {
      const urlToRevoke = prev[index];
      const next = prev.filter((_, i) => i !== index);
      if (urlToRevoke) URL.revokeObjectURL(urlToRevoke);
      return next;
    });
  }

  function clearAllNewImages() {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setPreviewUrls([]);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setError('');
    setIsSaving(true);

    try {
      if (!token) {
        throw new Error('Token admin manquant. Veuillez vous reconnecter.');
      }

      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('category', form.category);
      formData.append('transactionType', form.transactionType);
      formData.append('status', form.status);

      selectedFiles.forEach((file) => formData.append('images', file));

      if (initialData?.id) {
        await updatePropertyMultipart(initialData.id, formData, token);
        setMessage('Propriété mise à jour avec succès.');
      } else {
        await createPropertyMultipart(formData, token);
        setMessage('Propriété créée avec succès.');
        setForm(defaultForm);
        clearAllNewImages();
      }

      onSaved();
    } catch (err: any) {
      setError(err.message || 'Impossible d’enregistrer la propriété.');
    } finally {
      setIsSaving(false);
    }
  }

  const hasNewImages = selectedFiles.length > 0;
  const hasExistingImages = existingImages.length > 0;
  const willReplaceExisting = hasNewImages && hasExistingImages;

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-5">
      <div className="flex items-center gap-2 pb-3 border-b border-brand-100">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-800 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </div>
        <h2 className="text-base font-bold text-brand-900">{initialData?.id ? 'Modifier la propriété' : 'Ajouter une propriété'}</h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="block lg:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-500">Titre</span>
          <input value={form.title} onChange={(e) => updateField('title', e.target.value)} type="text" placeholder="Ex. Villa moderne à Marrakech" className="mt-1.5 w-full" />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-500">Catégorie</span>
          <select value={form.category} onChange={(e) => updateField('category', e.target.value)} className="mt-1.5 w-full">
            <option value="HOUSES">Maisons</option>
            <option value="VILLAS">Villas</option>
            <option value="TERRAIN">Terrain</option>
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-500">Type de transaction</span>
          <select value={form.transactionType} onChange={(e) => updateField('transactionType', e.target.value)} className="mt-1.5 w-full">
            <option value="SALE">À vendre</option>
            <option value="RENT">À louer</option>
          </select>
        </label>
        <label className="block lg:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-500">Description</span>
          <textarea value={form.description} onChange={(e) => updateField('description', e.target.value)} rows={4} placeholder="Décrivez le bien..." className="mt-1.5 w-full" />
        </label>
        <label className="block lg:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-500">Statut</span>
          <select value={form.status} onChange={(e) => updateField('status', e.target.value)} className="mt-1.5 w-full">
            <option value="ACTIVE">Actif</option>
            <option value="INACTIVE">Inactif</option>
          </select>
        </label>

        {/* ===== ENHANCED IMAGE UPLOAD SECTION ===== */}
        <div className="block lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-500">Images du bien</span>
            {hasNewImages && (
              <button
                type="button"
                onClick={clearAllNewImages}
                className="text-xs font-medium text-rose-600 hover:text-rose-700 transition-colors"
              >
                Tout effacer
              </button>
            )}
          </div>

          {/* Drag & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Zone de dépôt pour télécharger des images"
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
            className={[
              'group relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 ease-out',
              'bg-cream-50 hover:bg-cream-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-gold-200/50',
              dragActive
                ? 'border-gold-400 bg-gold-50 shadow-glow scale-[1.01]'
                : 'border-brand-200 hover:border-brand-300',
              'p-6 sm:p-8',
            ].join(' ')}
          >
            <input
              ref={inputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="sr-only"
              aria-hidden="true"
            />
            <div className="flex flex-col items-center text-center space-y-3">
              <div
                className={[
                  'flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300',
                  dragActive
                    ? 'bg-gold-100 text-gold-600 scale-110'
                    : 'bg-brand-100 text-brand-400 group-hover:bg-brand-200 group-hover:text-brand-600',
                ].join(' ')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-brand-700">
                  {dragActive ? 'Déposez les images ici' : 'Glissez-déposez ou cliquez pour choisir'}
                </p>
                <p className="text-xs text-brand-400">
                  PNG, JPG, WEBP — plusieurs fichiers acceptés
                </p>
              </div>
            </div>
          </div>

          {/* New Images Gallery */}
          {hasNewImages && (
            <div className="rounded-2xl bg-cream-100 p-4 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-500">
                  Nouvelles images · {selectedFiles.length} fichier{selectedFiles.length > 1 ? 's' : ''}
                </p>
                <span className="text-xs text-brand-400">{formatFileSize(totalNewSize)}</span>
              </div>

              {willReplaceExisting && (
                <div className="flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800 border border-amber-200">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  Ces nouvelles images remplaceront la galerie existante lors de l’enregistrement.
                </div>
              )}

              <div className="gallery-grid">
                {previewUrls.map((url, index) => (
                  <div
                    key={`${url}-${index}`}
                    className="gallery-item group relative aspect-[4/3] overflow-hidden rounded-xl bg-brand-100 shadow-sm"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <img
                      src={url}
                      alt={`Aperçu ${index + 1}`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-900/70 via-brand-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {/* Top-right remove button */}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                      aria-label={`Retirer l'image ${index + 1}`}
                      className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-rose-600 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-110 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                    {/* Bottom info */}
                    <div className="absolute bottom-0 left-0 right-0 px-3 py-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <p className="text-[11px] font-medium text-white truncate">
                        {selectedFiles[index]?.name}
                      </p>
                      <p className="text-[10px] text-white/80">
                        {formatFileSize(selectedFiles[index]?.size || 0)}
                      </p>
                    </div>
                    {/* Main image badge */}
                    {index === 0 && (
                      <span className="absolute top-2 left-2 inline-flex items-center rounded-md bg-gold-500/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm backdrop-blur-sm">
                        Principale
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Existing Images Gallery */}
          {hasExistingImages && !hasNewImages && (
            <div className="rounded-2xl bg-cream-100 p-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-500">
                Images existantes · {existingImages.length}
              </p>
              <div className="gallery-grid">
                {existingImages.map((url, index) => (
                  <div
                    key={url}
                    className="gallery-item group relative aspect-[4/3] overflow-hidden rounded-xl bg-brand-100 shadow-sm"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <img
                      src={url}
                      alt={`Existante ${index + 1}`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {index === 0 && (
                      <span className="absolute top-2 left-2 inline-flex items-center rounded-md bg-gold-500/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm backdrop-blur-sm">
                        Principale
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {message && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 border border-emerald-200 animate-slide-up">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          {message}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-800 border border-rose-200 animate-slide-up">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {error}
        </div>
      )}

      <button type="submit" disabled={isSaving} className="btn-primary w-full disabled:opacity-60">
        {isSaving ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Enregistrement…
          </span>
        ) : (
          <span className="flex items-center gap-2">
            {initialData?.id ? 'Mettre à jour' : 'Créer la propriété'}
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          </span>
        )}
      </button>
    </form>
  );
}
