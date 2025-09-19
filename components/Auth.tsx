
import React from 'react';
// FIX: Populating file with a basic authentication component to resolve parsing errors.
import { GoogleIcon } from './icons/GoogleIcon';
import { MicrosoftIcon } from './icons/MicrosoftIcon';

const Auth: React.FC = () => {
  return (
    <div className="bg-brand-gray-800 p-8 rounded-xl shadow-lg border border-brand-gray-700 max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-brand-gray-100 mb-2 text-center">Welcome to Aapda Mitra</h2>
      <p className="text-brand-gray-400 mb-8 text-center">Sign in to continue</p>
      <div className="space-y-4">
        <button
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition-colors"
        >
          <GoogleIcon />
          Sign in with Google
        </button>
        <button
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition-colors"
        >
          <MicrosoftIcon />
          Sign in with Microsoft
        </button>
      </div>
    </div>
  );
};

export default Auth;
