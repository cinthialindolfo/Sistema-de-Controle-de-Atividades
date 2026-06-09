# Especificação Técnica (SDD) - Sistema de Controle de Atividades

Este documento descreve as especificações técnicas e funcionais atualizadas para o Sistema de Controle de Atividades.

## 1. Visão Geral do Sistema
O **Sistema de Controle de Atividades** é uma aplicação voltada para o gerenciamento de tarefas técnicas e operacionais. Originalmente planejado com Prisma, o sistema foi evoluído para uma arquitetura de acesso direto ao **SQLite** via **Better-SQLite3** para garantir máxima compatibilidade e performance em ambientes locais (Windows).

## 2. Arquitetura e Fluxo de Dados
A aplicação utiliza o framework **Next.js** com a seguinte estrutura:
*   **Persistência:** Banco de dados SQLite local (`dev.db`).
*   **Acesso ao Banco:** Utilização direta da biblioteca `better-sqlite3` isolada em `lib/db.ts`.
*   **Server Actions:** Lógica de negócio e operações de banco encapsuladas em `app/actions.ts`, utilizando importações dinâmicas para evitar vazamento de código do servidor para o cliente.
*   **Segurança:** Sistema de login simplificado com auto-registro no primeiro acesso.

## 3. Requisitos do Sistema

### 3.1 Requisitos Funcionais (RF)
| ID | Requisito | Descrição |
| :--- | :--- | :--- |
| **RF01** | Login Simplificado | Acesso via Nome, Sobrenome e PIN de 4 dígitos. |
| **RF02** | Auto-Registro | O primeiro acesso de um par Nome/Sobrenome cria o usuário automaticamente. |
| **RF03** | CRUD de Atividades | Criação, Listagem, Edição e Exclusão persistidas diretamente no SQLite. |
| **RF04** | Dashboard Reativo | Cards de resumo (Total, Pendentes, etc.) atualizados em tempo real via banco. |
| **RF05** | Filtros Avançados | Filtragem por prioridade, categoria, time, responsável e busca textual. |
| **RF06** | Feedback Visual | Notificações (Toasts) para todas as operações de sucesso ou erro. |

### 3.2 Requisitos Não Funcionais (RNF)
*   **RNF01 (Performance):** Operações de banco de dados devem ser executadas em menos de 100ms localmente.
*   **RNF02 (Compatibilidade):** Deve rodar em Windows/macOS/Linux sem necessidade de Docker ou banco externo.
*   **RNF03 (Segurança):** O PIN deve ser validado no servidor (Server Actions) e a sessão mantida via Cookies HttpOnly.
*   **RNF04 (Usabilidade):** Interface responsiva para telas mobile e desktop.

## 4. Modelo de Dados (SQLite)

### Tabela: `Activity`
| Campo | Tipo | Regra |
| :--- | :--- | :--- |
| `id` | TEXT (PK) | UUID ou string randômica. |
| `title` | TEXT | Obrigatório. |
| `description` | TEXT | Detalhamento da tarefa. |
| `priority` | TEXT | BAIXA, MEDIA, ALTA, CRITICA. |
| `category` | TEXT | BUG, FEATURE, MELHORIA, SUPORTE, OPERACIONAL. |
| `teamResponsible` | TEXT | Time dono da demanda. |
| `personResponsible`| TEXT | Pessoa que executará. |
| `status` | TEXT | PENDENTE, EM_ANDAMENTO, CONCLUIDA, BLOQUEADA. |
| `createdAt` | DATETIME | Gerado automaticamente. |
| `updatedAt` | DATETIME | Atualizado em cada modificação. |

### Tabela: `User`
| Campo | Tipo | Regra |
| :--- | :--- | :--- |
| `id` | TEXT (PK) | Identificador único. |
| `firstName` | TEXT | Primeiro nome. |
| `lastName` | TEXT | Sobrenome. |
| `pin` | TEXT | Senha de 4 dígitos. |
| `UNIQUE` | - | (firstName, lastName). |

## 5. Fluxos da Interface
1.  **Fluxo de Login:** Usuário entra -> Digita Nome/PIN -> Se não existe, cria -> Redireciona para Dashboard.
2.  **Fluxo de Criação:** Dashboard -> Botão "Nova Atividade" -> Abre Modal -> Preenche campos -> Salva -> Toast de Sucesso -> Lista atualiza.
3.  **Fluxo de Edição:** Menu na linha da tabela -> Editar -> Abre Modal com dados -> Altera -> Salva -> Toast de Sucesso.
4.  **Fluxo de Exclusão:** Menu -> Excluir -> Confirmação (Alert) -> Exclui -> Toast de Sucesso.

## 6. Critérios de Aceite
*   Todas as atividades devem possuir obrigatoriamente Título, Prioridade e Categoria.
*   O Dashboard deve refletir a contagem correta de cada status.
*   O filtro deve ser cumulativo (ex: Status: Pendente AND Prioridade: Alta).

## 7. Casos de Erro
*   **Erro de Login:** PIN incorreto para usuário já cadastrado exibe mensagem de erro.
*   **Banco Indisponível:** Exibe toast de erro crítico ao tentar qualquer operação CRUD.
*   **Validação de Formulário:** Campos obrigatórios vazios impedem o envio do formulário no cliente.

## 8. Estratégia de Validação
*   **Testes Manuais:** Execução dos fluxos principais conforme seção 5.
*   **Validação de Schema:** Verificação se o arquivo `dev.db` segue o modelo definido na seção 4.
*   **Responsividade:** Teste via DevTools em resoluções de 375px (iPhone SE) e 1440px (Desktop).

## 9. Decisões de Projeto (ADRs)
1.  **Migração Prisma -> Better-SQLite3:** Tomada para resolver conflitos de engine type no Windows e simplificar a distribuição local.
2.  **Importações Dinâmicas:** Implementadas em `app/actions.ts` para garantir que bibliotecas de Node.js (como `fs` e `path`) não quebrem o bundle do navegador.
3.  **Login Stateless:** Utilização de cookies de sessão (`auth_session`) para manter o usuário logado sem necessidade de JWT complexo para ambiente local.
