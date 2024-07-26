import React from 'react';

const HomePage = () => {
  return (
    <div className="h-screen bg-cover bg-center" style={{ backgroundImage: 'url(https://img.freepik.com/free-photo/weathered-blue-page_53876-88602.jpg?w=740&t=st=1718525001~exp=1718525601~hmac=8145c414efbf244a0399bac462046e6e42aa86efca3bfa86f06cd07294da1b69' }}>
      <div className="flex items-center justify-center h-full bg-gray-900 bg-opacity-50">
        <h1 className="text-white text-5xl">Welcome to the Home Page</h1>
      </div>
    </div>
  );
};

export default HomePage;
