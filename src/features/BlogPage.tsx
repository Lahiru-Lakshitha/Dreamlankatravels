"use client";

import { useState, useEffect } from 'react';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight, Search, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { ContentLoading } from '@/components/ui/loading-spinner';
import { MetaTags } from '@/components/seo/MetaTags';
import { PageHeroStrip } from '@/components/layout/PageHeroStrip';
import heroImage from '@/assets/hero-sigiriya.jpg';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  category_id: string | null;
  created_at: string;
  category?: { name: string; slug: string } | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setError(null);
    try {
      const [postsRes, categoriesRes] = await Promise.all([
        supabase
          .from('blog_posts')
          .select('*, category:blog_categories(name, slug)')
          .eq('published', true)
          .order('created_at', { ascending: false }),
        supabase.from('blog_categories').select('*').order('name'),
      ]);

      if (postsRes.error) throw postsRes.error;
      if (categoriesRes.error) throw categoriesRes.error;

      setPosts(postsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (err) {
      setError('Failed to load blog posts. Please try again.');
      toast({
        title: 'Error',
        description: 'Failed to load blog posts.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = !selectedCategory || post.category?.slug === selectedCategory;
    const matchesSearch = !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pt-20">
      <MetaTags
        title="Travel Blog"
        description="Discover travel tips, destination guides, and inspiring stories from Sri Lanka. Expert advice for your next adventure."
      />

      {/* Hero Strip */}
      <PageHeroStrip
        accentLabel="Travel Stories"
        title="Our Blog"
        subtitle="Discover travel tips, destination guides, and inspiring stories from Sri Lanka."
      />

      {/* Content Section */}
      <section className="pb-16 sm:pb-24">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <div className="flex flex-col gap-4 mb-8 sm:mb-12">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedCategory === null ? 'default' : 'outline'}
                className="cursor-pointer transition-colors"
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Badge>
              {categories.map((cat) => (
                <Badge
                  key={cat.id}
                  variant={selectedCategory === cat.slug ? 'default' : 'outline'}
                  className="cursor-pointer transition-colors"
                  onClick={() => setSelectedCategory(cat.slug)}
                >
                  {cat.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="w-12 h-12 text-destructive mb-4" />
              <p className="text-muted-foreground mb-4">{error}</p>
              <button
                onClick={fetchData}
                className="text-sunset hover:underline font-medium"
              >
                Try again
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading && !error && <ContentLoading text="Loading articles..." />}

          {/* Empty State */}
          {!loading && !error && filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No articles found.</p>
              {(searchQuery || selectedCategory) && (
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
                  className="text-sunset hover:underline mt-2"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          {/* Posts Grid */}
          {!loading && !error && filteredPosts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
                >
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    <Image
                      src={post.featured_image || heroImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {post.category && (
                      <Badge className="absolute top-4 left-4">{post.category.name}</Badge>
                    )}
                  </div>
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(post.created_at), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <h2 className="font-serif text-lg sm:text-xl font-bold text-card-foreground mb-2 group-hover:text-sunset transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center text-sunset font-medium hover:gap-2 transition-all text-sm"
                    >
                      Read More <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
