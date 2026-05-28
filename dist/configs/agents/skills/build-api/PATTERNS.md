# API Patterns Reference

## Directory structure

```
lib/api/
├── index.ts                     # re-exports queries, mutations, queryClient
├── queryClient.ts               # TanStack Query singleton + localStorage persistence
├── selects.ts                   # PostgREST nested select string fragments
├── queries/
│   ├── index.ts                 # aggregates all domain query objects into `queries`
│   └── <domain>.ts
├── mutations/
│   ├── index.ts                 # aggregates all domain mutation objects into `mutations`
│   └── <domain>/
│       ├── index.ts             # exports `<domain>Mutations` object
│       └── <operation><Entity>.ts
├── parsers/                     # optional: transform raw API response shapes
├── types/                       # composed types (e.g. LeadWithQuotes extends Lead)
└── utils/                       # shared helpers (buildActivityPayload, etc.)
```

---

## queryClient.ts

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

---

## selects.ts

Named PostgREST select string fragments. Compose with template literals.

```typescript
export const quoteWithLineItemsSelect = `*,quote_line_items(*)`;
export const leadWithQuotesSelect = `*,quotes(${quoteWithLineItemsSelect})`;
export const threadWithMessagesSelect = `*,contact:contacts(*),messages(*)`;
export const userWithPermissionsSelect = `*,permissions:user_permissions(*)`;
```

Naming: `<entity>With<Relation>Select`. Always compose from smaller fragments.

---

## types/

Composed types that pair a base row type with its joined relations.

```typescript
// types/leads.ts
import type { Database } from '@/types/database.types';

type Lead = Database['public']['Tables']['leads']['Row'];
type Quote = Database['public']['Tables']['quotes']['Row'];

export interface QuoteWithLineItems extends Quote {
    quote_line_items: LineItem[];
}

export interface LeadWithQuotes extends Lead {
    quotes: QuoteWithLineItems[];
}
```

---

## Query pattern

Factory function → `queryOptions()`. Grouped into a domain object export.

### List query
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
const leadActivitiesQuery = (leadId: string) =>
    queryOptions({
        queryKey: ['leads', 'activities', leadId] as const,
        enabled: Boolean(leadId),
        queryFn: async (): Promise<ParsedLeadActivity[]> => {
            const { data } = await supabase
                .from('activity')
                .select('*')
                .eq('lead_id', leadId)
                .order('created_at', { ascending: false })
                .throwOnError();
            return parseLeadActivities(data);
        },
    });
```

### Domain export
```typescript
export const leadQueries = {
    lead: leadQuery,
    leads: leadsQuery,
    leadActivities: leadActivitiesQuery,
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

## Mutation pattern

Separate `async function` for `mutationFn`, then `mutationOptions`. Never inline the fn.

### CREATE
```typescript
import { mutationOptions } from '@tanstack/react-query';
import { queries } from '@/lib/api/queries';
import { toast } from 'sonner';

export interface CreateNotePayload extends Pick<LeadNote, 'lead_id' | 'created_by'> {
    content: string;
}

const createLeadNote = async (payload: CreateNotePayload): Promise<LeadNote> => {
    const { data } = await supabase
        .from('notes')
        .insert(payload)
        .select('*')
        .single()
        .throwOnError();
    return data;
};

export const createLeadNoteMutation = mutationOptions({
    mutationFn: createLeadNote,
    onSuccess: (data, __, ___, context) => {
        const queryClient = context.client;
        queryClient.setQueryData(queries.leads().queryKey, (old) =>
            old ? [...old, data] : [data]
        );
        void queryClient.invalidateQueries({ queryKey: queries.leads().queryKey });
        toast.success('Note added');
    },
});
```

### UPDATE
```typescript
export interface UpdateLeadPayload extends Partial<Pick<Lead, 'first_name' | 'last_name' | 'email'>> {
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
    onSuccess: (data, payload, ___, context) => {
        const queryClient = context.client;
        queryClient.setQueryData(queries.lead(data.id).queryKey, data);
        queryClient.setQueryData(queries.leads().queryKey, (old) =>
            old ? old.map((row) => (row.id === data.id ? data : row)) : [data]
        );
        void queryClient.invalidateQueries({ queryKey: queries.lead(data.id).queryKey });
        void queryClient.invalidateQueries({ queryKey: queries.leads().queryKey });
        // Suppress toast for silent updates (e.g. status toggles):
        if (!payload.status_id) toast.success('Lead updated');
    },
});
```

### DELETE (soft)
```typescript
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
    onSuccess: (lead, payload, ___, context) => {
        const queryClient = context.client;
        queryClient.setQueryData(queries.leads().queryKey, (old) =>
            old ? old.filter((row) => row.id !== payload.id) : old
        );
        void queryClient.removeQueries({ queryKey: queries.lead(payload.id).queryKey });
        void queryClient.invalidateQueries({ queryKey: queries.leads().queryKey });
        toast.success('Lead deleted');
    },
});
```

### Multi-step (parent + child inserts)

Use manual error handling — do not use `.throwOnError()` across steps.

```typescript
const createQuote = async (payload: CreateQuotePayload): Promise<QuoteWithLineItems> => {
    const { line_items, ...quoteData } = payload;

    const { data: quote, error: quoteError } = await supabase
        .from('quotes')
        .insert(quoteData)
        .select('*')
        .single();
    if (quoteError) throw quoteError;

    const { data: lineItems, error: linesError } = await supabase
        .from('quote_line_items')
        .insert(line_items.map((item) => ({ ...item, quote_id: quote.id })))
        .select('*');
    if (linesError) throw linesError;

    return { ...quote, quote_line_items: lineItems };
};
```

---

## Mutation complexity

### Soft-delete tables
Always include `.eq('is_deleted', false)` in reads and use `.update({ is_deleted: true })` for deletes — never `.delete()`.

### Activity logging
Fetch previous state before mutating, diff with `buildActivityPayload()`, insert an `activity` row:

```typescript
const { data: previousLead } = await supabase.from('leads').select('*').eq('id', id).single().throwOnError();
// ... perform update ...
const activityPayload = buildActivityPayload(previousLead, updatedLead, Object.keys(updates));
if (Object.keys(activityPayload).length > 0) {
    await supabase.from('activity').insert({ lead_id: id, user_id: updated_by, event_type, payload: activityPayload }).throwOnError();
}
```

### Related record cleanup
Pass an optional flag in the payload to branch behaviour:

```typescript
export type DeleteLeadPayload = { id: string; deleted_by: string; delete_linked_threads?: boolean };
// In mutationFn: if (payload.delete_linked_threads) { ... } else { ... }
```

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

| Thing | Pattern | Example |
|---|---|---|
| Query factory | `<entity>Query` / `<entity>sQuery` | `leadQuery`, `leadsQuery` |
| Query key | `['entity', 'type', id?]` | `['leads', 'detail', leadId]` |
| Mutation export | `<operation><Entity>Mutation` | `createLeadMutation` |
| Payload interface | `<Operation><Entity>Payload` | `CreateLeadPayload` |
| Select fragment | `<entity>With<Relation>Select` | `leadWithQuotesSelect` |
| Domain query object | `<domain>Queries` | `leadQueries` |
| Domain mutation object | `<domain>Mutations` | `leadMutations` |
