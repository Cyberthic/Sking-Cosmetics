import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { userWishlistService } from '@/services/user/userWishlistApiService';

interface WishlistState {
    items: string[]; // Array of product IDs
    loading: boolean;
    error: string | null;
}

const initialState: WishlistState = {
    items: [],
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

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        clearWishlist: (state) => {
            state.items = [];
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
            });
    },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
