import { Suspense } from 'react';
import QuotePage from '@/features/QuotePage';
import { PageLoading } from '@/components/ui/loading-spinner';

export default function Page() {
    return (
        <Suspense fallback={<PageLoading />}>
            <QuotePage />
        </Suspense>
    );
}
