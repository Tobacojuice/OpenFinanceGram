-- Create channels table for group chats
CREATE TABLE public.channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('region', 'university', 'public', 'private')),
  avatar_url TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  member_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES public.channels(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  reply_to UUID REFERENCES public.messages(id) ON DELETE SET NULL,
  edited_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  attachments JSONB DEFAULT '[]'::jsonb,
  reactions JSONB DEFAULT '{}'::jsonb
);

-- Create channel members table
CREATE TABLE public.channel_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES public.channels(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(channel_id, user_id)
);

-- Create direct messages table
CREATE TABLE public.direct_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE,
  attachments JSONB DEFAULT '[]'::jsonb
);

-- Enable RLS
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channel_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for channels
CREATE POLICY "Public channels are viewable by everyone"
  ON public.channels FOR SELECT
  USING (type IN ('region', 'university', 'public') OR id IN (
    SELECT channel_id FROM public.channel_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can create channels"
  ON public.channels FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Channel admins can update channels"
  ON public.channels FOR UPDATE
  USING (id IN (
    SELECT channel_id FROM public.channel_members 
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

-- RLS Policies for messages
CREATE POLICY "Users can view messages in their channels"
  ON public.messages FOR SELECT
  USING (channel_id IN (
    SELECT channel_id FROM public.channel_members WHERE user_id = auth.uid()
  ) OR channel_id IN (
    SELECT id FROM public.channels WHERE type IN ('region', 'university', 'public')
  ));

CREATE POLICY "Users can create messages in their channels"
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = user_id AND (
    channel_id IN (SELECT channel_id FROM public.channel_members WHERE user_id = auth.uid())
    OR channel_id IN (SELECT id FROM public.channels WHERE type IN ('region', 'university', 'public'))
  ));

CREATE POLICY "Users can update their own messages"
  ON public.messages FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own messages"
  ON public.messages FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for channel members
CREATE POLICY "Users can view channel members"
  ON public.channel_members FOR SELECT
  USING (channel_id IN (
    SELECT channel_id FROM public.channel_members WHERE user_id = auth.uid()
  ) OR channel_id IN (
    SELECT id FROM public.channels WHERE type IN ('region', 'university', 'public')
  ));

CREATE POLICY "Users can join public channels"
  ON public.channel_members FOR INSERT
  WITH CHECK (auth.uid() = user_id AND channel_id IN (
    SELECT id FROM public.channels WHERE type IN ('region', 'university', 'public')
  ));

CREATE POLICY "Users can leave channels"
  ON public.channel_members FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for direct messages
CREATE POLICY "Users can view their direct messages"
  ON public.direct_messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send direct messages"
  ON public.direct_messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their sent messages"
  ON public.direct_messages FOR UPDATE
  USING (auth.uid() = sender_id);

-- Create indexes
CREATE INDEX idx_messages_channel ON public.messages(channel_id, created_at DESC);
CREATE INDEX idx_messages_user ON public.messages(user_id);
CREATE INDEX idx_channel_members_user ON public.channel_members(user_id);
CREATE INDEX idx_channel_members_channel ON public.channel_members(channel_id);
CREATE INDEX idx_direct_messages_sender ON public.direct_messages(sender_id, created_at DESC);
CREATE INDEX idx_direct_messages_recipient ON public.direct_messages(recipient_id, created_at DESC);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.channel_members;
ALTER PUBLICATION supabase_realtime ADD TABLE public.direct_messages;

-- Seed regional channels
INSERT INTO public.channels (name, description, type, is_active) VALUES
('🌎 AMERICAS', 'Chat for traders in North & South America', 'region', true),
('🌍 EMEA', 'Chat for traders in Europe, Middle East & Africa', 'region', true),
('🌏 ASIA', 'Chat for traders in Asia & Pacific', 'region', true),
('🌐 REST OF WORLD', 'Global chat for all other regions', 'region', true);

-- Seed top 100 universities
INSERT INTO public.channels (name, description, type, is_active) VALUES
('Harvard University', 'Harvard Business School & Economics students', 'university', true),
('Stanford University', 'Stanford GSB & Economics community', 'university', true),
('MIT', 'MIT Sloan & Economics community', 'university', true),
('Oxford University', 'Oxford Saïd Business School community', 'university', true),
('Cambridge University', 'Cambridge Judge Business School community', 'university', true),
('Yale University', 'Yale School of Management community', 'university', true),
('Princeton University', 'Princeton Economics & Finance community', 'university', true),
('Columbia University', 'Columbia Business School community', 'university', true),
('University of Chicago', 'UChicago Booth School community', 'university', true),
('Penn (Wharton)', 'Wharton School of Business community', 'university', true),
('LSE', 'London School of Economics community', 'university', true),
('NYU (Stern)', 'NYU Stern School of Business community', 'university', true),
('Duke University', 'Duke Fuqua School of Business community', 'university', true),
('Northwestern (Kellogg)', 'Kellogg School of Management community', 'university', true),
('UC Berkeley (Haas)', 'Berkeley Haas School of Business community', 'university', true),
('Dartmouth (Tuck)', 'Tuck School of Business community', 'university', true),
('Cornell University', 'Cornell SC Johnson College community', 'university', true),
('UCLA (Anderson)', 'UCLA Anderson School of Management community', 'university', true),
('Imperial College London', 'Imperial Business School community', 'university', true),
('INSEAD', 'INSEAD Business School community', 'university', true),
('HEC Paris', 'HEC Paris Business School community', 'university', true),
('Bocconi University', 'Bocconi School of Management community', 'university', true),
('National University of Singapore', 'NUS Business School community', 'university', true),
('Tsinghua University', 'Tsinghua School of Economics community', 'university', true),
('Peking University', 'Peking Guanghua School of Management', 'university', true),
('University of Hong Kong', 'HKU Faculty of Business & Economics', 'university', true),
('HKUST', 'HKUST Business School community', 'university', true),
('Seoul National University', 'SNU Business School community', 'university', true),
('University of Tokyo', 'UTokyo Economics community', 'university', true);

-- Function to update member count
CREATE OR REPLACE FUNCTION update_channel_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.channels 
    SET member_count = member_count + 1 
    WHERE id = NEW.channel_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.channels 
    SET member_count = GREATEST(member_count - 1, 0)
    WHERE id = OLD.channel_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_member_count_trigger
AFTER INSERT OR DELETE ON public.channel_members
FOR EACH ROW EXECUTE FUNCTION update_channel_member_count();