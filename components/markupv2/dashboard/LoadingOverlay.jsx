// LoadingOverlay.js
import React from 'react';

function LoadingOverlay({IsLoading}) {
  if (IsLoading === false){
    return
  } 
  
  return (
    <div className="h-full w-full bg-black absolute">
      <div className="spinner"></div>
    </div>
  );
}

export default LoadingOverlay;
