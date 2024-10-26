import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import background from '../assets/top-background.png';
import { toast } from 'react-hot-toast';
import check from '../assets/check-svg.svg'

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input fields
    if (!email) {
      toast.error('Please Enter Your Email.');
      return;
    }

    // Show success modal
    setIsModalOpen(true);

    // Simulate an API call and modal display for a brief time
    setTimeout(() => {
      setIsModalOpen(false);
      navigate('/otp'); // Navigate to the OTP page after modal closes
    }, 2000); // Adjust the time as needed
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
          Please enter your email to receive a code for your password reset
        </small>

        <form onSubmit={handleSendCode} className="h-[70%] mt-[5%] flex flex-col">
          <label htmlFor="email">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-4 border border-gray-400 rounded-md outline-[#AE1729]"
            placeholder="Enter your Email"
            type="email"
          />
          <button className="self-end p-4 bg-[#AE1729] rounded-md mt-6 text-white w-52">
            Confirm
          </button>
        </form>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-md flex flex-col justify-center items-center shadow-lg h-[50%] md:w-[50%] w-[95%]">
            <img src={check} alt="" />
            <h2 className="text-xl font-semibold">Recovery Code Sent</h2>
            <p className="text-sm text-gray-600 mt-2 text-center">
              A one time OTP Code has been sent to the email <span className='font-medium'>{email}</span> 
            </p>
            <p className="text-sm text-gray-600 mt-2 text-center">
              you will be redirected to the OTP page soon 
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
