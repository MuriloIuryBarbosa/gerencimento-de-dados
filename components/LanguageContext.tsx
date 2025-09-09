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
    registration: 'Cadastro',
    settings: 'Configurações',
    logout: 'Logout',
    // Common
    dashboard: 'Dashboard',
    orders: 'Ordens de Compra',
    proformas: 'Proformas',
    requisitions: 'Requisições',
    containers: 'Conteineres',
    followUp: 'Follow Up',
    skus: 'SKUs',
    prices: 'Preços',
    stock: 'Estoque',
    colors: 'Cores',
    representatives: 'Representantes',
    clients: 'Clientes',
    suppliers: 'Fornecedores',
    carriers: 'Transportadoras',
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
    selectSupplier: 'Selecionar Fornecedor',
    selectSku: 'Selecionar SKU',
    sku: 'SKU',
    manageSystemData: 'Gerenciar dados do sistema',
    // Registration module
    manageSuppliers: 'Gerenciar fornecedores',
    manageSkus: 'Gerenciar SKUs',
    manageColors: 'Gerenciar cores',
    manageRepresentatives: 'Gerenciar representantes',
    manageClients: 'Gerenciar clientes',
    manageCarriers: 'Gerenciar transportadoras',
    newSupplier: 'Novo Fornecedor',
    newSku: 'Novo SKU',
    newColor: 'Nova Cor',
    newRepresentative: 'Novo Representante',
    newClient: 'Novo Cliente',
    newCarrier: 'Nova Transportadora',
    fillSupplierData: 'Preencha os dados do fornecedor',
    fillSkuData: 'Preencha os dados do SKU',
    fillColorData: 'Preencha os dados da cor',
    fillRepresentativeData: 'Preencha os dados do representante',
    fillClientData: 'Preencha os dados do cliente',
    fillCarrierData: 'Preencha os dados da transportadora',
    supplierCreated: 'Fornecedor criado com sucesso!',
    skuCreated: 'SKU criado com sucesso!',
    colorCreated: 'Cor criada com sucesso!',
    representativeCreated: 'Representante criado com sucesso!',
    clientCreated: 'Cliente criado com sucesso!',
    carrierCreated: 'Transportadora criada com sucesso!',
    errorCreatingSupplier: 'Erro ao criar fornecedor',
    errorCreatingSku: 'Erro ao criar SKU',
    errorCreatingColor: 'Erro ao criar cor',
    errorCreatingRepresentative: 'Erro ao criar representante',
    errorCreatingClient: 'Erro ao criar cliente',
    errorCreatingCarrier: 'Erro ao criar transportadora',
    // Form fields
    companyName: 'Razão Social',
    contact: 'Contato',
    contactPrincipal: 'Contato Principal',
    company: 'Empresa',
    commission: 'Comissão',
    freightValue: 'Valor do Frete',
    salePrice: 'Preço de Venda',
    averageCost: 'Custo Médio',
    minStock: 'Estoque Mínimo',
    maxStock: 'Estoque Máximo',
    colorName: 'Nome da Cor',
    hexCode: 'Código Hex',
    pantoneCode: 'Código Pantone',
    preview: 'Pré-visualização',
    skuCode: 'Código SKU',
    skuName: 'Nome do SKU',
    category: 'Categoria',
    unitOfMeasure: 'Unidade de Medida',
    // Units
    kilogram: 'Quilograma',
    liter: 'Litro',
    meter: 'Metro',
    squareMeter: 'Metro Quadrado',
    cubicMeter: 'Metro Cúbico',
    // Search
    searchSuppliers: 'Buscar fornecedores...',
    searchSkus: 'Buscar SKUs...',
    searchColors: 'Buscar cores...',
    searchRepresentatives: 'Buscar representantes...',
    searchClients: 'Buscar clientes...',
    searchCarriers: 'Buscar transportadoras...',
    noSuppliersFound: 'Nenhum fornecedor encontrado',
    noSkusFound: 'Nenhum SKU encontrado',
    noColorsFound: 'Nenhuma cor encontrada',
    noRepresentativesFound: 'Nenhum representante encontrado',
    noClientsFound: 'Nenhum cliente encontrado',
    noCarriersFound: 'Nenhuma transportadora encontrada',
    // Common
    loading: 'Carregando...',
    saving: 'Salvando...',
    save: 'Salvar',
    select: 'Selecionar',
    days: 'dias',
    cash: 'À vista',
  },
  en: {
    // Sidebar
    system: 'System',
    home: 'Home',
    planning: 'Planning',
    executive: 'Executive',
    registration: 'Registration',
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
    representatives: 'Representatives',
    clients: 'Clients',
    suppliers: 'Suppliers',
    carriers: 'Carriers',
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
    selectSupplier: 'Select Supplier',
    selectSku: 'Select SKU',
    sku: 'SKU',
    manageSystemData: 'Manage system data',
    // Registration module
    manageSuppliers: 'Manage suppliers',
    manageSkus: 'Manage SKUs',
    manageColors: 'Manage colors',
    manageRepresentatives: 'Manage representatives',
    manageClients: 'Manage clients',
    manageCarriers: 'Manage carriers',
    newSupplier: 'New Supplier',
    newSku: 'New SKU',
    newColor: 'New Color',
    newRepresentative: 'New Representative',
    newClient: 'New Client',
    newCarrier: 'New Carrier',
    fillSupplierData: 'Fill in the supplier data',
    fillSkuData: 'Fill in the SKU data',
    fillColorData: 'Fill in the color data',
    fillRepresentativeData: 'Fill in the representative data',
    fillClientData: 'Fill in the client data',
    fillCarrierData: 'Fill in the carrier data',
    supplierCreated: 'Supplier created successfully!',
    skuCreated: 'SKU created successfully!',
    colorCreated: 'Color created successfully!',
    representativeCreated: 'Representative created successfully!',
    clientCreated: 'Client created successfully!',
    carrierCreated: 'Carrier created successfully!',
    errorCreatingSupplier: 'Error creating supplier',
    errorCreatingSku: 'Error creating SKU',
    errorCreatingColor: 'Error creating color',
    errorCreatingRepresentative: 'Error creating representative',
    errorCreatingClient: 'Error creating client',
    errorCreatingCarrier: 'Error creating carrier',
    // Form fields
    companyName: 'Company Name',
    contact: 'Contact',
    contactPrincipal: 'Main Contact',
    company: 'Company',
    commission: 'Commission',
    freightValue: 'Freight Value',
    salePrice: 'Sale Price',
    averageCost: 'Average Cost',
    minStock: 'Minimum Stock',
    maxStock: 'Maximum Stock',
    colorName: 'Color Name',
    hexCode: 'Hex Code',
    pantoneCode: 'Pantone Code',
    preview: 'Preview',
    skuCode: 'SKU Code',
    skuName: 'SKU Name',
    category: 'Category',
    unitOfMeasure: 'Unit of Measure',
    // Units
    kilogram: 'Kilogram',
    liter: 'Liter',
    meter: 'Meter',
    squareMeter: 'Square Meter',
    cubicMeter: 'Cubic Meter',
    // Search
    searchSuppliers: 'Search suppliers...',
    searchSkus: 'Search SKUs...',
    searchColors: 'Search colors...',
    searchRepresentatives: 'Search representatives...',
    searchClients: 'Search clients...',
    searchCarriers: 'Search carriers...',
    noSuppliersFound: 'No suppliers found',
    noSkusFound: 'No SKUs found',
    noColorsFound: 'No colors found',
    noRepresentativesFound: 'No representatives found',
    noClientsFound: 'No clients found',
    noCarriersFound: 'No carriers found',
    // Common
    loading: 'Loading...',
    saving: 'Saving...',
    save: 'Save',
    select: 'Select',
    days: 'days',
    cash: 'Cash',
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
