# Especificação Técnica (SDD) - Sistema de Controle de Atividades

Este documento descreve as especificações técnicas e funcionais para o desenvolvimento de um sistema local de gerenciamento de atividades, focado em organização, rastreabilidade e produtividade.

## 1. Visão Geral do Sistema
O **Sistema de Controle de Atividades** é uma aplicação local destinada a centralizar o registro e acompanhamento de tarefas técnicas e operacionais. O objetivo é oferecer uma interface intuitiva para que usuários possam gerenciar o ciclo de vida de suas atividades, permitindo a classificação por prioridade e categoria, além de manter um histórico preciso de atualizações. O sistema utilizará **SQLite** como motor de persistência e **Prisma ORM** para modelagem e interação com os dados.

## 2. Requisitos Funcionais (User Stories)

| ID | Usuário | Desejo | Para que... |
| :--- | :--- | :--- | :--- |
| **RF01** | Usuário | Criar uma nova atividade com todos os campos obrigatórios. | Eu possa registrar uma demanda no sistema. |
| **RF02** | Usuário | Listar todas as atividades cadastradas com filtros por Status e Prioridade. | Eu tenha uma visão clara do que precisa ser feito. |
| **RF03** | Usuário | Atualizar os dados de uma atividade existente (exceto data de criação). | Eu possa refletir o progresso ou mudanças no escopo. |
| **RF04** | Usuário | Alterar o Status de uma atividade para "Concluída". | O sistema registre a finalização da tarefa. |
| **RF05** | Usuário | Excluir uma atividade do sistema. | Eu possa remover registros inseridos indevidamente. |
| **RF06** | Usuário | Visualizar o histórico de uma atividade específica. | Eu saiba quem foi o responsável e quando ela foi alterada. |

## 3. Requisitos Não Funcionais
*   **RNF01 (Persistência):** Os dados devem ser armazenados localmente em um banco de dados SQLite.
*   **RNF02 (Performance):** A listagem de até 1.000 atividades deve ocorrer em menos de 200ms.
*   **RNF03 (Integridade):** O sistema deve garantir que campos obrigatórios não sejam nulos no banco de dados.
*   **RNF04 (Usabilidade):** A interface deve seguir padrões de design limpos, priorizando a legibilidade das prioridades (ex: cores para Critica/Alta).
*   **RNF05 (Manutenibilidade):** O código deve utilizar Prisma para facilitar futuras migrações de banco de dados.

## 4. Modelo de Dados (SQLite / Prisma)

### Entidade: `Activity`

| Campo | Tipo | Descrição | Regras |
| :--- | :--- | :--- | :--- |
| `id` | Int (PK) | Identificador único autoincrementado. | Gerado automaticamente. |
| `title` | String | Título curto da atividade. | Obrigatório, máx 255 chars. |
| `description` | Text | Detalhamento da atividade. | Obrigatório. |
| `priority` | Enum | Nível de urgência. | Baixa, Média, Alta, Crítica. |
| `category` | Enum | Tipo de atividade. | Bug, Feature, Melhoria, Suporte, Operacional. |
| `teamResponsible`| String | Time encarregado. | Obrigatório. |
| `personResponsible`| String | Nome da pessoa responsável. | Obrigatório. |
| `status` | Enum | Estado atual da tarefa. | Pendente, Em andamento, Concluída, Bloqueada. |
| `createdAt` | DateTime | Data e hora de criação. | Automático (default now). |
| `updatedAt` | DateTime | Data e hora da última alteração. | Atualizado automaticamente. |

### Schema Prisma (Exemplo)
```prisma
model Activity {
  id                String   @id @default(uuid())
  title             String
  description       String
  priority          String   // "BAIXA", "MEDIA", "ALTA", "CRITICA"
  category          String   // "BUG", "FEATURE", "MELHORIA", "SUPORTE", "OPERACIONAL"
  teamResponsible   String
  personResponsible String
  status            String   @default("PENDENTE")
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

enum Priority {
  BAIXA
  MEDIA
  ALTA
  CRITICA
}

enum Category {
  BUG
  FEATURE
  MELHORIA
  SUPORTE
  OPERACIONAL
}

enum Status {
  PENDENTE
  EM_ANDAMENTO
  CONCLUIDA
  BLOQUEADA
}
```

## 5. Fluxos da Interface
1.  **Dashboard:** Visualização de cards ou tabela com todas as atividades. Indicadores rápidos de "Bloqueadas" e "Críticas".
2.  **Criação:** Formulário modal contendo inputs para Título, Descrição e Dropdowns para Prioridade, Categoria e Status.
3.  **Edição:** Mesma interface de criação, carregando os dados atuais e permitindo salvar alterações.
4.  **Detalhes:** Tela para leitura expandida da descrição e visualização das datas de criação/atualização.

## 6. Critérios de Aceite
*   Uma atividade só pode ser salva se os campos `title`, `description`, `teamResponsible` e `personResponsible` estiverem preenchidos.
*   Ao mudar o status para "Concluída", o campo `updatedAt` deve ser atualizado instantaneamente.
*   O filtro de busca deve permitir filtrar por `Category` e `Status` simultaneamente.
*   O sistema deve exibir um alerta visual de confirmação antes de excluir qualquer registro.

## 7. Casos de Erro
*   **CE01 (Campo Vazio):** Se o usuário tentar salvar sem título, o sistema deve exibir: "O título é obrigatório".
*   **CE02 (Falha na Conexão):** Caso o banco SQLite esteja inacessível, exibir erro amigável ao iniciar.
*   **CE03 (Dados Inválidos):** Tentar inserir um valor fora dos Enums (ex: Prioridade "Urgente") deve ser impedido na camada de validação do Prisma.

## 8. Estratégia de Validação
1.  **Testes Unitários:** Validar as funções de mapeamento dos Enums e lógica de criação de datas.
2.  **Testes de Integração:** Verificar se o Prisma está persistindo e recuperando os dados corretamente no SQLite.
3.  **Homologação (UAT):** O usuário final deve realizar o fluxo completo (Criar -> Mover para Em Andamento -> Concluir) e validar se as datas refletem as ações.