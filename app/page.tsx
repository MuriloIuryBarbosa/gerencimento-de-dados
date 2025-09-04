import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Sistema de Gerenciamento de Dados</h1>
        <p className="text-lg mb-8">Gerencie dados com governança e controle</p>
        <div className="space-x-4">
          <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Login
          </Link>
          <Link href="/register" className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
            Cadastrar
          </Link>
        </div>
      </div>
    </div>
  );
}
