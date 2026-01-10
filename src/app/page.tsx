import HomePage from "@/features/HomePage";
import { createClient } from "@/lib/supabase/server";
import { FALLBACK_TOURS } from "@/hooks/useTours";

async function getFeaturedTours() {
    const supabase = createClient();
    const { data } = await supabase
        .from('tours')
        .select('*')
        .eq('featured', true)
        .range(0, 5);

    if (!data || data.length === 0) {
        const { data: topRated } = await supabase.from('tours').select('*').order('rating', { ascending: false }).range(0, 5);
        return (topRated && topRated.length > 0) ? topRated : FALLBACK_TOURS;
    }
    return data;
}

export default async function Page() {
    const tours = await getFeaturedTours();
    return <HomePage tours={tours} />;
}
