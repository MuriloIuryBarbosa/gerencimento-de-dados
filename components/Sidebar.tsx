"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Home, Settings, BarChart3, Package, Truck, FileText, ShoppingCart, ClipboardList, Palette, DollarSign, Archive, Layers, LogOut } from "lucide-react";
import { useLanguage } from "./LanguageContext";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const { t } = useLanguage();
  const [expandedModules, setExpandedModules] = useState<string[]>([]);

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
      name: t("planning"),
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
          name: t("proformas"),
          href: "/proforma",
          icon: FileText,
          description: "Gerenciar proformas"
        },
        {
          name: t("requisitions"),
          href: "/requisicoes",
          icon: ClipboardList,
          description: "Gerenciar requisições"
        },
        {
          name: t("containers"),
          href: "/conteineres",
          icon: Package,
          description: "Gerenciar conteineres"
        },
        {
          name: t("followUp"),
          href: "/follow-up",
          icon: Truck,
          description: "Acompanhar logística"
        }
      ]
    },
    {
      name: t("executive"),
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
        }
      ]
    },
    {
      name: t("registration"),
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
        }
      ]
    },
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
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {isOpen && (
          <h2 className="text-lg font-semibold text-white">{t('system')}</h2>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          aria-label={isOpen ? "Recolher menu" : "Expandir menu"}
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>      {/* Menu Items */}
      <nav className="mt-8">
        <ul className="space-y-2 px-2">
          {menuModules.map((module) => {
            const Icon = module.icon;

            if (module.submodules) {
              // Module with submodules
              return (
                <li key={module.name}>
                  <button
                    onClick={() => toggleModule(module.name)}
                    className={`flex items-center w-full px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors group ${
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
                  </button>

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
          onClick={() => {
            // TODO: Implement logout logic
            alert('Logout realizado com sucesso!');
            window.location.href = '/login';
          }}
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
