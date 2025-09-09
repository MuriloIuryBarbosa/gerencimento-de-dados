-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `cargo` VARCHAR(191) NULL,
    `departamento` VARCHAR(191) NULL,
    `empresaId` INTEGER NULL,
    `isAdmin` BOOLEAN NOT NULL DEFAULT false,
    `isSuperAdmin` BOOLEAN NOT NULL DEFAULT false,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `ultimoAcesso` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `usuarios_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fornecedores` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `cnpj` VARCHAR(191) NULL,
    `endereco` VARCHAR(191) NULL,
    `telefone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `contatoPrincipal` VARCHAR(191) NULL,
    `condicoesPagamento` VARCHAR(191) NULL,
    `prazoEntregaPadrao` INTEGER NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `fornecedores_nome_key`(`nome`),
    UNIQUE INDEX `fornecedores_cnpj_key`(`cnpj`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ordens_compra` (
    `id` VARCHAR(191) NOT NULL,
    `fornecedor` VARCHAR(191) NOT NULL,
    `cnpj` VARCHAR(191) NULL,
    `endereco` VARCHAR(191) NULL,
    `telefone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `condicaoPagamento` VARCHAR(191) NULL,
    `prazoEntrega` DATETIME(3) NULL,
    `observacoes` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Pendente Aprovação',
    `prioridade` VARCHAR(191) NOT NULL DEFAULT 'Média',
    `dataEmissao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `valorTotal` DECIMAL(65, 30) NOT NULL DEFAULT 0.00,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `itens_ordem_compra` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ordemId` VARCHAR(191) NOT NULL,
    `skuId` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `quantidade` INTEGER NOT NULL,
    `unidade` VARCHAR(191) NOT NULL,
    `valorUnitario` DECIMAL(65, 30) NOT NULL,
    `valorTotal` DECIMAL(65, 30) NOT NULL,
    `dataEntrega` DATETIME(3) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Pendente',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `skus` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `categoria` VARCHAR(191) NULL,
    `familiaId` INTEGER NULL,
    `cor` VARCHAR(191) NULL,
    `tamanhoId` INTEGER NULL,
    `unegId` INTEGER NULL,
    `origemCriacao` VARCHAR(191) NOT NULL DEFAULT 'individual',
    `statusRevisao` VARCHAR(191) NOT NULL DEFAULT 'revisado',
    `revisadoPor` INTEGER NULL,
    `dataRevisao` DATETIME(3) NULL,
    `observacoesRevisao` VARCHAR(191) NULL,
    `unidade` VARCHAR(191) NOT NULL DEFAULT 'UN',
    `precoVenda` DECIMAL(65, 30) NULL,
    `custoMedio` DECIMAL(65, 30) NULL,
    `estoqueMinimo` INTEGER NOT NULL DEFAULT 0,
    `estoqueMaximo` INTEGER NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `estoque` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `skuId` VARCHAR(191) NOT NULL,
    `depositoId` INTEGER NULL,
    `quantidadeAtual` INTEGER NOT NULL DEFAULT 0,
    `quantidadeReservada` INTEGER NOT NULL DEFAULT 0,
    `quantidadeDisponivel` INTEGER NOT NULL DEFAULT 0,
    `localizacao` VARCHAR(191) NULL,
    `lote` VARCHAR(191) NULL,
    `dataValidade` DATETIME(3) NULL,
    `dataUltimaEntrada` DATETIME(3) NULL,
    `dataUltimaSaida` DATETIME(3) NULL,
    `custoMedio` DECIMAL(65, 30) NULL,
    `valorTotalEstoque` DECIMAL(65, 30) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Disponível',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `estoque_skuId_localizacao_key`(`skuId`, `localizacao`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `movimentacoes_estoque` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `skuId` VARCHAR(191) NOT NULL,
    `depositoId` INTEGER NULL,
    `tipoMovimentacao` VARCHAR(191) NOT NULL,
    `quantidade` INTEGER NOT NULL,
    `quantidadeAnterior` INTEGER NULL,
    `quantidadeAtual` INTEGER NULL,
    `localizacao` VARCHAR(191) NULL,
    `lote` VARCHAR(191) NULL,
    `documentoReferencia` VARCHAR(191) NULL,
    `custoUnitario` DECIMAL(65, 30) NULL,
    `valorTotal` DECIMAL(65, 30) NULL,
    `motivo` VARCHAR(191) NULL,
    `usuarioId` INTEGER NULL,
    `dataMovimentacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cores` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `codigoHex` VARCHAR(191) NULL,
    `codigoPantone` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `requisicoes` (
    `id` VARCHAR(191) NOT NULL,
    `solicitante` VARCHAR(191) NOT NULL,
    `departamento` VARCHAR(191) NOT NULL,
    `dataRequisicao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dataNecessidade` DATETIME(3) NULL,
    `prioridade` VARCHAR(191) NOT NULL DEFAULT 'Média',
    `status` VARCHAR(191) NOT NULL DEFAULT 'Pendente',
    `observacoes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `itens_requisicao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `requisicaoId` VARCHAR(191) NOT NULL,
    `skuId` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `quantidade` INTEGER NOT NULL,
    `unidade` VARCHAR(191) NOT NULL,
    `observacoes` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Pendente',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `proformas` (
    `id` VARCHAR(191) NOT NULL,
    `fornecedor` VARCHAR(191) NOT NULL,
    `moeda` VARCHAR(191) NOT NULL DEFAULT 'BRL',
    `taxaCambio` DECIMAL(65, 30) NOT NULL DEFAULT 1.00,
    `prazoValidade` DATETIME(3) NULL,
    `condicoes` VARCHAR(191) NULL,
    `observacoes` VARCHAR(191) NULL,
    `valorTotal` DECIMAL(65, 30) NOT NULL DEFAULT 0.00,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Rascunho',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `itens_proforma` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `proformaId` VARCHAR(191) NOT NULL,
    `skuId` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `quantidade` INTEGER NOT NULL,
    `unidade` VARCHAR(191) NOT NULL,
    `valorUnitario` DECIMAL(65, 30) NOT NULL,
    `valorTotal` DECIMAL(65, 30) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `follow_ups` (
    `id` VARCHAR(191) NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `prioridade` VARCHAR(191) NOT NULL DEFAULT 'Média',
    `status` VARCHAR(191) NOT NULL DEFAULT 'Aberto',
    `responsavel` VARCHAR(191) NULL,
    `dataVencimento` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `representantes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `telefone` VARCHAR(191) NULL,
    `empresa` VARCHAR(191) NULL,
    `comissao` DECIMAL(65, 30) NOT NULL DEFAULT 0.00,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `representantes_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `clientes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `razaoSocial` VARCHAR(191) NULL,
    `cnpj` VARCHAR(191) NULL,
    `endereco` VARCHAR(191) NULL,
    `telefone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `contato` VARCHAR(191) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `clientes_cnpj_key`(`cnpj`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transportadoras` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `cnpj` VARCHAR(191) NULL,
    `endereco` VARCHAR(191) NULL,
    `telefone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `contato` VARCHAR(191) NULL,
    `prazoEntrega` INTEGER NULL,
    `valorFrete` DECIMAL(65, 30) NOT NULL DEFAULT 0.00,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `transportadoras_cnpj_key`(`cnpj`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ordens_compra_novo` (
    `id` VARCHAR(191) NOT NULL,
    `empresa_id` INTEGER NOT NULL,
    `uneg` VARCHAR(191) NOT NULL,
    `familia_codigo` VARCHAR(191) NOT NULL,
    `familia_nome` VARCHAR(191) NULL,
    `produto_descricao` VARCHAR(191) NULL,
    `cod_tamanho` VARCHAR(191) NULL,
    `observacao` VARCHAR(191) NULL,
    `capacidade_container` VARCHAR(191) NULL,
    `planejado_compra` INTEGER NULL,
    `etd_target` DATETIME(3) NULL,
    `week_etd` VARCHAR(191) NULL,
    `transit_time` INTEGER NULL,
    `lead_time` INTEGER NULL,
    `factory_date` DATETIME(3) NULL,
    `week_factory` VARCHAR(191) NULL,
    `date_of_sale` DATETIME(3) NULL,
    `prop_cont` VARCHAR(191) NULL,
    `original_total_value` DECIMAL(65, 30) NULL,
    `cost_in_dollars` DECIMAL(65, 30) NULL,
    `total_value_dollars_item` DECIMAL(65, 30) NULL,
    `total_value_dollars_uc` DECIMAL(65, 30) NULL,
    `total_containers` INTEGER NULL,
    `pi_numero` VARCHAR(191) NULL,
    `pi_date` DATETIME(3) NULL,
    `pi_country` VARCHAR(191) NULL,
    `pi_supplier` VARCHAR(191) NULL,
    `pi_obs` VARCHAR(191) NULL,
    `pi_original_currency` VARCHAR(191) NULL,
    `pi_original_cost` DECIMAL(65, 30) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Pendente Aprovação',
    `usuario_criador_nome` VARCHAR(191) NOT NULL,
    `data_criacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `compartilhado_com` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ordens_compra_historico` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ordem_compra_id` VARCHAR(191) NOT NULL,
    `acao` VARCHAR(191) NOT NULL,
    `usuario_nome` VARCHAR(191) NOT NULL,
    `data_acao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `detalhes` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `empresas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `cnpj` VARCHAR(191) NULL,
    `endereco` VARCHAR(191) NULL,
    `cidade` VARCHAR(191) NULL,
    `estado` VARCHAR(191) NULL,
    `cep` VARCHAR(191) NULL,
    `telefone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `contato` VARCHAR(191) NULL,
    `observacoes` VARCHAR(191) NULL,
    `dominio` VARCHAR(191) NULL,
    `logo` VARCHAR(191) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `empresas_nome_key`(`nome`),
    UNIQUE INDEX `empresas_cnpj_key`(`cnpj`),
    UNIQUE INDEX `empresas_dominio_key`(`dominio`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permissoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `categoria` VARCHAR(191) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `permissoes_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios_permissoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `permissaoId` INTEGER NOT NULL,
    `concedidoPor` INTEGER NOT NULL,
    `dataConcessao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dataExpiracao` DATETIME(3) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `usuarios_permissoes_usuarioId_permissaoId_key`(`usuarioId`, `permissaoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permissoes_empresas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `empresaId` INTEGER NOT NULL,
    `permissaoId` INTEGER NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `permissoes_empresas_empresaId_permissaoId_key`(`empresaId`, `permissaoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `historico_qualidade_dados` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dataCalculo` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `qualidadeGeral` DECIMAL(65, 30) NOT NULL,
    `totalTabelas` INTEGER NOT NULL,
    `totalRegistros` INTEGER NOT NULL,
    `registrosCompletos` INTEGER NOT NULL,
    `registrosIncompletos` INTEGER NOT NULL,
    `detalhesTabelas` VARCHAR(191) NOT NULL,
    `usuarioId` INTEGER NULL,
    `observacoes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `familias` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` INTEGER NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `familias_codigo_key`(`codigo`),
    UNIQUE INDEX `familias_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tamanhos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` INTEGER NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tamanhos_codigo_key`(`codigo`),
    UNIQUE INDEX `tamanhos_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `unegs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `unegs_codigo_key`(`codigo`),
    UNIQUE INDEX `unegs_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `depositos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `empresaId` INTEGER NOT NULL,
    `endereco` VARCHAR(191) NULL,
    `cidade` VARCHAR(191) NULL,
    `estado` VARCHAR(191) NULL,
    `cep` VARCHAR(191) NULL,
    `telefone` VARCHAR(191) NULL,
    `responsavel` VARCHAR(191) NULL,
    `capacidade` DECIMAL(65, 30) NULL,
    `tipo` VARCHAR(191) NOT NULL DEFAULT 'Armazém',
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `depositos_codigo_key`(`codigo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tabelas_dinamicas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `empresaId` INTEGER NOT NULL,
    `criadoPor` INTEGER NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tabelas_dinamicas_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `campos_dinamicos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tabelaId` INTEGER NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `tamanho` INTEGER NULL,
    `obrigatorio` BOOLEAN NOT NULL DEFAULT false,
    `unico` BOOLEAN NOT NULL DEFAULT false,
    `valorPadrao` VARCHAR(191) NULL,
    `opcoes` VARCHAR(191) NULL,
    `ordem` INTEGER NOT NULL DEFAULT 0,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `campos_dinamicos_tabelaId_nome_key`(`tabelaId`, `nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `registros_dinamicos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tabelaId` INTEGER NOT NULL,
    `dados` VARCHAR(191) NOT NULL,
    `criadoPor` INTEGER NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `logs_sistema` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NULL,
    `acao` VARCHAR(191) NOT NULL,
    `entidade` VARCHAR(191) NOT NULL,
    `entidadeId` INTEGER NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `dadosAntes` VARCHAR(191) NULL,
    `dadosDepois` VARCHAR(191) NULL,
    `ip` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `localizacoes_estoque` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `empresa` VARCHAR(191) NOT NULL,
    `armazem` VARCHAR(191) NULL,
    `centroResponsavel` VARCHAR(191) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `localizacoes_estoque_codigo_key`(`codigo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `estoque_base` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `localizacaoId` INTEGER NOT NULL,
    `codigoProduto` VARCHAR(191) NOT NULL,
    `skuId` VARCHAR(191) NULL,
    `apelidoFamilia` VARCHAR(191) NOT NULL,
    `qualidade` VARCHAR(191) NULL,
    `qmm` VARCHAR(191) NULL,
    `cor` VARCHAR(191) NULL,
    `quantidade` DECIMAL(65, 30) NOT NULL,
    `descricaoCor` VARCHAR(191) NULL,
    `tamanho` VARCHAR(191) NULL,
    `tamanhoDetalhado` VARCHAR(191) NULL,
    `embalagemVolume` VARCHAR(191) NULL,
    `unidade` VARCHAR(191) NOT NULL,
    `pesoLiquido` DECIMAL(65, 30) NULL,
    `pesoBruto` DECIMAL(65, 30) NULL,
    `empresa` VARCHAR(191) NOT NULL,
    `dataProcessamento` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `arquivoOrigem` VARCHAR(191) NOT NULL,
    `lote` VARCHAR(191) NULL,
    `dataValidade` DATETIME(3) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Ativo',
    `observacoes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `arquivos_estoque_processados` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomeArquivo` VARCHAR(191) NOT NULL,
    `empresa` VARCHAR(191) NOT NULL,
    `dataProcessamento` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `totalRegistros` INTEGER NOT NULL DEFAULT 0,
    `registrosValidos` INTEGER NOT NULL DEFAULT 0,
    `registrosInvalidos` INTEGER NOT NULL DEFAULT 0,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Processando',
    `erros` VARCHAR(191) NULL,
    `usuarioId` INTEGER NULL,
    `observacoes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `arquivos_estoque_processados_nomeArquivo_key`(`nomeArquivo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `estoque_consolidado` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `skuId` VARCHAR(191) NOT NULL,
    `quantidadeTotal` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `quantidadeReservada` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `quantidadeDisponivel` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `unidade` VARCHAR(191) NOT NULL DEFAULT 'UN',
    `valorTotalEstoque` DECIMAL(65, 30) NULL,
    `custoMedio` DECIMAL(65, 30) NULL,
    `ultimaAtualizacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` VARCHAR(191) NOT NULL DEFAULT 'Ativo',
    `observacoes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `estoque_consolidado_skuId_key`(`skuId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `empresas`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ordens_compra` ADD CONSTRAINT `ordens_compra_fornecedor_fkey` FOREIGN KEY (`fornecedor`) REFERENCES `fornecedores`(`nome`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `itens_ordem_compra` ADD CONSTRAINT `itens_ordem_compra_ordemId_fkey` FOREIGN KEY (`ordemId`) REFERENCES `ordens_compra`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `itens_ordem_compra` ADD CONSTRAINT `itens_ordem_compra_skuId_fkey` FOREIGN KEY (`skuId`) REFERENCES `skus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `skus` ADD CONSTRAINT `skus_familiaId_fkey` FOREIGN KEY (`familiaId`) REFERENCES `familias`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `skus` ADD CONSTRAINT `skus_tamanhoId_fkey` FOREIGN KEY (`tamanhoId`) REFERENCES `tamanhos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `skus` ADD CONSTRAINT `skus_unegId_fkey` FOREIGN KEY (`unegId`) REFERENCES `unegs`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `estoque` ADD CONSTRAINT `estoque_skuId_fkey` FOREIGN KEY (`skuId`) REFERENCES `skus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `estoque` ADD CONSTRAINT `estoque_depositoId_fkey` FOREIGN KEY (`depositoId`) REFERENCES `depositos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `movimentacoes_estoque` ADD CONSTRAINT `movimentacoes_estoque_skuId_fkey` FOREIGN KEY (`skuId`) REFERENCES `skus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `movimentacoes_estoque` ADD CONSTRAINT `movimentacoes_estoque_depositoId_fkey` FOREIGN KEY (`depositoId`) REFERENCES `depositos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `movimentacoes_estoque` ADD CONSTRAINT `movimentacoes_estoque_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `itens_requisicao` ADD CONSTRAINT `itens_requisicao_requisicaoId_fkey` FOREIGN KEY (`requisicaoId`) REFERENCES `requisicoes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `itens_requisicao` ADD CONSTRAINT `itens_requisicao_skuId_fkey` FOREIGN KEY (`skuId`) REFERENCES `skus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `itens_proforma` ADD CONSTRAINT `itens_proforma_proformaId_fkey` FOREIGN KEY (`proformaId`) REFERENCES `proformas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `itens_proforma` ADD CONSTRAINT `itens_proforma_skuId_fkey` FOREIGN KEY (`skuId`) REFERENCES `skus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ordens_compra_novo` ADD CONSTRAINT `ordens_compra_novo_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `empresas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ordens_compra_historico` ADD CONSTRAINT `ordens_compra_historico_ordem_compra_id_fkey` FOREIGN KEY (`ordem_compra_id`) REFERENCES `ordens_compra_novo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuarios_permissoes` ADD CONSTRAINT `usuarios_permissoes_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuarios_permissoes` ADD CONSTRAINT `usuarios_permissoes_permissaoId_fkey` FOREIGN KEY (`permissaoId`) REFERENCES `permissoes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `permissoes_empresas` ADD CONSTRAINT `permissoes_empresas_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `empresas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `permissoes_empresas` ADD CONSTRAINT `permissoes_empresas_permissaoId_fkey` FOREIGN KEY (`permissaoId`) REFERENCES `permissoes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historico_qualidade_dados` ADD CONSTRAINT `historico_qualidade_dados_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `depositos` ADD CONSTRAINT `depositos_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `empresas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tabelas_dinamicas` ADD CONSTRAINT `tabelas_dinamicas_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `empresas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `campos_dinamicos` ADD CONSTRAINT `campos_dinamicos_tabelaId_fkey` FOREIGN KEY (`tabelaId`) REFERENCES `tabelas_dinamicas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `registros_dinamicos` ADD CONSTRAINT `registros_dinamicos_tabelaId_fkey` FOREIGN KEY (`tabelaId`) REFERENCES `tabelas_dinamicas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `estoque_base` ADD CONSTRAINT `estoque_base_localizacaoId_fkey` FOREIGN KEY (`localizacaoId`) REFERENCES `localizacoes_estoque`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `estoque_base` ADD CONSTRAINT `estoque_base_skuId_fkey` FOREIGN KEY (`skuId`) REFERENCES `skus`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `arquivos_estoque_processados` ADD CONSTRAINT `arquivos_estoque_processados_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `estoque_consolidado` ADD CONSTRAINT `estoque_consolidado_skuId_fkey` FOREIGN KEY (`skuId`) REFERENCES `skus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
