import React, { useContext } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './components/AuthContext';
import Notes from './components/Notes';
import LoginPage from './pages/LoginPage';
import UserNotes from './components/UserNotes';
import Alluserstats from './components/Allusersstats';
import SupportPage from './components/SupportPage'; // Import the SupportPage component
import Footer from './components/Footer'; // Import the Footer component

const ProtectedRoute = ({ children, requireAdmin }) => {
  const { isLoggedIn } = useContext(AuthContext);
  const userEmail = localStorage.getItem('userEmail');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  
  const isAuthenticated = isLoggedIn || 
                         (userEmail && localStorage.getItem('isAdmin') !== null);

  if (!isAuthenticated) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/usernotes" replace />;
  }

  if (!requireAdmin && isAdmin) {
    return <Navigate to="/notes" replace />;
  }

  return children;
};

const SupportRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);
  const userEmail = localStorage.getItem('userEmail');
  
  const isAuthenticated = isLoggedIn || userEmail;

  if (!isAuthenticated) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {  
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/all-stats" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <Alluserstats />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/support"
            element={
              <SupportRoute>
                <SupportPage />
              </SupportRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route 
            path="/notes" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <Notes />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/usernotes" 
            element={
              <ProtectedRoute requireAdmin={false}>
                <UserNotes />
              </ProtectedRoute>
            } 
          />
        </Routes>
        <Footer /> {/* Render the Footer component */}
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;