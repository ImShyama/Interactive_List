import React from 'react';

const TestLogin = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <img src="/path-to-your-logo.png" alt="Interact Logo" className="mx-auto h-12" />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Welcome Back!</h1>
          <div className="flex items-center justify-center mb-6">
            <div className="mr-2">
              <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-yellow-500">SECURE</p>
              <p className="text-gray-600">Google Log In</p>
            </div>
          </div>
          <p className="mb-4 text-gray-600">Please Sign In with -</p>
          <button className="flex items-center justify-center w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <img src="/path-to-google-icon.png" alt="Google" className="w-5 h-5 mr-2" />
            Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestLogin;