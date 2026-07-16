import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import mockRegistrationsData from '../../../data/mockRegistrations.json';

export interface Registration {
  id: number;
  eventId: number;
  userId: number;
  userName: string;
  userEmail: string;
  status: string;
  registrationDate: string;
  checkedInAt: string | null;
}

interface RegistrationsState {
  items: Registration[];
  selectedRegistration: Registration | null;
  filters: {
    eventId?: number;
    status?: string;
  };
}

const initialState: RegistrationsState = {
  items: mockRegistrationsData.registrations,
  selectedRegistration: null,
  filters: {},
};

const registrationsSlice = createSlice({
  name: 'registrations',
  initialState,
  reducers: {
    selectRegistration: (state, action: PayloadAction<Registration>) => {
      state.selectedRegistration = action.payload;
    },
    addRegistration: (state, action: PayloadAction<Registration>) => {
      state.items.push(action.payload);
    },
    updateRegistration: (state, action: PayloadAction<Partial<Registration> & { id: number }>) => {
      const index = state.items.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    cancelRegistration: (state, action: PayloadAction<number>) => {
      const index = state.items.findIndex(r => r.id === action.payload);
      if (index !== -1) {
        state.items[index].status = 'cancelled';
      }
    },
    setFilters: (state, action: PayloadAction<RegistrationsState['filters']>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
});

export const { selectRegistration, addRegistration, updateRegistration, cancelRegistration, setFilters } = registrationsSlice.actions;
export default registrationsSlice.reducer;
