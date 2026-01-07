"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowLeft, Share2, Facebook, Twitter, Copy, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { PageLoading } from '@/components/ui/loading-spinner';
import { MetaTags } from '@/components/seo/MetaTags';
import heroImage from '@/assets/hero-sigiriya.jpg';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  featured_image: string | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  category?: { name: string; slug: string } | null;
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*, category:blog_categories(name, slug)')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle();

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load blog post.',
        variant: 'destructive',
      });
    }

    if (data) {
      setPost(data);
    }
    setLoading(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast({ title: 'Link copied to clipboard!' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: 'Failed to copy link', variant: 'destructive' });
    }
  };

  const handleShare = (platform: 'facebook' | 'twitter') => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(post?.title || '');

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  if (loading) {
    return <PageLoading text="Loading article..." />;
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-background">
        <div className="text-center px-4">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/blog">
            <Button variant="ocean">Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="min-h-screen pt-20">
      {/* SEO Meta Tags */}
      <MetaTags
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt || ''}
        image={post.featured_image || undefined}
        url={currentUrl}
        type="article"
        publishedTime={post.created_at}
      />

      {/* Hero Image */}
      <div className="relative h-[40vh] sm:h-[50vh] min-h-[300px] md:min-h-[400px]">
        <Image
          src={post.featured_image || heroImage}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      {/* Content */}
      <article className="relative -mt-24 sm:-mt-32 pb-16 sm:pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-card p-6 sm:p-8 md:p-12 rounded-2xl shadow-card">
              {/* Back Link */}
              <Link
                href="/blog"
                className="inline-flex items-center text-muted-foreground hover:text-sunset transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>

              {/* Category & Date */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4">
                {post.category && (
                  <Badge>{post.category.name}</Badge>
                )}
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(post.created_at), 'MMMM d, yyyy')}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-card-foreground mb-6">
                {post.title}
              </h1>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-base sm:text-lg text-muted-foreground mb-8 italic border-l-4 border-sunset pl-4">
                  {post.excerpt}
                </p>
              )}

              {/* Content */}
              <div className="prose prose-lg max-w-none text-card-foreground prose-headings:font-serif prose-headings:text-card-foreground prose-p:text-card-foreground/90 prose-a:text-sunset">
                {post.content?.split('\n').map((paragraph, idx) => (
                  paragraph.trim() && <p key={idx} className="mb-4">{paragraph}</p>
                ))}
              </div>

              {/* Share */}
              <div className="mt-12 pt-8 border-t border-border">
                <p className="text-sm text-muted-foreground mb-4">Share this article:</p>
                <div className="flex flex-wrap gap-3">
                  <Button size="sm" variant="outline" onClick={() => handleShare('facebook')}>
                    <Facebook className="w-4 h-4 mr-2" />
                    Facebook
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleShare('twitter')}>
                    <Twitter className="w-4 h-4 mr-2" />
                    Twitter
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCopyLink}>
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2 text-palm" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Link
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
