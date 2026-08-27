import type { Metadata } from "next";
import "./globals.css";
import "./effects.css";
export const metadata: Metadata = {title:"Aurelia Jewels | Contemporary Heirlooms",description:"Aurelia Jewels — contemporary heirlooms in gold, diamond, and vivid colour."};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}
