import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registrationService } from '../services/registrationService';
import { Registration, AttendanceStats } from '../types/registration.types';

interface RegistrationState {
  registrations: Registration[];
  userRegistrations: Registration[];
  selectedRegistration: Registration | null;
  attendanceStats: AttendanceStats | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const initialState: RegistrationState = {
  registrations: [],
  userRegistrations: [],
  selectedRegistration: null,
  attendanceStats: null,
  loading: false,
  error: null,
  pagination: { page: 1, limit: 20, total: 0, pages: 0 },
};

export const fetchRegistrations = createAsyncThunk(
  'registrations/fetchRegistrations',
  async ({ eventId, page, limit }: { eventId: number; page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      return await registrationService.getRegistrations(eventId, page, limit);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch registrations');
    }
  }
);

export const fetchUserRegistrations = createAsyncThunk(
  'registrations/fetchUserRegistrations',
  async (_, { rejectWithValue }) => {
    try {
      return await registrationService.getUserRegistrations();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch your registrations');
    }
  }
);

export const registerForEvent = createAsyncThunk(
  'registrations/registerForEvent',
  async (eventId: number, { rejectWithValue }) => {
    try {
      return await registrationService.registerForEvent(eventId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to register for event');
    }
  }
);

export const approveRegistration = createAsyncThunk(
  'registrations/approveRegistration',
  async (id: number, { rejectWithValue }) => {
    try {
      return await registrationService.approveRegistration(id);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to approve registration');
    }
  }
);

export const checkInRegistration = createAsyncThunk(
  'registrations/checkInRegistration',
  async (id: number, { rejectWithValue }) => {
    try {
      return await registrationService.checkIn(id);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to check in');
    }
  }
);

export const markAttended = createAsyncThunk(
  'registrations/markAttended',
  async (id: number, { rejectWithValue }) => {
    try {
      return await registrationService.markAttended(id);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to mark attended');
    }
  }
);

export const cancelRegistration = createAsyncThunk(
  'registrations/cancelRegistration',
  async (id: number, { rejectWithValue }) => {
    try {
      return await registrationService.cancelRegistration(id);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to cancel registration');
    }
  }
);

export const fetchAttendanceStats = createAsyncThunk(
  'registrations/fetchAttendanceStats',
  async (eventId: number, { rejectWithValue }) => {
    try {
      return await registrationService.getAttendanceStats(eventId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch stats');
    }
  }
);

const registrationSlice = createSlice({
  name: 'registrations',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegistrations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRegistrations.fulfilled, (state, action) => {
        state.loading = false;
        state.registrations = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchRegistrations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchUserRegistrations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserRegistrations.fulfilled, (state, action) => {
        state.loading = false;
        state.userRegistrations = action.payload.data;
      })
      .addCase(fetchUserRegistrations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(registerForEvent.fulfilled, (state, action) => {
        state.userRegistrations.push(action.payload.data);
      })

      .addCase(approveRegistration.fulfilled, (state, action) => {
        const index = state.registrations.findIndex(r => r.id === action.payload.data.id);
        if (index !== -1) state.registrations[index] = action.payload.data;
      })

      .addCase(checkInRegistration.fulfilled, (state, action) => {
        const index = state.registrations.findIndex(r => r.id === action.payload.data.id);
        if (index !== -1) state.registrations[index] = action.payload.data;
      })

      .addCase(markAttended.fulfilled, (state, action) => {
        const index = state.registrations.findIndex(r => r.id === action.payload.data.id);
        if (index !== -1) state.registrations[index] = action.payload.data;
      })

      .addCase(cancelRegistration.fulfilled, (state, action) => {
        state.userRegistrations = state.userRegistrations.filter(r => r.id !== action.payload.data.id);
      })

      .addCase(fetchAttendanceStats.fulfilled, (state, action) => {
        state.attendanceStats = action.payload.data;
      });
  },
});

export const { clearError } = registrationSlice.actions;
export default registrationSlice.reducer;
