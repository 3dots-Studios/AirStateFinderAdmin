import React from 'react';
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProps } from '../types';

const GoogleAuth: React.FC<GoogleAuthProps> = ({ type, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center w-[85%] mb:w-[75%] justify-center mt-10 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100"
    >
      <FcGoogle className="mr-2" size={24} />
      {type === "signIn" ? "Sign in with Google" : "Sign up with Google"}
    </button>
  );
};

export default GoogleAuth;
