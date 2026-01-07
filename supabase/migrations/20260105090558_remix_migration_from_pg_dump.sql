CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
BEGIN;

--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: app_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.app_role AS ENUM (
    'admin',
    'user'
);


--
-- Name: quote_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.quote_status AS ENUM (
    'pending',
    'replied',
    'closed'
);


--
-- Name: generate_booking_reference(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.generate_booking_reference() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.booking_reference := 'VL-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(gen_random_uuid()::text, 1, 6));
  RETURN NEW;
END;
$$;


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;


--
-- Name: has_role(uuid, public.app_role); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


--
-- Name: validate_profile_access(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.validate_profile_access() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- This trigger provides an additional layer of security
  -- It ensures that only the profile owner or admins can access profile data
  IF TG_OP = 'SELECT' THEN
    -- Allow if user is viewing their own profile or is admin
    IF NEW.user_id = auth.uid() OR has_role(auth.uid(), 'admin') THEN
      RETURN NEW;
    ELSE
      RAISE EXCEPTION 'Unauthorized access to profile data';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: blog_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blog_categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: blog_posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blog_posts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    excerpt text,
    content text,
    featured_image text,
    category_id uuid,
    author_id uuid,
    published boolean DEFAULT false,
    meta_title text,
    meta_description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: bookings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bookings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    booking_reference text NOT NULL,
    tour_id uuid NOT NULL,
    user_id uuid,
    pricing_id uuid,
    status text DEFAULT 'pending'::text NOT NULL,
    guest_name text NOT NULL,
    guest_email text NOT NULL,
    guest_phone text,
    guest_country text,
    travel_date date NOT NULL,
    end_date date,
    travelers integer DEFAULT 1 NOT NULL,
    special_requests text,
    total_price numeric NOT NULL,
    currency text DEFAULT 'USD'::text NOT NULL,
    deposit_amount numeric DEFAULT 0,
    deposit_paid boolean DEFAULT false,
    payment_method text,
    payment_reference text,
    payment_status text DEFAULT 'unpaid'::text,
    confirmed_at timestamp with time zone,
    cancelled_at timestamp with time zone,
    cancellation_reason text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT bookings_payment_status_check CHECK ((payment_status = ANY (ARRAY['unpaid'::text, 'partial'::text, 'paid'::text, 'refunded'::text]))),
    CONSTRAINT bookings_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'paid'::text, 'cancelled'::text, 'completed'::text])))
);


--
-- Name: chat_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chat_messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    message text NOT NULL,
    is_admin_reply boolean DEFAULT false,
    read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: destinations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.destinations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    short_description text,
    image_url text,
    highlights text[],
    best_time_to_visit text,
    featured boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: faq_entries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.faq_entries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    category text NOT NULL,
    question text NOT NULL,
    answer text NOT NULL,
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: instagram_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.instagram_images (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    image_url text NOT NULL,
    alt_text text,
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: newsletter_subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.newsletter_subscriptions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    name text,
    is_active boolean DEFAULT true,
    source text DEFAULT 'website'::text,
    subscribed_at timestamp with time zone DEFAULT now() NOT NULL,
    unsubscribed_at timestamp with time zone
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    full_name text,
    email text,
    phone text,
    country text,
    preferred_language text DEFAULT 'en'::text,
    dark_mode boolean DEFAULT false,
    avatar_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: quotes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quotes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    full_name text NOT NULL,
    email text NOT NULL,
    phone text,
    country text,
    travel_start_date date,
    travel_end_date date,
    travelers integer DEFAULT 1,
    budget_range text,
    tour_type text,
    destinations text[],
    special_requests text,
    status public.quote_status DEFAULT 'pending'::public.quote_status,
    admin_reply text,
    replied_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reviews (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tour_id uuid,
    user_id uuid,
    reviewer_name text NOT NULL,
    reviewer_email text,
    reviewer_country text,
    rating integer NOT NULL,
    title text,
    content text,
    travel_date date,
    is_verified boolean DEFAULT false,
    is_approved boolean DEFAULT false,
    is_featured boolean DEFAULT false,
    admin_response text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    platform text DEFAULT 'tripadvisor'::text,
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


--
-- Name: site_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.site_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    key text NOT NULL,
    value text,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: tour_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tour_images (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tour_id uuid NOT NULL,
    image_url text NOT NULL,
    caption text,
    is_primary boolean DEFAULT false,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: tour_itineraries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tour_itineraries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tour_id uuid NOT NULL,
    day_number integer NOT NULL,
    title text NOT NULL,
    description text,
    location text,
    meals_included text[] DEFAULT '{}'::text[],
    accommodation text,
    highlights text[] DEFAULT '{}'::text[],
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: tour_pricing; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tour_pricing (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tour_id uuid NOT NULL,
    tier_name text DEFAULT 'Standard'::text NOT NULL,
    price_per_person numeric NOT NULL,
    currency text DEFAULT 'USD'::text NOT NULL,
    min_travelers integer DEFAULT 1,
    max_travelers integer DEFAULT 10,
    inclusions text[] DEFAULT '{}'::text[],
    exclusions text[] DEFAULT '{}'::text[],
    valid_from date,
    valid_until date,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: tours; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tours (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    short_description text,
    duration text,
    price numeric(10,2),
    image_url text,
    highlights text[],
    destinations uuid[],
    max_travelers integer,
    featured boolean DEFAULT false,
    rating numeric(2,1) DEFAULT 0,
    review_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    tour_type text DEFAULT 'cultural'::text,
    difficulty_level text DEFAULT 'easy'::text,
    min_age integer DEFAULT 0,
    group_size_min integer DEFAULT 1,
    group_size_max integer DEFAULT 15,
    languages text[] DEFAULT '{English}'::text[],
    video_url text,
    map_coordinates jsonb,
    CONSTRAINT tours_difficulty_level_check CHECK ((difficulty_level = ANY (ARRAY['easy'::text, 'moderate'::text, 'challenging'::text])))
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role public.app_role DEFAULT 'user'::public.app_role NOT NULL
);


--
-- Name: blog_categories blog_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_categories
    ADD CONSTRAINT blog_categories_pkey PRIMARY KEY (id);


--
-- Name: blog_categories blog_categories_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_categories
    ADD CONSTRAINT blog_categories_slug_key UNIQUE (slug);


--
-- Name: blog_posts blog_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_pkey PRIMARY KEY (id);


--
-- Name: blog_posts blog_posts_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_slug_key UNIQUE (slug);


--
-- Name: bookings bookings_booking_reference_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_reference_key UNIQUE (booking_reference);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- Name: chat_messages chat_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_pkey PRIMARY KEY (id);


--
-- Name: destinations destinations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.destinations
    ADD CONSTRAINT destinations_pkey PRIMARY KEY (id);


--
-- Name: destinations destinations_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.destinations
    ADD CONSTRAINT destinations_slug_key UNIQUE (slug);


--
-- Name: faq_entries faq_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faq_entries
    ADD CONSTRAINT faq_entries_pkey PRIMARY KEY (id);


--
-- Name: instagram_images instagram_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.instagram_images
    ADD CONSTRAINT instagram_images_pkey PRIMARY KEY (id);


--
-- Name: newsletter_subscriptions newsletter_subscriptions_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.newsletter_subscriptions
    ADD CONSTRAINT newsletter_subscriptions_email_key UNIQUE (email);


--
-- Name: newsletter_subscriptions newsletter_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.newsletter_subscriptions
    ADD CONSTRAINT newsletter_subscriptions_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);


--
-- Name: quotes quotes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT quotes_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: site_settings site_settings_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_key_key UNIQUE (key);


--
-- Name: site_settings site_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_pkey PRIMARY KEY (id);


--
-- Name: tour_images tour_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tour_images
    ADD CONSTRAINT tour_images_pkey PRIMARY KEY (id);


--
-- Name: tour_itineraries tour_itineraries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tour_itineraries
    ADD CONSTRAINT tour_itineraries_pkey PRIMARY KEY (id);


--
-- Name: tour_pricing tour_pricing_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tour_pricing
    ADD CONSTRAINT tour_pricing_pkey PRIMARY KEY (id);


--
-- Name: tours tours_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tours
    ADD CONSTRAINT tours_pkey PRIMARY KEY (id);


--
-- Name: tours tours_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tours
    ADD CONSTRAINT tours_slug_key UNIQUE (slug);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);


--
-- Name: idx_bookings_reference; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bookings_reference ON public.bookings USING btree (booking_reference);


--
-- Name: idx_bookings_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bookings_status ON public.bookings USING btree (status);


--
-- Name: idx_bookings_tour_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bookings_tour_id ON public.bookings USING btree (tour_id);


--
-- Name: idx_bookings_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bookings_user_id ON public.bookings USING btree (user_id);


--
-- Name: idx_reviews_approved; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reviews_approved ON public.reviews USING btree (is_approved) WHERE (is_approved = true);


--
-- Name: idx_reviews_tour_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reviews_tour_id ON public.reviews USING btree (tour_id);


--
-- Name: idx_tour_images_tour_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tour_images_tour_id ON public.tour_images USING btree (tour_id);


--
-- Name: idx_tour_itineraries_tour_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tour_itineraries_tour_id ON public.tour_itineraries USING btree (tour_id);


--
-- Name: idx_tour_pricing_tour_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tour_pricing_tour_id ON public.tour_pricing USING btree (tour_id);


--
-- Name: bookings set_booking_reference; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_booking_reference BEFORE INSERT ON public.bookings FOR EACH ROW WHEN (((new.booking_reference IS NULL) OR (new.booking_reference = ''::text))) EXECUTE FUNCTION public.generate_booking_reference();


--
-- Name: blog_posts update_blog_posts_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: bookings update_bookings_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: destinations update_destinations_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_destinations_updated_at BEFORE UPDATE ON public.destinations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: faq_entries update_faq_entries_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_faq_entries_updated_at BEFORE UPDATE ON public.faq_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: profiles update_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: quotes update_quotes_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON public.quotes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: reviews update_reviews_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: tours update_tours_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_tours_updated_at BEFORE UPDATE ON public.tours FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: blog_posts blog_posts_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: blog_posts blog_posts_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.blog_categories(id) ON DELETE SET NULL;


--
-- Name: bookings bookings_pricing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pricing_id_fkey FOREIGN KEY (pricing_id) REFERENCES public.tour_pricing(id) ON DELETE SET NULL;


--
-- Name: bookings bookings_tour_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_tour_id_fkey FOREIGN KEY (tour_id) REFERENCES public.tours(id) ON DELETE RESTRICT;


--
-- Name: bookings bookings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: chat_messages chat_messages_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: quotes quotes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT quotes_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: reviews reviews_tour_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_tour_id_fkey FOREIGN KEY (tour_id) REFERENCES public.tours(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: tour_images tour_images_tour_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tour_images
    ADD CONSTRAINT tour_images_tour_id_fkey FOREIGN KEY (tour_id) REFERENCES public.tours(id) ON DELETE CASCADE;


--
-- Name: tour_itineraries tour_itineraries_tour_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tour_itineraries
    ADD CONSTRAINT tour_itineraries_tour_id_fkey FOREIGN KEY (tour_id) REFERENCES public.tours(id) ON DELETE CASCADE;


--
-- Name: tour_pricing tour_pricing_tour_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tour_pricing
    ADD CONSTRAINT tour_pricing_tour_id_fkey FOREIGN KEY (tour_id) REFERENCES public.tours(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: faq_entries Admins can manage FAQ entries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage FAQ entries" ON public.faq_entries USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: instagram_images Admins can manage Instagram images; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage Instagram images" ON public.instagram_images USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: blog_categories Admins can manage blog categories; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage blog categories" ON public.blog_categories USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: blog_posts Admins can manage blog posts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage blog posts" ON public.blog_posts USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: bookings Admins can manage bookings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage bookings" ON public.bookings USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: destinations Admins can manage destinations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage destinations" ON public.destinations USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: reviews Admins can manage reviews; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage reviews" ON public.reviews USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: user_roles Admins can manage roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage roles" ON public.user_roles USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: site_settings Admins can manage site settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage site settings" ON public.site_settings USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: newsletter_subscriptions Admins can manage subscriptions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage subscriptions" ON public.newsletter_subscriptions USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: tour_images Admins can manage tour images; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage tour images" ON public.tour_images USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: tour_itineraries Admins can manage tour itineraries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage tour itineraries" ON public.tour_itineraries USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: tour_pricing Admins can manage tour pricing; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage tour pricing" ON public.tour_pricing USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: tours Admins can manage tours; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage tours" ON public.tours USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: chat_messages Admins can reply to messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can reply to messages" ON public.chat_messages FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: chat_messages Admins can update messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update messages" ON public.chat_messages FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: quotes Admins can update quotes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update quotes" ON public.quotes FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: faq_entries Admins can view all FAQ entries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all FAQ entries" ON public.faq_entries FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: instagram_images Admins can view all Instagram images; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all Instagram images" ON public.instagram_images FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: blog_posts Admins can view all blog posts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all blog posts" ON public.blog_posts FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: bookings Admins can view all bookings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all bookings" ON public.bookings FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: chat_messages Admins can view all messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all messages" ON public.chat_messages FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: profiles Admins can view all profiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: quotes Admins can view all quotes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all quotes" ON public.quotes FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: reviews Admins can view all reviews; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all reviews" ON public.reviews FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: user_roles Admins can view all roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: newsletter_subscriptions Admins can view subscriptions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view subscriptions" ON public.newsletter_subscriptions FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: newsletter_subscriptions Anyone can subscribe to newsletter; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscriptions FOR INSERT WITH CHECK (true);


--
-- Name: faq_entries Anyone can view active FAQ entries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view active FAQ entries" ON public.faq_entries FOR SELECT USING ((is_active = true));


--
-- Name: instagram_images Anyone can view active Instagram images; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view active Instagram images" ON public.instagram_images FOR SELECT USING ((is_active = true));


--
-- Name: reviews Anyone can view approved reviews; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view approved reviews" ON public.reviews FOR SELECT USING ((is_approved = true));


--
-- Name: blog_categories Anyone can view blog categories; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view blog categories" ON public.blog_categories FOR SELECT USING (true);


--
-- Name: destinations Anyone can view destinations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view destinations" ON public.destinations FOR SELECT USING (true);


--
-- Name: blog_posts Anyone can view published blog posts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view published blog posts" ON public.blog_posts FOR SELECT USING ((published = true));


--
-- Name: site_settings Anyone can view site settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view site settings" ON public.site_settings FOR SELECT USING (true);


--
-- Name: tour_images Anyone can view tour images; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view tour images" ON public.tour_images FOR SELECT USING (true);


--
-- Name: tour_itineraries Anyone can view tour itineraries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view tour itineraries" ON public.tour_itineraries FOR SELECT USING (true);


--
-- Name: tour_pricing Anyone can view tour pricing; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view tour pricing" ON public.tour_pricing FOR SELECT USING (true);


--
-- Name: tours Anyone can view tours; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view tours" ON public.tours FOR SELECT USING (true);


--
-- Name: bookings Authenticated users can create bookings for themselves; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can create bookings for themselves" ON public.bookings FOR INSERT TO authenticated WITH CHECK ((user_id = auth.uid()));


--
-- Name: bookings Guests can create bookings without user_id; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Guests can create bookings without user_id" ON public.bookings FOR INSERT TO anon WITH CHECK (((user_id IS NULL) AND (guest_name IS NOT NULL) AND (guest_email IS NOT NULL)));


--
-- Name: quotes Users can create quotes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create quotes" ON public.quotes FOR INSERT WITH CHECK (true);


--
-- Name: chat_messages Users can send messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can send messages" ON public.chat_messages FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: reviews Users can submit reviews; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can submit reviews" ON public.reviews FOR INSERT WITH CHECK (true);


--
-- Name: profiles Users can update their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: reviews Users can update their own reviews; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own reviews" ON public.reviews FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: bookings Users can update their pending bookings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their pending bookings" ON public.bookings FOR UPDATE USING (((auth.uid() = user_id) AND (status = 'pending'::text)));


--
-- Name: bookings Users can view their own bookings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own bookings" ON public.bookings FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: chat_messages Users can view their own messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own messages" ON public.chat_messages FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: profiles Users can view their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: quotes Users can view their own quotes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own quotes" ON public.quotes FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: user_roles Users can view their own roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: blog_categories; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;

--
-- Name: blog_posts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

--
-- Name: bookings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

--
-- Name: chat_messages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

--
-- Name: destinations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;

--
-- Name: faq_entries; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.faq_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: instagram_images; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.instagram_images ENABLE ROW LEVEL SECURITY;

--
-- Name: newsletter_subscriptions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: quotes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

--
-- Name: reviews; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

--
-- Name: site_settings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

--
-- Name: tour_images; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.tour_images ENABLE ROW LEVEL SECURITY;

--
-- Name: tour_itineraries; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.tour_itineraries ENABLE ROW LEVEL SECURITY;

--
-- Name: tour_pricing; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.tour_pricing ENABLE ROW LEVEL SECURITY;

--
-- Name: tours; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--




COMMIT;