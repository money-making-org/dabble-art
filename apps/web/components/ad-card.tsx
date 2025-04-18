import { cn } from "@/lib/utils";
import { useEffect } from "react";
import Script from "next/script";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdCardProps {
  className?: string;

  clientId: "ca-pub-6714877547689628";

  slotId: "3489516387";
}

export function AdCard({
  className,
  clientId,
  slotId,
}: AdCardProps) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  }, []);

  return (
    <>
      <Script
        id="adsense-script"
        strategy="afterInteractive"
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
        crossOrigin="anonymous"
      />

      <div
        className={cn(
          "w-full rounded-lg border bg-card p-4 shadow-sm",
          className
        )}
      >
        <div className="flex h-[250px] w-full items-center justify-center">
          <ins
            className="adsbygoogle block"
            style={{ display: "block" }}
            data-ad-client={clientId}
            data-ad-slot={slotId}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      </div>
    </>
  );
}
