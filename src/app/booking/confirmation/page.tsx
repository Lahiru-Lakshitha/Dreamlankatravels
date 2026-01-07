import { Suspense } from 'react';
import BookingConfirmationPage from '@/features/BookingConfirmationPage';
import { PageLoading } from '@/components/ui/loading-spinner';

export default function Page() {
    return (
        <Suspense fallback={<PageLoading />}>
            <BookingConfirmationPage />
        </Suspense>
    );
}
