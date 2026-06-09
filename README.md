# Sistema de Controle de Atividades

Um sistema moderno e responsivo para gestão e acompanhamento de demandas técnicas e operacionais.

## 🚀 Como Rodar a Aplicação

Siga os passos abaixo para configurar e iniciar o projeto em seu ambiente local:

### 1. Pré-requisitos
*   **Node.js** (v18 ou superior)
*   **npm** ou **yarn**

### 2. Instalação
Clone o repositório e instale as dependências:
```bash
npm install
```

### 3. Configuração do Banco de Dados
A aplicação utiliza **SQLite** via **Prisma v6**. Prepare o banco de dados com:
```bash
npx prisma migrate dev
```
### 4. Executando em Desenvolvimento
Para rodar o projeto com atualização em tempo real:
```bash
npm run dev
```
Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

### 🌐 Variáveis de Ambiente (Opcional - Nuvem)
Se desejar rodar em produção (Vercel/Turso), configure:
- `TURSO_DATABASE_URL`: URL do seu banco de dados LibSQL.
- `TURSO_AUTH_TOKEN`: Token de autenticação do Turso.

*Nota: Se estas variáveis não forem fornecidas, o sistema utilizará automaticamente o SQLite local.*

## 🔐 Acesso ao Sistema
...

O login é simplificado para uso ágil:
1.  Na tela inicial, digite seu **Nome** e **Sobrenome**.
2.  Crie um **PIN de 4 dígitos** (apenas números).
3.  No primeiro acesso, sua conta será criada automaticamente. Nos próximos acessos, utilize o mesmo PIN escolhido.

## ✨ Funcionalidades Principais
*   **Dashboard de Métricas**: Visualize o total de tarefas pendentes, em andamento e bloqueadas.
*   **Filtros Inteligentes**: Busque atividades por nome, prioridade ou categoria.
*   **Paginação Server-Side**: Navegação fluida e rápida através de grandes volumes de dados.
*   **Acesso Seguro**: Login com PIN e alternância de visibilidade (ícone de olho).
*   **Interface Premium**: Totalmente adaptado para Desktop e Mobile, com suporte nativo a Temas (Claro/Escuro) com alto contraste.
*   **Toasts de Notificação**: Feedback visual instantâneo para cada ação realizada.

## 🛠️ Tecnologias Utilizadas
*   **Framework**: Next.js 15+ (App Router)
*   **Linguagem**: TypeScript
*   **Estilização**: Tailwind CSS + ShadCN UI
*   **Banco de Dados**: SQLite (Local) / Turso LibSQL (Nuvem)
*   **Ícones**: Lucide React
*   **Notificações**: Sonner (Toast)

## 🧪 Testes e Qualidade (CI/CD)

O projeto utiliza **GitHub Actions** para garantir a qualidade do código em cada contribuição:
*   **Integração Contínua (CI)**: Toda vez que um código é enviado para o GitHub, os testes automatizados são executados em um ambiente Linux isolado.
*   **Validação Automatizada**: O build e a geração do cliente Prisma são validados antes de qualquer integração na branch principal.

## 🐳 Docker

O sistema é totalmente containerizado para facilitar a distribuição e o desenvolvimento consistente.

### Comandos Rápidos (via docker.sh):
```bash
# Subir ambiente de produção
./docker.sh up

# Ver logs
./docker.sh logs

# Parar tudo
./docker.sh down
```

A configuração Docker utiliza um **Dockerfile Multi-stage**, garantindo uma imagem final leve e segura, rodando com usuário não-root.

## 🤖 Uso de IA / Cloud Code Skill

Este projeto foi desenvolvido com o auxílio do **Gemini CLI**, uma ferramenta de IA baseada em Agentic Workflows que atua como um engenheiro de software sênior.

*   **Objetivo:** Acelerar o ciclo de desenvolvimento, garantir a consistência com a especificação (SDD) e automatizar tarefas repetitivas de análise de código.
*   **Impacto:** Redução significativa no tempo de mapeamento da arquitetura e identificação de gaps entre a especificação técnica e a implementação real.
*   **Partes Assistidas por IA:**
    *   **Análise de Gaps:** Identificação de requisitos faltantes no SDD e na UI.
    *   **Refinamento de Documentação:** Geração automática das seções de Critérios de Aceite, Casos de Erro e Estratégia de Validação no `docs/SDD.md`.
    *   **Geração de Componentes:** Ajustes na lógica de visualização de datas e status na interface.
    *   **Criação de Scripts:** Desenvolvimento do script de seed de dados para testes rápidos.

---
Desenvolvido para ser simples, rápido e eficiente.
