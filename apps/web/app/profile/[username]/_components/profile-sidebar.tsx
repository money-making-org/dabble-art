import { Mail, Globe, Twitter, Instagram, Award, Star } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { AdCard } from "@/components/ad-card";

// Mock data for badges and achievements
const badges = [
  { name: "Early Adopter", icon: Star, description: "Joined in the first month" },
  { name: "Top Creator", icon: Award, description: "Reached 10K followers" },
  { name: "Art Master", icon: Award, description: "Created 100+ artworks" },
];

// Mock contact info
const contactInfo = {
  email: "contact@example.com",
  website: "www.example.com",
  twitter: "@username",
  instagram: "@username",
};

export function ProfileSidebar() {
  return (
    <div className="hidden md:block w-80">
      <div className="sticky top-29.5 space-y-4">
        {/* Contact Information */}
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="font-medium mb-4">Contact Info</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{contactInfo.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <a href={`https://${contactInfo.website}`} className="hover:underline">
                {contactInfo.website}
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Twitter className="h-4 w-4 text-muted-foreground" />
              <a href={`https://twitter.com/${contactInfo.twitter}`} className="hover:underline">
                {contactInfo.twitter}
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Instagram className="h-4 w-4 text-muted-foreground" />
              <a href={`https://instagram.com/${contactInfo.instagram}`} className="hover:underline">
                {contactInfo.instagram}
              </a>
            </div>
          </div>
        </div>

        {/* Badges & Achievements */}
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="font-medium mb-4">Badges & Achievements</h3>
          <div className="space-y-4">
            {badges.map((badge) => (
              <div key={badge.name} className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <badge.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{badge.name}</p>
                  <p className="text-sm text-muted-foreground">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ad Card */}
        <AdCard clientId="ca-pub-6714877547689628" slotId="3489516387" />
      </div>
    </div>
  );
} 