-- CreateTable
CREATE TABLE "usuarios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "cargo" TEXT,
    "departamento" TEXT,
    "empresaId" INTEGER,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "isSuperAdmin" BOOLEAN NOT NULL DEFAULT false,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "ultimoAcesso" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "usuarios_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "fornecedores" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT,
    "endereco" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "contatoPrincipal" TEXT,
    "condicoesPagamento" TEXT,
    "prazoEntregaPadrao" INTEGER,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ordens_compra" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fornecedor" TEXT NOT NULL,
    "cnpj" TEXT,
    "endereco" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "condicaoPagamento" TEXT,
    "prazoEntrega" DATETIME,
    "observacoes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pendente Aprovação',
    "prioridade" TEXT NOT NULL DEFAULT 'Média',
    "dataEmissao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valorTotal" DECIMAL NOT NULL DEFAULT 0.00,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ordens_compra_fornecedor_fkey" FOREIGN KEY ("fornecedor") REFERENCES "fornecedores" ("nome") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "itens_ordem_compra" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ordemId" TEXT NOT NULL,
    "skuId" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "unidade" TEXT NOT NULL,
    "valorUnitario" DECIMAL NOT NULL,
    "valorTotal" DECIMAL NOT NULL,
    "dataEntrega" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'Pendente',
    CONSTRAINT "itens_ordem_compra_ordemId_fkey" FOREIGN KEY ("ordemId") REFERENCES "ordens_compra" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "itens_ordem_compra_skuId_fkey" FOREIGN KEY ("skuId") REFERENCES "skus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "skus" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "categoria" TEXT,
    "unidade" TEXT NOT NULL DEFAULT 'UN',
    "precoVenda" DECIMAL,
    "custoMedio" DECIMAL,
    "estoqueMinimo" INTEGER NOT NULL DEFAULT 0,
    "estoqueMaximo" INTEGER,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "estoque" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "skuId" TEXT NOT NULL,
    "quantidadeAtual" INTEGER NOT NULL DEFAULT 0,
    "quantidadeReservada" INTEGER NOT NULL DEFAULT 0,
    "quantidadeDisponivel" INTEGER NOT NULL DEFAULT 0,
    "localizacao" TEXT,
    "lote" TEXT,
    "dataValidade" DATETIME,
    "dataUltimaEntrada" DATETIME,
    "dataUltimaSaida" DATETIME,
    "custoMedio" DECIMAL,
    "valorTotalEstoque" DECIMAL,
    "status" TEXT NOT NULL DEFAULT 'Disponível',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "estoque_skuId_fkey" FOREIGN KEY ("skuId") REFERENCES "skus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "movimentacoes_estoque" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "skuId" TEXT NOT NULL,
    "tipoMovimentacao" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "quantidadeAnterior" INTEGER,
    "quantidadeAtual" INTEGER,
    "localizacao" TEXT,
    "lote" TEXT,
    "documentoReferencia" TEXT,
    "custoUnitario" DECIMAL,
    "valorTotal" DECIMAL,
    "motivo" TEXT,
    "usuarioId" INTEGER,
    "dataMovimentacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "movimentacoes_estoque_skuId_fkey" FOREIGN KEY ("skuId") REFERENCES "skus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "movimentacoes_estoque_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cores" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "codigoHex" TEXT,
    "codigoPantone" TEXT
);

-- CreateTable
CREATE TABLE "requisicoes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "solicitante" TEXT NOT NULL,
    "departamento" TEXT NOT NULL,
    "dataRequisicao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataNecessidade" DATETIME,
    "prioridade" TEXT NOT NULL DEFAULT 'Média',
    "status" TEXT NOT NULL DEFAULT 'Pendente',
    "observacoes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "itens_requisicao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "requisicaoId" TEXT NOT NULL,
    "skuId" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "unidade" TEXT NOT NULL,
    "observacoes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pendente',
    CONSTRAINT "itens_requisicao_requisicaoId_fkey" FOREIGN KEY ("requisicaoId") REFERENCES "requisicoes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "itens_requisicao_skuId_fkey" FOREIGN KEY ("skuId") REFERENCES "skus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "proformas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fornecedor" TEXT NOT NULL,
    "moeda" TEXT NOT NULL DEFAULT 'BRL',
    "taxaCambio" DECIMAL NOT NULL DEFAULT 1.00,
    "prazoValidade" DATETIME,
    "condicoes" TEXT,
    "observacoes" TEXT,
    "valorTotal" DECIMAL NOT NULL DEFAULT 0.00,
    "status" TEXT NOT NULL DEFAULT 'Rascunho',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "itens_proforma" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "proformaId" TEXT NOT NULL,
    "skuId" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "unidade" TEXT NOT NULL,
    "valorUnitario" DECIMAL NOT NULL,
    "valorTotal" DECIMAL NOT NULL,
    CONSTRAINT "itens_proforma_proformaId_fkey" FOREIGN KEY ("proformaId") REFERENCES "proformas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "itens_proforma_skuId_fkey" FOREIGN KEY ("skuId") REFERENCES "skus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "follow_ups" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "tipo" TEXT NOT NULL,
    "prioridade" TEXT NOT NULL DEFAULT 'Média',
    "status" TEXT NOT NULL DEFAULT 'Aberto',
    "responsavel" TEXT,
    "dataVencimento" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "representantes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT,
    "telefone" TEXT,
    "empresa" TEXT,
    "comissao" DECIMAL NOT NULL DEFAULT 0.00,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "razaoSocial" TEXT,
    "cnpj" TEXT,
    "endereco" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "contato" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "transportadoras" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT,
    "endereco" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "contato" TEXT,
    "prazoEntrega" INTEGER,
    "valorFrete" DECIMAL NOT NULL DEFAULT 0.00,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ordens_compra_novo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "empresa_id" INTEGER NOT NULL,
    "uneg" TEXT NOT NULL,
    "familia_codigo" TEXT NOT NULL,
    "familia_nome" TEXT,
    "produto_descricao" TEXT,
    "cod_tamanho" TEXT,
    "observacao" TEXT,
    "capacidade_container" TEXT,
    "planejado_compra" INTEGER,
    "etd_target" DATETIME,
    "week_etd" TEXT,
    "transit_time" INTEGER,
    "lead_time" INTEGER,
    "factory_date" DATETIME,
    "week_factory" TEXT,
    "date_of_sale" DATETIME,
    "prop_cont" TEXT,
    "original_total_value" DECIMAL,
    "cost_in_dollars" DECIMAL,
    "total_value_dollars_item" DECIMAL,
    "total_value_dollars_uc" DECIMAL,
    "total_containers" INTEGER,
    "pi_numero" TEXT,
    "pi_date" DATETIME,
    "pi_country" TEXT,
    "pi_supplier" TEXT,
    "pi_obs" TEXT,
    "pi_original_currency" TEXT,
    "pi_original_cost" DECIMAL,
    "status" TEXT NOT NULL DEFAULT 'Pendente Aprovação',
    "usuario_criador_nome" TEXT NOT NULL,
    "data_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "compartilhado_com" TEXT,
    CONSTRAINT "ordens_compra_novo_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ordens_compra_historico" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ordem_compra_id" TEXT NOT NULL,
    "acao" TEXT NOT NULL,
    "usuario_nome" TEXT NOT NULL,
    "data_acao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "detalhes" TEXT,
    CONSTRAINT "ordens_compra_historico_ordem_compra_id_fkey" FOREIGN KEY ("ordem_compra_id") REFERENCES "ordens_compra_novo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "empresas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT,
    "endereco" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "dominio" TEXT,
    "logo" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "permissoes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "categoria" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "usuarios_permissoes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER NOT NULL,
    "permissaoId" INTEGER NOT NULL,
    "concedidoPor" INTEGER NOT NULL,
    "dataConcessao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataExpiracao" DATETIME,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "usuarios_permissoes_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "usuarios_permissoes_permissaoId_fkey" FOREIGN KEY ("permissaoId") REFERENCES "permissoes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "permissoes_empresas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "empresaId" INTEGER NOT NULL,
    "permissaoId" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "permissoes_empresas_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "permissoes_empresas_permissaoId_fkey" FOREIGN KEY ("permissaoId") REFERENCES "permissoes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tabelas_dinamicas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "empresaId" INTEGER NOT NULL,
    "criadoPor" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "tabelas_dinamicas_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "campos_dinamicos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tabelaId" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "tamanho" INTEGER,
    "obrigatorio" BOOLEAN NOT NULL DEFAULT false,
    "unico" BOOLEAN NOT NULL DEFAULT false,
    "valorPadrao" TEXT,
    "opcoes" TEXT,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "campos_dinamicos_tabelaId_fkey" FOREIGN KEY ("tabelaId") REFERENCES "tabelas_dinamicas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "registros_dinamicos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tabelaId" INTEGER NOT NULL,
    "dados" TEXT NOT NULL,
    "criadoPor" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "registros_dinamicos_tabelaId_fkey" FOREIGN KEY ("tabelaId") REFERENCES "tabelas_dinamicas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "logs_sistema" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER,
    "acao" TEXT NOT NULL,
    "entidade" TEXT NOT NULL,
    "entidadeId" INTEGER,
    "descricao" TEXT NOT NULL,
    "dadosAntes" TEXT,
    "dadosDepois" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "fornecedores_nome_key" ON "fornecedores"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "fornecedores_cnpj_key" ON "fornecedores"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "estoque_skuId_localizacao_key" ON "estoque"("skuId", "localizacao");

-- CreateIndex
CREATE UNIQUE INDEX "representantes_email_key" ON "representantes"("email");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_cnpj_key" ON "clientes"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "transportadoras_cnpj_key" ON "transportadoras"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_nome_key" ON "empresas"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_cnpj_key" ON "empresas"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_dominio_key" ON "empresas"("dominio");

-- CreateIndex
CREATE UNIQUE INDEX "permissoes_nome_key" ON "permissoes"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_permissoes_usuarioId_permissaoId_key" ON "usuarios_permissoes"("usuarioId", "permissaoId");

-- CreateIndex
CREATE UNIQUE INDEX "permissoes_empresas_empresaId_permissaoId_key" ON "permissoes_empresas"("empresaId", "permissaoId");

-- CreateIndex
CREATE UNIQUE INDEX "tabelas_dinamicas_nome_key" ON "tabelas_dinamicas"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "campos_dinamicos_tabelaId_nome_key" ON "campos_dinamicos"("tabelaId", "nome");
