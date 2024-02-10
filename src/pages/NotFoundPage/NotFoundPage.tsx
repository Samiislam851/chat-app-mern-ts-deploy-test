
import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-purple-900">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-xl text-white mb-8">Oops! Page not found.</p>
        <button
          className="transition-all ease-in-out duration-500 hover:scale-110 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg"
          onClick={() => window.history.back()}
        >
       <FaArrowLeft className='inline'/>   Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;