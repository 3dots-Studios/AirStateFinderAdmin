import React, { useState } from 'react';
import background from '../assets/background.svg';
import logo from '../assets/logo.svg';
import { Divider, GoogleAuth } from '../component';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, EmailAuthProvider, linkWithCredential, sendPasswordResetEmail } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../Context/AuthContext';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useUser();
  // Function to generate a random password (for Google sign-up)
  const generateRandomPassword = (length = 12) => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  // Handle Google Sign-Up and automatically link with Email/Password
  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      // Sign in with Google
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user.email) {
        throw new Error("Email is missing from Google account");
      }

      // Generate a random password
      const randomPassword = generateRandomPassword();

      // Create an email credential with the user's Google email and generated password
      const credential = EmailAuthProvider.credential(user.email, randomPassword);

      // Link Google account with Email/Password credentials
      await linkWithCredential(user, credential);

      // Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: user.displayName || "Anonymous",
        email: user.email,
        createdAt: new Date(),
        provider: "google"
      });

      // Optional: Send a password reset email for the user to set their own password
      await sendPasswordResetEmail(auth, user.email);
      // Store user data in global state and localStorage
      login({ uid: user.uid, email: user.email, name });
      toast.success('Google account linked successfully! Check your email to set a password.');
      navigate('/home')
    } catch (error) {
      console.error("Error with Google Sign-Up:", error);
      toast.error('Error signing up with Google. Please try again.');
    }
  };


  // Handle Email/Password Sign-Up
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error('Please enter your Full name');
      return;
    }
    if (!email) {
      toast.error('Please enter your Email.');
      return;
    }
    if (!password) {
      toast.error('Please enter your Password.');
      return;
    }

    try {
      // Create the user with Email/Password
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      // Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: user.email,
        createdAt: new Date(),
        provider: "email"
      });

      toast.success('Account created successfully!');
      console.log('User signed up with Email/Password:', user);

      // Store user data in global state and localStorage
      login({ uid: user.uid, email, name });

      navigate('/home')
    } catch (error) {
      console.error("Error with Email/Password Sign-Up:", error);
      toast.error('Error signing up with Email/Password. Please try again.');
    }
  };

  return (
    <div className=" h-[100vh] flex justify-center items-center md:flex-row md:justify-around md:p-12 md:px-16">
      <img className='md:block hidden h-[95%] w-[45%]' src={background} alt="" />
      <div className=' flex flex-col items-center justify-center h-[99%] w-[95%] md:w-[40%]'>
        <img className='w-48' src={logo} alt="" />
        <h1 className='font-semibold text-xl '>Register for our services</h1>
        <small className='text-center md:text-xs opacity-50'>Sign up to access a suite of professional real estate solutions</small>

        {/* Google Sign-Up Button */}
        <GoogleAuth type='signUp' onClick={handleGoogleSignUp} />
        <Divider />

        {/* Sign-Up Form for Email/Password */}
        <form onSubmit={handleEmailSignUp} className=' w-[95%] md:w-[85%] flex flex-col h-[60%]'>
          <label htmlFor="" className='text-sm'>Full Name</label>
          <input
            placeholder='Enter your full name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='p-3 rounded-md outline-[#AE1729] border border-gray-400'
            type="text"
          />
          <label htmlFor="" className='text-sm mt-3'>Email</label>
          <input
            placeholder='Enter your email address'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='p-3 rounded-md outline-[#AE1729] border border-gray-400'
            type="email"
          />
          <label htmlFor="" className='text-sm mt-3'>Password</label>
          <input
            placeholder='Enter your password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='p-3 rounded-md outline-[#AE1729] border border-gray-400'
            type="password"
          />
          <button className='p-3 bg-[#AE1729] rounded-sm text-white mt-5'>Create account</button>
        </form>

        {/* Navigation to Login */}
        <NavLink to='/login'>
          <h3 className='text-sm font-medium mt-3'>Already have an account? <span className='text-[#AE1729]'>Sign In</span></h3>
        </NavLink>
      </div>
    </div>
  );
}
