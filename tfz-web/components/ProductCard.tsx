import React from "react";
import { Plus } from "lucide-react";
import { useCart } from "../lib/cartContext";

export const ProductCard: React.FC<{ id: number; title: string; price: number; image?: string; category?: string }> = ({ id, title, price, image, category }) => {
  const { add } = useCart();
  return (
    <div className="group relative flex-none w-[260px] md:w-[300px] aspect-video cursor-pointer transition-all duration-300 hover:z-20 hover:scale-105">
      <div className="w-full h-full rounded-md overflow-hidden relative shadow-lg bg-zinc-800 border-none">
        <img src={image} alt={title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition duration-500" />
        <div className="absolute inset-0 bg-zinc-900/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex gap-2">
              <button onClick={(e) => { e.stopPropagation(); add({ id, title, price, image, category }); }} className="bg-white text-black rounded-full p-2 hover:bg-red-600 hover:text-white transition border border-white" aria-label={`Aggiungi ${title}`}>
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <span className="text-green-500 font-bold text-sm tracking-wide">98% Match</span>
          </div>

          <h3 className="text-white font-bold text-lg leading-tight">{title}</h3>
          <div className="flex items-center gap-2 text-xs text-gray-300 mt-2">
            <span className="text-white font-bold text-base">{new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(price)}</span>
            <span className="text-zinc-500">•</span>
            <span>{category}</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black via-black/60 to-transparent opacity-100 group-hover:opacity-0 transition-opacity">
          <h4 className="text-white font-bold drop-shadow-md text-sm truncate uppercase tracking-widest">{title}</h4>
        </div>
      </div>
    </div>
  );
};