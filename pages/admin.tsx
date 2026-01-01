import { useEffect, useState } from "react";
import Head from "next/head";
import { fetchOrdersAdmin } from "../lib/api";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const envPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "";

  const login = () => {
    if (password === envPass) {
      setAuthed(true);
    } else {
      alert("Password errata");
    }
  };

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    fetchOrdersAdmin().then((res: any) => {
      if (res && res.orders) setOrders(res.orders);
      else if (Array.isArray(res)) setOrders(res);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
      alert("Errore fetching orders");
    });
  }, [authed]);

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-6 bg-[#141414] rounded border border-zinc-800">
          <h2 className="text-white mb-4">Admin Login</h2>
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-64 p-2 bg-[#0f0f0f] border border-zinc-800 rounded text-white" />
          <div className="mt-4">
            <button onClick={login} className="bg-red-600 px-4 py-2 rounded text-white">Accedi</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head><title>Admin - Orders</title></Head>
      <div className="p-6">
        <h1 className="text-white text-2xl mb-4">Orders</h1>
        {loading && <div>Loading...</div>}
        {!loading && orders.length === 0 && <div className="text-gray-400">Nessun ordine</div>}
        <div className="space-y-4">
          {orders.map((o: any, idx: number) => (
            <div key={idx} className="p-4 bg-[#0f0f0f] border border-zinc-800 rounded">
              <div className="flex justify-between">
                <div>
                  <div className="text-white font-bold">{o.customer?.name || o.name || "Cliente"}</div>
                  <div className="text-gray-400 text-sm">{o.customer?.email || o.email}</div>
                </div>
                <div className="text-white">{o.total}€</div>
              </div>
              <div className="text-xs text-gray-400 mt-2">{o.created_at || o.timestamp}</div>
              <pre className="text-xs text-gray-300 mt-2">{JSON.stringify(o.items || o.items_json || o.raw_payload || [], null, 2)}</pre>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
