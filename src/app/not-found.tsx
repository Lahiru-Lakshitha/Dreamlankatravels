import { Suspense } from 'react';
import NotFound from '@/features/NotFound';
import { PageLoading } from '@/components/ui/loading-spinner';

export default function NotFoundPage() {
    return (
        <Suspense fallback={<PageLoading />}>
            <NotFound />
        </Suspense>
    );
}
