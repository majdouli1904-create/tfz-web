import React from "react";
import { X, Tv, ChevronRight } from "lucide-react";
import { useCart } from "../lib/cartContext";

export const CartDrawer: React.FC<{ open: boolean; onClose: () => void; onCheckout: () => void }> = ({ open, onClose, onCheckout }) => {
  const { cart, remove, increase, decrease, total } = useCart();
  return (
    <>
      <div className={`fixed inset-0 bg-black/80 z-40 transition-opacity ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={onClose} />
      <div className={`fixed right-0 top-0 h-full w-full md:w-[420px] bg-[#141414] z-50 transform transition-transform ${open ? "translate-x-0" : "translate-x-full"}`} role="dialog" aria-modal="true">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
          <h3 className="text-white font-bold">Il tuo Ordine</h3>
          <button onClick={onClose} aria-label="Chiudi" className="text-gray-400"><X /></button>
        </div>

        <div className="p-6 overflow-y-auto h-[70vh] space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-gray-500 space-y-4">
              <Tv className="w-16 h-16 opacity-20" />
              <p>Carrello vuoto</p>
            </div>
          ) : (
            cart.map((it, i) => (
              <div key={`${it.id}-${i}`} className="flex gap-4 bg-zinc-900 p-3 rounded">
                <img src={it.image} alt={it.title} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="text-white font-medium text-sm">{it.title}</h4>
                    <div className="text-white font-bold">{new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(it.price * it.quantity)}</div>
                  </div>
                  <p className="text-gray-400 text-xs">{it.category}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <button onClick={() => decrease(i)} className="bg-zinc-800 px-2 py-1 rounded">-</button>
                      <span className="text-white">{it.quantity}</span>
                      <button onClick={() => increase(i)} className="bg-zinc-800 px-2 py-1 rounded">+</button>
                    </div>
                    <button onClick={() => remove(i)} className="text-xs text-gray-400 underline">Rimuovi</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-zinc-800">
            <div className="flex justify-between text-gray-400">
              <span>Totale</span>
              <span className="text-white font-bold">{new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(total)}</span>
            </div>
            <button onClick={onCheckout} className="w-full mt-4 bg-red-600 py-3 rounded text-white flex items-center justify-center gap-2">Procedi (invia ordine) <ChevronRight /></button>
            <p className="text-xs text-gray-500 mt-2">Pagamento esterno al sito.</p>
          </div>
        )}
      </div>
    </>
  );
};