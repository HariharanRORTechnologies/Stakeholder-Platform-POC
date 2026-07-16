import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../services/userService';
import { User, CreateUserRequest, UpdateUserRequest, UserListFilters } from '../types/user.types';

interface UserState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  filters: UserListFilters;
}

const initialState: UserState = {
  users: [],
  currentUser: null,
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

export const fetchUsersAsync = createAsyncThunk(
  'users/fetchAll',
  async (filters: UserListFilters, { rejectWithValue }) => {
    try {
      return await userService.listUsers(filters);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchUserAsync = createAsyncThunk(
  'users/fetchOne',
  async (userId: number, { rejectWithValue }) => {
    try {
      return await userService.getUser(userId);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createUserAsync = createAsyncThunk(
  'users/create',
  async (data: CreateUserRequest, { rejectWithValue }) => {
    try {
      return await userService.createUser(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateUserAsync = createAsyncThunk(
  'users/update',
  async ({ userId, data }: { userId: number; data: UpdateUserRequest }, { rejectWithValue }) => {
    try {
      return await userService.updateUser(userId, data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteUserAsync = createAsyncThunk(
  'users/delete',
  async (userId: number, { rejectWithValue }) => {
    try {
      await userService.deleteUser(userId);
      return userId;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deactivateUserAsync = createAsyncThunk(
  'users/deactivate',
  async (userId: number, { rejectWithValue }) => {
    try {
      await userService.deactivateUser(userId);
      return userId;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const activateUserAsync = createAsyncThunk(
  'users/activate',
  async (userId: number, { rejectWithValue }) => {
    try {
      await userService.activateUser(userId);
      return userId;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<UserListFilters>) => {
      state.filters = action.payload;
    },
    clearCurrentUser: state => {
      state.currentUser = null;
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUsersAsync.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.users = action.payload.users;
        state.pagination = {
          total: action.payload.pagination.total,
          page: action.payload.pagination.page,
          limit: action.payload.pagination.limit,
          totalPages: action.payload.pagination.totalPages,
        };
      })
      .addCase(fetchUsersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchUserAsync.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createUserAsync.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUserAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.users.unshift(action.payload);
      })
      .addCase(createUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateUserAsync.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const index = state.users.findIndex(u => u.id === action.payload.id);
        if (index >= 0) {
          state.users[index] = action.payload;
        }
        if (state.currentUser?.id === action.payload.id) {
          state.currentUser = action.payload;
        }
      })
      .addCase(updateUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteUserAsync.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.users = state.users.filter(u => u.id !== action.payload);
      })
      .addCase(deleteUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(deactivateUserAsync.fulfilled, (state, action: PayloadAction<any>) => {
        const index = state.users.findIndex(u => u.id === action.payload);
        if (index >= 0) {
          state.users[index].isActive = false;
        }
      })

      .addCase(activateUserAsync.fulfilled, (state, action: PayloadAction<any>) => {
        const index = state.users.findIndex(u => u.id === action.payload);
        if (index >= 0) {
          state.users[index].isActive = true;
        }
      });
  },
});

export const { setFilters, clearCurrentUser, clearError } = userSlice.actions;
export default userSlice.reducer;
