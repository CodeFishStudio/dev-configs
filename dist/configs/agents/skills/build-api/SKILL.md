---
name: build-api
description: Builds or extends TanStack Query + Supabase API logic following a fixed project structure (lib/api/ with queries/, mutations/, types/, selects.ts). Handles two modes: scaffold (creates full directory from scratch) and extend (reads existing indexes and adds new domains/operations without breaking exports). Use when asked to build or scaffold an API layer, add new queries or mutations, bootstrap data fetching, or wire up a new domain to TanStack Query in a Supabase + React project.
---

# build-api

## Quick start

Ask the user two things upfront:

1. **Mode** — scaffold from scratch, or extend an existing `lib/api/`?
2. **Domains** — which database tables/domains are in scope?

Then collect schema + requirements per domain (see below), and generate all files in one pass.

## Workflows

### Mode: Scaffold (new project)

- [ ] Collect schema for all domains in scope (see [PATTERNS.md](PATTERNS.md#gathering-requirements))
- [ ] Collect queries + mutations needed per domain
- [ ] Infer mutation complexity (soft-delete? activity logging? child records?) — see [PATTERNS.md](PATTERNS.md#mutation-complexity)
- [ ] Generate in this order:
  1. `lib/api/queryClient.ts`
  2. `lib/api/selects.ts`
  3. `lib/api/types/<domain>.ts` for each domain
  4. `lib/api/parsers/<domain>.ts` if response transformation needed
  5. `lib/api/queries/<domain>.ts` for each domain
  6. `lib/api/queries/index.ts`
  7. `lib/api/mutations/<domain>/<operation><Entity>.ts` for each mutation
  8. `lib/api/mutations/<domain>/index.ts` for each domain
  9. `lib/api/mutations/index.ts`
  10. `lib/api/index.ts`

### Mode: Extend (existing project)

- [ ] **Read first** — before generating anything, read:
  - `lib/api/index.ts`
  - `lib/api/queries/index.ts`
  - `lib/api/mutations/index.ts`
  - Any existing domain files that the new domain relates to (for foreign key invalidation)
- [ ] Collect schema + requirements for the new domain only
- [ ] Generate new domain files (same order as scaffold, steps 3–8)
- [ ] Splice new exports into existing index files — do not rewrite them wholesale, use Edit to add the new import + spread/property

## Requirements gathering

Ask per domain:

```
For each domain, I need:
- Table name(s) and relevant columns (name, type, nullable, FK references)
- Which columns use soft delete (is_deleted)?
- Relationships: which tables join, and what the PostgREST select shape looks like
- Queries needed (list? detail by id? filtered sub-lists?)
- Mutations needed (create / update / delete / custom?)
- For each mutation: does it need activity logging? child record inserts/deletes? related cache invalidation outside this domain?
```

## Key rules (full details in PATTERNS.md)

- Query keys: `['entity', 'list']`, `['entity', 'detail', id]`, `['entity', 'subresource', parentId]`
- All Supabase calls end with `.throwOnError()`
- Soft-delete tables always filtered `.eq('is_deleted', false)`
- Mutations: separate `async function` for `mutationFn`, then `mutationOptions({ mutationFn, onSuccess })`
- `onSuccess` cache strategy: CREATE → setQueryData + invalidate; UPDATE → setQueryData + invalidate; DELETE → filter list + removeQueries + invalidate related
- Payload interfaces extend `Pick<Row, ...>` from the DB type; updates always include `id: string` + `updated_by: string`
- Select fragments go in `selects.ts`, named `<entity>With<Relation>Select`
- Export aggregation: domain object → domain index → top-level index

See [PATTERNS.md](PATTERNS.md) for code examples for every pattern.
