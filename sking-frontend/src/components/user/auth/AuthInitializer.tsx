'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePathname } from 'next/navigation';
import { AppDispatch, RootState } from '../../../redux/store';
import { checkSession } from '../../../redux/features/authSlice';
import { checkAdminSession } from '../../../redux/features/adminAuthSlice';

export default function AuthInitializer() {
    const dispatch = useDispatch<AppDispatch>();
    const pathname = usePathname();

    const { isAuthenticated: isUserAuth } = useSelector((state: RootState) => state.auth);
    const { isAuthenticated: isAdminAuth } = useSelector((state: RootState) => state.adminAuth);

    useEffect(() => {
        if (pathname?.startsWith('/admin')) {
            if (!isAdminAuth) {
                dispatch(checkAdminSession());
            }
        } else {
            if (!isUserAuth) {
                dispatch(checkSession());
            }
        }
    }, [dispatch, pathname, isAdminAuth, isUserAuth]);

    return null;
}
