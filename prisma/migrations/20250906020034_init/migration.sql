-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `cargo` VARCHAR(191) NULL,
    `departamento` VARCHAR(191) NULL,
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

-- AddForeignKey
ALTER TABLE `ordens_compra` ADD CONSTRAINT `ordens_compra_fornecedor_fkey` FOREIGN KEY (`fornecedor`) REFERENCES `fornecedores`(`nome`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `itens_ordem_compra` ADD CONSTRAINT `itens_ordem_compra_ordemId_fkey` FOREIGN KEY (`ordemId`) REFERENCES `ordens_compra`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `itens_ordem_compra` ADD CONSTRAINT `itens_ordem_compra_skuId_fkey` FOREIGN KEY (`skuId`) REFERENCES `skus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `estoque` ADD CONSTRAINT `estoque_skuId_fkey` FOREIGN KEY (`skuId`) REFERENCES `skus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `movimentacoes_estoque` ADD CONSTRAINT `movimentacoes_estoque_skuId_fkey` FOREIGN KEY (`skuId`) REFERENCES `skus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

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
