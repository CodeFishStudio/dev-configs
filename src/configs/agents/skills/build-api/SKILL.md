---
name: build-api
description: Builds or extends a TanStack Query API layer (lib/api/ with queries/, mutations/, types/) using Supabase or REST. Discovers which the project uses from the repo before generating. Handles scaffold (greenfield lib/api/) and extend (splice into existing indexes). Use when asked to build or scaffold an API layer, add queries or mutations, bootstrap data fetching, or wire a new domain to TanStack Query in a React project.
---

# build-api

## Quick start

1. **Discover the data layer** — before asking the user, read the repo (see [Discover the data layer](#discover-the-data-layer)).
2. **Infer mode** — if `lib/api/index.ts` exists, default to **extend** unless the user asked for a greenfield scaffold.
3. **Confirm with the user** (skip what you already inferred):
    - **Mode** — scaffold or extend?
    - **Domains** — which entities/tables/resources are in scope?
    - **Data layer** — only if discovery was ambiguous.

Then collect schema + requirements per domain (see [Requirements gathering](#requirements-gathering)), and generate all files in one pass.

## Discover the data layer

Inspect existing code and match its patterns — do not introduce a new stack unless the user asks.

| Signal in repo                                            | Data layer           | Where to look                                              |
| --------------------------------------------------------- | -------------------- | ---------------------------------------------------------- |
| `@supabase/supabase-js`, `lib/supabase`, `.from('table')` | Supabase (PostgREST) | Existing queries/mutations, `database.types`, `selects.ts` |
| `fetch('/api/...')`, `axios`, OpenAPI client              | REST / HTTP          | Route handlers, client wrappers, DTO types                 |

**Rules:**

- Reuse the project's client import path and error-handling style (e.g. Supabase `.throwOnError()`, REST `if (!response.ok) throw`).
- `queryFn` / `mutationFn` call that layer only — TanStack Query owns caching, keys, `onSuccess`, and `onSettled`.
- Optional files depend on the layer: `selects.ts` (Supabase/PostgREST), `parsers/` (shape normalization), `utils/` (shared mutation helpers). Skip what the project does not use.
- Supabase examples in PATTERNS may show patterns such as `is_deleted` soft-delete — **copy only what the project already uses**; do not add soft-delete (or audit columns) because an example includes them.

See [PATTERNS.md](PATTERNS.md#data-layer) for layer-specific notes. Code examples in PATTERNS are **illustrative Supabase samples**, not required conventions.

## Workflows

### Mode: Scaffold (new project)

- [ ] Discover data layer and read any existing API conventions
- [ ] Collect schema for all domains in scope (see [Requirements gathering](#requirements-gathering))
- [ ] Collect queries + mutations needed per domain
- [ ] Generate in this order:
    1. `lib/api/queryClient.ts` — match existing project setup if present; otherwise use PATTERNS default
    2. `lib/api/selects.ts` — **Supabase/PostgREST only**
    3. `lib/api/types/<domain>.ts` for each domain
    4. `lib/api/parsers/<domain>.ts` if response transformation needed
    5. `lib/api/utils/` — shared helpers when needed; **before** mutations that import them
    6. `lib/api/queries/<domain>.ts` for each domain
    7. `lib/api/queries/index.ts`
    8. `lib/api/mutations/<domain>/<operation><Entity>.ts` for each mutation
    9. `lib/api/mutations/<domain>/index.ts` for each domain
    10. `lib/api/mutations/index.ts`
    11. `lib/api/index.ts`

### Mode: Extend (existing project)

- [ ] **Read first** — before generating anything, read:
    - `lib/api/index.ts`
    - `lib/api/queries/index.ts`
    - `lib/api/mutations/index.ts`
    - How existing domains call the data layer (copy that style)
    - Any related domain files (cross-domain cache — see [PATTERNS.md](PATTERNS.md#cross-domain-cache-invalidation))
- [ ] Collect schema + requirements for the new domain only
- [ ] Generate new domain files (scaffold steps 3–10; include `selects.ts` only if the project already uses it)
- [ ] Splice new exports into existing index files — do not rewrite them wholesale; use Edit to add import + spread/property

## Requirements gathering

Ask per domain (adapt wording to the data layer — "table/columns" for Supabase vs "resource/fields" for REST):

```
For each domain, I need:
- Entity shape: fields, types, nullable, relationships / foreign keys
- How to load related data (join select, nested query, separate endpoint, include param)
- Queries needed (list? detail by id? filtered sub-lists?)
- Mutations needed (create / update / delete / custom?)
- Delete semantics for this project (hard delete, soft-delete column, etc.) — do not assume the PATTERNS examples
- For each mutation: multi-step writes? cache invalidation outside this domain?
```

## Key rules (TanStack Query — full examples in PATTERNS.md)

- Query keys: `['entity', 'list']`, `['entity', 'detail', id]`, `['entity', 'subresource', parentId]`
- Flattened `queries` / `mutations` keys must be globally unique — see [PATTERNS.md](PATTERNS.md#flattened-export-keys)
- `queryFn` / `mutationFn`: separate async functions; use `queryOptions` / `mutationOptions`
- Propagate errors the way the project already does; never swallow failures in `queryFn` / `mutationFn`
- `onSuccess`: optimistic `setQueryData` (and toasts) only — runs on success
- `onSettled`: all `invalidateQueries` — runs on success **and** error; target queries this mutation affects (list, detail, sub-resources, related domains)
- Cache strategy: CREATE/UPDATE → `setQueryData` in `onSuccess`, invalidate in `onSettled`; DELETE → filter list in `onSuccess`, `removeQueries` on detail in `onSuccess`, invalidate in `onSettled`
- Payload types: extend generated/domain types (`Pick<Row, ...>`) or project DTOs; match audit/delete fields the app already uses — examples may show `updated_by` / `deleted_by` / `is_deleted` only as samples
- Export aggregation: domain object → domain index → top-level index

See [PATTERNS.md](PATTERNS.md) for code examples (Supabase reference + generic shapes).
