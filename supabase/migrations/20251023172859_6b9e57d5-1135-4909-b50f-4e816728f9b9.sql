-- Create enum for order status
CREATE TYPE order_status AS ENUM ('new', 'filled', 'canceled', 'rejected', 'partially_filled');

-- Create enum for order side
CREATE TYPE order_side AS ENUM ('buy', 'sell');

-- Create enum for order type
CREATE TYPE order_type AS ENUM ('market', 'limit', 'stop', 'bracket');

-- Paper Orders table
CREATE TABLE public.paper_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  side order_side NOT NULL,
  type order_type NOT NULL,
  qty DECIMAL NOT NULL,
  limit_price DECIMAL,
  stop_price DECIMAL,
  tp_price DECIMAL,
  status order_status NOT NULL DEFAULT 'new',
  strategy TEXT,
  tags TEXT[],
  signal_id TEXT
);

-- Paper Fills table
CREATE TABLE public.paper_fills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES public.paper_orders(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  price DECIMAL NOT NULL,
  qty DECIMAL NOT NULL,
  fee DECIMAL NOT NULL DEFAULT 0
);

-- Paper Positions table
CREATE TABLE public.paper_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  qty DECIMAL NOT NULL DEFAULT 0,
  avg_price DECIMAL NOT NULL,
  unrealized DECIMAL NOT NULL DEFAULT 0,
  realized DECIMAL NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, symbol)
);

-- Strategy Signals table
CREATE TABLE public.strategy_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  strategy TEXT NOT NULL,
  symbol TEXT NOT NULL,
  interval TEXT NOT NULL,
  payload JSONB NOT NULL
);

-- Backtests table
CREATE TABLE public.backtests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  strategy TEXT NOT NULL,
  symbol TEXT NOT NULL,
  params JSONB NOT NULL,
  summary JSONB NOT NULL,
  equity JSONB NOT NULL,
  trades JSONB NOT NULL
);

-- Audit log table
CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  detail JSONB NOT NULL
);

-- Enable RLS
ALTER TABLE public.paper_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_fills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strategy_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backtests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for paper_orders
CREATE POLICY "Users can view their own orders"
  ON public.paper_orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
  ON public.paper_orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders"
  ON public.paper_orders FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for paper_fills
CREATE POLICY "Users can view their own fills"
  ON public.paper_fills FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own fills"
  ON public.paper_fills FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for paper_positions
CREATE POLICY "Users can view their own positions"
  ON public.paper_positions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own positions"
  ON public.paper_positions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own positions"
  ON public.paper_positions FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for strategy_signals
CREATE POLICY "Users can view their own signals"
  ON public.strategy_signals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own signals"
  ON public.strategy_signals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for backtests
CREATE POLICY "Users can view their own backtests"
  ON public.backtests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own backtests"
  ON public.backtests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for audit_log
CREATE POLICY "Users can view their own audit logs"
  ON public.audit_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create audit logs"
  ON public.audit_log FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_paper_orders_user_symbol ON public.paper_orders(user_id, symbol);
CREATE INDEX idx_paper_orders_status ON public.paper_orders(status);
CREATE INDEX idx_paper_fills_order ON public.paper_fills(order_id);
CREATE INDEX idx_paper_positions_user ON public.paper_positions(user_id);
CREATE INDEX idx_strategy_signals_user_symbol ON public.strategy_signals(user_id, symbol);
CREATE INDEX idx_backtests_user ON public.backtests(user_id);
CREATE INDEX idx_audit_log_user ON public.audit_log(user_id);

-- Trigger to update updated_at on positions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_paper_positions_updated_at
  BEFORE UPDATE ON public.paper_positions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();