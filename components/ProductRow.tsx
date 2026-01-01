import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "./ProductCard";

export const ProductRow: React.FC<{ title: string; products: any[] }> = ({ title, products }) => {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const scroll = (offset: number) => rowRef.current?.scrollBy({ left: offset, behavior: "smooth" });
  return (
    <div className="py-8 relative group">
      <h2 className="text-xl md:text-2xl text-gray-200 font-bold mb-4 px-4 md:px-12 flex items-center gap-2">{title}</h2>
      <div className="relative">
        <button onClick={() => scroll(-300)} className="absolute left-0 top-0 bottom-0 z-30 bg-black/50 w-12 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-black/70 transition text-white" aria-label="Scorri a sinistra">
          <ChevronLeft className="w-10 h-10" />
        </button>
        <div ref={rowRef} className="flex gap-4 overflow-x-auto px-4 md:px-12 scrollbar-hide pb-8 pt-4">
          {products.map(p => <ProductCard key={p.id} {...p} />)}
        </div>
        <button onClick={() => scroll(300)} className="absolute right-0 top-0 bottom-0 z-30 bg-black/50 w-12 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-black/70 transition text-white" aria-label="Scorri a destra">
          <ChevronRight className="w-10 h-10" />
        </button>
      </div>
    </div>
  );
};
