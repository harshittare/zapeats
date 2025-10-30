import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const FavoritesPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center">
        <Typography variant="h4" gutterBottom>
          Favorites ❤️
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Saved favorite restaurants and dishes,
          <br />
          AI recommendations based on preferences.
        </Typography>
      </Box>
    </Container>
  );
};

export default FavoritesPage;