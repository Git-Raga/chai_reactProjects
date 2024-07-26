import React from 'react';

const PageNotFound = () => {
  return (
    <div className="h-screen bg-cover bg-center font-poppins" style={{ backgroundImage: 'url(https://images.pexels.com/photos/5594361/pexels-photo-5594361.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)' }}>
      <div className="flex items-center justify-center h-full bg-gray-900 bg-opacity-50">
        <h1 className="text-white text-5xl">404 - Page Not Found</h1>
      </div>
    </div>
  );
};

export default PageNotFound;
