"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NovoProdutoPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto redirect after 3 seconds
    const timer = setTimeout(() => {
      router.push('/cadastro/skus/novo');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  const handleRedirect = () => {
    router.push('/cadastro/skus/novo');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Package className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Cadastrar Novo Produto</h1>
              <p className="text-gray-600">Redirecionando para cadastro de SKU...</p>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Cadastro de Produtos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 text-center">
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 mb-4">
                  No nosso sistema, os produtos são cadastrados como <strong>SKUs (Stock Keeping Units)</strong>.
                </p>
                <p className="text-blue-700 text-sm">
                  Você será redirecionado automaticamente para a página de cadastro de SKUs em alguns segundos.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleRedirect}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Ir para Cadastro de SKU
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>

                <Button
                  variant="outline"
                  onClick={() => router.push('/cadastro/produtos')}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  Voltar
                </Button>
              </div>

              <div className="text-sm text-gray-500">
                <p>Redirecionamento automático em <span className="font-semibold">3 segundos</span>...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
