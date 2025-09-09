import { Suspense } from 'react'
import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Ruler } from 'lucide-react'
import Link from 'next/link'
import { TamanhosTable } from '@/components/tamanhos/TamanhosTable'
import { TamanhosStats } from '@/components/tamanhos/TamanhosStats'

export const metadata: Metadata = {
  title: 'Tamanhos | Sistema de Gestão',
  description: 'Gerencie os tamanhos dos produtos',
}

export default function TamanhosPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Ruler className="h-8 w-8" />
              Tamanhos
            </h1>
            <p className="text-green-100 mt-2">
              Gerencie os tamanhos disponíveis para seus produtos
            </p>
          </div>
          <Link href="/executivo/tamanhos/nova">
            <Button className="bg-white text-green-600 hover:bg-green-50">
              <Plus className="h-4 w-4 mr-2" />
              Novo Tamanho
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <Suspense fallback={<div>Carregando estatísticas...</div>}>
        <TamanhosStats />
      </Suspense>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Tamanhos Cadastrados</CardTitle>
          <CardDescription>
            Lista completa de todos os tamanhos disponíveis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Carregando tamanhos...</div>}>
            <TamanhosTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
