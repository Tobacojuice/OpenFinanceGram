-- Performance optimization indexes for FinanceGram (corrected)

-- Watchlist items - composite index for watchlist queries
CREATE INDEX IF NOT EXISTS idx_watchlist_items_watchlist_added 
ON public.watchlist_items(watchlist_id, added_at DESC);

-- Watchlist items - symbol lookup
CREATE INDEX IF NOT EXISTS idx_watchlist_items_symbol 
ON public.watchlist_items(symbol);

-- Messages - composite index for channel queries with pagination
CREATE INDEX IF NOT EXISTS idx_messages_channel_created 
ON public.messages(channel_id, created_at DESC);

-- Messages - user messages index
CREATE INDEX IF NOT EXISTS idx_messages_user 
ON public.messages(user_id, created_at DESC);

-- Channel members - composite for membership checks
CREATE INDEX IF NOT EXISTS idx_channel_members_user_channel 
ON public.channel_members(user_id, channel_id);

-- Channel members - channel lookup
CREATE INDEX IF NOT EXISTS idx_channel_members_channel 
ON public.channel_members(channel_id);

-- Profiles - user lookup
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_user_id 
ON public.profiles(user_id);

-- LinkedIn profiles - user lookup
CREATE INDEX IF NOT EXISTS idx_linkedin_profiles_user 
ON public.jobsea_linkedin_profiles(user_id, created_at DESC);

-- LinkedIn profiles - profile URL uniqueness
CREATE UNIQUE INDEX IF NOT EXISTS idx_linkedin_profiles_url_unique 
ON public.jobsea_linkedin_profiles(linkedin_url) 
WHERE linkedin_url IS NOT NULL;

-- LinkedIn scrapes - rate limiting lookup
CREATE INDEX IF NOT EXISTS idx_linkedin_scrapes_user_time 
ON public.jobsea_linkedin_scrapes(user_id, created_at DESC);

-- Watchlists - user default lookup
CREATE INDEX IF NOT EXISTS idx_watchlists_user_default 
ON public.watchlists(user_id, is_default);

-- Paper orders - user status lookup
CREATE INDEX IF NOT EXISTS idx_paper_orders_user_status 
ON public.paper_orders(user_id, status, created_at DESC);

-- Paper positions - user symbol lookup
CREATE INDEX IF NOT EXISTS idx_paper_positions_user_symbol 
ON public.paper_positions(user_id, symbol);

-- Price alerts - active alerts lookup
CREATE INDEX IF NOT EXISTS idx_price_alerts_active 
ON public.price_alerts(user_id, is_active, symbol) 
WHERE is_active = true;