-- DropTable
DROP TABLE `skus`;

-- CreateTable
CREATE TABLE `skus` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NULL,
    `descricao` VARCHAR(191) NULL,
    `categoria` VARCHAR(191) NULL,
    `familiaId` INTEGER NULL,
    `cor` VARCHAR(191) NULL,
    `tamanhoId` INTEGER NULL,
    `unegId` INTEGER NULL,
    `unegNome` VARCHAR(191) NULL,
    `unegCodigo` VARCHAR(191) NULL,
    `familiaCodigo` VARCHAR(191) NULL,
    `familiaNome` VARCHAR(191) NULL,
    `corCodigo` VARCHAR(191) NULL,
    `corNome` VARCHAR(191) NULL,
    `tamanhoCodigo` VARCHAR(191) NULL,
    `tamanhoNome` VARCHAR(191) NULL,
    `curvaOrdem` VARCHAR(191) NULL,
    `curvaOrdemCurta` VARCHAR(191) NULL,
    `subgrupo` VARCHAR(191) NULL,
    `item` VARCHAR(191) NULL,
    `destino` VARCHAR(191) NULL,
    `leadTimeReposicao` INTEGER NULL,
    `radarPlanejamento` VARCHAR(191) NULL,
    `gramatura` VARCHAR(191) NULL,
    `exclusivo` VARCHAR(191) NULL,
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

-- AddForeignKey
ALTER TABLE `skus` ADD CONSTRAINT `skus_familiaId_fkey` FOREIGN KEY (`familiaId`) REFERENCES `familias`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `skus` ADD CONSTRAINT `skus_tamanhoId_fkey` FOREIGN KEY (`tamanhoId`) REFERENCES `tamanhos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `skus` ADD CONSTRAINT `skus_unegId_fkey` FOREIGN KEY (`unegId`) REFERENCES `unegs`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
