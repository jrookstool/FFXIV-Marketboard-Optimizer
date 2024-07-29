import React from 'react';
import './Loading.css'; // Make sure to create and import your CSS file

const Loading = () => {
  return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

export default Loading;