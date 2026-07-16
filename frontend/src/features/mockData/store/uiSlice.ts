import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'division_manager'
  | 'event_organizer'
  | 'employee'
  | 'volunteer'
  | 'speaker'
  | 'sponsor'
  | 'external_user'
  | 'customer_support'
  | 'manager'
  | 'organizer'
  | 'coordinator'
  | 'stakeholder';

interface UIState {
  currentRole: UserRole;
  hasSelectedRole: boolean;
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  toastMessage: {
    id?: number;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    open: boolean;
  };
}

const initialState: UIState = {
  currentRole: 'stakeholder',
  hasSelectedRole: false,
  sidebarOpen: true,
  theme: 'light',
  toastMessage: {
    message: '',
    type: 'info',
    open: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<UserRole>) => {
      state.currentRole = action.payload;
    },
    setHasSelectedRole: (state, action: PayloadAction<boolean>) => {
      state.hasSelectedRole = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    showToast: (state, action: PayloadAction<Omit<UIState['toastMessage'], 'id' | 'open'>>) => {
      state.toastMessage = {
        id: Date.now(),
        ...action.payload,
        open: true,
      };
    },
    hideToast: (state) => {
      state.toastMessage.open = false;
    },
  },
});

export const { setRole, setHasSelectedRole, toggleSidebar, setSidebarOpen, setTheme, showToast, hideToast } = uiSlice.actions;
export default uiSlice.reducer;
