import { createSlice, createAsyncThunk, PayloadAction, current } from '@reduxjs/toolkit';
import { userWishlistService } from '@/services/user/userWishlistApiService';

interface WishlistState {
    items: string[]; // Array of product IDs
    loading: boolean;
    error: string | null;
}

const getGuestWishlist = (): string[] => {
    if (typeof window !== 'undefined') {
        try {
            const saved = localStorage.getItem('guestWishlist');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error("Failed to parse guest wishlist from local storage", e);
            return [];
        }
    }
    return [];
};

const initialState: WishlistState = {
    items: getGuestWishlist(),
    loading: false,
    error: null,
};

export const fetchWishlist = createAsyncThunk(
    'wishlist/fetchWishlist',
    async (_, { rejectWithValue }) => {
        try {
            const response = await userWishlistService.getWishlist();
            if (response.success) {
                return response.wishlist.products.map((p: any) => p._id);
            }
            return rejectWithValue('Failed to fetch wishlist');
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
        }
    }
);

export const toggleWishlist = createAsyncThunk(
    'wishlist/toggleWishlist',
    async (productId: string, { rejectWithValue }) => {
        try {
            const response = await userWishlistService.toggleWishlist(productId);
            if (response.success) {
                // Return the updated list of IDs
                return response.wishlist.products.map((p: any) => p._id || p);
            }
            return rejectWithValue('Failed to update wishlist');
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update wishlist');
        }
    }
);

export const mergeGuestWishlist = createAsyncThunk(
    'wishlist/mergeGuestWishlist',
    async (productIds: string[], { dispatch, rejectWithValue }) => {
        try {
            const response = await userWishlistService.mergeWishlist(productIds);
            if (response.success) {
                localStorage.removeItem('guestWishlist');
                dispatch(fetchWishlist());
                return response.wishlist.products.map((p: any) => p._id || p);
            }
            return rejectWithValue('Failed to merge wishlist');
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to merge wishlist');
        }
    }
);

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        clearWishlist: (state) => {
            state.items = [];
            localStorage.removeItem('guestWishlist');
        },
        toggleGuestWishlist: (state, action: PayloadAction<string>) => {
            const productId = action.payload;
            if (state.items.includes(productId)) {
                state.items = state.items.filter(id => id !== productId);
            } else {
                state.items.push(productId);
            }
            try {
                localStorage.setItem('guestWishlist', JSON.stringify(current(state).items));
            } catch (e) {
                console.error("Failed to save guest wishlist", e);
            }
        },
        initializeGuestWishlist: (state) => {
            state.items = getGuestWishlist();
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWishlist.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(toggleWishlist.fulfilled, (state, action) => {
                state.items = action.payload;
            })
            .addMatcher(
                (action) => action.type === 'auth/logout',
                (state) => {
                    state.items = [];
                    state.loading = false;
                    state.error = null;
                }
            );
    },
});

export const { clearWishlist, toggleGuestWishlist, initializeGuestWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
