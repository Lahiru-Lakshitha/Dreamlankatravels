import { Suspense } from 'react';
import ToursPage from '@/features/ToursPage';
import { PageLoading } from '@/components/ui/loading-spinner';
import { createClient } from '@/lib/supabase/server';
import { FALLBACK_TOURS } from '@/data/tours';

async function getTours() {
    const supabase = createClient();
    const { data } = await supabase
        .from('tours')
        .select('*')
        .order('featured', { ascending: false })
        .order('rating', { ascending: false });
    return (data && data.length > 0) ? data : FALLBACK_TOURS;
}

export default async function Page() {
    const tours = await getTours();
    return (
        <Suspense fallback={<PageLoading />}>
            <ToursPage initialTours={tours} />
        </Suspense>
    );
}
