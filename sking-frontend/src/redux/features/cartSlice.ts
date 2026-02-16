import { createSlice, createAsyncThunk, PayloadAction, current } from '@reduxjs/toolkit';
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
    isDrawerOpen: boolean;
}

const getGuestCart = (): CartItem[] => {
    if (typeof window !== 'undefined') {
        try {
            const saved = localStorage.getItem('guestCart');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error("Failed to parse guest cart from local storage", e);
            return [];
        }
    }
    return [];
};

const guestItemsInitial = getGuestCart();

const initialState: CartState = {
    items: guestItemsInitial,
    totalAmount: guestItemsInitial.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0),
    totalItems: guestItemsInitial.reduce((acc: number, item: any) => acc + item.quantity, 0),
    loading: false,
    error: null,
    isDrawerOpen: false,
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

export const mergeGuestCart = createAsyncThunk(
    'cart/mergeGuestCart',
    async (guestItems: CartItem[], { dispatch, rejectWithValue }) => {
        try {
            const itemsToMerge = guestItems.map(item => ({
                productId: item.product._id,
                variantName: item.variantName,
                quantity: item.quantity
            }));
            const response = await userCartService.mergeCart(itemsToMerge);
            if (response.success) {
                localStorage.removeItem('guestCart');
                dispatch(fetchCart());
                return response.cart;
            }
            return rejectWithValue('Failed to merge cart');
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to merge cart');
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
            state.loading = false;
            if (cart && cart.items) {
                state.items = cart.items;
                state.totalItems = cart.items.reduce((acc: number, item: any) => acc + item.quantity, 0);
                // Calculate total price
                state.totalAmount = cart.items.reduce((acc: number, item: any) => acc + ((item.price || item.product?.price || 0) * item.quantity), 0);
            }
        },
        addToGuestCart: (state, action: PayloadAction<CartItem>) => {
            const newItem = action.payload;
            const existingItemIndex = state.items.findIndex(
                item => item.product._id === newItem.product._id && item.variantName === newItem.variantName
            );

            if (existingItemIndex > -1) {
                state.items[existingItemIndex].quantity += newItem.quantity;
            } else {
                state.items.push(newItem);
            }

            state.totalItems = state.items.reduce((acc, item) => acc + item.quantity, 0);
            state.totalAmount = state.items.reduce((acc, item) => acc + ((item.price || item.product?.price || 0) * item.quantity), 0);
            try {
                localStorage.setItem('guestCart', JSON.stringify(current(state).items));
            } catch (e) {
                console.error("Failed to save guest cart", e);
            }
        },
        removeFromGuestCart: (state, action: PayloadAction<{ productId: string, variantName?: string }>) => {
            state.items = state.items.filter(
                item => !(item.product._id === action.payload.productId && item.variantName === action.payload.variantName)
            );
            state.totalItems = state.items.reduce((acc, item) => acc + item.quantity, 0);
            state.totalAmount = state.items.reduce((acc, item) => acc + ((item.price || item.product?.price || 0) * item.quantity), 0);
            try {
                localStorage.setItem('guestCart', JSON.stringify(current(state).items));
            } catch (e) {
                console.error("Failed to save guest cart", e);
            }
        },
        updateGuestQuantity: (state, action: PayloadAction<{ productId: string, variantName?: string, quantity: number }>) => {
            const { productId, variantName, quantity } = action.payload;
            const item = state.items.find(
                i => i.product._id === productId && i.variantName === variantName
            );
            if (item) {
                item.quantity = quantity;
            }
            state.totalItems = state.items.reduce((acc, item) => acc + item.quantity, 0);
            state.totalAmount = state.items.reduce((acc, item) => acc + ((item.price || item.product?.price || 0) * item.quantity), 0);
            try {
                localStorage.setItem('guestCart', JSON.stringify(current(state).items));
            } catch (e) {
                console.error("Failed to save guest cart", e);
            }
        },
        setDrawerOpen: (state, action: PayloadAction<boolean>) => {
            state.isDrawerOpen = action.payload;
        },
        clearCartLocally: (state) => {
            state.items = [];
            state.totalItems = 0;
            state.totalAmount = 0;
            state.loading = false;
            state.error = null;
            localStorage.removeItem('guestCart');
        },
        initializeGuestCart: (state) => {
            const guestItems = getGuestCart();
            state.items = guestItems;
            state.totalItems = guestItems.reduce((acc: number, item: any) => acc + item.quantity, 0);
            state.totalAmount = guestItems.reduce((acc: number, item: any) => acc + ((item.price || item.product?.price || 0) * item.quantity), 0);
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
                    state.totalItems = cart.items.reduce((acc: number, item: any) => acc + item.quantity, 0);
                    state.totalAmount = cart.items.reduce((acc: number, item: any) => acc + ((item.price || item.product?.price || 0) * item.quantity), 0);
                } else {
                    state.items = [];
                    state.totalItems = 0;
                    state.totalAmount = 0;
                }
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addMatcher(
                (action) => action.type === 'auth/logout',
                (state) => {
                    state.items = [];
                    state.totalItems = 0;
                    state.totalAmount = 0;
                    state.loading = false;
                    state.error = null;
                }
            );
    },
});

export const {
    updateCartLocally,
    setDrawerOpen,
    clearCartLocally,
    addToGuestCart,
    removeFromGuestCart,
    updateGuestQuantity,
    initializeGuestCart
} = cartSlice.actions;
export default cartSlice.reducer;
