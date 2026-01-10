"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tour, FALLBACK_TOURS } from '@/data/tours';

export type { Tour };
export { FALLBACK_TOURS };

export function useTours() {
    const [tours, setTours] = useState<Tour[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        fetchTours();
    }, []);

    const fetchTours = async () => {
        try {
            const { data, error } = await supabase
                .from('tours')
                .select('*')
                .order('featured', { ascending: false })
                .order('rating', { ascending: false });

            if (error) throw error;

            if (data && data.length > 0) {
                setTours(data);
            } else {
                setTours(FALLBACK_TOURS);
            }
        } catch (err) {
            console.error('Error fetching tours:', err);
            setError(err as Error);
            setTours(FALLBACK_TOURS);
        } finally {
            setIsLoading(false);
        }
    };

    return { tours, isLoading, error };
}
