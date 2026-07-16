import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { eventService } from '../services/eventService';
import { Event, CreateEventRequest, UpdateEventRequest } from '../types/event.types';

interface EventState {
  events: Event[];
  selectedEvent: Event | null;
  upcomingEvents: Event[];
  myEvents: Event[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  filters: {
    status?: string;
    eventType?: string;
    departmentId?: number;
    organizerId?: number;
    isPublished?: boolean;
    search?: string;
  };
}

const initialState: EventState = {
  events: [],
  selectedEvent: null,
  upcomingEvents: [],
  myEvents: [],
  loading: false,
  error: null,
  pagination: { page: 1, limit: 20, total: 0, pages: 0 },
  filters: {},
};

export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (params: { page?: number; limit?: number; filters?: any }, { rejectWithValue }) => {
    try {
      const response = await eventService.getEvents(params.page || 1, params.limit || 20, params.filters);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch events');
    }
  }
);

export const fetchEventById = createAsyncThunk(
  'events/fetchEventById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await eventService.getEventById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch event');
    }
  }
);

export const fetchUpcomingEvents = createAsyncThunk(
  'events/fetchUpcomingEvents',
  async (limit: number | undefined, { rejectWithValue }) => {
    try {
      const response = await eventService.getUpcomingEvents(limit);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch upcoming events');
    }
  }
);

export const fetchMyEvents = createAsyncThunk(
  'events/fetchMyEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await eventService.getMyEvents();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch my events');
    }
  }
);

export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (data: CreateEventRequest, { rejectWithValue }) => {
    try {
      const response = await eventService.createEvent(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create event');
    }
  }
);

export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async ({ id, data }: { id: number; data: UpdateEventRequest }, { rejectWithValue }) => {
    try {
      const response = await eventService.updateEvent(id, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update event');
    }
  }
);

export const publishEvent = createAsyncThunk(
  'events/publishEvent',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await eventService.publishEvent(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to publish event');
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async (id: number, { rejectWithValue }) => {
    try {
      await eventService.deleteEvent(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete event');
    }
  }
);

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<any>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1;
    },
    clearFilters: (state) => {
      state.filters = {};
      state.pagination.page = 1;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEvent = action.payload.data;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchUpcomingEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUpcomingEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.upcomingEvents = action.payload.data;
      })
      .addCase(fetchUpcomingEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchMyEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.myEvents = action.payload.data;
      })
      .addCase(fetchMyEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createEvent.fulfilled, (state, action) => {
        state.events.unshift(action.payload.data);
      })

      .addCase(updateEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex(e => e.id === action.payload.data.id);
        if (index !== -1) {
          state.events[index] = action.payload.data;
        }
        state.selectedEvent = action.payload.data;
      })

      .addCase(publishEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex(e => e.id === action.payload.data.id);
        if (index !== -1) {
          state.events[index] = action.payload.data;
        }
        state.selectedEvent = action.payload.data;
      })

      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = state.events.filter(e => e.id !== action.payload);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
      });
  },
});

export const { setFilters, clearFilters, clearError } = eventSlice.actions;
export default eventSlice.reducer;
