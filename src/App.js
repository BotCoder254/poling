import React from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Featured from './components/Featured';
import Archive from './components/Archive';
import Analytics from './components/Analytics';
import Profile from './components/Profile';
import Settings from './components/Settings';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import { auth } from './firebase/config';
import Login from './components/auth/Login';

function App() {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Router>
          <Box minH="100vh">
            <Navigation />
            <Box pt={4} px={4}>
              <Routes>
                
                <Route path="/" element={<Dashboard />} />
                <Route path="/featured" element={<Featured />} />
                <Route path="/archive" element={<Archive />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <PrivateRoute>
                      <Settings />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </Box>
          </Box>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
