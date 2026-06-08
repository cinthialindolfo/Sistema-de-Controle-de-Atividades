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
A aplicação utiliza **SQLite** para persistência. Não é necessário configurar um servidor de banco de dados externo. O arquivo `dev.db` será criado automaticamente na raiz do projeto ao iniciar.

### 4. Executando em Desenvolvimento
Para rodar o projeto com atualização em tempo real:
```bash
npm run dev
```
Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🔐 Acesso ao Sistema
O login é simplificado para uso ágil:
1.  Na tela inicial, digite seu **Nome** e **Sobrenome**.
2.  Crie um **PIN de 4 dígitos** (apenas números).
3.  No primeiro acesso, sua conta será criada automaticamente. Nos próximos acessos, utilize o mesmo PIN escolhido.

## ✨ Funcionalidades Principais
*   **Dashboard de Métricas**: Visualize o total de tarefas pendentes, em andamento e bloqueadas.
*   **Filtros Inteligentes**: Busque atividades por nome, prioridade ou categoria.
*   **Interface Responsiva**: Totalmente adaptado para Desktop e Mobile (incluindo tabela com scroll horizontal).
*   **Toasts de Notificação**: Feedback visual instantâneo para cada ação realizada.

## 🛠️ Tecnologias Utilizadas
*   **Framework**: Next.js 15+ (App Router)
*   **Linguagem**: TypeScript
*   **Estilização**: Tailwind CSS + ShadCN UI
*   **Banco de Dados**: SQLite via Better-SQLite3
*   **Ícones**: Lucide React
*   **Notificações**: Sonner (Toast)

---
Desenvolvido para ser simples, rápido e eficiente.
