import React from "react";
import { ShoppingCart, Search, Bell } from "lucide-react";
import { useCart } from "../lib/cartContext";

export const Navbar: React.FC<{ onOpenCart: () => void; isScrolled: boolean }> = ({ onOpenCart, isScrolled }) => {
  const { itemCount } = useCart();
  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? "bg-black/95 shadow-xl backdrop-blur-md" : "bg-gradient-to-b from-black/90 to-transparent"}`}>
      <div className="flex items-center justify-between px-4 md:px-12 py-4">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-1 cursor-pointer">
            <h1 className="text-4xl font-black text-red-600 tracking-tighter drop-shadow-lg">TFZ<span className="text-white text-3xl font-normal ml-1">TV</span></h1>
          </div>
        </div>

        <div className="flex items-center gap-6 text-white">
          <Search className="w-5 h-5 cursor-pointer hover:text-gray-300 transition" />
          <Bell className="w-5 h-5 cursor-pointer hover:text-gray-300 transition" />
          <div className="relative cursor-pointer group" onClick={onOpenCart} aria-label="Apri carrello" role="button" tabIndex={0}>
            <ShoppingCart className="w-5 h-5 group-hover:text-red-600 transition" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-black" aria-live="polite">
                {itemCount}
              </span>
            )}
          </div>
          <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center font-bold text-sm cursor-pointer shadow-lg" aria-hidden>
            :)
          </div>
        </div>
      </div>
    </nav>
  );
};
