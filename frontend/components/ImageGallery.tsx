'use client';

import { useState } from 'react';

interface ImageGalleryProps {
  images: string[];
  title: string;
  categoryNode: React.ReactNode;
}

export default function ImageGallery({ images, title, categoryNode }: ImageGalleryProps) {
  const [mainImageIndex, setMainImageIndex] = useState(0);

  return (
    <div className="card overflow-hidden flex flex-col">
      <div className="relative h-80 sm:h-[28rem]">
        <img 
          src={images[mainImageIndex]}
          alt={`${title} - ${mainImageIndex}`} 
          className="h-full w-full object-contain bg-black/5 transition-opacity duration-300" 
        />
        <div className="absolute bottom-4 left-4 flex gap-2">
          {categoryNode}
        </div>
      </div>
      
      {images.length > 1 && (
        <div className="flex overflow-x-auto gap-2 p-4 bg-white border-t border-brand-100 no-scrollbar">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setMainImageIndex(index)}
              className={`flex-shrink-0 h-20 w-28 rounded-md overflow-hidden border-2 transition-all ${
                mainImageIndex === index ? 'border-brand-500 ring-2 ring-brand-200' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`Thumbnail ${index + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
