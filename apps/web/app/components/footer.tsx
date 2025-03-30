import Link from "next/link";
import Image from "next/image";
import { Github, Twitter, MessageSquare, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:justify-between gap-8">
          {/* Brand section */}
          <div className="flex flex-col items-center md:items-start space-y-3">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/logotest2.png" alt="dabble.art" width={40} height={40} />
              <span className="font-bold text-xl bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500 bg-clip-text text-transparent -ml-2">
                dabble.art
              </span>
            </Link>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              Create, share, and discover digital art
            </p>
          </div>

          {/* Links section */}
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div className="space-y-3">
              <h4 className="font-semibold">Platform</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/challenges" className="text-muted-foreground hover:text-foreground">
                    Challenges
                  </Link>
                </li>
                <li>
                  <Link href="/discover" className="text-muted-foreground hover:text-foreground">
                    Discover
                  </Link>
                </li>
                <li>
                  <Link href="/upload" className="text-muted-foreground hover:text-foreground">
                    Upload
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Legal & Help</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/dabble-art"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://discord.gg/jG6gYzePmr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
              aria-label="Discord"
            >
              <MessageSquare className="h-5 w-5" />
            </a>
            <a
              href="mailto:contact@dabble.art"
              className="text-muted-foreground hover:text-foreground"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>

          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} dabble.art. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 