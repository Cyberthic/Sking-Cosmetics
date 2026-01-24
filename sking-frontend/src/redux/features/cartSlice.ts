import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { userCartService } from '@/services/user/userCartApiService';

interface CartItem {
    product: {
        _id: string;
        name: string;
        price: number;
        images: string[];
    };
    quantity: number;
    price: number;
    variantName?: string;
}

interface CartState {
    items: CartItem[];
    totalAmount: number;
    totalItems: number;
    loading: boolean;
    error: string | null;
}

const initialState: CartState = {
    items: [],
    totalAmount: 0,
    totalItems: 0,
    loading: false,
    error: null,
};

export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { rejectWithValue }) => {
        try {
            const response = await userCartService.getCart();
            if (response.success) {
                return response.cart;
            }
            return rejectWithValue('Failed to fetch cart');
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        updateCartLocally: (state, action: PayloadAction<any>) => {
            // Helper to update state from a cart object directly (e.g. after add/remove)
            const cart = action.payload;
            if (cart && cart.items) {
                state.items = cart.items;
                state.totalItems = cart.items.length;
                // Calculate total price
                state.totalAmount = cart.items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                const cart = action.payload;
                if (cart && cart.items) {
                    state.items = cart.items;
                    state.totalItems = cart.items.length;
                    state.totalAmount = cart.items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
                } else {
                    state.items = [];
                    state.totalItems = 0;
                    state.totalAmount = 0;
                }
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { updateCartLocally } = cartSlice.actions;
export default cartSlice.reducer;
