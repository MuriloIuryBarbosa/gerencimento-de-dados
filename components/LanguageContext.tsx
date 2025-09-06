"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'pt' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  pt: {
    // Sidebar
    system: 'Sistema',
    home: 'Home',
    planning: 'Planejamento',
    executive: 'Executivo',
    settings: 'Configurações',
    logout: 'Logout',
    // Common
    dashboard: 'Dashboard',
    orders: 'Ordens de Compra',
    proformas: 'Proformas',
    requisitions: 'Requisições',
    containers: 'Conteineres',
    followUp: 'Follow Up',
    skus: 'Gestão de SKUs',
    prices: 'Gestão de Preços',
    stock: 'Controle de Estoque',
    colors: 'Controle de Cores',
    // Language selector
    language: 'Idioma',
    portuguese: 'Português',
    english: 'Inglês',
    // Orders page
    manageOrders: 'Gerencie todas as ordens de compra da empresa',
    listOfOrders: 'Lista de Ordens de Compra',
    viewManageOrders: 'Visualize e gerencie todas as ordens de compra registradas',
    newPurchaseOrder: 'Nova Ordem de Compra',
    fillDataNewOrder: 'Preencha os dados para criar uma nova ordem de compra',
    supplierInfo: 'Informações do Fornecedor',
    cnpj: 'CNPJ',
    address: 'Endereço',
    phone: 'Telefone',
    paymentTerms: 'Condição de Pagamento',
    deliveryDeadline: 'Prazo de Entrega',
    observations: 'Observações',
    items: 'Itens',
    description: 'Descrição',
    quantity: 'Quantidade',
    unit: 'Unidade',
    unitValue: 'Valor Unitário',
    addItem: 'Adicionar Item',
    remove: 'Remover',
    generalTotal: 'Total Geral',
    createOrder: 'Criar Ordem',
    cancel: 'Cancelar',
    back: 'Voltar',
    // Login page
    login: 'Login',
    email: 'Email',
    password: 'Senha',
    enter: 'Entrar',
    noAccount: 'Não tem conta?',
    register: 'Cadastrar',
    // Dashboard
    generalOverview: 'Visão geral do sistema de gerenciamento',
    totalSkus: 'Total de SKUs',
    activeOrders: 'Ordens Ativas',
    managedData: 'Dados Gerenciados',
    users: 'Usuários',
    reports: 'Relatórios',
    pendingRequests: 'Requisições Pendentes',
    stockValue: 'Valor em Estoque',
    // Table headers
    order: 'Ordem',
    supplier: 'Fornecedor',
    issueDate: 'Data Emissão',
    totalValue: 'Valor Total',
    status: 'Status',
    priority: 'Prioridade',
    actions: 'Ações',
    viewDetails: 'Ver Detalhes',
    edit: 'Editar',
    previous: 'Anterior',
    next: 'Próximo',
    showing: 'Mostrando',
    to: 'a',
    of: 'de',
    results: 'resultados',
  },
  en: {
    // Sidebar
    system: 'System',
    home: 'Home',
    planning: 'Planning',
    executive: 'Executive',
    settings: 'Settings',
    logout: 'Logout',
    // Common
    dashboard: 'Dashboard',
    orders: 'Purchase Orders',
    proformas: 'Proformas',
    requisitions: 'Requisitions',
    containers: 'Containers',
    followUp: 'Follow Up',
    skus: 'SKU Management',
    prices: 'Price Management',
    stock: 'Stock Control',
    colors: 'Color Control',
    // Language selector
    language: 'Language',
    portuguese: 'Portuguese',
    english: 'English',
    // Orders page
    manageOrders: 'Manage all purchase orders of the company',
    listOfOrders: 'List of Purchase Orders',
    viewManageOrders: 'View and manage all registered purchase orders',
    newPurchaseOrder: 'New Purchase Order',
    fillDataNewOrder: 'Fill in the data to create a new purchase order',
    supplierInfo: 'Supplier Information',
    cnpj: 'CNPJ',
    address: 'Address',
    phone: 'Phone',
    paymentTerms: 'Payment Terms',
    deliveryDeadline: 'Delivery Deadline',
    observations: 'Observations',
    items: 'Items',
    description: 'Description',
    quantity: 'Quantity',
    unit: 'Unit',
    unitValue: 'Unit Value',
    addItem: 'Add Item',
    remove: 'Remove',
    generalTotal: 'General Total',
    createOrder: 'Create Order',
    cancel: 'Cancel',
    back: 'Back',
    // Login page
    login: 'Login',
    email: 'Email',
    password: 'Password',
    enter: 'Enter',
    noAccount: 'Don\'t have an account?',
    register: 'Register',
    // Dashboard
    generalOverview: 'General overview of the management system',
    totalSkus: 'Total SKUs',
    activeOrders: 'Active Orders',
    managedData: 'Managed Data',
    users: 'Users',
    reports: 'Reports',
    pendingRequests: 'Pending Requests',
    stockValue: 'Stock Value',
    // Table headers
    order: 'Order',
    supplier: 'Supplier',
    issueDate: 'Issue Date',
    totalValue: 'Total Value',
    status: 'Status',
    priority: 'Priority',
    actions: 'Actions',
    viewDetails: 'View Details',
    edit: 'Edit',
    previous: 'Previous',
    next: 'Next',
    showing: 'Showing',
    to: 'to',
    of: 'of',
    results: 'results',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('pt');

  useEffect(() => {
    // Load language from localStorage on mount
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'pt' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
