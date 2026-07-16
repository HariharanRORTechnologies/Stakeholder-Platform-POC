import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import mockEventsData from '../../../data/mockEvents.json';

export interface Event {
  id: number;
  title: string;
  description: string;
  eventType: string;
  status: string;
  startDate: string;
  endDate: string;
  location: string;
  maxCapacity: number;
  registrationDeadline: string;
  organizerId: number;
  budget: number;
  imageUrl: string;
  registrations: number;
  attended: number;
  avgRating: number;
  tags: string[];
}

interface EventsState {
  items: Event[];
  selectedEvent: Event | null;
  filters: {
    status?: string;
    eventType?: string;
    searchTerm?: string;
  };
}

const initialState: EventsState = {
  items: mockEventsData.events,
  selectedEvent: null,
  filters: {},
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    selectEvent: (state, action: PayloadAction<Event>) => {
      state.selectedEvent = action.payload;
    },
    setFilters: (state, action: PayloadAction<EventsState['filters']>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    updateEvent: (state, action: PayloadAction<Partial<Event> & { id: number }>) => {
      const index = state.items.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
  },
});

export const { selectEvent, setFilters, clearFilters, updateEvent } = eventsSlice.actions;
export default eventsSlice.reducer;
