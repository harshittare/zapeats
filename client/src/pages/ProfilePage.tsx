import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const ProfilePage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center">
        <Typography variant="h4" gutterBottom>
          User Profile ⚙️
        </Typography>
        <Typography variant="body1" color="text.secondary">
          User details, saved addresses, payment methods,
          <br />
          loyalty points, settings, and rewards system.
        </Typography>
      </Box>
    </Container>
  );
};

export default ProfilePage;