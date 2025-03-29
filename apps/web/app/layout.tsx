import { Geist, Geist_Mono } from "next/font/google";

import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import ReactQueryProvider from "@/components/react-query-provider";
import { SidebarProvider } from "@workspace/ui/components/sidebar";
import { SidebarInset } from "@workspace/ui/components/sidebar";
import { AppSidebar } from "@workspace/ui/components/app-sidebar";
import { Toaster } from "sonner";
import { NavigationMenu } from "@/app/components/navigation-menu";
import Head from "next/head";
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
      <Head>
        <Script
          defer
          src="https://umami.dabble.art/script.js"
          data-website-id="bf23d432-fe96-45aa-8fdd-09bcd25930e7"
        ></Script>
      </Head>

      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <ReactQueryProvider>
          <Providers>
            <SidebarProvider>
              <SidebarInset>
                <NavigationMenu />
                {children}
              </SidebarInset>
            </SidebarProvider>
          </Providers>
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
