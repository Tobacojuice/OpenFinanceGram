-- Create security definer function to check if user can view channel
CREATE OR REPLACE FUNCTION public.user_can_view_channel(_user_id uuid, _channel_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- User can view if they're a member OR if it's a public/region/university channel
  SELECT EXISTS (
    SELECT 1 FROM public.channel_members 
    WHERE user_id = _user_id AND channel_id = _channel_id
  ) OR EXISTS (
    SELECT 1 FROM public.channels 
    WHERE id = _channel_id AND type IN ('region', 'university', 'public')
  )
$$;

-- Drop existing problematic policy
DROP POLICY IF EXISTS "Users can view channel members" ON public.channel_members;

-- Create new policy using the function to avoid recursion
CREATE POLICY "Users can view channel members"
ON public.channel_members
FOR SELECT
USING (public.user_can_view_channel(auth.uid(), channel_id));