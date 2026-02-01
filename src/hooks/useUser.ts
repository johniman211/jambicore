'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

interface UserData {
    user: User | null;
    loading: boolean;
    error: Error | null;
}

export function useUser(): UserData {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const supabase = createClient();

        // Get initial user
        const getUser = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser();
                if (error) throw error;
                setUser(user);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        getUser();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null);
                setLoading(false);
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return { user, loading, error };
}

export async function logout(): Promise<void> {
    const response = await fetch('/api/auth/logout', {
        method: 'POST',
    });

    if (!response.ok) {
        throw new Error('Failed to logout');
    }

    // Redirect to login page
    window.location.href = '/login';
}
