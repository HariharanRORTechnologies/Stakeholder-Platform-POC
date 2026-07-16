import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../services/authService';
import { JWTPayload } from '../types/auth.types';

interface AuthState {
  isAuthenticated: boolean;
  user: JWTPayload | null;
  loading: boolean;
  error: string | null;
  mfaPending: boolean;
  mfaUserId?: number;
  tokens: {
    accessToken: string | null;
    refreshToken: string | null;
  };
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  mfaPending: false,
  tokens: {
    accessToken: null,
    refreshToken: null,
  },
};

export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const registerAsync = createAsyncThunk(
  'auth/register',
  async (
    data: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      confirmPassword: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.register(data);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const refreshTokenAsync = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const refreshToken = state.auth.tokens.refreshToken;

      if (!refreshToken) {
        return rejectWithValue('No refresh token available');
      }

      const response = await authService.refreshToken(refreshToken);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const verifyMFAAsync = createAsyncThunk(
  'auth/verifyMFA',
  async (
    { userId, token }: { userId: number; token: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.verifyMFA(userId, token);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return null;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<JWTPayload>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    setTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      state.tokens = action.payload;
    },
    clearAuth: state => {
      state.isAuthenticated = false;
      state.user = null;
      state.tokens = { accessToken: null, refreshToken: null };
      state.mfaPending = false;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginAsync.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;

        if (action.payload.mfaPending) {
          state.mfaPending = true;
          state.mfaUserId = action.payload.data?.userId;
        } else {
          state.isAuthenticated = true;
          state.tokens = {
            accessToken: action.payload.data.accessToken,
            refreshToken: action.payload.data.refreshToken,
          };
          state.mfaPending = false;
        }
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      .addCase(registerAsync.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.tokens = {
          accessToken: action.payload.data.accessToken,
          refreshToken: action.payload.data.refreshToken,
        };
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(refreshTokenAsync.pending, state => {
        state.loading = true;
      })
      .addCase(refreshTokenAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.tokens = {
          accessToken: action.payload.data.accessToken,
          refreshToken: action.payload.data.refreshToken,
        };
      })
      .addCase(refreshTokenAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      .addCase(verifyMFAAsync.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyMFAAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.mfaPending = false;
        state.tokens = {
          accessToken: action.payload.data.accessToken,
          refreshToken: action.payload.data.refreshToken,
        };
      })
      .addCase(verifyMFAAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutAsync.fulfilled, state => {
        state.isAuthenticated = false;
        state.user = null;
        state.tokens = { accessToken: null, refreshToken: null };
        state.error = null;
      });
  },
});

export const { setUser, setTokens, clearAuth, setError, clearError } = authSlice.actions;
export default authSlice.reducer;
