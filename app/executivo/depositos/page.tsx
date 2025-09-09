import { Suspense } from 'react'
import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Warehouse } from 'lucide-react'
import Link from 'next/link'
import { DepositosTable } from '@/components/depositos/DepositosTable'
import { DepositosStats } from '@/components/depositos/DepositosStats'

export const metadata: Metadata = {
  title: 'Depósitos | Sistema de Gestão',
  description: 'Gerencie os depósitos e centros de distribuição',
}

export default function DepositosPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Warehouse className="h-8 w-8" />
              Depósitos
            </h1>
            <p className="text-orange-100 mt-2">
              Gerencie seus depósitos e centros de distribuição
            </p>
          </div>
          <Link href="/executivo/depositos/nova">
            <Button className="bg-white text-orange-600 hover:bg-orange-50">
              <Plus className="h-4 w-4 mr-2" />
              Novo Depósito
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <Suspense fallback={<div>Carregando estatísticas...</div>}>
        <DepositosStats />
      </Suspense>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Depósitos Cadastrados</CardTitle>
          <CardDescription>
            Lista completa de todos os depósitos e centros de distribuição
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Carregando depósitos...</div>}>
            <DepositosTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
