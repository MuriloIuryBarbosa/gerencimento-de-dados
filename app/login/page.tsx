"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "../../components/LanguageContext";
import { useAuth } from "../../components/AuthContext";
import { useNotification } from "../../components/Notification";

export default function Login() {
  const { t } = useLanguage();
  const { login, isAuthenticated } = useAuth();
  const { showNotification } = useNotification();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    console.log('Login page - isAuthenticated:', isAuthenticated);
    if (isAuthenticated) {
      console.log('Login page - Redirecionando para dashboard');
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login form submitted with:', { email, password });
    setIsLoading(true);

    try {
      console.log('Calling login function...');
      const result = await login(email, password);
      console.log('Login result:', result);

      if (result.success) {
        console.log('Login successful, showing notification and redirecting');
        showNotification('success', 'Login realizado com sucesso!');
        router.push('/');
      } else {
        console.log('Login failed:', result.error);
        showNotification('error', result.error || 'Erro no login');
      }
    } catch (error) {
      console.error('Login error:', error);
      showNotification('error', 'Erro interno do servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">{t('login')}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">{t('email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white text-gray-900"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">{t('password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white text-gray-900"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Entrando...
              </>
            ) : (
              t('enter')
            )}
          </button>
        </form>
        <p className="mt-4 text-center">
          {t('noAccount')} <Link href="/register" className="text-blue-600">{t('register')}</Link>
        </p>
      </div>
    </div>
  );
}
