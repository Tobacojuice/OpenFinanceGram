import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import {
  Users,
  Globe,
  Hash,
  Loader2,
  Search,
  AlertCircle,
  Send,
  TrendingUp,
  Map as MapIcon,
  List
} from 'lucide-react';
import UniversityMap from '@/components/community/UniversityMap';

interface Channel {
  id: string;
  name: string;
  description: string;
  type: string;
  member_count: number;
}

interface University {
  id: string;
  name: string;
  country: string;
  region: string;
  channel_id: string;
  student_count: number;
  latitude: number | null;
  longitude: number | null;
}

interface Message {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  username?: string;
}

export default function Community() {
  const [user, setUser] = useState<any>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [joinedChannels, setJoinedChannels] = useState<string[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState<University[]>([]);
  const [activeTab, setActiveTab] = useState<'AMERICA' | 'EMEA' | 'ASIA' | 'OTHERS'>('AMERICA');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('map');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load all data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      performSearch(debouncedQuery);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [debouncedQuery, activeTab]);

  // Subscribe to messages when channel is selected
  useEffect(() => {
    if (selectedChannel) {
      fetchMessages(selectedChannel.id);
      const unsubscribe = subscribeToMessages(selectedChannel.id);
      return unsubscribe;
    }
  }, [selectedChannel]);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current user
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);

      // Load universities first (this is the main data)
      const { data: uniData, error: uniError } = await supabase
        .from('universities')
        .select('*')
        .order('name');

      if (uniError) throw new Error(`Failed to load universities: ${uniError.message}`);
      setUniversities(uniData || []);

      // Load all university channels
      const channelIds = uniData?.map(u => u.channel_id).filter(Boolean) || [];
      if (channelIds.length > 0) {
        const { data: channelData, error: channelError } = await supabase
          .from('channels')
          .select('*')
          .in('id', channelIds)
          .order('name');

        if (channelError) throw new Error(`Failed to load channels: ${channelError.message}`);
        setChannels(channelData || []);
      }

      // Load user's joined channels
      if (currentUser) {
        const { data: joinedData, error: joinedError } = await supabase
          .from('channel_members')
          .select('channel_id')
          .eq('user_id', currentUser.id);

        if (joinedError) throw new Error(`Failed to load memberships: ${joinedError.message}`);
        setJoinedChannels(joinedData?.map(j => j.channel_id) || []);
      }
    } catch (err) {
      console.error('Load data error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
      toast.error('Failed to load community data');
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async (query: string) => {
    try {
      setSearchLoading(true);
      setShowSearchResults(true);

      const { data, error } = await supabase.rpc('search_universities', {
        search_term: query,
        region_filter: activeTab
      });

      if (error) throw new Error(`Search failed: ${error.message}`);
      // Map search results to include latitude/longitude as null (search function doesn't return these)
      const mappedResults = (data || []).map(d => ({
        ...d,
        latitude: null,
        longitude: null
      })) as University[];
      setSearchResults(mappedResults);
    } catch (err) {
      console.error('Search error:', err);
      toast.error('University search failed');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleJoinUniversity = async (channelId: string) => {
    if (!user) {
      toast.error('Please sign in to join channels');
      return;
    }

    try {
      const { error } = await supabase
        .from('channel_members')
        .insert({ channel_id: channelId, user_id: user.id });

      if (error) {
        if (error.code === '23505') { // Duplicate
          toast.info('You are already a member');
          return;
        }
        throw error;
      }

      setJoinedChannels(prev => [...prev, channelId]);
      
      // Set as selected channel
      const channel = channels.find(c => c.id === channelId);
      if (channel) setSelectedChannel(channel);
      
      toast.success('Joined university channel!');
    } catch (err) {
      console.error('Join error:', err);
      toast.error('Failed to join channel');
    }
  };

  const handleLeaveUniversity = async (channelId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('channel_members')
        .delete()
        .match({ channel_id: channelId, user_id: user.id });

      if (error) throw error;

      setJoinedChannels(prev => prev.filter(id => id !== channelId));
      
      if (selectedChannel?.id === channelId) {
        setSelectedChannel(null);
      }
      
      toast.success('Left university channel');
    } catch (err) {
      console.error('Leave error:', err);
      toast.error('Failed to leave channel');
    }
  };

  const fetchMessages = async (channelId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('channel_id', channelId)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;

      // Fetch usernames for messages
      const userIds = [...new Set(data?.map(m => m.user_id) || [])];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, display_name')
        .in('user_id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p.display_name]));

      const messagesWithUsernames = data?.map(m => ({
        ...m,
        username: profileMap.get(m.user_id) || 'User'
      })) || [];

      setMessages(messagesWithUsernames);
    } catch (err) {
      console.error('Fetch messages error:', err);
      toast.error('Failed to load messages');
    }
  };

  const subscribeToMessages = (channelId: string) => {
    const subscription = supabase
      .channel(`messages:${channelId}`)
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `channel_id=eq.${channelId}` },
        async (payload) => {
          const newMsg = payload.new as Message;
          
          // Fetch username
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('user_id', newMsg.user_id)
            .maybeSingle();

          setMessages(prev => [...prev, { ...newMsg, username: profile?.display_name || 'User' }]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChannel || !user) return;

    try {
      const { error } = await supabase.from('messages').insert({
        channel_id: selectedChannel.id,
        user_id: user.id,
        content: newMessage.trim()
      });

      if (error) throw error;
      setNewMessage('');
    } catch (err) {
      console.error('Send message error:', err);
      toast.error('Failed to send message');
    }
  };

  const getUniversitiesByRegion = useCallback((region: string) => {
    return universities.filter(u => u.region === region);
  }, [universities]);

  const UniversityItem = ({ uni }: { uni: University }) => {
    const isJoined = joinedChannels.includes(uni.channel_id);
    
    return (
      <div className="flex items-center justify-between p-3 rounded-lg border-2 border-foreground/50 hover:border-primary transition">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm mono">{uni.name}</span>
              <Badge variant="outline" className="text-xs">
                {uni.country}
              </Badge>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-muted-foreground mono">
                {uni.student_count || 0} students
              </span>
              {isJoined && (
                <Badge variant="default" className="text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Joined
                </Badge>
              )}
            </div>
          </div>
        </div>
        <Button
          size="sm"
          variant={isJoined ? "secondary" : "default"}
          onClick={() => isJoined ? handleLeaveUniversity(uni.channel_id) : handleJoinUniversity(uni.channel_id)}
          className="ml-2 mono"
        >
          {isJoined ? 'Leave' : 'Join'}
        </Button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen p-4">
        <Card className="p-6 max-w-md">
          <CardHeader>
            <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
            <CardTitle>Failed to Load</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 mono">{error}</p>
            <Button onClick={loadData} className="mono">Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col p-4">
      {/* View Mode Toggle Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold mono">UNIVERSITY COMMUNITY</h1>
          <Badge variant="outline" className="mono">{universities.length} universities</Badge>
        </div>
        <div className="flex items-center gap-2 bg-background border-2 border-foreground rounded-lg p-1">
          <Button
            variant={viewMode === 'map' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('map')}
            className="mono"
          >
            <MapIcon className="w-4 h-4 mr-1" />
            Map
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="mono"
          >
            <List className="w-4 h-4 mr-1" />
            List
          </Button>
        </div>
      </div>

      {/* Map View */}
      {viewMode === 'map' && (
        <div className="flex-1 flex gap-4">
          <Card className="flex-1 bg-black border-2 border-foreground overflow-hidden">
            <UniversityMap
              universities={universities}
              joinedChannels={joinedChannels}
              onJoinUniversity={handleJoinUniversity}
              onLeaveUniversity={handleLeaveUniversity}
            />
          </Card>
          
          {/* Chat Panel in Map View */}
          <Card className="w-96 bg-black border-2 border-foreground flex flex-col">
            {selectedChannel ? (
              <>
                <CardHeader className="border-b-2 border-foreground py-3">
                  <CardTitle className="mono flex items-center gap-2 text-sm">
                    <Hash className="w-4 h-4" />
                    {selectedChannel.name}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="flex-1 overflow-y-auto p-3">
                  <div className="space-y-3">
                    {messages.map(msg => (
                      <div key={msg.id} className="flex gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold mono">
                          {(msg.username || 'U')[0]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs mono">{msg.username || 'Anonymous'}</span>
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(msg.created_at).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-xs mt-1">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </CardContent>

                <div className="p-2 border-t-2 border-foreground flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1 mono text-xs h-8"
                  />
                  <Button onClick={sendMessage} disabled={!newMessage.trim()} size="sm" className="mono h-8">
                    <Send className="h-3 w-3" />
                  </Button>
                </div>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center mono opacity-70">
                  <Globe size={32} className="mx-auto mb-2" />
                  <p className="text-sm">Click a university on the map</p>
                  <p className="text-xs mt-1">to join and start chatting</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="flex-1 flex gap-4">
          {/* Left Sidebar - University Search & Regions */}
          <Card className="w-80 bg-black border-2 border-foreground flex flex-col">
            <CardHeader className="space-y-3">
              <CardTitle className="mono flex items-center gap-2 text-sm">
                <Search size={16} />
                FIND UNIVERSITIES
              </CardTitle>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search universities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 mono text-sm"
                />
                {searchLoading && (
                  <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>

              {/* Search Results */}
              {showSearchResults && searchQuery.trim() && (
                <div className="border-2 border-primary/50 rounded-lg p-3 max-h-48 overflow-y-auto bg-background/50">
                  <div className="text-xs text-muted-foreground mb-2 mono">
                    Search Results ({searchResults.length})
                  </div>
                  {searchResults.length > 0 ? (
                    <div className="space-y-2">
                      {searchResults.map(uni => (
                        <UniversityItem key={uni.id} uni={uni} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-sm text-muted-foreground py-4 mono">
                      No universities found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </CardHeader>

            <CardContent className="flex-1 overflow-hidden">
              {/* Region Tabs */}
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-4 gap-1 bg-black border-2 border-foreground">
                  <TabsTrigger value="AMERICA" className="mono text-xs">AMERICA</TabsTrigger>
                  <TabsTrigger value="EMEA" className="mono text-xs">EMEA</TabsTrigger>
                  <TabsTrigger value="ASIA" className="mono text-xs">ASIA</TabsTrigger>
                  <TabsTrigger value="OTHERS" className="mono text-xs">OTHERS</TabsTrigger>
                </TabsList>
                
                {(['AMERICA', 'EMEA', 'ASIA', 'OTHERS'] as const).map(region => (
                  <TabsContent key={region} value={region} className="flex-1 mt-4">
                    <ScrollArea className="h-[calc(100vh-420px)]">
                      <div className="space-y-2">
                        {/* Region Header */}
                        <div className="mb-3 p-3 bg-gradient-to-r from-primary/20 to-primary/5 border-2 border-primary/40 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Globe className="w-4 h-4 text-primary" />
                            <span className="font-bold text-sm mono">{region}</span>
                          </div>
                          <div className="text-xs text-muted-foreground mono">
                            {getUniversitiesByRegion(region).length} universities
                          </div>
                        </div>

                        {/* University List */}
                        {getUniversitiesByRegion(region).map(uni => (
                          <UniversityItem key={uni.id} uni={uni} />
                        ))}

                        {/* Empty State */}
                        {getUniversitiesByRegion(region).length === 0 && (
                          <div className="text-center p-6 text-sm opacity-50 mono border-2 border-dashed border-foreground/20 rounded-lg">
                            No universities in this region yet
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* Right Chat Area */}
          <Card className="flex-1 bg-black border-2 border-foreground flex flex-col">
            {selectedChannel ? (
              <>
                <CardHeader className="border-b-2 border-foreground">
                  <CardTitle className="mono flex items-center gap-2">
                    <Hash className="w-5 h-5" />
                    {selectedChannel.name}
                  </CardTitle>
                  <p className="text-sm opacity-70 mono">{selectedChannel.description}</p>
                </CardHeader>
                
                <CardContent className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-3">
                    {messages.map(msg => (
                      <div key={msg.id} className="flex gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold mono">
                          {(msg.username || 'U')[0]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm mono">{msg.username || 'Anonymous'}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(msg.created_at).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm mt-1">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </CardContent>

                <div className="p-3 border-t-2 border-foreground flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1 mono"
                  />
                  <Button onClick={sendMessage} disabled={!newMessage.trim()} className="mono">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center mono opacity-70">
                  <Users size={48} className="mx-auto mb-4" />
                  <p>Select a university to start chatting</p>
                  <p className="text-sm mt-2">{universities.length} universities available</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
