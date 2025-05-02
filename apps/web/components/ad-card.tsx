"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import Script from "next/script";
import Link from "next/link";

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

function CreatorSupportMessage() {
  return (
    <div className="w-full rounded-lg border bg-card p-6 shadow-sm min-h-[250px] flex items-center justify-center">
      <div className="space-y-4 text-center">
        <h3 className="text-2xl font-semibold tracking-tight">
          75% of ad revenue goes to creators
        </h3>
        <p className="text-muted-foreground">
          Support creators and enjoy dabble ad-free with Dabble+
        </p>
        <Link
          href="/plus"
          className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Learn more about Dabble+
        </Link>
      </div>
    </div>
  );
}

export function AdCard({ className, clientId, slotId }: AdCardProps) {
  const [showAd, setShowAd] = useState(true);

  useEffect(() => {
    // Set up the interval to toggle between ad and message
    const interval = setInterval(() => {
      setShowAd(prev => !prev);
    }, 15000); // 15 seconds

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Only push to adsbygoogle when showing ad
    if (showAd) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (error: any) {
        console.log(error.message);
      }
    }
  }, [showAd]);

  if (!showAd) {
    return <CreatorSupportMessage />;
  }

  return (
    <div className={cn("w-full rounded-lg border bg-card shadow-sm", className)}>
      <ins
        className="adsbygoogle block rounded-md"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );

  // return (
  //   <>
  //     {/* <Script
  //       id="adsense-script"
  //       strategy="afterInteractive"
  //       async
  //       src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
  //       crossOrigin="anonymous"
  //     /> */}

  //     <div
  //       className={cn(
  //         "w-full rounded-lg border bg-card p-4 shadow-sm",
  //         className
  //       )}
  //     >
  //       {/* <div className="flex h-[250px] w-full items-center justify-center"> */}
  //         <ins
  //           className="adsbygoogle block"
  //           data-ad-client={clientId}
  //           data-ad-slot={slotId}
  //           data-ad-format="auto"
  //           data-full-width-responsive="true"
  //         />
  //       </div>
  //     </div>
  //   </>
  // );
}
