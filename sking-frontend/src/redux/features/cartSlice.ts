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

const getStoredCart = (): CartItem[] => {
    if (typeof window !== 'undefined') {
        try {
            const saved = localStorage.getItem('guestCart');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error("Failed to parse cart from local storage", e);
            return [];
        }
    }
    return [];
};

const deduplicateCartItems = (items: CartItem[]) => {
    const map = new Map();
    items.forEach(item => {
        const key = `${item.product._id}-${item.variantName || 'default'}`;
        if (map.has(key)) {
            // merge quantities if we found duplicate keys
            const existing = map.get(key);
            existing.quantity = (existing.quantity || 0) + (item.quantity || 0);
        } else {
            map.set(key, JSON.parse(JSON.stringify(item)));
        }
    });
    return Array.from(map.values());
};

const saveCartToStorage = (items: CartItem[]) => {
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem('guestCart', JSON.stringify(items));
        } catch (e) {
            console.error("Failed to save cart to local storage", e);
        }
    }
};

const initialItems = getStoredCart();

const initialState: CartState = {
    items: initialItems,
    totalAmount: initialItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0),
    totalItems: initialItems.reduce((acc: number, item: any) => acc + item.quantity, 0),
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
            const cart = action.payload;
            state.loading = false;
            if (cart && cart.items) {
                const uniqueItems = deduplicateCartItems(cart.items);
                state.items = uniqueItems;
                state.totalItems = uniqueItems.reduce((acc: number, item: any) => acc + item.quantity, 0);
                state.totalAmount = uniqueItems.reduce((acc: number, item: any) => acc + ((item.price || item.product?.price || 0) * item.quantity), 0);
                saveCartToStorage(state.items);
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
            saveCartToStorage(state.items);
        },
        removeFromGuestCart: (state, action: PayloadAction<{ productId: string, variantName?: string }>) => {
            state.items = state.items.filter(
                item => !(item.product._id === action.payload.productId && item.variantName === action.payload.variantName)
            );
            state.totalItems = state.items.reduce((acc, item) => acc + item.quantity, 0);
            state.totalAmount = state.items.reduce((acc, item) => acc + ((item.price || item.product?.price || 0) * item.quantity), 0);
            saveCartToStorage(state.items);
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
            saveCartToStorage(state.items);
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
            const guestItems = getStoredCart();
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
                    // If server returns an empty cart but we have local items, 
                    // we assume they are guest items waiting to be merged.
                    // We only overwrite if server cart is NOT empty OR if our state is already empty.
                    if (cart.items.length > 0 || state.items.length === 0) {
                        const uniqueItems = deduplicateCartItems(cart.items);
                        state.items = uniqueItems;
                        state.totalItems = uniqueItems.reduce((acc: number, item: any) => acc + item.quantity, 0);
                        state.totalAmount = uniqueItems.reduce((acc: number, item: any) => acc + ((item.price || item.product?.price || 0) * item.quantity), 0);
                        saveCartToStorage(state.items);
                    }
                }
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(mergeGuestCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(mergeGuestCart.fulfilled, (state, action) => {
                state.loading = false;
                const cart = action.payload;
                if (cart && cart.items) {
                    const uniqueItems = deduplicateCartItems(cart.items);
                    state.items = uniqueItems;
                    state.totalItems = uniqueItems.reduce((acc: number, item: any) => acc + item.quantity, 0);
                    state.totalAmount = uniqueItems.reduce((acc: number, item: any) => acc + ((item.price || item.product?.price || 0) * item.quantity), 0);
                    saveCartToStorage(state.items);
                }
            })
            .addCase(mergeGuestCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addMatcher(
                (action) => action.type === 'auth/logout',
                (state) => {
                    // Persistence across logout
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
