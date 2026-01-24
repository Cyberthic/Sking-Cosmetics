import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import adminAuthReducer from './features/adminAuthSlice';
import cartReducer from './features/cartSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        adminAuth: adminAuthReducer,
        cart: cartReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
