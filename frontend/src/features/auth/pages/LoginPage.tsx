import React from 'react';
import { Box } from '@mui/material';
import { LoginForm } from '../components/LoginForm';

export const LoginPage: React.FC = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <LoginForm />
    </Box>
  );
};
