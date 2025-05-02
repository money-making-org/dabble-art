"use client";

import { Heart, MessageCircle, Repeat, Share2 } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import Script from "next/script";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ExploreAdCardProps {
  clientId: "ca-pub-6714877547689628";
  slotId: "2421030611";
}

function CreatorSupportMessage() {
  return (
    <div className="bg-card rounded-lg border">
      {/* Header - matching ad header */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
            <span className="text-sm font-medium">Ad</span>
          </div>
          <div className="flex-1">
            <p className="font-medium">Sponsored</p>
            <p className="text-sm text-muted-foreground">Advertisement</p>
          </div>
        </div>
      </div>

      {/* Content - full height support message */}
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background/80 to-background">
          <div className="space-y-6 text-center max-w-sm">
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold tracking-tight">
                75% of ad revenue goes to creators
              </h3>
              <p className="text-muted-foreground">
                Support creators and enjoy dabble ad-free with Dabble+
              </p>
            </div>
            <Link
              href="/plus"
              className="inline-flex items-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Learn more about Dabble+
            </Link>
          </div>
        </div>
      </div>

      {/* Footer - matching ad footer */}
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="hover:text-primary">
            <Heart className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:text-primary">
            <MessageCircle className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:text-primary">
            <Repeat className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:text-primary">
            <Share2 className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ExploreAdCard({ clientId, slotId }: ExploreAdCardProps) {
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
    <div className="bg-card rounded-lg border">
      {/* Ad Header */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
            <span className="text-sm font-medium">Ad</span>
          </div>
          <div className="flex-1">
            <p className="font-medium">Sponsored</p>
            <p className="text-sm text-muted-foreground">Advertisement</p>
          </div>
        </div>
      </div>

      {/* Ad Content */}
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        <ins
          className="adsbygoogle"
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            position: "absolute",
            inset: 0
          }}
          data-ad-client={clientId}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
        <Script
          id={`ad-script-${slotId}`}
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (adsbygoogle = window.adsbygoogle || []).push({});
            `,
          }}
        />
      </div>

      {/* Ad Footer */}
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="hover:text-primary">
            <Heart className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:text-primary">
            <MessageCircle className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:text-primary">
            <Repeat className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:text-primary">
            <Share2 className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
} 