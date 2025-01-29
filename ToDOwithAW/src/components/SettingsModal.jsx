import React, { useState } from 'react';

const SettingsModal = ({ isOpen, onClose, onLogout, onPasswordUpdate, theme }) => {
  const [currentView, setCurrentView] = useState('menu');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      await onPasswordUpdate(currentPassword, newPassword);
      setSuccess('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsLoading(false);
      
      setTimeout(() => {
        setSuccess('');
        setCurrentView('menu');
      }, 2000);
      
    } catch (error) {
      setError(error.message || 'Failed to update password');
      setIsLoading(false);
    }
  };

  const getModalClass = () => {
    switch (theme) {
      case 'dark':
        return 'bg-gray-800 text-white';
      case 'green':
        return 'bg-cyan-800 text-white';
      default:
        return 'bg-white text-black';
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
          1
        </span>
        <span className="font-medium">Change Password</span>
      </button>

      <button
        onClick={() => setCurrentView('userStats')}
        className={`w-full px-4 py-3 text-left rounded-lg ${
          theme === 'dark' 
            ? 'bg-gray-700 hover:bg-gray-600 text-white' 
            : theme === 'green'
            ? 'bg-cyan-700 hover:bg-cyan-600 text-white'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
        } transition-colors duration-200 flex items-center`}
      >
        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-500 text-white mr-3">
          2
        </span>
        <span className="font-medium">User Stats</span>
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
          3
        </span>
        <span className="font-medium">Log Out</span>
      </button>
    </div>
  );

  const renderPasswordForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1">Current Password</label>
        <div className="relative">
          <input
            type={showCurrentPassword ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-2 border rounded text-black pr-10"
            placeholder="Enter current password"
            required
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showCurrentPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
      </div>

      <div>
        <label className="block mb-1">New Password</label>
        <div className="relative">
          <input
            type={showNewPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border rounded text-black pr-10"
            placeholder="Enter new password"
            required
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showNewPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
      </div>

      <div>
        <label className="block mb-1">Confirm New Password</label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border rounded text-black pr-10"
            placeholder="Confirm new password"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
          </button>
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

  const renderUserStats = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">User Stats</h3>
      <p>Coming soon...</p>
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`rounded-lg p-6 shadow-xl w-96 ${getModalClass()}`}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <h2 className={`text-xl font-semibold ${
              theme === 'dark' ? 'text-white' : 
              theme === 'green' ? 'text-white' : 
              'text-gray-800'
            }`}>
              Settings
            </h2>
            {currentView !== 'menu' && (
              <span className={`ml-2 px-3 py-1 text-sm rounded-full ${
                theme === 'dark' ? 'bg-gray-700 text-gray-300' :
                theme === 'green' ? 'bg-cyan-700 text-cyan-100' :
                'bg-gray-200 text-gray-600'
              }`}>
                {currentView === 'changePassword' ? 'Change Password' : 
                 currentView === 'userStats' ? 'User Stats' : 'Menu'}
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

export default SettingsModal;