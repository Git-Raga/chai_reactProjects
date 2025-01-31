import React, { useState, useEffect } from 'react';
import db from '../appwrite/database';
import { Query } from 'appwrite';
import { useNavigate } from 'react-router-dom'; // Add this import

const AdminSettingsModal = ({ isOpen, onClose, onLogout, onPasswordUpdate, theme, selectedFont, userTasks }) => {
  const navigate = useNavigate(); // Add this hook
  const [currentView, setCurrentView] = useState('menu');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const userEmail = localStorage.getItem('userEmail');
  const [email, setEmail] = useState('');
  const currentFont = localStorage.getItem("selectedFont") || "font-titillium"; // Add this line

  useEffect(() => {
    if (currentView === 'userStats') {
      const fetchStats = async () => {
        try {
          setStatsLoading(true);
          const userStats = await db.todocollection.getUserStats(userEmail);
          setStats(userStats);
        } catch (error) {
          console.error('Error fetching stats:', error);
        } finally {
          setStatsLoading(false);
        }
      };

      fetchStats();
    }
  }, [currentView, userEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
  
    // Validate email first
    if (!email) {
      setError('Email is required');
      setIsLoading(false);
      return;
    }
  
    // Validate current password
    if (!currentPassword) {
      setError('Current password is required');
      setIsLoading(false);
      return;
    }
  
    // Validate password match
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      setIsLoading(false);
      return;
    }
  
    try {
      // First verify if the email exists and matches the current user
      const response = await db.userdetails.list([
        Query.equal('email', email)
      ]);
  
      if (!response.documents || response.documents.length === 0) {
        throw new Error('Email not found in system');
      }
  
      const user = response.documents[0];
  
      // Verify current password
      if (user.password !== currentPassword) {
        throw new Error('Current password is incorrect');
      }
  
      // Update password directly in the database
      await db.userdetails.update(user.$id, {
        password: newPassword
      });
      
      setSuccess('Password updated successfully');
      // Clear all fields
      setEmail('');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      setTimeout(() => {
        setSuccess('');
        setCurrentView('menu');
      }, 2000);
  
    } catch (error) {
      setError(error.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const renderMenu = () => (
    <div className="space-y-3">
      <button
        onClick={() => setCurrentView('changePassword')}
        className={`w-full px-4 py-3 text-left rounded-lg ${
          theme === 'dark' 
            ? 'bg-gray-700 hover:bg-gray-600 text-white' 
            : theme === 'green'
            ? 'bg-cyan-700 hover:bg-cyan-600 text-white'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
        } transition-colors duration-200 flex items-center`}
      >
        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-500 text-white mr-3">
        🔐
        </span>
        <span className="font-medium">Change Password</span>
      </button>

      <button
        onClick={() => {
          console.log("AdminModal - selectedFont:", selectedFont); // Debug log
          onClose();
          navigate('/all-stats', { 
            state: { 
              theme:theme,
              selectedFont:currentFont
            }
          });
          
        }}
      className={`w-full px-4 py-3 text-left rounded-lg ${
        theme === 'dark' 
          ? 'bg-gray-700 hover:bg-gray-600 text-white' 
          : theme === 'green'
          ? 'bg-cyan-700 hover:bg-cyan-600 text-white'
          : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
      } transition-colors duration-200 flex items-center`}
    >
      <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-500 text-white mr-3">
        📊
      </span>
      <span className="font-medium">All User Stats</span>
    </button>

      <button
        onClick={onLogout}
        className={`w-full px-4 py-3 text-left rounded-lg ${
          theme === 'dark' 
            ? 'bg-red-900/40 hover:bg-red-900/60 text-red-200' 
            : theme === 'green'
            ? 'bg-red-900/40 hover:bg-red-900/60 text-red-200'
            : 'bg-red-50 hover:bg-red-100 text-red-600'
        } transition-colors duration-200 flex items-center`}
      >
        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white mr-3">
        🔌
        </span>
        <span className="font-medium">Log Out</span>
      </button>
    </div>
  );

  const renderPasswordForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email field */}
      <div>
        <label className="block mb-1">Your Email</label>
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded text-black pr-10"
            placeholder="Enter your email"
            required
          />
        </div>
      </div>

      {/* Current Password field */}
      <div>
        <label className="block mb-1">Current Password</label>
        <div className="relative">
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-2 border rounded text-black pr-10"
            placeholder="Enter current password"
            required
          />
        </div>
      </div>

      <div>
        <label className="block mb-1">New Password</label>
        <div className="relative">
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border rounded text-black pr-10"
            placeholder="Enter new password"
            required
          />
        </div>
      </div>

      <div>
        <label className="block mb-1">Confirm New Password</label>
        <div className="relative">
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border rounded text-black pr-10"
            placeholder="Confirm new password"
            required
          />
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm mt-2 p-2 bg-red-50 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="text-green-500 text-sm mt-2 p-2 bg-green-50 rounded">
          {success}
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={() => setCurrentView('menu')}
          className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
            theme === 'dark'
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : theme === 'green'
              ? 'bg-cyan-700 hover:bg-cyan-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
          }`}
          disabled={isLoading}
        >
          Back
        </button>
        <button
          type="submit"
          className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
            isLoading 
              ? 'opacity-50 cursor-not-allowed' 
              : ''
          } bg-blue-500 hover:bg-blue-600 text-white`}
          disabled={isLoading}
        >
          {isLoading ? 'Updating...' : 'Update Password'}
        </button>
      </div>
    </form>
  );

  const renderUserStats = () => {
    if (statsLoading) {
      return <div>Loading stats...</div>;
    }

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-4">Admin Statistics</h3>
        
        <div className={`rounded-lg overflow-hidden border ${
          theme === 'dark' 
            ? 'border-gray-700' 
            : theme === 'green'
            ? 'border-cyan-700'
            : 'border-gray-200'
        }`}>
          <table className="w-full">
            <tbody>
              <tr className={`${
                theme === 'dark'
                  ? 'bg-gray-700'
                  : theme === 'green'
                  ? 'bg-cyan-700'
                  : 'bg-gray-100'
              }`}>
                <td className="px-4 py-2 font-medium">Total Tasks</td>
                <td className="px-4 py-2 text-right">{stats?.totalTasks || 0}</td>
              </tr>
              <tr className={`${
                theme === 'dark'
                  ? 'bg-gray-800'
                  : theme === 'green'
                  ? 'bg-cyan-800'
                  : 'bg-white'
              }`}>
                <td className="px-4 py-2 font-medium">Active Tasks</td>
                <td className="px-4 py-2 text-right">{stats?.activeTasks || 0}</td>
              </tr>
              <tr className={`${
                theme === 'dark'
                  ? 'bg-gray-700'
                  : theme === 'green'
                  ? 'bg-cyan-700'
                  : 'bg-gray-100'
              }`}>
                <td className="px-4 py-2 font-medium">Completed Tasks</td>
                <td className="px-4 py-2 text-right">{stats?.completedTasks || 0}</td>
              </tr>
              <tr className={`${
                theme === 'dark'
                  ? 'bg-gray-800'
                  : theme === 'green'
                  ? 'bg-cyan-800'
                  : 'bg-white'
              }`}>
                <td className="px-4 py-2 font-medium">Late Tasks</td>
                <td className="px-4 py-2 text-right">{stats?.lateTasks || 0}</td>
              </tr>
              <tr className={`${
                theme === 'dark'
                  ? 'bg-gray-700'
                  : theme === 'green'
                  ? 'bg-cyan-700'
                  : 'bg-gray-100'
              }`}>
                <td className="px-4 py-2 font-medium">Perfect Rating (5⭐)</td>
                <td className="px-4 py-2 text-right">{stats?.perfectTasks || 0}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <button
          onClick={() => setCurrentView('menu')}
          className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
            theme === 'dark'
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : theme === 'green'
              ? 'bg-cyan-700 hover:bg-cyan-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
          }`}
        >
          Back
        </button>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`rounded-lg p-4 shadow-xl w-96 ${
        theme === 'dark'
          ? 'bg-gray-800 text-white'
          : theme === 'green'
          ? 'bg-cyan-800 text-white'
          : 'bg-white text-black'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold">Admin Settings</h2>
            {currentView !== 'menu' && (
              <span className={`ml-2 px-3 py-1 text-sm rounded-full ${
                theme === 'dark' ? 'bg-gray-700 text-gray-300' :
                theme === 'green' ? 'bg-cyan-700 text-cyan-100' :
                'bg-gray-200 text-gray-600'
              }`}>
                {currentView === 'changePassword' ? 'Change Password' : 
                 currentView === 'userStats' ? 'Admin Stats' : 'Menu'}
              </span>
            )}
          </div>
          <button 
            onClick={onClose} 
            className={`p-2 rounded-full hover:bg-opacity-80 transition-colors ${
              theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' :
              theme === 'green' ? 'hover:bg-cyan-700 text-gray-300' :
              'hover:bg-gray-200 text-gray-500'
            }`}
            disabled={isLoading}
          >
            ✕
          </button>
        </div>

        {currentView === 'menu' && renderMenu()}
        {currentView === 'changePassword' && renderPasswordForm()}
        {currentView === 'userStats' && renderUserStats()}
      </div>
    </div>
  );
};

export default AdminSettingsModal;