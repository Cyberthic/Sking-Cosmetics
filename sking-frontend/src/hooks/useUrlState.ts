"use client";

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useMemo, useRef } from 'react';

export function useUrlState<T extends Record<string, any>>(initialState: T) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const initialStateRef = useRef(initialState);

    const state = useMemo(() => {
        const currentParams = { ...initialStateRef.current };
        Object.keys(initialStateRef.current).forEach((key) => {
            const value = searchParams.get(key);
            if (value !== null) {
                const type = typeof initialStateRef.current[key];
                if (type === 'number') {
                    currentParams[key as keyof T] = Number(value) as any;
                } else if (type === 'boolean') {
                    currentParams[key as keyof T] = (value === 'true') as any;
                } else {
                    currentParams[key as keyof T] = value as any;
                }
            }
        });
        return currentParams;
    }, [searchParams]);

    const setUrlState = useCallback((newState: Partial<T> | ((prev: T) => T)) => {
        const nextState = typeof newState === 'function' ? newState(state) : { ...state, ...newState };
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(nextState).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '' && value !== initialStateRef.current[key]) {
                params.set(key, String(value));
            } else if (value === initialStateRef.current[key] || value === '' || value === null) {
                params.delete(key);
            }
        });

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, [pathname, router, searchParams, state]);

    return [state, setUrlState] as const;
}
