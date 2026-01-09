"use client";

import { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';
import { User, FileText, MessageSquare, Settings, LogOut, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { logout } from '@/app/auth/actions';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { PageLoading, ContentLoading } from '@/components/ui/loading-spinner';

interface Quote {
  id: string;
  full_name: string;
  email: string;
  travel_start_date: string | null;
  travel_end_date: string | null;
  travelers: number;
  budget_range: string | null;
  tour_type: string | null;
  destinations: string[] | null;
  status: 'pending' | 'replied' | 'closed';
  admin_reply: string | null;
  created_at: string;
}

export default function UserDashboard() {
  const { user, profile, isLoading, signOut, updateProfile } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loadingQuotes, setLoadingQuotes] = useState(true);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth');
    }
  }, [user, isLoading, router.push]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setCountry(profile.country || '');
      setDarkMode(profile.dark_mode);
    }
  }, [profile]);

  useEffect(() => {
    if (user) {
      fetchQuotes();
    }
  }, [user]);

  const fetchQuotes = async () => {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load your quote requests.',
        variant: 'destructive',
      });
    } else if (data) {
      setQuotes(data as Quote[]);
    }
    setLoadingQuotes(false);
  };

  const handleUpdateProfile = async () => {
    setIsSaving(true);
    const { error } = await updateProfile({
      full_name: fullName,
      phone,
      country,
      dark_mode: darkMode,
    });
    setIsSaving(false);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
    }
  };

  const handleSignOut = async () => {
    await logout();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-amber-600 border-amber-500 bg-amber-50 dark:bg-amber-500/10"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'replied':
        return <Badge variant="outline" className="text-emerald-600 border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10"><CheckCircle className="w-3 h-3 mr-1" />Replied</Badge>;
      case 'closed':
        return <Badge variant="secondary"><AlertCircle className="w-3 h-3 mr-1" />Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return <PageLoading text="Loading your dashboard..." />;
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">My Dashboard</h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">Welcome back, {profile?.full_name || 'Traveler'}!</p>
            </div>
            <Button variant="outline" onClick={handleSignOut} size="sm" className="self-start sm:self-center">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>

          <Tabs defaultValue="quotes" className="space-y-4 sm:space-y-6">
            <TabsList className="grid w-full grid-cols-3 h-auto p-1">
              <TabsTrigger value="quotes" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">My</span> Quotes
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2">
                <MessageSquare className="w-4 h-4" />
                Messages
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2">
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Quotes Tab */}
            <TabsContent value="quotes" className="space-y-4">
              <div className="bg-card p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-card">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-card-foreground mb-4">Your Quote Requests</h2>

                {loadingQuotes ? (
                  <ContentLoading text="Loading quotes..." />
                ) : quotes.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">You haven't submitted any quote requests yet.</p>
                    <Button variant="ocean" onClick={() => router.push('/quote')}>
                      Request a Quote
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {quotes.map((quote) => (
                      <div key={quote.id} className="border border-border rounded-xl p-4 hover:border-sunset/50 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                          <div>
                            <p className="font-medium text-card-foreground">
                              {quote.tour_type || 'Custom Tour'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {quote.travel_start_date && quote.travel_end_date
                                ? `${format(new Date(quote.travel_start_date), 'MMM d')} - ${format(new Date(quote.travel_end_date), 'MMM d, yyyy')}`
                                : 'Dates TBD'}
                            </p>
                          </div>
                          {getStatusBadge(quote.status)}
                        </div>

                        {quote.destinations && quote.destinations.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {quote.destinations.map((dest) => (
                              <Badge key={dest} variant="secondary" className="text-xs">
                                {dest}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {quote.admin_reply && (
                          <div className="mt-3 p-3 bg-muted rounded-lg">
                            <p className="text-sm font-medium text-foreground mb-1">Admin Reply:</p>
                            <p className="text-sm text-muted-foreground">{quote.admin_reply}</p>
                          </div>
                        )}

                        <p className="text-xs text-muted-foreground mt-3">
                          Submitted: {format(new Date(quote.created_at), 'MMM d, yyyy')}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages" className="space-y-4">
              <div className="bg-card p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-card">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-card-foreground mb-4">Chat with Us</h2>
                <div className="text-center py-8 sm:py-12">
                  <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Live chat feature coming soon! In the meantime, reach us via WhatsApp.
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4">
              <div className="bg-card p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-card">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-card-foreground mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-sunset" />
                  Profile Settings
                </h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={user?.email || ''}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 234 567 890"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="United States"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-4 border-t border-border">
                    <div>
                      <p className="font-medium text-card-foreground">Dark Mode</p>
                      <p className="text-sm text-muted-foreground">Toggle dark theme preference</p>
                    </div>
                    <Switch
                      checked={darkMode}
                      onCheckedChange={setDarkMode}
                    />
                  </div>

                  <Button variant="ocean" onClick={handleUpdateProfile} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
