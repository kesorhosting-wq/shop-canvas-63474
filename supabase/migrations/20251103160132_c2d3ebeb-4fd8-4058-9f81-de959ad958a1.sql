-- Force type regeneration with schema modification
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now() NOT NULL;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now() NOT NULL;