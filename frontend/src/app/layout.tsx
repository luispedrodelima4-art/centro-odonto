import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Centro Odonto - Modern Clinical Management SaaS",
  description: "Next-generation dental clinic software with interactive odontograms, diagnostic imaging, and EHR.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#FAF8F5] antialiased text-[#362312] font-sans selection:bg-[#8B623B] selection:text-white">
        {children}
      </body>
    </html>
  );
}
