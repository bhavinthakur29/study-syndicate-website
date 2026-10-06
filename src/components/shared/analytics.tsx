import Script from "next/script";

export function Analytics() {
  const id = process.env.NEXT_PUBLIC_UMAMI_ID;
  const src =
    process.env.NEXT_PUBLIC_UMAMI_SRC ?? "https://cloud.umami.is/script.js";
  if (!id) return null;
  return <Script src={src} data-website-id={id} strategy="afterInteractive" />;
}
