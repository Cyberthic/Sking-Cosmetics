import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import adminAuthReducer from './features/adminAuthSlice';
import cartReducer from './features/cartSlice';
import wishlistReducer from './features/wishlistSlice';
import adminDashboardReducer from './features/adminDashboardSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        adminAuth: adminAuthReducer,
        cart: cartReducer,
        wishlist: wishlistReducer,
        adminDashboard: adminDashboardReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
