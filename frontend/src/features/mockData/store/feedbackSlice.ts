import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import mockFeedbackData from '../../../data/mockFeedback.json';

export interface Feedback {
  id: number;
  eventId: number;
  userId: number;
  userName: string;
  rating: number;
  title: string;
  content: string;
  timestamp: string;
  isAnonymous: boolean;
}

interface FeedbackState {
  items: Feedback[];
  selectedFeedback: Feedback | null;
}

const initialState: FeedbackState = {
  items: mockFeedbackData.feedback,
  selectedFeedback: null,
};

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    selectFeedback: (state, action: PayloadAction<Feedback>) => {
      state.selectedFeedback = action.payload;
    },
    addFeedback: (state, action: PayloadAction<Feedback>) => {
      state.items.push(action.payload);
    },
    deleteFeedback: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(f => f.id !== action.payload);
    },
  },
});

export const { selectFeedback, addFeedback, deleteFeedback } = feedbackSlice.actions;
export default feedbackSlice.reducer;
