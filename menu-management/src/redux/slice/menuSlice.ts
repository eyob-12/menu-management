import { base_url } from "@/utils/base_url";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface MenuItem {
    id: string;
    name: string;
    parentId: string | null;
    children?: MenuItem[];
}

interface MenuState {
    menus: MenuItem[];
    expanded: Record<string, boolean>; // Track which menus are expanded
    loading: boolean;
    error: string | null;
}

const initialState: MenuState = {
    menus: [],
    expanded: {},
    loading: false,
    error: null,
};

// Fetch menus from backend
export const fetchMenus = createAsyncThunk<MenuItem[], void>(
    "menu/fetchMenus",
    async () => {
        const response = await axios.get(`${base_url}/menus`);
        return response.data;
    }
);

// Update a menu item
export const updateMenuItem = createAsyncThunk<
    MenuItem,
    { id: string; name: string },
    { rejectValue: string }
>(
    "menu/updateMenuItem",
    async ({ id, name }, { rejectWithValue }) => {
        try {
            const response = await axios.patch(`${base_url}/menus/${id}`, { name });
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.data) {
                return rejectWithValue(error.response.data as string);
            }
            return rejectWithValue("Failed to update menu");
        }
    }
);

// Delete a menu item
export const deleteMenuItem = createAsyncThunk<
    string,
    string,
    { rejectValue: string }
>(
    "menu/deleteMenuItem",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${base_url}/menus/${id}`);
            return id; // Return deleted menu ID
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.data) {
                return rejectWithValue(error.response.data as string);
            }
            return rejectWithValue("Failed to delete menu");
        }
    }
);

const menuSlice = createSlice({
    name: "menu",
    initialState,
    reducers: {
        toggleExpand: (state, action: PayloadAction<string>) => {
            const menuId = action.payload;
            state.expanded[menuId] = !state.expanded[menuId];
        },
        expandAll: (state) => {
            state.menus.forEach((menu) => {
                state.expanded[menu.id] = true;
                menu.children?.forEach((child) => {
                    state.expanded[child.id] = true;
                });
            });
        },
        collapseAll: (state) => {
            state.expanded = {};
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch menus
            .addCase(fetchMenus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMenus.fulfilled, (state, action: PayloadAction<MenuItem[]>) => {
                state.menus = action.payload;
                state.loading = false;
            })
            .addCase(fetchMenus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Update menu item
            .addCase(updateMenuItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateMenuItem.fulfilled, (state, action: PayloadAction<MenuItem>) => {
                const updatedItem = action.payload;
                const index = state.menus.findIndex((menu) => menu.id === updatedItem.id);
                if (index !== -1) {
                    state.menus[index] = updatedItem;
                }
                state.loading = false;
            })
            .addCase(updateMenuItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Delete menu item
            .addCase(deleteMenuItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteMenuItem.fulfilled, (state, action: PayloadAction<string>) => {
                state.menus = state.menus.filter(menu => menu.id !== action.payload);
                state.loading = false;
            })
            .addCase(deleteMenuItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { toggleExpand, expandAll, collapseAll } = menuSlice.actions;
export default menuSlice.reducer;
