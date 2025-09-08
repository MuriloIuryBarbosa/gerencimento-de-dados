"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import { LanguageProvider, useLanguage } from "../components/LanguageContext";
import { NotificationProvider } from "../components/Notification";
import { AuthProvider } from "../components/AuthContext";

function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="fixed top-4 right-4 z-50">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as 'pt' | 'en')}
        className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="pt">{t('portuguese')}</option>
        <option value="en">{t('english')}</option>
      </select>
    </div>
  );
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Não mostrar sidebar na página de login
  const isLoginPage = pathname === '/login';
  const showSidebar = !isLoginPage;

  return (
    <div className="flex min-h-screen">
      {showSidebar && <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />}
      <main className={`flex-1 transition-all duration-300 ${
        showSidebar && sidebarOpen ? 'lg:ml-64 ml-0' : showSidebar && !sidebarOpen ? 'lg:ml-16 ml-0' : 'ml-0'
      }`}>
        {/* Mobile menu button - só mostrar se não for página de login */}
        {showSidebar && (
          <div className="lg:hidden fixed top-4 left-4 z-50">
            <button
              onClick={toggleSidebar}
              className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
              aria-label="Abrir menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        )}
        <LanguageSelector />
        {children}
      </main>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 text-gray-900">
        <LanguageProvider>
          <AuthProvider>
            <NotificationProvider>
              <AppLayout>{children}</AppLayout>
            </NotificationProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
