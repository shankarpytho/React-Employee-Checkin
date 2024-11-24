import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';  // Import createTheme and ThemeProvider
import Header from './components/header';
import Dashboard from './components/dashboard';
import LoginPage from './components/login';
import Attendance from './components/attendence';
import ProtectedRoute from './components/protectedRoute';
import EmployeeHistory from './components/employeeHistory';
import CreateEmployee from './components/createEmployee';



const App = () => {
  return (
    
      <Router>
        <HeaderWithConditionalRender />
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee-history" // New admin route
            element={
              <ProtectedRoute>
                <EmployeeHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-employee"  // Make sure the path matches the URL you are trying to access
            element={
              <ProtectedRoute> {/* Ensure this is wrapped with ProtectedRoute if you have a route guard */}
                <CreateEmployee />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance"
            element={
              <ProtectedRoute>
                <Attendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    
  );
};

const HeaderWithConditionalRender = () => {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('accessToken');

  if (!isAuthenticated || location.pathname === '/login') {
    return null;
  }

  return <Header onLogout={() => localStorage.clear()} />;
};

export default App;
