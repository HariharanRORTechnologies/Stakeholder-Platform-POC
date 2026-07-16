import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { roleService } from '../services/roleService';
import { Role, CreateRoleRequest, UpdateRoleRequest, RoleListFilters } from '../types/role.types';

interface RoleState {
  roles: Role[];
  currentRole: Role | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  filters: RoleListFilters;
}

const initialState: RoleState = {
  roles: [],
  currentRole: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  },
  filters: {
    page: 1,
    limit: 20,
  },
};

export const fetchRolesAsync = createAsyncThunk(
  'roles/fetchAll',
  async (filters: RoleListFilters, { rejectWithValue }) => {
    try {
      return await roleService.listRoles(filters);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchRoleAsync = createAsyncThunk(
  'roles/fetchOne',
  async (roleId: number, { rejectWithValue }) => {
    try {
      return await roleService.getRole(roleId);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createRoleAsync = createAsyncThunk(
  'roles/create',
  async (data: CreateRoleRequest, { rejectWithValue }) => {
    try {
      return await roleService.createRole(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateRoleAsync = createAsyncThunk(
  'roles/update',
  async ({ roleId, data }: { roleId: number; data: UpdateRoleRequest }, { rejectWithValue }) => {
    try {
      return await roleService.updateRole(roleId, data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteRoleAsync = createAsyncThunk(
  'roles/delete',
  async (roleId: number, { rejectWithValue }) => {
    try {
      await roleService.deleteRole(roleId);
      return roleId;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deactivateRoleAsync = createAsyncThunk(
  'roles/deactivate',
  async (roleId: number, { rejectWithValue }) => {
    try {
      await roleService.deactivateRole(roleId);
      return roleId;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const activateRoleAsync = createAsyncThunk(
  'roles/activate',
  async (roleId: number, { rejectWithValue }) => {
    try {
      await roleService.activateRole(roleId);
      return roleId;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const roleSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<RoleListFilters>) => {
      state.filters = action.payload;
    },
    clearCurrentRole: state => {
      state.currentRole = null;
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchRolesAsync.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRolesAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.roles = action.payload.roles;
        state.pagination = {
          total: action.payload.pagination.total,
          page: action.payload.pagination.page,
          limit: action.payload.pagination.limit,
          totalPages: action.payload.pagination.totalPages,
        };
      })
      .addCase(fetchRolesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchRoleAsync.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoleAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.currentRole = action.payload;
      })
      .addCase(fetchRoleAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createRoleAsync.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRoleAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.roles.unshift(action.payload);
      })
      .addCase(createRoleAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateRoleAsync.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRoleAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const index = state.roles.findIndex(r => r.id === action.payload.id);
        if (index >= 0) {
          state.roles[index] = action.payload;
        }
        if (state.currentRole?.id === action.payload.id) {
          state.currentRole = action.payload;
        }
      })
      .addCase(updateRoleAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteRoleAsync.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRoleAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.roles = state.roles.filter(r => r.id !== action.payload);
      })
      .addCase(deleteRoleAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(deactivateRoleAsync.fulfilled, (state, action: PayloadAction<any>) => {
        const index = state.roles.findIndex(r => r.id === action.payload);
        if (index >= 0) {
          state.roles[index].isActive = false;
        }
      })

      .addCase(activateRoleAsync.fulfilled, (state, action: PayloadAction<any>) => {
        const index = state.roles.findIndex(r => r.id === action.payload);
        if (index >= 0) {
          state.roles[index].isActive = true;
        }
      });
  },
});

export const { setFilters, clearCurrentRole, clearError } = roleSlice.actions;
export default roleSlice.reducer;
