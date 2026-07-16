import React from 'react';
import { Box } from '@mui/material';
import { RegisterForm } from '../components/RegisterForm';

export const RegisterPage: React.FC = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <RegisterForm />
    </Box>
  );
};
