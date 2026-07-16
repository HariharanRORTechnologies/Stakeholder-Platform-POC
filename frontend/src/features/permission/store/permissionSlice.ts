import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { permissionService } from '../services/permissionService';
import {
  Permission,
  CreatePermissionRequest,
  UpdatePermissionRequest,
  PermissionListFilters,
} from '../types/permission.types';

interface PermissionState {
  permissions: Permission[];
  currentPermission: Permission | null;
  categories: string[];
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  filters: PermissionListFilters;
}

const initialState: PermissionState = {
  permissions: [],
  currentPermission: null,
  categories: [],
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 50,
    totalPages: 0,
  },
  filters: {
    page: 1,
    limit: 50,
  },
};

export const fetchPermissionsAsync = createAsyncThunk(
  'permissions/fetchAll',
  async (filters: PermissionListFilters, { rejectWithValue }) => {
    try {
      return await permissionService.listPermissions(filters);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchPermissionAsync = createAsyncThunk(
  'permissions/fetchOne',
  async (permissionId: number, { rejectWithValue }) => {
    try {
      return await permissionService.getPermission(permissionId);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createPermissionAsync = createAsyncThunk(
  'permissions/create',
  async (data: CreatePermissionRequest, { rejectWithValue }) => {
    try {
      return await permissionService.createPermission(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updatePermissionAsync = createAsyncThunk(
  'permissions/update',
  async (
    { permissionId, data }: { permissionId: number; data: UpdatePermissionRequest },
    { rejectWithValue }
  ) => {
    try {
      return await permissionService.updatePermission(permissionId, data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deletePermissionAsync = createAsyncThunk(
  'permissions/delete',
  async (permissionId: number, { rejectWithValue }) => {
    try {
      await permissionService.deletePermission(permissionId);
      return permissionId;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deactivatePermissionAsync = createAsyncThunk(
  'permissions/deactivate',
  async (permissionId: number, { rejectWithValue }) => {
    try {
      await permissionService.deactivatePermission(permissionId);
      return permissionId;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const activatePermissionAsync = createAsyncThunk(
  'permissions/activate',
  async (permissionId: number, { rejectWithValue }) => {
    try {
      await permissionService.activatePermission(permissionId);
      return permissionId;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchCategoriesAsync = createAsyncThunk(
  'permissions/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await permissionService.getCategories();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const permissionSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<PermissionListFilters>) => {
      state.filters = action.payload;
    },
    clearCurrentPermission: state => {
      state.currentPermission = null;
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchPermissionsAsync.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermissionsAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.permissions = action.payload.permissions;
        state.pagination = {
          total: action.payload.pagination.total,
          page: action.payload.pagination.page,
          limit: action.payload.pagination.limit,
          totalPages: action.payload.pagination.totalPages,
        };
      })
      .addCase(fetchPermissionsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchPermissionAsync.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermissionAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.currentPermission = action.payload;
      })
      .addCase(fetchPermissionAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createPermissionAsync.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPermissionAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.permissions.unshift(action.payload);
      })
      .addCase(createPermissionAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updatePermissionAsync.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePermissionAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const index = state.permissions.findIndex(p => p.id === action.payload.id);
        if (index >= 0) {
          state.permissions[index] = action.payload;
        }
        if (state.currentPermission?.id === action.payload.id) {
          state.currentPermission = action.payload;
        }
      })
      .addCase(updatePermissionAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(deletePermissionAsync.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePermissionAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.permissions = state.permissions.filter(p => p.id !== action.payload);
      })
      .addCase(deletePermissionAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(deactivatePermissionAsync.fulfilled, (state, action: PayloadAction<any>) => {
        const index = state.permissions.findIndex(p => p.id === action.payload);
        if (index >= 0) {
          state.permissions[index].isActive = false;
        }
      })

      .addCase(activatePermissionAsync.fulfilled, (state, action: PayloadAction<any>) => {
        const index = state.permissions.findIndex(p => p.id === action.payload);
        if (index >= 0) {
          state.permissions[index].isActive = true;
        }
      })

      .addCase(fetchCategoriesAsync.pending, state => {
        state.loading = true;
      })
      .addCase(fetchCategoriesAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategoriesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearCurrentPermission, clearError } = permissionSlice.actions;
export default permissionSlice.reducer;
