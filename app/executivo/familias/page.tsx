import { Suspense } from 'react'
import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Package } from 'lucide-react'
import Link from 'next/link'
import { FamiliasTable } from '@/components/familias/FamiliasTable'
import { FamiliasStats } from '@/components/familias/FamiliasStats'

export const metadata: Metadata = {
  title: 'Famílias de Produtos | Sistema de Gestão',
  description: 'Gerencie as famílias de produtos do sistema',
}

export default function FamiliasPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Package className="h-8 w-8" />
              Famílias de Produtos
            </h1>
            <p className="text-blue-100 mt-2">
              Gerencie as categorias e famílias dos seus produtos
            </p>
          </div>
          <Link href="/executivo/familias/nova">
            <Button className="bg-white text-blue-600 hover:bg-blue-50">
              <Plus className="h-4 w-4 mr-2" />
              Nova Família
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <Suspense fallback={<div>Carregando estatísticas...</div>}>
        <FamiliasStats />
      </Suspense>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Famílias Cadastradas</CardTitle>
          <CardDescription>
            Lista completa de todas as famílias de produtos do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Carregando famílias...</div>}>
            <FamiliasTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
