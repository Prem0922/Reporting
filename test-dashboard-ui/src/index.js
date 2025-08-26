import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Keep your existing CSS if you have any global styles
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './components/auth/LandingPage';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import { AuthProvider } from './AuthContext';
import AuthContext from './AuthContext';
import DashboardApp from './DashboardApp';

// You can customize your theme here
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // A nice blue color (can be changed)
    },
    secondary: {
      main: '#dc004e', // A pinkish-red (can be changed)
    },
    background: {
      default: '#fafafa', // Light grey background
      paper: '#ffffff', // White backgrounds for cards/panels
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif', // Default font
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Don't uppercase button text
          borderRadius: '8px',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#f5f5f5', // Light grey for the drawer
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: 'rgba(0, 0, 0, 0.08)', // Highlighted menu item
          },
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
  },
});

// Simple Auth Context
// const AuthContext = React.createContext(); // <-- REMOVE THIS LINE

function RequireAuth({ children }) {
  const { isAuthenticated } = React.useContext(AuthContext);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated } = React.useContext(AuthContext);
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to="/opening" replace />;
  }

  return children;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            } />
            <Route path="/login" element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            } />
            <Route path="/signup" element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            } />
            <Route path="/forgot-password" element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            } />
            <Route path="/reset-password" element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            } />

            {/* Protected routes */}
            <Route path="/*" element={
              <RequireAuth>
                <DashboardApp />
              </RequireAuth>
            } />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();