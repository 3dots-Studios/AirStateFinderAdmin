import React, { useState } from 'react';
import background from '../assets/background.svg';
import logo from '../assets/logo.svg';
import { Divider, GoogleAuth } from '../component';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth,db } from '../firebase/config';
import { useUser } from '../Context/AuthContext';
import { doc, getDoc } from "firebase/firestore";
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name,setName] = useState('');
  const navigate = useNavigate(); // Navigation after login
  const { login } = useUser();

  // Handler for Email/Password login
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input fields
    if (!email) {
      toast.error('Please enter your Email.');
      return;
    }

    if (!password) {
      toast.error('Please enter your Password.');
      return;
    }

    try {
      // Firebase authentication with Email/Password
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      toast.success('Logged in successfully!');
      console.log('Signed in user:', user);

      const getUsername = async (uid:string) =>{
        try {
          const userDoc = await getDoc(doc(db, "users", uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const userObj = {
              uid: userData.uid,
              email: userData.email,
              name: userData.name || "Anonymous", // Ensure `name` is never null
            };
    
            setName(userObj.name)
          } else {
            console.error("No such user!");
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
      getUsername(user.uid)
      // Store user data in global state and localStorage
      login({ uid: user.uid, email,name });

      // Redirect to homepage or dashboard after successful login
      navigate('/home');  // Adjust the path as per your app structure
    } catch (error) {
      console.error('Error signing in:', error);
      toast.error('Invalid email or password. Please try again.');
    }
  };

  // Handler for Google Sign-In
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      // Firebase authentication with Google
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      toast.success('Logged in with Google successfully!');
      console.log('Google signed-in user:', user);
      login({ uid: user.uid, email,name });
      // Redirect to homepage or dashboard after successful login
      navigate('/home');  // Adjust the path as per your app structure
    } catch (error) {
      console.error('Error signing in with Google:', error);
      toast.error('Google sign-in failed. Please try again.');
    }
  };

  return (
    <div className=" h-[100vh] flex justify-center items-center md:flex-row md:justify-around md:p-12 md:px-16">
      <img className='md:block hidden h-[95%] w-[45%]' src={background} alt="" />
      <div className='flex flex-col items-center justify-center h-[99%] w-[95%] md:w-[40%]'>
        <img className='w-48' src={logo} alt="" />
        <h1 className='font-semibold text-xl '>Welcome back, explore solutions</h1>
        <small className='text-center md:text-xs opacity-50'>
          Sign in to access a suite of professional real estate solutions
        </small>

        {/* Google Sign-In */}
        <GoogleAuth type='signIn' onClick={handleGoogleSignIn} />
        <Divider />

        {/* Sign-In Form for Email/Password */}
        <form onSubmit={handleSignIn} className='w-[95%] md:w-[85%] flex flex-col h-[60%]'>
          <label htmlFor="email" className='text-sm mt-3'>Email</label>
          <input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className='p-3 rounded-md outline-[#AE1729] border border-gray-400'
            type="text"
          />

          <label htmlFor="password" className='text-sm mt-6'>Password</label>
          <input
            id="password"
            placeholder='Enter your password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='p-3 rounded-md outline-[#AE1729] border border-gray-400'
            type="password"
          />

          <button className='p-3 bg-[#AE1729] rounded-sm text-white mt-8'>
            Sign In
          </button>

          <NavLink to='/forgotpassword' className='text-right mt-4 hover:underline'>
            Forgot Password?
          </NavLink>
        </form>

        <NavLink to='/'>
          <h3 className='text-sm font-medium mt-3'>
            Don't have an account? <span className='text-[#AE1729]'>Sign Up</span>
          </h3>
        </NavLink>
      </div>
    </div>
  );
}
