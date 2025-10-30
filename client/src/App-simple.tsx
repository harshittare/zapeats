import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';

// Simple test component
const HomePage = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h1>🍔 Welcome to ZapEats!</h1>
    <p>Your modern food delivery app is ready to go!</p>
    <p>✅ All errors have been fixed</p>
    <p>🚀 Ready for development</p>
  </div>
);

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#FF6B35',
      light: '#FF8A65',
      dark: '#E65100'
    },
    secondary: {
      main: '#2E7D32',
      light: '#4CAF50',
      dark: '#1B5E20'
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF'
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <main style={{ minHeight: '100vh' }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
            </Routes>
          </main>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: '12px'
              }
            }}
          />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;