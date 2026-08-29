import type { Metadata } from "next";
import "./globals.css";
import "./effects.css";
import { ReduxProvider } from "@/lib/redux/ReduxProvider";
import { StoreProvider } from "@/components/context/StoreContext";
import { MainLayout } from "@/components/layout/MainLayout";

export const metadata: Metadata = {
  title: "Aurelia Jewels | Contemporary Heirlooms",
  description:
    "Aurelia Jewels — contemporary heirlooms in gold, diamond, and vivid colour.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <StoreProvider>
            <MainLayout>{children}</MainLayout>
          </StoreProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
