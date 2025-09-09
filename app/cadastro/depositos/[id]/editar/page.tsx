'use client';

import { useParams } from 'next/navigation';

export default function EditarDeposito() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Editar Depósito</h1>
      <p>ID do depósito: {id}</p>
      <p className="text-gray-500 mt-4">Página em desenvolvimento...</p>
    </div>
  );
}
