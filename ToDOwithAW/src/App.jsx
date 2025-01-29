import React, { useContext } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from './components/AuthContext';
import Notes from "./components/Notes";
import LoginPage from "./pages/LoginPage";
import UserNotes from "./components/UserNotes";

// Updated ProtectedRoute to handle role-based access
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

  // Redirect based on user role
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/usernotes" replace />;
  }

  if (!requireAdmin && isAdmin) {
    return <Navigate to="/notes" replace />;
  }

  return children;
};

function App() {  
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
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
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;