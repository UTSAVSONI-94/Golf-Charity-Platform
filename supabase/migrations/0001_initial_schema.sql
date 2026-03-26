-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS TABLE (Linked to Supabase Auth)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own data" ON public.users FOR SELECT USING (auth.uid() = id);

-- CHARITIES TABLE 
CREATE TABLE public.charities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.charities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view charities" ON public.charities FOR SELECT USING (true);
CREATE POLICY "Admin can full manage charities" ON public.charities FOR ALL USING (
  -- In a real app we'd verify admin role, using a placeholder check for now
  auth.jwt() ->> 'role' = 'service_role' OR auth.uid() IN (SELECT id FROM public.users) 
);

-- SUBSCRIPTIONS TABLE
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL, 
  status TEXT NOT NULL, 
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- SCORES TABLE
CREATE TABLE public.scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  score INTEGER CHECK (score >= 1 AND score <= 45),
  date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own scores" ON public.scores FOR ALL USING (auth.uid() = user_id);

-- TRIGGER TO ENFORCE MAX 5 SCORES PER USER
CREATE OR REPLACE FUNCTION enforce_max_five_scores()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete all rows beyond the most recent 5 for this user
  DELETE FROM public.scores
  WHERE user_id = NEW.user_id
    AND id NOT IN (
      SELECT id FROM public.scores
      WHERE user_id = NEW.user_id
      ORDER BY date DESC, created_at DESC
      LIMIT 5
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_enforce_max_five_scores
AFTER INSERT ON public.scores
FOR EACH ROW
EXECUTE FUNCTION enforce_max_five_scores();

-- DRAWS TABLE
CREATE TABLE public.draws (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  month INTEGER,
  year INTEGER,
  draw_numbers INTEGER[] CHECK (array_length(draw_numbers, 1) = 5),
  type TEXT, 
  status TEXT, 
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.draws ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published draws" ON public.draws FOR SELECT USING (status = 'published');

-- USER_DRAW_ENTRIES TABLE
CREATE TABLE public.user_draw_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  draw_id UUID REFERENCES public.draws(id) ON DELETE CASCADE,
  user_numbers INTEGER[] CHECK (array_length(user_numbers, 1) = 5),
  match_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.user_draw_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own entries" ON public.user_draw_entries FOR SELECT USING (auth.uid() = user_id);

-- WINNERS TABLE
CREATE TABLE public.winners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  draw_id UUID REFERENCES public.draws(id) ON DELETE CASCADE,
  match_type INTEGER CHECK (match_type IN (3, 4, 5)),
  prize_amount NUMERIC(10,2),
  status TEXT DEFAULT 'pending', 
  proof_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.winners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own prizes" ON public.winners FOR SELECT USING (auth.uid() = user_id);

-- DONATIONS TABLE
CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  charity_id UUID REFERENCES public.charities(id) ON DELETE CASCADE,
  percentage NUMERIC(5,2) CHECK (percentage >= 10 AND percentage <= 100),
  amount NUMERIC(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own donations" ON public.donations FOR SELECT USING (auth.uid() = user_id);
