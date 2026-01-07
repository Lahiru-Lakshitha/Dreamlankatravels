import { Suspense } from 'react';
import ToursPage from '@/features/ToursPage';
import { PageLoading } from '@/components/ui/loading-spinner';

export default function Page() {
    return (
        <Suspense fallback={<PageLoading />}>
            <ToursPage />
        </Suspense>
    );
}
