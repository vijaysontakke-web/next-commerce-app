"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
  images: string[];
  name: string;
}

export function ProductImageGallery({
  images,
  name,
}: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted flex items-center justify-center text-muted-foreground">
        <Image
          src="/placeholder.svg"
          alt={name}
          fill
          className="object-cover"
          priority
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted flex items-center justify-center text-muted-foreground">
        <Image
          src={images[selectedImageIndex]}
          alt={name}
          fill
          className="object-cover transition-all duration-300"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-4 overflow-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImageIndex(idx)}
              className={cn(
                "relative aspect-square w-24 flex-none overflow-hidden rounded-md border bg-muted cursor-pointer transition-all",
                selectedImageIndex === idx
                  ? "ring-2 ring-primary border-primary"
                  : "hover:ring-2 hover:ring-primary/50"
              )}
            >
              <Image
                src={img}
                alt={`${name} view ${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
