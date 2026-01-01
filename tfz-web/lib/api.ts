export type OrderItem = {
  id: number;
  title: string;
  price: number;
  quantity: number;
};

export type OrderPayload = {
  created_at: string;
  customer: { name: string; email: string; phone?: string; note?: string };
  total: number;
  items: OrderItem[];
  source?: string;
};

const ORDER_ENDPOINT = process.env.NEXT_PUBLIC_ORDER_ENDPOINT || "";
const ORDER_TOKEN = process.env.NEXT_PUBLIC_ORDER_TOKEN || "";

export async function sendOrder(payload: OrderPayload) {
  if (!ORDER_ENDPOINT) {
    console.warn("No ORDER_ENDPOINT configured; order will be logged to console.");
    // eslint-disable-next-line no-console
    console.log("ORDER (local):", payload);
    return { success: true, message: "logged" };
  }

  const body = new URLSearchParams();
  body.append("payload", JSON.stringify(payload));
  body.append("token", ORDER_TOKEN);

  const res = await fetch(ORDER_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body: body.toString()
  });

  const json = await res.json();
  return json;
}

export async function fetchOrdersAdmin(token?: string) {
  const endpoint = ORDER_ENDPOINT;
  if (!endpoint) throw new Error("No ORDER_ENDPOINT configured");
  const url = new URL(endpoint);
  url.searchParams.set("token", token || ORDER_TOKEN);
  url.searchParams.set("admin", "1");
  const res = await fetch(url.toString(), { method: "GET" });
  if (!res.ok) {
    throw new Error(`Failed to fetch orders: ${res.status}`);
  }
  const json = await res.json();
  return json;
}