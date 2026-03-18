# Database Migration: Add Message Field

## What Changed

The waitlist form has been updated to include an optional message field where users can provide additional context about what they're looking for.

## Required Database Update

You need to add a `message` column to your `waiting_list` table in Supabase.

### Option 1: Run via Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the SQL from `add_message_to_waiting_list.sql`
4. Click **Run**

### Option 2: Run via SQL

```sql
ALTER TABLE waiting_list
ADD COLUMN IF NOT EXISTS message TEXT;

COMMENT ON COLUMN waiting_list.message IS 'Optional message from the user describing what they are looking for';
```

### Option 3: Supabase CLI (if using locally)

```bash
# From the website directory
supabase db push
```

## Verification

After running the migration, verify the column was added:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'waiting_list'
ORDER BY ordinal_position;
```

You should see the `message` column with type `TEXT` and `is_nullable = YES`.

## What This Changes

### API `/api/waitlist`
- Now accepts an optional `message` field in the request body
- `POST { email, message?, locale }`

### Database Schema
```
waiting_list
├── id (uuid, primary key)
├── email (text, unique, not null)
├── locale (text, not null)
├── message (text, nullable) ← NEW
└── created_at (timestamp, not null)
```

### TypeScript Types
Updated `WaitlistEntry` type in `src/lib/supabase.ts` to include optional `message` field.
