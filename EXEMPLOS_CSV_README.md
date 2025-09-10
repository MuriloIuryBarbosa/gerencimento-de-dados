# Arquivos de Exemplo para Importação CSV

Este diretório contém arquivos de exemplo CSV para testar a funcionalidade de importação bulk dos módulos do sistema.

## Arquivos Disponíveis

### 1. `skus_exemplo.csv`
Arquivo de exemplo para importar SKUs com resolução automática de relacionamentos.
- **Colunas**: CHAVE SKU, Nome do Produto, Uneg, Codigo Uneg, Codigo Familia, Familia, etc.
- **Registros**: 4 SKUs de exemplo com diferentes famílias, tamanhos e UNEGs
- **Funcionalidade**: O sistema automaticamente cria famílias, tamanhos e UNEGs se não existirem

### 2. `familias_exemplo.csv`
Arquivo de exemplo para importar famílias de produtos.
- **Colunas**: nome, descricao, ativo
- **Registros**: 5 famílias de exemplo

### 3. `tamanhos_exemplo.csv`
Arquivo de exemplo para importar tamanhos de produtos.
- **Colunas**: codigo, nome, ordem, ativo
- **Registros**: 7 tamanhos (PP até XXG)

### 4. `unegs_exemplo.csv`
Arquivo de exemplo para importar Unidades de Negócios (UNEGs).
- **Colunas**: codigo, nome, ativo
- **Registros**: 4 unidades de exemplo

### 5. `depositos_exemplo.csv`
Arquivo de exemplo para importar depósitos/almoxarifados.
- **Colunas**: codigo, nome, localizacao, ativo
- **Registros**: 4 depósitos em diferentes regiões

### 6. `estoque_exemplo.csv`
Arquivo de exemplo para importar dados de estoque.
- **Colunas**: sku, quantidade, localizacao, ativo
- **Registros**: 5 itens de estoque

## Correção Importante - Relacionamentos Automáticos

### Problema Resolvido
- **Erro anterior**: `Invalid prisma.sKU.findUnique() invocation: The column datalake.skus.familiaId does not exist`
- **Causa**: O sistema tentava usar códigos de família diretamente como IDs numéricos
- **Solução**: Implementada resolução automática de relacionamentos

### Como Funciona Agora
1. **Família**: O sistema busca pela família usando `familiaCodigo` ou `familiaNome`
2. **Se encontrada**: Usa o ID existente
3. **Se não encontrada**: Cria automaticamente uma nova família
4. **Mesma lógica** para Tamanhos e UNEGs

### Campos de Relacionamento
- `familiaCodigo` → `familiaId` (tabela `familias`)
- `tamanhoCodigo` → `tamanhoId` (tabela `tamanhos`)
- `unegCodigo` → `unegId` (tabela `unegs`)

## Como Usar

1. **Acesse o módulo desejado** através do menu Cadastro
2. **Clique na aba "Upload"** do módulo
3. **Selecione ou arraste** um dos arquivos de exemplo
4. **Mapeie as colunas** automaticamente (o sistema tenta mapear automaticamente)
5. **Revise o preview** dos dados
6. **Clique em "Importar"** para processar os dados

## Melhorias Implementadas

### Interface Visual Aprimorada
- **Indicador de etapas visual** com animações e descrições
- **Barra de progresso detalhada** com gradiente e animações
- **Estatísticas em tempo real** durante a importação
- **Estimativa de tempo restante** e velocidade de processamento
- **Feedback visual rico** com ícones e cores

### Resolução de Relacionamentos
- **Criação automática** de famílias, tamanhos e UNEGs
- **Busca inteligente** por código ou nome
- **Tratamento de erros** robusto para relacionamentos
- **Logs detalhados** para debugging

### Experiência do Usuário
- **Drag and drop** aprimorado com feedback visual
- **Validação de arquivos** com mensagens informativas
- **Preview detalhado** dos dados antes da importação
- **Relatório completo** após a importação com estatísticas
- **Botão de exemplo CSV** para download de modelo

### Funcionalidades Técnicas
- **Processamento em lotes** para melhor performance
- **Mapeamento automático** de colunas baseado em nomes
- **Conversão de tipos** automática (números, booleanos)
- **Tratamento de erros** detalhado com lista de problemas
- **Cálculo de métricas** de performance em tempo real

## Testando as Melhorias

Para testar todas as melhorias implementadas:

1. **Upload de arquivo**: Arraste ou selecione um arquivo CSV
2. **Mapeamento**: Observe o mapeamento automático e notificações
3. **Preview**: Revise os dados na tabela de preview
4. **Importação**: Observe o progresso detalhado e notificações
5. **Resultado**: Veja o relatório completo com estatísticas

## Suporte

Se encontrar algum problema ou tiver dúvidas sobre o uso dos arquivos de exemplo, consulte a documentação do sistema ou entre em contato com o suporte técnico.
