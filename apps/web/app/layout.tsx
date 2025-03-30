import { Geist, Geist_Mono } from "next/font/google";

import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import ReactQueryProvider from "@/components/react-query-provider";
import { Toaster } from "sonner";
import { NavigationMenu } from "@/app/components/navigation-menu";
import { Footer } from "@/app/components/footer";
import Script from "next/script";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          defer
          src="https://umami.dabble.art/script.js"
          data-website-id="bf23d432-fe96-45aa-8fdd-09bcd25930e7"
        ></Script>
      </head>

      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <ReactQueryProvider>
          <Providers>
            <div className="flex flex-col min-h-screen">
              <NavigationMenu />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </Providers>
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
