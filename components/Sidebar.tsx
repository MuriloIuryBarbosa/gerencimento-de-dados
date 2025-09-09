"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, Home, Settings, BarChart3, Package, Truck, FileText, ShoppingCart, ClipboardList, Palette, DollarSign, Archive, Layers, LogOut, Shield, User, Crown, ShieldCheck, Bell, Ruler, Building2, Warehouse } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import { useUserPermissions } from "./useUserPermissions";
import { useUsuarioAtual } from "./useUsuarioAtual";
import { useAuth } from "./AuthContext";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const { t, language, setLanguage } = useLanguage();
  const { canAccessAdmin, loading: permissionsLoading } = useUserPermissions();
  const { usuario, loading: userLoading, papel, cargo } = useUsuarioAtual();
  const { logout } = useAuth();
  const pathname = usePathname();
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = 0; // Temporário - implementar depois

  // Função para determinar qual módulo deve estar expandido baseado na rota atual
  const getModuleFromPath = (path: string): string | null => {
    // Mapeamento de rotas para módulos
    const routeMappings: Record<string, string> = {
      // Cadastro
      '/cadastro': 'Cadastro',
      '/cadastro/skus': 'Cadastro',
      '/cadastro/cores': 'Cadastro',
      '/cadastro/representantes': 'Cadastro',
      '/cadastro/clientes': 'Cadastro',
      '/cadastro/fornecedores': 'Cadastro',
      '/cadastro/transportadoras': 'Cadastro',
      '/cadastro/empresas': 'Cadastro',

      // Executivo
      '/executivo': 'Executivo',
      '/executivo/skus': 'Executivo',
      '/executivo/precos': 'Executivo',
      '/executivo/estoque': 'Executivo',
      '/executivo/cores': 'Executivo',
      '/executivo/familias': 'Executivo',
      '/executivo/tamanhos': 'Executivo',
      '/executivo/uneg': 'Executivo',
      '/executivo/depositos': 'Executivo',

      // Cubagem
      '/cubagem': 'Cubagem',
      '/cubagem/simulador': 'Cubagem',

      // Financeiro
      '/financeiro': 'Financeiro',
      '/financeiro/boletos': 'Financeiro',

      // Planejamento
      '/planejamento': 'Planejamento',
      '/ordem-compra': 'Planejamento',
      '/ordem-compra/nova': 'Planejamento',
      '/proforma': 'Planejamento',
      '/requisicoes': 'Planejamento',
      '/requisicoes/nova': 'Planejamento',
      '/conteineres': 'Planejamento',
      '/followup': 'Planejamento',

      // Administração
      '/admin': 'Administração',
      '/admin/dashboard': 'Administração',
      '/admin/usuarios': 'Administração',
      '/admin/permissoes': 'Administração',
      '/admin/permissoes-dinamicas': 'Administração',
      '/admin/logs': 'Administração',
      '/admin/tabelas': 'Administração',
    };

    return routeMappings[path] || null;
  };

  // Atualizar módulos expandidos baseado na rota atual
  useEffect(() => {
    const currentModule = getModuleFromPath(pathname);
    if (currentModule) {
      setExpandedModules([currentModule]);
    }
  }, [pathname]);

  const toggleModule = (moduleName: string) => {
    setExpandedModules(prev =>
      prev.includes(moduleName)
        ? prev.filter(name => name !== moduleName)
        : [...prev, moduleName]
    );
  };

  const menuModules = [
    {
      name: t("home"),
      href: "/",
      icon: Home,
      description: "Dashboard geral do sistema"
    },
    {
      name: t("registration"),
      href: "/cadastro",
      icon: Package,
      description: "Módulos de cadastro",
      submodules: [
        {
          name: t("skus"),
          href: "/cadastro/skus",
          icon: Package,
          description: "Gerenciar SKUs"
        },
        {
          name: t("colors"),
          href: "/cadastro/cores",
          icon: Palette,
          description: "Gerenciar cores"
        },
        {
          name: t("representatives"),
          href: "/cadastro/representantes",
          icon: Truck,
          description: "Gerenciar representantes"
        },
        {
          name: t("clients"),
          href: "/cadastro/clientes",
          icon: Home,
          description: "Gerenciar clientes"
        },
        {
          name: t("suppliers"),
          href: "/cadastro/fornecedores",
          icon: ShoppingCart,
          description: "Gerenciar fornecedores"
        },
        {
          name: t("carriers"),
          href: "/cadastro/transportadoras",
          icon: Truck,
          description: "Gerenciar transportadoras"
        },
        {
          name: "Empresas",
          href: "/cadastro/empresas",
          icon: Home,
          description: "Gerenciar empresas do sistema"
        }
      ]
    },
    {
      name: t("executive"),
      href: "/executivo",
      icon: Layers,
      description: "Módulos executivos",
      submodules: [
        {
          name: t("skus"),
          href: "/executivo/skus",
          icon: Package,
          description: "Gerenciar SKUs"
        },
        {
          name: t("prices"),
          href: "/executivo/precos",
          icon: DollarSign,
          description: "Controlar preços"
        },
        {
          name: t("stock"),
          href: "/executivo/estoque",
          icon: Archive,
          description: "Gerenciar estoque"
        },
        {
          name: t("colors"),
          href: "/executivo/cores",
          icon: Palette,
          description: "Gerenciar cores"
        },
        {
          name: "Famílias",
          href: "/executivo/familias",
          icon: Package,
          description: "Gerenciar famílias de produtos"
        },
        {
          name: "Tamanhos",
          href: "/executivo/tamanhos",
          icon: Ruler,
          description: "Gerenciar tamanhos de produtos"
        },
        {
          name: "UNEG",
          href: "/executivo/uneg",
          icon: Building2,
          description: "Gerenciar unidades de negócio"
        },
        {
          name: "Depósitos",
          href: "/executivo/depositos",
          icon: Warehouse,
          description: "Gerenciar depósitos e centros de distribuição"
        }
      ]
    },
    {
      name: "Cubagem",
      href: "/cubagem",
      icon: Package,
      description: "Módulos de cubagem e volume",
      submodules: [
        {
          name: "Simulador de Cubagem",
          href: "/cubagem/simulador",
          icon: Package,
          description: "Simular cubagem de produtos"
        }
      ]
    },
    {
      name: "Financeiro",
      href: "/financeiro",
      icon: DollarSign,
      description: "Módulos financeiros",
      submodules: [
        {
          name: "Gestão de Boletos",
          href: "/financeiro/boletos",
          icon: FileText,
          description: "Gerenciar boletos e pagamentos"
        }
      ]
    },
    {
      name: t("planning"),
      href: "/planejamento",
      icon: BarChart3,
      description: "Módulos de planejamento",
      submodules: [
        {
          name: t("orders"),
          href: "/ordem-compra",
          icon: ShoppingCart,
          description: "Gerenciar ordens de compra"
        },
        {
          name: t("requisitions"),
          href: "/requisicoes",
          icon: ClipboardList,
          description: "Gerenciar requisições"
        },
        {
          name: "Proformas Control",
          href: "/proforma",
          icon: FileText,
          description: "Gerenciar proformas"
        },
        {
          name: t("containers"),
          href: "/conteineres",
          icon: Package,
          description: "Gerenciar conteineres"
        },
        {
          name: t("followUp"),
          href: "/followup",
          icon: Truck,
          description: "Acompanhar logística"
        }
      ]
    },
    // Módulo de Administração - apenas para usuários com permissão
    ...(canAccessAdmin ? [{
      name: "Administração",
      href: "/admin",
      icon: Shield,
      description: "Painel administrativo do sistema",
      submodules: [
        {
          name: "Dashboard Admin",
          href: "/admin/dashboard",
          icon: BarChart3,
          description: "Dashboard administrativo"
        },
        {
          name: "Gerenciar Usuários",
          href: "/admin/usuarios",
          icon: Home,
          description: "Gerenciar usuários do sistema"
        },
        {
          name: "Gerenciar Permissões",
          href: "/admin/permissoes",
          icon: Shield,
          description: "Controlar permissões de acesso"
        },
        {
          name: "Permissões Dinâmicas",
          href: "/admin/permissoes-dinamicas",
          icon: ShieldCheck,
          description: "Atribuir permissões por página"
        },
        {
          name: "Logs do Sistema",
          href: "/admin/logs",
          icon: FileText,
          description: "Visualizar logs de auditoria"
        },
        {
          name: "Tabelas Dinâmicas",
          href: "/admin/tabelas",
          icon: Package,
          description: "Gerenciar tabelas dinâmicas"
        }
      ]
    }] : []),
    {
      name: t("settings"),
      href: "/settings",
      icon: Settings,
      description: "Configurações do sistema"
    }
  ];

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      <div className={`fixed left-0 top-0 h-full bg-gray-800 text-white transition-all duration-300 z-50 ${
        isOpen ? 'w-64 lg:w-64' : 'w-16 lg:w-16'
      } ${isOpen ? 'block' : 'hidden lg:block'}`}>
      {/* Header with Controls */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {isOpen && (
          <h2 className="text-lg font-semibold text-white">{t('system')}</h2>
        )}
        <div className="flex items-center space-x-2">
          {/* Language Selector */}
          {isOpen && (
            <div className="flex items-center bg-gray-700 rounded-full p-1">
              <button
                onClick={() => setLanguage('pt')}
                className={`px-3 py-1 rounded-full text-xs transition-all duration-200 ${
                  language === 'pt'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                🇧🇷 PT
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-full text-xs transition-all duration-200 ${
                  language === 'en'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                🇺🇸 EN
              </button>
            </div>
          )}

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors relative"
              title="Notificações"
            >
              <Bell size={18} className="text-gray-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
            aria-label={isOpen ? "Recolher menu" : "Expandir menu"}
          >
            {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
      </div>

      {/* User Info Section */}
      {isOpen && (
        <div className="px-4 py-3 border-b border-gray-700 bg-gray-750">
          {userLoading ? (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-600 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="h-3 bg-gray-600 rounded animate-pulse mb-1"></div>
                <div className="h-2 bg-gray-600 rounded animate-pulse"></div>
              </div>
            </div>
          ) : usuario ? (
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                {usuario.isSuperAdmin && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Crown size={10} className="text-white" />
                  </div>
                )}
                {usuario.isAdmin && !usuario.isSuperAdmin && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <ShieldCheck size={10} className="text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">
                  {usuario.nome}
                </div>
                <div className="text-xs text-gray-400 truncate">
                  {cargo}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {papel}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <User size={16} className="text-gray-400" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-400">Usuário não identificado</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Profile Link */}
      {isOpen && usuario && (
        <div className="px-4 py-2 border-b border-gray-700">
          <Link
            href="/perfil"
            className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white transition-colors"
          >
            <User size={14} />
            <span>Ver Perfil Completo</span>
          </Link>
        </div>
      )}      {/* Menu Items with Scroll */}
      <nav className="mt-8 flex-1 overflow-y-auto">
        <ul className="space-y-2 px-2 pb-20">
          {menuModules.map((module) => {
            const Icon = module.icon;

            if (module.submodules) {
              // Module with submodules
              return (
                <li key={module.name}>
                  <div className="flex flex-col">
                    {/* Module header - clickable */}
                    <Link
                      href={module.href}
                      className={`flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors group ${
                        isOpen ? 'justify-between' : 'justify-center'
                      }`}
                      title={isOpen ? '' : module.description}
                    >
                      <div className="flex items-center">
                        <Icon size={20} className="text-gray-300 group-hover:text-white" />
                        {isOpen && (
                          <span className="ml-3 text-gray-300 group-hover:text-white">
                            {module.name}
                          </span>
                        )}
                      </div>
                      {isOpen && (
                        <ChevronRight
                          size={16}
                          className={`text-gray-400 transition-transform ${
                            expandedModules.includes(module.name) ? 'rotate-90' : ''
                          }`}
                        />
                      )}
                    </Link>
                  </div>

                  {/* Submodules */}
                  {isOpen && expandedModules.includes(module.name) && (
                    <ul className="ml-6 mt-2 space-y-1">
                      {module.submodules.map((submodule) => {
                        const SubIcon = submodule.icon;
                        return (
                          <li key={submodule.name}>
                            <Link
                              href={submodule.href}
                              className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors group"
                              title={submodule.description}
                            >
                              <SubIcon size={16} className="text-gray-400 group-hover:text-white" />
                              <span className="ml-3 text-gray-400 group-hover:text-white text-sm">
                                {submodule.name}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            } else {
              // Regular menu item
              return (
                <li key={module.name}>
                  <Link
                    href={module.href}
                    className={`flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors group ${
                      isOpen ? 'justify-start' : 'justify-center'
                    }`}
                    title={isOpen ? '' : module.description}
                  >
                    <Icon size={20} className="text-gray-300 group-hover:text-white" />
                    {isOpen && (
                      <span className="ml-3 text-gray-300 group-hover:text-white">
                        {module.name}
                      </span>
                    )}
                  </Link>
                </li>
              );
            }
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-16 left-2 right-2">
        <button
          onClick={logout}
          className={`flex items-center w-full px-4 py-3 rounded-lg hover:bg-red-700 transition-colors group ${
            isOpen ? 'justify-start' : 'justify-center'
          }`}
          title={isOpen ? '' : 'Fazer logout'}
        >
          <LogOut size={20} className="text-gray-300 group-hover:text-white" />
          {isOpen && (
            <span className="ml-3 text-gray-300 group-hover:text-white">
              {t('logout')}
            </span>
          )}
        </button>
      </div>

      {/* Footer */}
      {isOpen && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="text-xs text-gray-400 text-center">
            Sistema de Gerenciamento
          </div>
        </div>
      )}
    </div>
    </>
  );
}
