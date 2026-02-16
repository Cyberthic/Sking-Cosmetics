'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePathname } from 'next/navigation';
import { AppDispatch, RootState } from '../../../redux/store';
import { checkSession } from '../../../redux/features/authSlice';
import { checkAdminSession } from '../../../redux/features/adminAuthSlice';
import { initializeGuestCart } from '@/redux/features/cartSlice';
import { initializeGuestWishlist } from '@/redux/features/wishlistSlice';

export default function AuthInitializer() {
    const dispatch = useDispatch<AppDispatch>();
    const pathname = usePathname();

    const { isAuthenticated: isUserAuth } = useSelector((state: RootState) => state.auth);
    const { isAuthenticated: isAdminAuth } = useSelector((state: RootState) => state.adminAuth);

    useEffect(() => {
        dispatch(initializeGuestCart());
        dispatch(initializeGuestWishlist());
    }, [dispatch]);

    useEffect(() => {
        // Skip session check on login/signin pages to avoid race conditions
        const isLoginPage = pathname === '/login' || pathname === '/signin' || pathname === '/admin/login';

        if (pathname?.startsWith('/admin')) {
            if (!isAdminAuth && !isLoginPage) {
                dispatch(checkAdminSession());
            }
        } else {
            if (!isUserAuth && !isLoginPage) {
                dispatch(checkSession());
            }
        }
    }, [dispatch, pathname, isAdminAuth, isUserAuth]);

    return null;
}
