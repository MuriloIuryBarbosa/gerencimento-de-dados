import { Suspense } from 'react'
import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Building2 } from 'lucide-react'
import Link from 'next/link'
import { UnegTable } from '@/components/uneg/UnegTable'
import { UnegStats } from '@/components/uneg/UnegStats'

export const metadata: Metadata = {
  title: 'UNEG | Sistema de Gestão',
  description: 'Gerencie as unidades de negócio (UNEG)',
}

export default function UnegPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Building2 className="h-8 w-8" />
              Unidades de Negócio (UNEG)
            </h1>
            <p className="text-purple-100 mt-2">
              Gerencie as unidades de negócio da sua empresa
            </p>
          </div>
          <Link href="/executivo/uneg/nova">
            <Button className="bg-white text-purple-600 hover:bg-purple-50">
              <Plus className="h-4 w-4 mr-2" />
              Nova UNEG
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <Suspense fallback={<div>Carregando estatísticas...</div>}>
        <UnegStats />
      </Suspense>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>UNEGs Cadastradas</CardTitle>
          <CardDescription>
            Lista completa de todas as unidades de negócio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Carregando UNEGs...</div>}>
            <UnegTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
