
-- Migration: 20251103153720
-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  product_id TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  image_url TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  facebook_link TEXT,
  tiktok_link TEXT,
  telegram_link TEXT,
  custom_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create site_settings table (single row for global settings)
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_name TEXT NOT NULL DEFAULT 'RICKKY STORE',
  logo_url TEXT,
  background_image_url TEXT,
  facebook_url TEXT,
  tiktok_url TEXT,
  telegram_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default site settings
INSERT INTO public.site_settings (store_name) VALUES ('RICKKY STORE');

-- Insert sample categories
INSERT INTO public.categories (name) VALUES 
  ('iPhone'),
  ('OPPO'),
  ('Vivo'),
  ('Samsung');

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables
CREATE POLICY "Public read access for categories"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "Public read access for products"
  ON public.products FOR SELECT
  USING (true);

CREATE POLICY "Public read access for site_settings"
  ON public.site_settings FOR SELECT
  USING (true);

-- Full access for authenticated users (admin)
CREATE POLICY "Full access for categories"
  ON public.categories FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Full access for products"
  ON public.products FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Full access for site_settings"
  ON public.site_settings FOR ALL
  USING (auth.role() = 'authenticated');

-- Migration: 20251103154721
-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true);

-- Storage policies for product images
CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update product images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Create storage bucket for site images (logo, background)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('site-images', 'site-images', true);

-- Storage policies for site images
CREATE POLICY "Public can view site images"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-images');

CREATE POLICY "Authenticated users can upload site images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'site-images' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update site images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'site-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete site images"
ON storage.objects FOR DELETE
USING (bucket_id = 'site-images' AND auth.role() = 'authenticated');

-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Update RLS policies for admin access
DROP POLICY IF EXISTS "Full access for categories" ON public.categories;
DROP POLICY IF EXISTS "Full access for products" ON public.products;
DROP POLICY IF EXISTS "Full access for site_settings" ON public.site_settings;

CREATE POLICY "Admins can manage categories"
ON public.categories FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage products"
ON public.products FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage site_settings"
ON public.site_settings FOR ALL
USING (public.has_role(auth.uid(), 'admin'));
