"use client";

import { Heart, MessageCircle, Repeat, Share2 } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import Script from "next/script";

interface ExploreAdCardProps {
  clientId: "ca-pub-6714877547689628";
  slotId: "2421030611";
}

export function ExploreAdCard({ clientId, slotId }: ExploreAdCardProps) {
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