export type CabinCounts = { total: number; booked: number };

// Reads the live count from Convex on the server. Cached for 30 minutes.
export async function getCabinCounts(): Promise<CabinCounts | null> {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) return null;

  try {
    const res = await fetch(`${url}/api/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: "cabins:publicCounts",
        args: {},
        format: "json",
      }),
      next: { revalidate: 1800 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;

    const data = await res.json();
    if (data.status !== "success") return null;

    const { total, available } = data.value;
    if (!Number.isInteger(total) || !Number.isInteger(available) || total <= 0)
      return null;
    return { total, booked: total - available };
  } catch {
    return null;
  }
}
