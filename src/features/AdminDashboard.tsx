"use client";

import { useState, useEffect } from 'react';
import {
  Users, FileText, MapPin, Package, BookOpen,
  Clock, CheckCircle, AlertCircle, Pencil, Trash2, Plus, Reply, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { PageLoading, ContentLoading } from '@/components/ui/loading-spinner';
import { AdminSettingsTab } from '@/components/admin/AdminSettingsTab';

interface StatCard {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

interface Quote {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  travel_start_date: string | null;
  travel_end_date: string | null;
  travelers: number;
  budget_range: string | null;
  tour_type: string | null;
  destinations: string[] | null;
  special_requests: string | null;
  status: 'pending' | 'replied' | 'closed';
  admin_reply: string | null;
  created_at: string;
}

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  country: string | null;
  created_at: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  published: boolean;
  created_at: string;
}

interface Destination {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  featured: boolean;
}

interface Tour {
  id: string;
  name: string;
  slug: string;
  duration: string | null;
  price: number | null;
  featured: boolean;
}

export default function AdminDashboard() {
  const { toast } = useToast();

  const [stats, setStats] = useState<StatCard[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [postDialogOpen, setPostDialogOpen] = useState(false);
  const [postForm, setPostForm] = useState({ title: '', slug: '', excerpt: '', content: '', published: false });
  const [isSavingPost, setIsSavingPost] = useState(false);

  // Removed Auth Protection useEffect

  useEffect(() => {
    // Always fetch data now
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);

    try {
      const [quotesRes, usersRes, postsRes, destRes, toursRes] = await Promise.all([
        supabase.from('quotes').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('blog_posts').select('*').order('created_at', { ascending: false }),
        supabase.from('destinations').select('*').order('name'),
        supabase.from('tours').select('*').order('name'),
      ]);

      if (quotesRes.data) setQuotes(quotesRes.data as Quote[]);
      if (usersRes.data) setUsers(usersRes.data as Profile[]);
      if (postsRes.data) setBlogPosts(postsRes.data as BlogPost[]);
      if (destRes.data) setDestinations(destRes.data as Destination[]);
      if (toursRes.data) setTours(toursRes.data as Tour[]);

      setStats([
        { title: 'Total Users', value: usersRes.data?.length || 0, icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />, color: 'bg-blue-500' },
        { title: 'Quote Requests', value: quotesRes.data?.length || 0, icon: <FileText className="w-5 h-5 sm:w-6 sm:h-6" />, color: 'bg-amber-500' },
        { title: 'Destinations', value: destRes.data?.length || 0, icon: <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />, color: 'bg-emerald-500' },
        { title: 'Blog Posts', value: postsRes.data?.length || 0, icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />, color: 'bg-purple-500' },
      ]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReplyToQuote = async () => {
    if (!selectedQuote || !replyText.trim()) return;
    setIsReplying(true);

    const { error } = await supabase
      .from('quotes')
      .update({
        admin_reply: replyText,
        status: 'replied' as const,
        replied_at: new Date().toISOString()
      })
      .eq('id', selectedQuote.id);

    setIsReplying(false);

    if (error) {
      toast({ title: 'Error', description: 'Failed to send reply.', variant: 'destructive' });
    } else {
      toast({ title: 'Reply Sent', description: 'Your reply has been sent to the customer.' });
      setReplyDialogOpen(false);
      setReplyText('');
      fetchAllData();
    }
  };

  const handleUpdateQuoteStatus = async (quoteId: string, status: 'pending' | 'replied' | 'closed') => {
    const { error } = await supabase
      .from('quotes')
      .update({ status })
      .eq('id', quoteId);

    if (error) {
      toast({ title: 'Error', description: 'Failed to update status.', variant: 'destructive' });
    } else {
      toast({ title: 'Status Updated', description: `Quote marked as ${status}.` });
      fetchAllData();
    }
  };

  const handleSaveBlogPost = async () => {
    if (!postForm.title.trim()) {
      toast({ title: 'Error', description: 'Title is required.', variant: 'destructive' });
      return;
    }

    setIsSavingPost(true);
    const slug = postForm.slug || postForm.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    if (editingPost) {
      const { error } = await supabase
        .from('blog_posts')
        .update({ ...postForm, slug })
        .eq('id', editingPost.id);

      setIsSavingPost(false);
      if (error) {
        toast({ title: 'Error', description: 'Failed to update post.', variant: 'destructive' });
      } else {
        toast({ title: 'Post Updated', description: 'Blog post has been updated successfully.' });
        setPostDialogOpen(false);
        fetchAllData();
      }
    } else {
      const { error } = await supabase
        .from('blog_posts')
        .insert([{ ...postForm, slug, author_id: null }]);

      setIsSavingPost(false);
      if (error) {
        toast({ title: 'Error', description: 'Failed to create post.', variant: 'destructive' });
      } else {
        toast({ title: 'Post Created', description: 'Blog post has been created successfully.' });
        setPostDialogOpen(false);
        fetchAllData();
      }
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    const { error } = await supabase.from('blog_posts').delete().eq('id', postId);
    if (error) {
      toast({ title: 'Error', description: 'Failed to delete post.', variant: 'destructive' });
    } else {
      toast({ title: 'Post Deleted', description: 'Blog post has been deleted.' });
      fetchAllData();
    }
  };

  const openPostDialog = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post);
      setPostForm({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || '',
        content: post.content || '',
        published: post.published
      });
    } else {
      setEditingPost(null);
      setPostForm({ title: '', slug: '', excerpt: '', content: '', published: false });
    }
    setPostDialogOpen(true);
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



  if (loading) {
    return <PageLoading text="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">Manage your travel website</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {stats.map((stat) => (
            <div key={stat.title} className="bg-card p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-card">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-muted-foreground text-xs sm:text-sm truncate">{stat.title}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-card-foreground mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-2 sm:p-3 rounded-lg sm:rounded-xl text-white shrink-0`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="quotes" className="space-y-4 sm:space-y-6">
          <TabsList className="w-full grid grid-cols-6 h-auto p-1">
            <TabsTrigger value="quotes" className="text-xs sm:text-sm py-2 px-1 sm:px-4 flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Quotes</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="text-xs sm:text-sm py-2 px-1 sm:px-4 flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="blog" className="text-xs sm:text-sm py-2 px-1 sm:px-4 flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Blog</span>
            </TabsTrigger>
            <TabsTrigger value="destinations" className="text-xs sm:text-sm py-2 px-1 sm:px-4 flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Dest.</span>
            </TabsTrigger>
            <TabsTrigger value="tours" className="text-xs sm:text-sm py-2 px-1 sm:px-4 flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Tours</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs sm:text-sm py-2 px-1 sm:px-4 flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Quotes Tab */}
          <TabsContent value="quotes">
            <div className="bg-card p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-card">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-card-foreground mb-4">Quote Requests</h2>

              {quotes.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No quote requests yet.</p>
              ) : (
                <div className="space-y-4">
                  {/* Mobile Cards */}
                  <div className="lg:hidden space-y-4">
                    {quotes.map((quote) => (
                      <div key={quote.id} className="p-4 border border-border rounded-xl space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-medium text-card-foreground truncate">{quote.full_name}</p>
                            <p className="text-sm text-muted-foreground truncate">{quote.email}</p>
                          </div>
                          {getStatusBadge(quote.status)}
                        </div>
                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                          <span>{quote.tour_type || 'Custom Tour'}</span>
                          <span>•</span>
                          <span>{quote.travel_start_date ? format(new Date(quote.travel_start_date), 'MMM d, yyyy') : 'TBD'}</span>
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                          <Dialog open={replyDialogOpen && selectedQuote?.id === quote.id} onOpenChange={setReplyDialogOpen}>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" onClick={() => setSelectedQuote(quote)} className="flex-1">
                                <Reply className="w-4 h-4 mr-2" />
                                Reply
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Reply to Quote Request</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="bg-muted p-4 rounded-lg text-sm space-y-2">
                                  <p><strong>Customer:</strong> {quote.full_name}</p>
                                  <p><strong>Email:</strong> {quote.email}</p>
                                  <p><strong>Tour Type:</strong> {quote.tour_type}</p>
                                  <p><strong>Budget:</strong> {quote.budget_range}</p>
                                  <p><strong>Travelers:</strong> {quote.travelers}</p>
                                  {quote.special_requests && (
                                    <p><strong>Special Requests:</strong> {quote.special_requests}</p>
                                  )}
                                </div>
                                <div className="space-y-2">
                                  <Label>Your Reply</Label>
                                  <Textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Type your reply to the customer..."
                                    rows={5}
                                  />
                                </div>
                                <Button onClick={handleReplyToQuote} variant="ocean" disabled={isReplying || !replyText.trim()}>
                                  {isReplying ? 'Sending...' : 'Send Reply'}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Select
                            value={quote.status}
                            onValueChange={(value: 'pending' | 'replied' | 'closed') => handleUpdateQuoteStatus(quote.id, value)}
                          >
                            <SelectTrigger className="flex-1 h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="replied">Replied</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-muted-foreground font-medium">Customer</th>
                          <th className="text-left py-3 px-4 text-muted-foreground font-medium">Tour Type</th>
                          <th className="text-left py-3 px-4 text-muted-foreground font-medium">Dates</th>
                          <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                          <th className="text-left py-3 px-4 text-muted-foreground font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quotes.map((quote) => (
                          <tr key={quote.id} className="border-b border-border hover:bg-muted/50">
                            <td className="py-3 px-4">
                              <p className="font-medium text-card-foreground">{quote.full_name}</p>
                              <p className="text-sm text-muted-foreground">{quote.email}</p>
                            </td>
                            <td className="py-3 px-4 text-card-foreground">{quote.tour_type || '-'}</td>
                            <td className="py-3 px-4 text-card-foreground">
                              {quote.travel_start_date
                                ? format(new Date(quote.travel_start_date), 'MMM d, yyyy')
                                : '-'}
                            </td>
                            <td className="py-3 px-4">{getStatusBadge(quote.status)}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <Dialog open={replyDialogOpen && selectedQuote?.id === quote.id} onOpenChange={setReplyDialogOpen}>
                                  <DialogTrigger asChild>
                                    <Button size="sm" variant="outline" onClick={() => setSelectedQuote(quote)}>
                                      <Reply className="w-4 h-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                      <DialogTitle>Reply to Quote Request</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div className="bg-muted p-4 rounded-lg text-sm space-y-2">
                                        <p><strong>Customer:</strong> {quote.full_name}</p>
                                        <p><strong>Email:</strong> {quote.email}</p>
                                        <p><strong>Tour Type:</strong> {quote.tour_type}</p>
                                        <p><strong>Budget:</strong> {quote.budget_range}</p>
                                        <p><strong>Travelers:</strong> {quote.travelers}</p>
                                        {quote.special_requests && (
                                          <p><strong>Special Requests:</strong> {quote.special_requests}</p>
                                        )}
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Your Reply</Label>
                                        <Textarea
                                          value={replyText}
                                          onChange={(e) => setReplyText(e.target.value)}
                                          placeholder="Type your reply to the customer..."
                                          rows={5}
                                        />
                                      </div>
                                      <Button onClick={handleReplyToQuote} variant="ocean" disabled={isReplying || !replyText.trim()}>
                                        {isReplying ? 'Sending...' : 'Send Reply'}
                                      </Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                <Select
                                  value={quote.status}
                                  onValueChange={(value: 'pending' | 'replied' | 'closed') => handleUpdateQuoteStatus(quote.id, value)}
                                >
                                  <SelectTrigger className="w-[120px] h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="replied">Replied</SelectItem>
                                    <SelectItem value="closed">Closed</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <div className="bg-card p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-card">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-card-foreground mb-4">Registered Users</h2>

              {users.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No registered users yet.</p>
              ) : (
                <div className="space-y-4">
                  {/* Mobile Cards */}
                  <div className="lg:hidden space-y-3">
                    {users.map((user) => (
                      <div key={user.id} className="p-4 border border-border rounded-xl">
                        <p className="font-medium text-card-foreground">{user.full_name || 'No name'}</p>
                        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                          <span>{user.country || 'No country'}</span>
                          <span>•</span>
                          <span>{format(new Date(user.created_at), 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-muted-foreground font-medium">Name</th>
                          <th className="text-left py-3 px-4 text-muted-foreground font-medium">Email</th>
                          <th className="text-left py-3 px-4 text-muted-foreground font-medium">Country</th>
                          <th className="text-left py-3 px-4 text-muted-foreground font-medium">Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b border-border hover:bg-muted/50">
                            <td className="py-3 px-4 font-medium text-card-foreground">{user.full_name || '-'}</td>
                            <td className="py-3 px-4 text-card-foreground">{user.email}</td>
                            <td className="py-3 px-4 text-card-foreground">{user.country || '-'}</td>
                            <td className="py-3 px-4 text-muted-foreground">
                              {format(new Date(user.created_at), 'MMM d, yyyy')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Blog Tab */}
          <TabsContent value="blog">
            <div className="bg-card p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-card-foreground">Blog Posts</h2>
                <Button variant="ocean" onClick={() => openPostDialog()} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Post
                </Button>
              </div>

              {blogPosts.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No blog posts yet.</p>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {blogPosts.map((post) => (
                    <div key={post.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border border-border rounded-xl hover:border-sunset/50 transition-colors">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-card-foreground truncate">{post.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">{post.excerpt || 'No excerpt'}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={post.published ? 'default' : 'secondary'} className="text-xs">
                            {post.published ? 'Published' : 'Draft'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(post.created_at), 'MMM d, yyyy')}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button size="sm" variant="outline" onClick={() => openPostDialog(post)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeletePost(post.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Blog Post Dialog */}
            <Dialog open={postDialogOpen} onOpenChange={setPostDialogOpen}>
              <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingPost ? 'Edit Post' : 'New Blog Post'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Title *</Label>
                    <Input
                      value={postForm.title}
                      onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                      placeholder="Post title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Slug</Label>
                    <Input
                      value={postForm.slug}
                      onChange={(e) => setPostForm({ ...postForm, slug: e.target.value })}
                      placeholder="post-url-slug (auto-generated if empty)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Excerpt</Label>
                    <Textarea
                      value={postForm.excerpt}
                      onChange={(e) => setPostForm({ ...postForm, excerpt: e.target.value })}
                      placeholder="Brief description for previews"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Content</Label>
                    <Textarea
                      value={postForm.content}
                      onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                      placeholder="Full post content..."
                      rows={8}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="published"
                      checked={postForm.published}
                      onCheckedChange={(checked) => setPostForm({ ...postForm, published: !!checked })}
                    />
                    <Label htmlFor="published" className="cursor-pointer">Publish immediately</Label>
                  </div>
                  <Button onClick={handleSaveBlogPost} variant="ocean" disabled={isSavingPost} className="w-full sm:w-auto">
                    {isSavingPost ? 'Saving...' : editingPost ? 'Update Post' : 'Create Post'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Destinations Tab */}
          <TabsContent value="destinations">
            <div className="bg-card p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-card">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-card-foreground mb-4">Destinations</h2>
              {destinations.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No destinations yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {destinations.map((dest) => (
                    <div key={dest.id} className="p-4 border border-border rounded-xl hover:border-sunset/50 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-medium text-card-foreground">{dest.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{dest.short_description}</p>
                        </div>
                        {dest.featured && <Badge className="shrink-0">Featured</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Tours Tab */}
          <TabsContent value="tours">
            <div className="bg-card p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-card">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-card-foreground mb-4">Tours</h2>
              {tours.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No tours yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {tours.map((tour) => (
                    <div key={tour.id} className="p-4 border border-border rounded-xl hover:border-sunset/50 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-medium text-card-foreground">{tour.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {tour.duration} • ${tour.price?.toLocaleString() || 'TBD'}
                          </p>
                        </div>
                        {tour.featured && <Badge className="shrink-0">Featured</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <AdminSettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
