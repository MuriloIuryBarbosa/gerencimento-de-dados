"use client";

import { useState } from "react";

export default function Settings() {
  const [logo, setLogo] = useState<File | null>(null);
  const [companyName, setCompanyName] = useState("");

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement settings save logic
    console.log("Settings:", companyName, logo);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
            <nav className="space-x-4">
              <a href="/dashboard" className="text-blue-600 hover:text-blue-800">Dashboard</a>
              <button className="text-red-600 hover:text-red-800">Logout</button>
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Configurações da Empresa</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Nome da Empresa</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700">Logo da Empresa</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="w-full px-3 py-2 border rounded"
                />
                {logo && <p className="mt-2 text-sm text-gray-600">Arquivo selecionado: {logo.name}</p>}
              </div>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Salvar Configurações
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
