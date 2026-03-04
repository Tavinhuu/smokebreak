import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TabacariaProvider } from "@/context/TabacariaContext";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Badge System",
  description: "Gestão de Tabacaria",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className={`${inter.className} bg-gray-50 pb-24`}>
        <TabacariaProvider>
          {children}
          <Navigation />
        </TabacariaProvider>
      </body>
    </html>
  );
}