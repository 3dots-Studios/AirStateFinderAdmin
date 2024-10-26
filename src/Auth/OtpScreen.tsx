import background from '../assets/top-background.png';
import { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function OtpScreen() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const handleChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to the next input if the value is entered and it's not the last input
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleConfirm = () => {
    const filledOtp = otp.join('');
    if (filledOtp.length < 4) {
      toast.error('Please enter the complete OTP.');
      return;
    }
    console.log('OTP Confirmed:', filledOtp);
    navigate('/resetpassword')
    // Add logic to handle OTP submission (e.g., API call)
  };

  const handleResendOtp = () => {
    // Logic to resend OTP (e.g., API call)
    toast.success('OTP has been resent.');
  };

  return (
    <div className="flex flex-col items-center r h-[100vh]">
        <img className="h-44 w-full absolute md:block hidden" src={background} alt="" />
      <div className="bg-[#AE1729] z-10 h-20 w-[100%] mb-[10%] md:mb-[5%] md:w-[65%] md:mt-[10%] flex flex-row items-center justify-between px-12">
        <h1 className="text-white text-xl">Forgot Password</h1>
        <h5 className="text-white">AirState</h5>
      </div>
      <h1 className="text-2xl font-semibold">Enter One-Time Code</h1>
      <p className="text-sm text-gray-500 mt-2">Please enter the 4 digit - code sent to your email</p>

      <div className="flex justify-center gap-4 mt-6">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            maxLength={1}
            className="w-12 h-12 text-center text-xl border border-gray-400 rounded-md"
            type="text"
          />
        ))}
      </div>

      <button
        onClick={handleConfirm}
        className="mt-6 p-3 bg-[#AE1729] text-white rounded-md w-52"
      >
        Confirm OTP
      </button>

      <button
        onClick={handleResendOtp}
        className="mt-3 text-[#AE1729] underline rounded-md w-52"
      >
        Resend OTP
      </button>
    </div>
  );
}
