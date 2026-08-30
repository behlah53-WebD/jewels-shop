import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./effects.css";
import "./animations.css";
import { ReduxProvider } from "@/lib/redux/ReduxProvider";
import { StoreProvider } from "@/components/context/StoreContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { PwaRegister } from "@/components/pwa/PwaRegister";

export const viewport: Viewport = {
  themeColor: "#163a2b",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Aurelia Jewels | Contemporary Heirlooms",
  description:
    "Aurelia Jewels — contemporary heirlooms in gold, diamond, and vivid colour.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Aurelia Jewels",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ReduxProvider>
          <StoreProvider>
            <MainLayout>{children}</MainLayout>
            <PwaRegister />
          </StoreProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}

