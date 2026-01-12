import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { FloatingChat } from '@/components/features/FloatingChat';
import { BackToTop } from '@/components/ui/back-to-top';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col font-sans relative">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <FloatingChat />
      <BackToTop />
    </div>
  );
}
