# API Patterns Reference

TanStack Query structure is **fixed**; the **data layer is not**. Discover what the project uses (see SKILL.md), then implement `queryFn` / `mutationFn` with that client.

**Supabase examples below are illustrative** — they show one valid shape (including soft-delete via `is_deleted` where noted). Match the repo’s actual schema and delete/filter behaviour; do not treat example-only columns or filters as requirements.

---

## Data layer

### What stays the same (every stack)

- Directory layout under `lib/api/` (queries, mutations, types, indexes)
- `queryOptions` / `mutationOptions`, query key shapes, domain exports, cache callback rules (`onSuccess` / `onSettled`)
- Flattened export keys, naming table at the end of this file

### What changes per stack

| Concern              | Supabase                           | REST / fetch                  |
| -------------------- | ---------------------------------- | ----------------------------- |
| List/detail fetch    | `.from().select().eq()`            | `GET /resources`              |
| Create/update/delete | `.insert()/.update()`              | `POST` / `PATCH` / `DELETE`   |
| Related data         | `selects.ts` nested select strings | `?include=` or extra requests |
| Types source         | `database.types`                   | OpenAPI / hand-written DTOs   |
| Errors               | `.throwOnError()`                  | check `response.ok`           |

### Generic `queryFn` shape

```typescript
const leadsQuery = () =>
    queryOptions({
        queryKey: ['leads', 'list'] as const,
        queryFn: async (): Promise<LeadWithQuotes[]> => {
            // Replace with project's data layer:
            // - supabase.from('leads').select(...)
            // - api.get('/leads') or fetch('/api/leads')
            return fetchLeads();
        },
    });
```

### Generic `mutationFn` shape

```typescript
const createLead = async (payload: CreateLeadPayload): Promise<LeadWithQuotes> => {
    // Replace with project's data layer; always throw on failure
    return createLeadViaApi(payload);
};

export const createLeadMutation = mutationOptions({
    mutationFn: createLead,
    onSuccess: (data, __, ___, context) => {
        const queryClient = context.client;
        queryClient.setQueryData(queries.leads().queryKey, (old) =>
            old ? [...old, data] : [data]
        );
    },
    onSettled: (_data, _error, __, ___, context) => {
        const queryClient = context.client;
        void queryClient.invalidateQueries({ queryKey: queries.leads().queryKey });
    },
});
```

---

## Directory structure

```
lib/api/
├── index.ts                     # re-exports queries, mutations, queryClient
├── queryClient.ts               # TanStack Query singleton (+ optional persistence)
├── selects.ts                   # optional: Supabase/PostgREST nested select fragments
├── queries/
│   ├── index.ts                 # aggregates all domain query objects into `queries`
│   └── <domain>.ts
├── mutations/
│   ├── index.ts                 # aggregates all domain mutation objects into `mutations`
│   └── <domain>/
│       ├── index.ts             # exports `<domain>Mutations` object
│       └── <operation><Entity>.ts
├── parsers/                     # optional: normalize API response → app types
├── types/                       # composed types (e.g. LeadWithQuotes)
└── utils/                       # optional: shared mutation/query helpers
```

---

## queryClient.ts

Match an existing `queryClient` if the project has one. Default for client-side React apps:

```typescript
import { MutationCache, QueryClient } from '@tanstack/react-query';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { toast } from 'sonner';

export const queryClient = new QueryClient({
    mutationCache: new MutationCache({
        onError: (error) => {
            toast.error(error.message ?? 'Something went wrong');
        },
    }),
    defaultOptions: {
        queries: { staleTime: 1000 * 30 },
    },
});

const persister = createSyncStoragePersister({ storage: window.localStorage });

persistQueryClient({
    queryClient,
    persister,
    buster: '1', // increment when schema changes break cached data
});

export const clearQueryCache = () => queryClient.clear();
```

Skip `persistQueryClient` / `window.localStorage` for SSR-only or server-managed clients.

---

## selects.ts (Supabase / PostgREST only)

Named nested select string fragments. Compose with template literals.

```typescript
export const quoteWithLineItemsSelect = `*,quote_line_items(*)`;
export const leadWithQuotesSelect = `*,quotes(${quoteWithLineItemsSelect})`;
export const threadWithMessagesSelect = `*,contact:contacts(*),messages(*)`;
```

Naming: `<entity>With<Relation>Select`. For REST, encode includes in the client call or parser instead — no `selects.ts` file.

---

## types/

Composed types that pair a base entity with relations. Source types from whatever the project uses:

```typescript
// types/leads.ts — Supabase example
import type { Database } from '@/types/database.types';

type Lead = Database['public']['Tables']['leads']['Row'];
type Quote = Database['public']['Tables']['quotes']['Row'];
type LineItem = Database['public']['Tables']['quote_line_items']['Row'];

export interface QuoteWithLineItems extends Quote {
    quote_line_items: LineItem[];
}

export interface LeadWithQuotes extends Lead {
    quotes: QuoteWithLineItems[];
}
```

Use API response field names as returned (often `snake_case` from Postgres). Map to app casing in `parsers/` if the UI expects camelCase.

---

## Query pattern

Factory function → `queryOptions()`. Grouped into a domain object export.

Supabase samples below filter `.eq('is_deleted', false)` where the example schema uses soft-delete — omit that filter if the project does not.

### List query (Supabase reference)

```typescript
import { queryOptions } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

const leadsQuery = () =>
    queryOptions({
        queryKey: ['leads', 'list'] as const,
        queryFn: async (): Promise<LeadWithQuotes[]> => {
            const { data } = await supabase
                .from('leads')
                .select(leadWithQuotesSelect)
                .eq('is_deleted', false)
                .order('created_at', { ascending: false })
                .throwOnError();
            return data;
        },
    });
```

### Detail query (optional id)

```typescript
const leadQuery = (leadId?: string) =>
    queryOptions({
        queryKey: ['leads', 'detail', leadId] as const,
        enabled: Boolean(leadId),
        queryFn: async (): Promise<LeadWithQuotes | null> => {
            if (!leadId) throw new Error('Lead ID is required');
            const { data } = await supabase
                .from('leads')
                .select(leadWithQuotesSelect)
                .eq('id', leadId)
                .eq('is_deleted', false)
                .maybeSingle()
                .throwOnError();
            return data;
        },
    });
```

### Sub-resource query (filtered by parent id)

```typescript
const leadNotesQuery = (leadId: string) =>
    queryOptions({
        queryKey: ['leads', 'notes', leadId] as const,
        enabled: Boolean(leadId),
        queryFn: async (): Promise<LeadNote[]> => {
            const { data } = await supabase
                .from('notes')
                .select('*')
                .eq('lead_id', leadId)
                .order('created_at', { ascending: false })
                .throwOnError();
            return data;
        },
    });
```

### Domain export

```typescript
export const leadQueries = {
    lead: leadQuery,
    leads: leadsQuery,
    leadNotes: leadNotesQuery,
};
```

### queries/index.ts

```typescript
import { leadQueries } from './leads';
import { accountQueries } from './accounts';

export const queries = {
    ...leadQueries,
    ...accountQueries,
};
```

---

## Flattened export keys

`queries/index.ts` and `mutations/index.ts` spread domain objects into one flat namespace. **Every key must be unique across all domains** — a later spread silently overwrites an earlier one.

- Prefer specific names: `lead`, `leads`, `leadNotes` — not generic `list` or `detail` on multiple domains.
- Before adding a domain, read the existing index and grep for the property names you plan to export.
- Same rule applies to `mutations`: `createLead`, `updateLead`, not reused `create` / `update` per domain.

---

## Mutation pattern

Separate `async function` for `mutationFn`, then `mutationOptions`. Never inline the fn. **Cache callbacks are stack-agnostic** — only `mutationFn` changes.

### Cache callbacks

- **`onSuccess`**: optimistic `setQueryData`, `removeQueries` when appropriate, toasts — success only
- **`onSettled`**: all `invalidateQueries` — runs on success **and** error so cache stays consistent after failures

### CREATE (Supabase reference)

```typescript
import { mutationOptions } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { queries } from '@/lib/api/queries';
import { toast } from 'sonner';

export interface CreateLeadPayload extends Pick<Lead, 'created_by'> {
    first_name: string;
    last_name: string;
    email: string;
}

const createLead = async (payload: CreateLeadPayload): Promise<LeadWithQuotes> => {
    const { data } = await supabase
        .from('leads')
        .insert(payload)
        .select(leadWithQuotesSelect)
        .single()
        .throwOnError();
    return data;
};

export const createLeadMutation = mutationOptions({
    mutationFn: createLead,
    onSuccess: (data, __, ___, context) => {
        const queryClient = context.client;
        queryClient.setQueryData(queries.leads().queryKey, (old) =>
            old ? [...old, data] : [data]
        );
        toast.success('Lead created');
    },
    onSettled: (_data, _error, __, ___, context) => {
        const queryClient = context.client;
        void queryClient.invalidateQueries({ queryKey: queries.leads().queryKey });
    },
});
```

**Child / sub-resource CREATE** — invalidate the caches that hold the new row in `onSettled`, not the parent list unless the list embeds that data:

```typescript
export const createLeadNoteMutation = mutationOptions({
    mutationFn: createLeadNote,
    onSuccess: () => {
        toast.success('Note added');
    },
    onSettled: (data, _error, variables, ___, context) => {
        const queryClient = context.client;
        const leadId = data?.lead_id ?? variables.lead_id;
        void queryClient.invalidateQueries({
            queryKey: queries.leadNotes(leadId).queryKey,
        });
        void queryClient.invalidateQueries({
            queryKey: queries.lead(leadId).queryKey,
        });
    },
});
```

### UPDATE (Supabase reference)

```typescript
import { supabase } from '@/lib/supabase';

export interface UpdateLeadPayload
    extends Partial<Pick<Lead, 'first_name' | 'last_name' | 'email'>> {
    id: string;
    updated_by: string;
}

const updateLead = async (payload: UpdateLeadPayload): Promise<LeadWithQuotes> => {
    const { id, updated_by, ...updates } = payload;
    const { data } = await supabase
        .from('leads')
        .update({ updated_by, ...updates })
        .eq('id', id)
        .eq('is_deleted', false)
        .select(leadWithQuotesSelect)
        .single()
        .throwOnError();
    return data;
};

export const updateLeadMutation = mutationOptions({
    mutationFn: updateLead,
    onSuccess: (data, __, ___, context) => {
        const queryClient = context.client;
        queryClient.setQueryData(queries.lead(data.id).queryKey, data);
        queryClient.setQueryData(queries.leads().queryKey, (old) =>
            old ? old.map((row) => (row.id === data.id ? data : row)) : [data]
        );
        toast.success('Lead updated');
    },
    onSettled: (data, _error, variables, ___, context) => {
        const queryClient = context.client;
        const id = data?.id ?? variables.id;
        void queryClient.invalidateQueries({ queryKey: queries.lead(id).queryKey });
        void queryClient.invalidateQueries({ queryKey: queries.leads().queryKey });
    },
});
```

### DELETE (Supabase reference — soft-delete example)

One valid approach: tombstone with `is_deleted`. Use hard `.delete()` or other semantics if the project does. Cache callbacks stay the same.

```typescript
import { supabase } from '@/lib/supabase';

export type DeleteLeadPayload = { id: string; deleted_by: string };

const deleteLead = async (payload: DeleteLeadPayload): Promise<Lead> => {
    const { data } = await supabase
        .from('leads')
        .update({ is_deleted: true })
        .eq('id', payload.id)
        .eq('is_deleted', false)
        .select('*')
        .single()
        .throwOnError();
    return data;
};

export const deleteLeadMutation = mutationOptions({
    mutationFn: deleteLead,
    onSuccess: (_data, payload, ___, context) => {
        const queryClient = context.client;
        queryClient.setQueryData(queries.leads().queryKey, (old) =>
            old ? old.filter((row) => row.id !== payload.id) : old
        );
        void queryClient.removeQueries({ queryKey: queries.lead(payload.id).queryKey });
        toast.success('Lead deleted');
    },
    onSettled: (_data, _error, payload, ___, context) => {
        const queryClient = context.client;
        void queryClient.invalidateQueries({ queryKey: queries.leads().queryKey });
    },
});
```

### Multi-step (parent + child) — Supabase reference

Use explicit error checks per step — do not assume `.throwOnError()` rolls back prior steps.

```typescript
const createQuote = async (payload: CreateQuotePayload): Promise<QuoteWithLineItems> => {
    const { line_items, ...quoteData } = payload;

    const { data: quote, error: quoteError } = await supabase
        .from('quotes')
        .insert(quoteData)
        .select('*')
        .single();
    if (quoteError) throw quoteError;

    const { data: insertedLineItems, error: linesError } = await supabase
        .from('quote_line_items')
        .insert(line_items.map((item) => ({ ...item, quote_id: quote.id })))
        .select('*');
    if (linesError) throw linesError;

    return { ...quote, quote_line_items: insertedLineItems };
};
```

For REST, use transactions or compensating deletes on partial failure if the backend does not atomicize. Apply the same `onSuccess` / `onSettled` cache rules as other mutations.

---

## Cross-domain cache invalidation

When a mutation changes data another domain's queries depend on, add those invalidations inside that mutation's `onSettled` (with the same `queryClient`):

```typescript
onSettled: (_data, _error, payload, ___, context) => {
    const queryClient = context.client;
    void queryClient.invalidateQueries({ queryKey: queries.leads().queryKey });
    void queryClient.invalidateQueries({ queryKey: ['threads', 'list'] });
    void queryClient.invalidateQueries({ queryKey: ['threads', 'detail'] });
},
```

Prefer `queries.threads().queryKey` (or equivalent) when the threads domain is exported. When extending, read related domain files for the exact key shape.

---

## Export aggregation

### mutations/<domain>/index.ts

```typescript
import { createLeadMutation } from './createLead';
import { updateLeadMutation } from './updateLead';
import { deleteLeadMutation } from './deleteLead';

export const leadMutations = {
    createLead: createLeadMutation,
    updateLead: updateLeadMutation,
    deleteLead: deleteLeadMutation,
};
```

### mutations/index.ts

```typescript
import { leadMutations } from './leads';
import { quoteMutations } from './quotes';

export const mutations = {
    ...leadMutations,
    ...quoteMutations,
};
```

### lib/api/index.ts

```typescript
export { queries } from './queries';
export { mutations } from './mutations';
export { queryClient, clearQueryCache } from './queryClient';
```

---

## Naming conventions

| Thing                      | Pattern                            | Example                       |
| -------------------------- | ---------------------------------- | ----------------------------- |
| Query factory              | `<entity>Query` / `<entity>sQuery` | `leadQuery`, `leadsQuery`     |
| Query key                  | `['entity', 'type', id?]`          | `['leads', 'detail', leadId]` |
| Mutation export            | `<operation><Entity>Mutation`      | `createLeadMutation`          |
| Payload interface          | `<Operation><Entity>Payload`       | `CreateLeadPayload`           |
| Select fragment (Supabase) | `<entity>With<Relation>Select`     | `leadWithQuotesSelect`        |
| Domain query object        | `<domain>Queries`                  | `leadQueries`                 |
| Domain mutation object     | `<domain>Mutations`                | `leadMutations`               |
