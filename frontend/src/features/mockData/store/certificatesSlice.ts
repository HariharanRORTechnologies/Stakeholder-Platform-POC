import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import mockCertificatesData from '../../../data/mockCertificates.json';

export interface Certificate {
  id: number;
  eventId: number;
  userId: number;
  userName: string;
  eventTitle: string;
  issuedDate: string;
  verificationCode: string;
  status: 'pending' | 'downloaded';
}

interface CertificatesState {
  items: Certificate[];
}

const initialState: CertificatesState = {
  items: mockCertificatesData.certificates as Certificate[],
};

const certificatesSlice = createSlice({
  name: 'certificates',
  initialState,
  reducers: {
    markAsDownloaded: (state, action: PayloadAction<number>) => {
      const cert = state.items.find(c => c.id === action.payload);
      if (cert) {
        cert.status = 'downloaded';
      }
    },
    addCertificate: (state, action: PayloadAction<Certificate>) => {
      state.items.push(action.payload);
    },
  },
});

export const { markAsDownloaded, addCertificate } = certificatesSlice.actions;
export default certificatesSlice.reducer;
