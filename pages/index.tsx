import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { ProductRow } from "../components/ProductRow";
import { PRODUCTS } from "../data/products";
import { CartDrawer } from "../components/CartDrawer";
import { CheckoutModal } from "../components/CheckoutModal";
import { useCart } from "../lib/cartContext";

const CATEGORIES = ["In Evidenza Live", "Cinema On Demand", "Hardware & Box TV", "Sicurezza & VPN"];
const CATEGORY_MAP: Record<string, string> = {
  "In Evidenza Live": "Abbonamenti Live",
  "Cinema On Demand": "On Demand",
  "Hardware & Box TV": "Hardware",
  "Sicurezza & VPN": "Sicurezza"
};

const Home: NextPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const { cart } = useCart();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setCartOpen(false);
  }, [cart.length]);

  const getProducts = (label: string) => PRODUCTS.filter(p => p.category === CATEGORY_MAP[label]);

  return (
    <div>
      <Head>
        <title>TFZ TV</title>
      </Head>

      <Navbar onOpenCart={() => setCartOpen(true)} isScrolled={isScrolled} />

      <main className="pb-20">
        <section className="relative h-[60vh] text-white flex items-center justify-center" style={{ background: "url('https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1600') center/cover no-repeat" }}>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
          <div className="relative z-10 text-center max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-black">STREAMING <span className="text-red-600">UNLIMITED</span></h1>
            <p className="mt-4 text-lg">Guarda sport, film e serie in alta qualità.</p>
          </div>
        </section>

        <div className="-mt-24 relative z-20">
          {CATEGORIES.map((c, i) => (
            <ProductRow key={i} title={c} products={getProducts(c)} />
          ))}

          <ProductRow title="Consigliati per Te" products={PRODUCTS.filter(p => p.price < 50)} />
        </div>
      </main>

      <footer className="bg-black text-gray-500 py-12 px-6">
        <div className="max-w-6xl mx-auto text-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ul>
              <li>Audio e Sottotitoli</li>
              <li>Privacy</li>
            </ul>
            <ul>
              <li>Centro assistenza</li>
            </ul>
          </div>
          <p className="mt-6 text-xs">© 1997-${new Date().getFullYear()} TFZ TV, Inc.</p>
        </div>
      </footer>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }} />
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </div>
  );
};

export default Home;
