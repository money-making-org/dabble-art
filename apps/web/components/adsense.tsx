import Script from "next/script";

export function AdSense() {
  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6714877547689628"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
