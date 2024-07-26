import React from 'react';

const AboutPage = () => {
  return (
    <div className="h-screen bg-cover bg-center" style={{ backgroundImage: 'url(https://example.com/about-bg.jpg)' }}>
      <div className="flex items-center justify-center h-full bg-gray-900 bg-opacity-50">
        <h1 className="text-white text-5xl">About Us</h1>
      </div>
    </div>
  );
};

export default AboutPage;
