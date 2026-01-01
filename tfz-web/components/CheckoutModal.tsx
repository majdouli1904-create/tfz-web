import React, { useEffect, useRef, useState } from "react";
import { CheckCircle } from "lucide-react";
import { sendOrder } from "../lib/api";
import { useCart } from "../lib/cartContext";

export const CheckoutModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const { cart, total, clear } = useCart();
  const [step, setStep] = useState<"form" | "processing" | "success">("form");
  const [form, setForm] = useState({ name: "", email: "", phone: "", note: "" });
  const [error, setError] = useState("");
  const firstRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setStep("form");
      setForm({ name: "", email: "", phone: "", note: "" });
      setTimeout(() => firstRef.current?.focus(), 50);
    }
  }, [open]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email) {
      setError("Nome e email obbligatori");
      return;
    }
    setStep("processing");
    const payload = {
      created_at: new Date().toISOString(),
      customer: form,
      total,
      items: cart.map(it => ({ id: it.id, title: it.title, price: it.price, quantity: it.quantity })),
      source: "web-site"
    };
    try {
      const res = await sendOrder(payload);
      if (!res || (res && res.success === false)) throw new Error("Send failed");
      setTimeout(() => setStep("success"), 600);
      clear();
    } catch (err) {
      setError("Errore invio ordine");
      setStep("form");
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="bg-[#141414] w-full max-w-md p-6 rounded border border-zinc-800">
        {step === "processing" && (
          <div className="text-center py-8">
            <div className="w-20 h-20 border-4 border-red-600 rounded-full mx-auto animate-spin border-t-transparent" />
            <h3 className="text-white text-2xl mt-4">Invio ordine...</h3>
          </div>
        )}
        {step === "success" && (
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-red-600/20 rounded-full mx-auto flex items-center justify-center text-red-600">
              <CheckCircle />
            </div>
            <h3 className="text-white text-2xl mt-4">Ordine inviato!</h3>
            <button className="mt-4 w-full bg-white text-black py-2 rounded" onClick={onClose}>Chiudi</button>
          </div>
        )}
        {step === "form" && (
          <form onSubmit={submit} className="space-y-4">
            <h3 className="text-white text-xl">Dati cliente</h3>
            <input ref={firstRef} value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nome" className="w-full p-2 bg-[#0f0f0f] border border-zinc-800 rounded text-white" required />
            <input value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} placeholder="Email" type="email" className="w-full p-2 bg-[#0f0f0f] border border-zinc-800 rounded text-white" required />
            <input value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="Telefono" className="w-full p-2 bg-[#0f0f0f] border border-zinc-800 rounded text-white" />
            <textarea value={form.note} onChange={(e) => setForm(f => ({ ...f, note: e.target.value }))} placeholder="Nota (opzionale)" className="w-full p-2 bg-[#0f0f0f] border border-zinc-800 rounded text-white" />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <div className="flex gap-2">
              <button type="button" onClick={onClose} className="flex-1 border border-zinc-700 text-white py-2 rounded">Annulla</button>
              <button type="submit" className="flex-1 bg-red-600 py-2 rounded text-white">Invia Ordine</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};