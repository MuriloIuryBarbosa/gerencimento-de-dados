"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Home, Settings, BarChart3, Package, Truck, FileText, ShoppingCart, ClipboardList, Palette, DollarSign, Archive, Layers, LogOut } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
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
      name: "Home",
      href: "/",
      icon: Home,
      description: "Dashboard geral do sistema"
    },
    {
      name: "Planejamento",
      icon: BarChart3,
      description: "Módulos de planejamento",
      submodules: [
        {
          name: "Ordens de Compra",
          href: "/ordem-compra",
          icon: ShoppingCart,
          description: "Gerenciar ordens de compra"
        },
        {
          name: "Proformas",
          href: "/proforma",
          icon: FileText,
          description: "Gerenciar proformas"
        },
        {
          name: "Requisições",
          href: "/requisicoes",
          icon: ClipboardList,
          description: "Gerenciar requisições"
        },
        {
          name: "Conteineres",
          href: "/conteineres",
          icon: Package,
          description: "Gerenciar conteineres"
        },
        {
          name: "Follow Up",
          href: "/follow-up",
          icon: Truck,
          description: "Acompanhar logística"
        }
      ]
    },
    {
      name: "Executivo",
      icon: Layers,
      description: "Módulos executivos",
      submodules: [
        {
          name: "Gestão de SKUs",
          href: "/executivo/skus",
          icon: Package,
          description: "Gerenciar SKUs"
        },
        {
          name: "Gestão de Preços",
          href: "/executivo/precos",
          icon: DollarSign,
          description: "Controlar preços"
        },
        {
          name: "Controle de Estoque",
          href: "/executivo/estoque",
          icon: Archive,
          description: "Gerenciar estoque"
        },
        {
          name: "Controle de Cores",
          href: "/executivo/cores",
          icon: Palette,
          description: "Gerenciar cores"
        }
      ]
    },
    {
      name: "Configurações",
      href: "/settings",
      icon: Settings,
      description: "Configurações do sistema"
    }
  ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-gray-800 text-white transition-all duration-300 z-50 ${
      isOpen ? 'w-64' : 'w-16'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {isOpen && (
          <h2 className="text-lg font-semibold text-white">Sistema</h2>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          aria-label={isOpen ? "Recolher menu" : "Expandir menu"}
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* Menu Items */}
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
              Logout
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
  );
}
