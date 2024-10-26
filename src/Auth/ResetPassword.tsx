import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import background from '../assets/top-background.png';
import { toast } from 'react-hot-toast';
import check from '../assets/check-svg.svg';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords
    if (!password) {
      toast.error('Please enter a new password.');
      return;
    }

    if (!confirmPassword) {
      toast.error('Please confirm your password.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error("The passwords don't match.");
      return;
    }

    // Show modal on successful match
    setIsModalOpen(true);

    // Simulate an action (like API call) and then navigate
    setTimeout(() => {
      setIsModalOpen(false);
      navigate('/login');
    }, 2000); // Adjust delay as needed
  };

  return (
    <div className="h-[100vh] flex flex-col items-center">
      <img className="h-44 w-full absolute md:block hidden" src={background} alt="" />
      <div className="bg-[#AE1729] z-10 h-20 w-[100%] md:w-[65%] md:mt-[10%] flex flex-row items-center justify-between px-12">
        <h1 className="text-white text-xl">Forgot Password</h1>
        <h5 className="text-white">AirState</h5>
      </div>

      <div className="md:w-[40%] md:h-[45%] h-[40%] w-[95%] mt-[3%] flex flex-col">
        <h1 className="md:text-lg text-2xl">Password Recovery</h1>
        <small className="text-black opacity-50">
          Please enter and confirm your new password.
        </small>

        <form onSubmit={handleReset} className="h-[70%] mt-[5%] flex flex-col">
          <label htmlFor="password">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-4 border border-gray-400 rounded-md outline-[#AE1729]"
            placeholder="Enter your new password"
            type="password"
            id="password"
          />
          <label className="mt-3" htmlFor="confirmPassword">Confirm Password</label>
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="p-4 border border-gray-400 rounded-md outline-[#AE1729]"
            placeholder="Confirm your password"
            type="password"
            id="confirmPassword"
          />
          <button type="submit" className="self-end p-4 bg-[#AE1729] rounded-md mt-6 text-white w-52">
            Confirm
          </button>
        </form>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-md flex flex-col justify-center items-center shadow-lg h-[50%] md:w-[50%] w-[95%]">
            <img src={check} alt="Success" />
            <h2 className="text-xl font-semibold">Password reset successful</h2>
            <p className="text-sm text-gray-600 mt-2 text-center">
              Your password has been changed. Please log in with your new password.
            </p>
            <button onClick={() => navigate('/login')} className="bg-[#AE1729] p-2 px-4 mt-4 text-white rounded-md">
              Ok
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
