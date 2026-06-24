<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Sistema WMS — Processo e Arquitetura

## Processo: OpenSpec é obrigatório

Este projeto é desenvolvido **inteiramente via OpenSpec**. Nenhuma funcionalidade é implementada sem passar pelo fluxo: **propose → (specs + design) → tasks → apply → archive**. Antes de codar qualquer coisa nova, crie/atualize a change correspondente em `openspec/changes/`. O escopo funcional está no `PRD.md`; as escolhas de stack/arquitetura são decisões registradas nas changes (não estão no PRD).

**Manutenção deste arquivo:** o `design.md` de cada change guarda a *justificativa* da decisão (e fica congelado no arquivo da change). Este `AGENTS.md` é a regra *viva* e consolidada. Toda change que **altere uma convenção** deve incluir uma tarefa no `tasks.md` para atualizar este arquivo — senão ele fica desatualizado, pois não se atualiza sozinho.

## Stack

- **Next.js (App Router)** + **TypeScript** — full-stack, monolito modular.
- **PostgreSQL** via **Docker** (`docker-compose.yml`, container `wms-postgres` em `localhost:5432`).
- **Prisma 7** como ORM. Prisma 7 exige driver adapter: usar `@prisma/adapter-pg` (ver `src/lib/db.ts`).
- **Zod** — validação e fonte única de tipos.
- **react-hook-form** + `@hookform/resolvers` — formulários.
- **Tailwind** + **shadcn/ui** — UI.
- **Recharts** (via componente `chart` do shadcn) — gráficos, sempre coloridos pelos tokens `--chart-1..5`. Lib única de visualização de dados.

## Regras de ouro (seguir ao codar)

1. **Zod é a fonte única de verdade dos inputs.** Defina o schema em `schema.ts`, derive o tipo com `z.infer` (nunca duplique tipo e validação). O **mesmo schema** valida no formulário (client, via `zodResolver`) **e** dentro da Server Action (server) antes de tocar no banco.
2. **Toda movimentação de estoque roda dentro de `prisma.$transaction`.** Gravar o `Movement` + atualizar o `StockItem` (saldo) é atômico. Saldo nunca pode "rachar". Coração do sistema.
3. **Leitura em Server Components, escrita em Server Actions.** Mutações usam `'use server'` e chamam `revalidatePath` para refletir o estado atual.
4. **Acesse o banco só pelo singleton** `db` de `src/lib/db.ts`. Nunca instancie `PrismaClient` solto.

## Organização por feature

Cada feature é um módulo auto-contido em `src/modules/<feature>/`:

```
src/
  app/                  # rotas (App Router)
  modules/<feature>/    # products, suppliers, locations, movements, inventory, dashboard
    schema.ts           # Zod (fonte de verdade) + tipos via z.infer
    queries.ts          # leituras (Server Components)
    actions.ts          # mutações ('use server')
    components/         # componentes da feature
  lib/                  # db (prisma singleton), utils
  components/ui/        # shadcn
  generated/prisma/     # Prisma Client gerado (não editar, não commitar)
prisma/schema.prisma    # modelo de domínio
```

## Domínio (ver `prisma/schema.prisma`)

`User` (perfis GESTOR/OPERADOR/COMPRAS), `Category`, `Supplier`, `Product`, hierarquia `Area → Aisle → Position`, `StockItem` (saldo por posição = estoque em tempo real), `Movement` (ENTRADA/SAIDA/DEVOLUCAO/TRANSFERENCIA), `Alert` (estoque mínimo), `Inventory`/`InventoryItem`.

## Decisões em aberto

- **Auth/RBAC adiado** — depende de hospedagem. `User` + enum `Role` já existem para plugar depois. Não implemente auth sem alinhar.

## Comandos

- `npm run db:up` / `db:down` — sobe/para o Postgres (Docker).
- `npm run db:migrate` — cria/aplica migration (`prisma migrate dev`).
- `npm run db:studio` — Prisma Studio.
- `npm run dev` — servidor Next.js.
