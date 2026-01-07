import { useEffect } from 'react';

interface MetaTagsProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  author?: string;
}

export function MetaTags({
  title,
  description,
  image,
  url,
  type = 'website',
  publishedTime,
  author,
}: MetaTagsProps) {
  useEffect(() => {
    // Update document title
    document.title = `${title} | Voyages Lanka`;

    // Helper to set meta tag
    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Basic meta tags
    setMeta('description', description);
    
    // Open Graph tags
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:type', type, true);
    if (url) setMeta('og:url', url, true);
    if (image) setMeta('og:image', image, true);
    
    // Twitter Card tags
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    if (image) setMeta('twitter:image', image);

    // Article-specific tags
    if (type === 'article') {
      if (publishedTime) setMeta('article:published_time', publishedTime, true);
      if (author) setMeta('article:author', author, true);
    }

    // Cleanup function to reset to defaults
    return () => {
      document.title = 'Voyages Lanka | Discover Sri Lanka';
    };
  }, [title, description, image, url, type, publishedTime, author]);

  return null;
}
