import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alyxa — Diagnostic Cabinet Dentaire",
  description: "Calculez votre chiffre d'affaires non capturé et découvrez votre potentiel récupérable en 3 minutes.",
  openGraph: {
    title: "Alyxa — Diagnostic Cabinet Dentaire",
    description: "Calculez votre chiffre d'affaires non capturé en 3 minutes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
