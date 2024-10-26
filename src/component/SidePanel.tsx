import { useState } from "react";
import { NavLink } from "react-router-dom";
import { RiHome6Fill } from "react-icons/ri";
import { AiOutlineDollar } from "react-icons/ai";
import { HiChartSquareBar } from "react-icons/hi";
import { useNavigate } from 'react-router-dom';
import { auth, } from '../firebase/config';// Firebase auth instance
import { FaSignOutAlt } from "react-icons/fa";
import { signOut } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import { NavLinkItem,NavItemProps } from "../types";
import { useUser } from "../Context/AuthContext";
const navItems: NavLinkItem[] = [
  { to: "/home", icon: <RiHome6Fill />, label: "Home" },
  { to: "/history", icon: <AiOutlineDollar />, label: "History" },
  { to: "/profile", icon: <HiChartSquareBar />, label: "Profile" },
];

export default function SidePanel() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useUser();
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navigate = useNavigate(); // Navigation after logout

  // Handler for sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth); // Firebase sign-out method
      toast.success('Signed out successfully!');
      logout()
      // Redirect to login page after sign-out
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out. Please try again.');
    }
  };

  const NavItem = ({ to, icon, label, isDisabled = false, onClick }:NavItemProps) => (
    <li className="rounded-sm">
      <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) =>
          `flex items-center p-2 space-x-3 rounded-md mx-2 ${isActive && !isDisabled
            ? 'bg-yellow-400 text-black'
            : isDisabled
              ? 'text-gray-400 pointer-events-none'
              : 'hover:bg-gray-200'
          }`
        }
      >
        {icon}
        <h2>{label}</h2>
      </NavLink>
    </li>
  )

  return (
    <div
      className={`hidden md:flex flex-col h-screen bg-white text-black border-r-2 border-gray-300 border-dotted ${isCollapsed ? "w-20" : "w-60"
        } transition-all duration-300`}
    >
      <div className="flex items-center justify-end p-4 cursor-pointer" onClick={toggleSidebar}>
        {/* <MenuIcon /> */}
      </div>
      <nav className="flex-1 mt-4">
        <ul className="space-y-2">
          {navItems.map(({ to, icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center p-2 space-x-3 rounded-md ${isActive ? "bg-[#f7a3ad] text-[#AE1729]" : "hover:bg-[#f7a3ad]"
                  } ${isCollapsed ? "justify-center" : "mx-2"}`
                }
              >
                <span className="text-xl">{icon}</span>
                {!isCollapsed && <span className="text-sm">{label}</span>}
              </NavLink>

            </li>
          ))}
          <div className="mt-auto mb-4">
            <NavItem
              to="/"
              icon={<FaSignOutAlt className='ml-4' />}
              label="Logout"
              onClick={handleSignOut}
              isDisabled={false}
            />
          </div>
        </ul>
      </nav>
    </div>
  )
}
