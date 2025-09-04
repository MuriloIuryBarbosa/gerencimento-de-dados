import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sistema de Gerenciamento de Dados",
  description: "Sistema web para gerenciamento de dados com governança",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
