/* Updated App.js - sends orders to Google Apps Script endpoint via URLSearchParams
   Provided endpoint and token have been inserted as ORDER_ENDPOINT and ORDER_TOKEN.
*/

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Bell, 
  Play, 
  Info, 
  Plus, 
  X, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle,
  Tv
} from 'lucide-react';

// CONFIG: Google Apps Script Web App endpoint + token (for your provided values)
const ORDER_ENDPOINT = "https://script.google.com/macros/s/AKfycbzn6lhTc8kfXTgp5BkwjklIuEuE-kVfjvicyKAG9uO2nj9oO89-0aK1uabUWCTcEFof/exec";
const ORDER_TOKEN = "AKfycbzn6lhTc8kfXTgp5BkwjklIuEuE-kVfjvicyKAG9uO2nj9oO89-0aK1uabUWCTcEFof";

// --- DATI MOCK (Catalogo TFZ TV - IPTV Premium) ---
const PRODUCTS = [
  {
    id: 1,
    title: "TFZ Sport Pass - 12 Mesi",
    category: "Abbonamenti Live",
    price: 89.99,
    rating: 5.0,
    isNew: true,
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800",
    description: "Tutto il calcio, Formula 1 e MotoGP in 4K HDR. Nessun buffering, server dedicati ad alta velocità.",
    match: "100% Compatibile"
  },
  {
    id: 2,
    title: "TFZ Cinema & Serie VOD",
    category: "On Demand",
    price: 59.99,
    rating: 4.8,
    isNew: false,
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800",
    description: "Oltre 50.000 titoli tra film e serie TV. Aggiornamenti giornalieri e qualità Blu-Ray.",
    match: "Novità"
  },
  {
    id: 3,
    title: "TFZ Ultimate Box 8K",
    category: "Hardware",
    price: 129.00,
    rating: 4.9,
    isNew: true,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800",
    description: "Il decoder Android più potente sul mercato. Pre-configurato per TFZ TV. Wi-Fi 6 e telecomando vocale.",
    match: "Top Tech"
  },
  {
    id: 4,
    title: "VPN Shield Pro - 1 Anno",
    category: "Sicurezza",
    price: 39.99,
    rating: 4.7,
    isNew: false,
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800",
    description: "Naviga e guarda in totale anonimato. Zero log, protezione militare e sblocco geografico globale.",
    match: "Essenziale"
  },
  {
    id: 5,
    title: "Pacchetto 3 Mesi Sport",
    category: "Abbonamenti Live",
    price: 29.99,
    rating: 4.5,
    isNew: false,
    image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800",
    description: "La soluzione flessibile per goderti la stagione sportiva senza vincoli a lungo termine.",
    match: "Popolare"
  },
  {
    id: 6,
    title: "Multi-Screen Addon",
    category: "Extra",
    price: 15.00,
    rating: 4.9,
    isNew: false,
    image: "https://images.unsplash.com/photo-1522869635100-1f4906a1715d?auto=format&fit=crop&q=80&w=800",
    description: "Guarda su 3 dispositivi contemporaneamente. Ideale per condividere l'abbonamento in famiglia.",
    match: "Famiglia"
  },
  {
    id: 7,
    title: "Configurazione Remota",
    category: "Servizi",
    price: 20.00,
    rating: 5.0,
    isNew: true,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    description: "I nostri tecnici configurano la tua Smart TV o Box da remoto. Rilassati e goditi lo spettacolo.",
    match: "Assistenza VIP"
  },
  {
    id: 8,
    title: "TFZ IPTV Reseller Pack",
    category: "Business",
    price: 299.00,
    rating: 4.8,
    isNew: false,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    description: "Inizia il tuo business con TFZ. Pannello di controllo, 100 crediti e supporto prioritario.",
    match: "B2B"
  }
];

const CATEGORIES = ["In Evidenza Live", "Cinema On Demand", "Hardware & Box TV", "Sicurezza & VPN"];

// Mappa visual label -> product.category
const CATEGORY_MAP = {
  "In Evidenza Live": "Abbonamenti Live",
  "Cinema On Demand": "On Demand",
  "Hardware & Box TV": "Hardware",
  "Sicurezza & VPN": "Sicurezza"
};

// localStorage key
const CART_KEY = "tfz_cart_v1";

// Utility: format price
const formatPrice = (value) =>
  new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value);

// --- COMPONENTI UI ---

const Navbar = ({ cartCount, onOpenCart, isScrolled }) => (
  <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-black/95 shadow-xl backdrop-blur-md' : 'bg-gradient-to-b from-black/90 to-transparent'}`}>
    <div className="flex items-center justify-between px-4 md:px-12 py-4">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-1 cursor-pointer">
           <h1 className="text-4xl font-black text-red-600 tracking-tighter drop-shadow-lg">TFZ<span className="text-white text-3xl font-normal ml-1">TV</span></h1>
        </div>
        
        <ul className="hidden md:flex gap-6 text-sm font-medium text-gray-300">
          <li className="hover:text-white cursor-pointer transition font-bold">Home</li>
          <li className="hover:text-white cursor-pointer transition">Serie A</li>
          <li className="hover:text-white cursor-pointer transition">Film</li>
          <li className="hover:text-white cursor-pointer transition">Nuovi Arrivi</li>
          <li className="hover:text-white cursor-pointer transition">La mia lista</li>
        </ul>
      </div>
      
      <div className="flex items-center gap-6 text-white">
        <Search className="w-5 h-5 cursor-pointer hover:text-gray-300 transition" />
        <Bell className="w-5 h-5 cursor-pointer hover:text-gray-300 transition" />
        <div className="relative cursor-pointer group" onClick={onOpenCart} aria-label="Apri carrello" role="button" tabIndex={0}>
          <ShoppingCart className="w-5 h-5 group-hover:text-red-600 transition" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-black" aria-live="polite">
              {cartCount}
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

// Hero Section
const Hero = ({ onBuy }) => (
  <div className="relative h-[85vh] w-full text-white overflow-hidden">
    <div 
      className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-105"
      style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1600")' }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
    </div>

    <div className="absolute top-1/3 left-4 md:left-12 max-w-2xl z-10 space-y-6">
      <div className="flex items-center gap-2 text-red-600 font-bold tracking-widest text-sm uppercase">
        <span className="w-8 h-10 bg-red-600 flex items-center justify-center text-white text-xs font-black rounded-sm">TOP</span>
        <span className="text-white font-bold text-xl drop-shadow-md">N. 1 in Italia oggi</span>
      </div>
      <h1 className="text-6xl md:text-8xl font-black leading-none drop-shadow-2xl tracking-tighter">
        STREAMING <br/> <span className="text-red-600">UNLIMITED</span>
      </h1>
      <p className="text-lg md:text-xl text-white font-medium drop-shadow-md max-w-xl">
        Guarda tutto lo sport che ami, film in prima visione e serie TV esclusive. Senza limiti, senza interruzioni.
      </p>
      
      <div className="flex items-center gap-4 pt-4">
        <button 
          onClick={() => onBuy({ id: 99, title: "TFZ Full Package 12 Mesi", price: 99.99, image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800", category: "Abbonamenti Live" })}
          className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded hover:bg-white/90 transition font-bold text-xl"
        >
          <Play fill="black" className="w-6 h-6" /> Abbonati
        </button>
        <button className="flex items-center gap-2 bg-gray-500/40 backdrop-blur-md text-white px-8 py-3 rounded hover:bg-gray-500/60 transition font-bold text-xl">
          <Info className="w-6 h-6" /> Altre Info
        </button>
      </div>
    </div>
  </div>
);

// Product Card
const ProductCard = ({ product, onAdd }) => (
  <div className="group relative flex-none w-[280px] md:w-[320px] aspect-video cursor-pointer transition-all duration-300 hover:z-20 hover:scale-110">
    <div className="w-full h-full rounded-md overflow-hidden relative shadow-lg bg-zinc-800 border-none">
      <img 
        src={product.image} 
        alt={product.title} 
        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition duration-500"
      />
      <div className="absolute inset-0 bg-zinc-900/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 backdrop-blur-none">
        <div className="flex items-center justify-between mb-2">
            <div className="flex gap-2">
                <button 
                    onClick={(e) => { e.stopPropagation(); onAdd(product); }}
                    className="bg-white text-black rounded-full p-2 hover:bg-red-600 hover:text-white transition border border-white"
                    aria-label={`Aggiungi ${product.title} al carrello`}
                >
                    <Plus className="w-4 h-4" />
                </button>
                <button className="border-2 border-gray-400 text-gray-400 rounded-full p-2 hover:border-white hover:text-white transition" aria-hidden>
                    <CheckCircle className="w-4 h-4" />
                </button>
            </div>
            <span className="text-green-500 font-bold text-sm tracking-wide">98% Match</span>
        </div>
        
        <div className="flex items-center gap-2 mb-1">
             <span className="bg-red-600 text-white text-[10px] px-1 rounded font-bold">HD</span>
             <span className="border border-gray-500 text-gray-300 text-[10px] px-1 rounded font-bold">5.1</span>
        </div>

        <h3 className="text-white font-bold text-lg leading-tight">{product.title}</h3>
        <div className="flex items-center gap-2 text-xs text-gray-300 mt-2">
            <span className="text-white font-bold text-base">{formatPrice(product.price)}</span>
            <span className="text-zinc-500">•</span>
            <span>{product.category}</span>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black via-black/60 to-transparent opacity-100 group-hover:opacity-0 transition-opacity">
         <div className="flex flex-col items-center">
            <h4 className="text-white font-bold drop-shadow-md text-sm truncate uppercase tracking-widest">{product.title}</h4>
         </div>
      </div>
    </div>
  </div>
);

// Product Row
const ProductRow = ({ title, products, onAdd }) => {
  const rowRef = useRef(null);

  const scroll = (offset) => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="py-8 relative group">
      <h2 className="text-xl md:text-2xl text-gray-200 font-bold mb-4 px-4 md:px-12 flex items-center gap-2 group/title hover:text-white transition cursor-pointer">
        {title} <ChevronRight className="opacity-0 group-hover/title:opacity-100 transition text-white w-5 h-5 font-bold" />
      </h2>
      
      <div className="relative">
        <button 
          onClick={() => scroll(-300)}
          className="absolute left-0 top-0 bottom-0 z-30 bg-black/50 w-12 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-black/70 transition text-white"
          aria-label={`Scorri ${title} a sinistra`}
        >
          <ChevronLeft className="w-10 h-10" />
        </button>

        <div 
          ref={rowRef}
          className="flex gap-4 overflow-x-auto px-4 md:px-12 scrollbar-hide pb-8 pt-4 clip-padding"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map(product => (
            <ProductCard key={product.id} product={product} onAdd={onAdd} />
          ))}
        </div>

        <button 
          onClick={() => scroll(300)}
          className="absolute right-0 top-0 bottom-0 z-30 bg-black/50 w-12 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-black/70 transition text-white"
          aria-label={`Scorri ${title} a destra`}
        >
          <ChevronRight className="w-10 h-10" />
        </button>
      </div>
    </div>
  );
};

// Cart Drawer
const CartDrawer = ({ isOpen, onClose, cart, onRemove, total, onCheckout, onIncrease, onDecrease }) => {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose}
        aria-hidden={!isOpen}
      />
      
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Carrello ordini"
        className={`fixed inset-y-0 right-0 w-full md:w-[450px] bg-[#141414] border-l border-zinc-800 z-[70] transform transition-transform duration-300 flex flex-col shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-black">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">Il tuo Ordine</h2>
          <button onClick={onClose} ref={closeButtonRef} className="text-gray-400 hover:text-white transition" aria-label="Chiudi carrello">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
              <Tv className="w-16 h-16 opacity-20" />
              <p className="text-lg">Carrello vuoto</p>
              <button onClick={onClose} className="text-white hover:underline">Sfoglia catalogo</button>
            </div>
          ) : (
            cart.map((item, index) => (
              <div key={`${item.id}-${index}`} className="flex gap-4 bg-zinc-900 p-4 rounded-lg border border-zinc-800">
                <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded bg-zinc-700" />
                <div className="flex-1">
                  <h3 className="text-white font-medium text-sm">{item.title}</h3>
                  <p className="text-gray-400 text-xs mt-1">{item.category}</p>
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => onDecrease(index)} className="bg-zinc-800 px-2 py-1 rounded text-white">-</button>
                      <span className="text-white font-bold">{item.quantity}</span>
                      <button onClick={() => onIncrease(index)} className="bg-zinc-800 px-2 py-1 rounded text-white">+</button>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-white font-bold">{formatPrice(item.price * item.quantity)}</span>
                      <button 
                        onClick={() => onRemove(index)}
                        className="text-gray-500 hover:text-red-500 text-xs underline transition mt-2"
                      >
                        Rimuovi
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 bg-black border-t border-zinc-800 space-y-4">
            <div className="flex justify-between text-gray-400">
              <span>Subtotale</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-white text-xl font-bold">
              <span>Totale</span>
              <span>{formatPrice(total)}</span>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-md transition flex items-center justify-center gap-2"
            >
              PROCEDI (invia ordine) <ChevronRight className="w-5 h-5" />
            </button>
            <p className="text-xs text-gray-500 mt-2">Il pagamento avverrà fuori dal sito. Compila i dati nell'ordine per procedere.</p>
          </div>
        )}
      </div>
    </>
  );
};

// Checkout Modal: form that posts order (no payment)
const CheckoutModal = ({ isOpen, onClose, total, cartSnapshot }) => {
  const [step, setStep] = useState('form'); // 'form' | 'processing' | 'success'
  const [form, setForm] = useState({ name: '', email: '', phone: '', note: '' });
  const [error, setError] = useState('');
  const firstFieldRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setStep('form');
      setError('');
      setForm({ name: '', email: '', phone: '', note: '' });
      setTimeout(() => firstFieldRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const submitOrder = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email) {
      setError('Nome e email sono obbligatori.');
      return;
    }

    setStep('processing');

    const orderPayload = {
      created_at: new Date().toISOString(),
      customer: { ...form },
      total,
      items: cartSnapshot.map(i => ({ id: i.id, title: i.title, price: i.price, quantity: i.quantity })),
      source: "web-site"
    };

    try {
      // Send as application/x-www-form-urlencoded using URLSearchParams
      const body = new URLSearchParams();
      body.append('payload', JSON.stringify(orderPayload));
      body.append('token', ORDER_TOKEN);

      const res = await fetch(ORDER_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: body.toString()
      });

      const json = await res.json();

      if (!res.ok || (json && json.success === false)) {
        throw new Error(json && json.error ? json.error : `HTTP ${res.status}`);
      }

      // small delay for UX
      setTimeout(() => setStep('success'), 600);
    } catch (err) {
      setError('Si è verificato un errore durante l\'invio dell\'ordine. Riprova.');
      setStep('form');
      // eslint-disable-next-line no-console
      console.error('Order send error', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-black/90 flex items-center justify-center px-4" role="dialog" aria-modal="true" aria-label="Checkout ordine">
      <div className="bg-[#141414] w-full max-w-md p-6 rounded-xl border border-zinc-800 shadow-2xl text-center relative overflow-hidden">
        {step === 'processing' && (
          <div className="space-y-6 py-8">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-red-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <h3 className="text-2xl font-bold text-white animate-pulse">Invio ordine...</h3>
            <p className="text-gray-400">Stiamo inviando i dettagli del tuo ordine...</p>
          </div>
        )}

        {step === 'success' && (
          <div className="space-y-6 py-4">
            <div className="w-20 h-20 bg-red-600/20 rounded-full flex items-center justify-center mx-auto text-red-600">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-3xl font-bold text-white">Ordine inviato!</h3>
            <p className="text-gray-400">
              Il tuo ordine da <span className="text-white font-bold">{formatPrice(total)}</span> è stato inviato.
              <br/>Riceverai una conferma via email (se fornita).
            </p>
            <button 
              onClick={onClose}
              className="bg-white text-black font-bold px-8 py-3 rounded hover:bg-gray-200 transition w-full"
            >
              Chiudi
            </button>
          </div>
        )}

        {step === 'form' && (
          <form onSubmit={submitOrder} className="space-y-4 text-left">
            <h3 className="text-2xl font-bold text-white">Dettagli Cliente</h3>
            <p className="text-gray-400 text-sm">Compila i dati. Il pagamento avverrà esternamente.</p>

            <div>
              <label className="text-sm text-gray-300">Nome *</label>
              <input
                ref={firstFieldRef}
                value={form.name}
                onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full mt-1 p-2 bg-[#0f0f0f] border border-zinc-800 rounded text-white"
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Email *</label>
              <input
                value={form.email}
                onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                type="email"
                className="w-full mt-1 p-2 bg-[#0f0f0f] border border-zinc-800 rounded text-white"
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Telefono</label>
              <input
                value={form.phone}
                onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full mt-1 p-2 bg-[#0f0f0f] border border-zinc-800 rounded text-white"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Nota (opzionale)</label>
              <textarea
                value={form.note}
                onChange={(e) => setForm(f => ({ ...f, note: e.target.value }))}
                className="w-full mt-1 p-2 bg-[#0f0f0f] border border-zinc-800 rounded text-white"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex gap-2">
              <button type="button" onClick={onClose} className="flex-1 bg-transparent border border-zinc-700 text-white py-2 rounded">Annulla</button>
              <button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded">Invia Ordine</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// --- MAIN APP ---
const App = () => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [checkoutSnapshot, setCheckoutSnapshot] = useState({ items: [], total: 0 });

  // load cart from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) {
        setCart(JSON.parse(raw));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // save cart to localStorage when changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) {
      // ignore
    }
  }, [cart]);

  // scroll handler for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // prevent body scroll when drawer or modal open
  useEffect(() => {
    const blocked = isCartOpen || isCheckoutOpen;
    document.body.style.overflow = blocked ? 'hidden' : '';
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (isCheckoutOpen) setIsCheckoutOpen(false);
        else if (isCartOpen) setIsCartOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [isCartOpen, isCheckoutOpen]);

  // compute cart total (memoized)
  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  }, [cart]);

  // total items (sum quantities)
  const totalItems = useMemo(() => {
    return cart.reduce((s, it) => s + (it.quantity || 1), 0);
  }, [cart]);

  // add to cart: merge by product.id, increment quantity if exists
  const addToCart = useCallback((product) => {
    setCart(prev => {
      const idx = prev.findIndex(p => p.id === product.id);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: (copy[idx].quantity || 1) + 1 };
        return copy;
      }
      return [...prev, { id: product.id, title: product.title, price: product.price || 0, image: product.image || '', category: product.category || '', quantity: 1 }];
    });
    setIsCartOpen(true);
  }, []);

  // remove from cart by index
  const removeFromCart = useCallback((index) => {
    setCart(prev => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
  }, []);

  const increaseQty = useCallback((index) => {
    setCart(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], quantity: (copy[index].quantity || 1) + 1 };
      return copy;
    });
  }, []);

  const decreaseQty = useCallback((index) => {
    setCart(prev => {
      const copy = [...prev];
      const q = copy[index].quantity || 1;
      if (q <= 1) {
        copy.splice(index, 1);
      } else {
        copy[index] = { ...copy[index], quantity: q - 1 };
      }
      return copy;
    });
  }, []);

  // prepare products by category (use mapping)
  const getProductsByCategory = useCallback((catLabel) => {
    const cat = CATEGORY_MAP[catLabel] || catLabel;
    return PRODUCTS.filter(p => p.category === cat);
  }, []);

  // handle checkout: snapshot cart & total, open modal
  const handleCheckout = useCallback(() => {
    setCheckoutSnapshot({ items: cart.map(i => ({ ...i })), total: cartTotal });
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  }, [cart, cartTotal]);

  const closeCheckout = useCallback(() => {
    setIsCheckoutOpen(false);
    setCart([]); // empty cart after closing checkout to reflect snapshot semantics
  }, []);

  // small dynamic year
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-[#141414] font-sans selection:bg-red-600 selection:text-white">
      <Navbar 
        cartCount={totalItems} 
        onOpenCart={() => setIsCartOpen(true)}
        isScrolled={isScrolled}
      />

      <main className="pb-20">
        <Hero onBuy={addToCart} />

        <div className="-mt-32 relative z-20 space-y-6">
          {CATEGORIES.map((category, index) => (
            <ProductRow 
              key={index}
              title={category}
              products={getProductsByCategory(category)}
              onAdd={addToCart}
            />
          ))}
          
          <ProductRow 
            title="Consigliati per Te"
            products={PRODUCTS.filter(p => p.price < 50)}
            onAdd={addToCart}
          />
        </div>
      </main>

      <footer className="bg-black text-gray-500 py-16 px-4 md:px-12 border-t border-zinc-900 mt-12">
        <div className="max-w-6xl mx-auto text-sm space-y-8">
           <div className="flex gap-4 mb-4">
               <div className="w-6 h-6 bg-white rounded cursor-pointer"></div>
               <div className="w-6 h-6 bg-white rounded cursor-pointer"></div>
               <div className="w-6 h-6 bg-white rounded cursor-pointer"></div>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ul className="space-y-3">
                <li className="hover:underline cursor-pointer">Audio e Sottotitoli</li>
                <li className="hover:underline cursor-pointer">Media Center</li>
                <li className="hover:underline cursor-pointer">Privacy</li>
                <li className="hover:underline cursor-pointer">Contattaci</li>
              </ul>
              <ul className="space-y-3">
                <li className="hover:underline cursor-pointer">Descrizione Audio</li>
                <li className="hover:underline cursor-pointer">Rapporti investitori</li>
                <li className="hover:underline cursor-pointer">Note legali</li>
              </ul>
              <ul className="space-y-3">
                <li className="hover:underline cursor-pointer">Centro assistenza</li>
                <li className="hover:underline cursor-pointer">Lavoro</li>
                <li className="hover:underline cursor-pointer">Preferenze per i cookie</li>
              </ul>
              <ul className="space-y-3">
                <li className="hover:underline cursor-pointer">Carte regalo</li>
                <li className="hover:underline cursor-pointer">Condizioni di utilizzo</li>
                <li className="hover:underline cursor-pointer">Informazioni sull'azienda</li>
              </ul>
           </div>
           
           <button className="border border-gray-500 p-2 text-gray-500 hover:text-white text-xs mt-4">
              Codice di servizio
           </button>
           
           <p className="text-[11px] mt-4">© 1997-{currentYear} TFZ TV, Inc.</p>
        </div>
      </footer>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        onRemove={removeFromCart}
        total={cartTotal}
        onCheckout={handleCheckout}
        onIncrease={increaseQty}
        onDecrease={decreaseQty}
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={closeCheckout}
        total={checkoutSnapshot.total}
        cartSnapshot={checkoutSnapshot.items}
      />
    </div>
  );
};

export default App;