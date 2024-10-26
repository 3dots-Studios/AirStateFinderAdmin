import React, { useState } from 'react';
import { Drawer, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { NavLink } from "react-router-dom";
import SidePanel from './SidePanel';
import { RiHome6Fill } from "react-icons/ri";
import { AiOutlineDollar } from "react-icons/ai";
import { HiChartSquareBar } from "react-icons/hi";
import { DefaultLayoutProps, NavItemProps } from '../types';
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, } from '../firebase/config';
import { toast } from 'react-hot-toast';
import { useUser } from "../Context/AuthContext";
const navItems = [
    { to: "/home", icon: <RiHome6Fill />, label: "Home" },
    { to: "/history", icon: <AiOutlineDollar />, label: "History" },
    { to: "/profile", icon: <HiChartSquareBar />, label: "Profile" },
];

const NavItem = ({ to, icon, label, isDisabled = false, onClick }: NavItemProps) => (
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

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const { logout } = useUser();
    const toggleDrawer = (open: boolean) => () => {
        setDrawerOpen(open);
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

    return (
        <div className="flex w-full h-screen bg-gray-200">
            <SidePanel />

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Hamburger Menu Button for Mobile */}
                <div className="md:hidden absolute">
                    <IconButton
                        onClick={toggleDrawer(true)}
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        className="absolute top-4 left-4 z-50"
                    >
                        <MenuIcon />
                    </IconButton>
                </div>

                {/* Drawer for Mobile */}
                <Drawer
                    anchor="left"
                    open={isDrawerOpen}
                    onClose={toggleDrawer(false)}
                    classes={{ paper: "w-60" }}
                >
                    <nav className="p-4">
                        <ul className="space-y-2">
                            {navItems.map(({ to, icon, label }) => (
                                <li key={to}>
                                    <NavLink
                                        to={to}
                                        className={({ isActive }) =>
                                            `flex items-center p-2 space-x-3 rounded-md ${isActive ? "bg-blue-100 text-blue-700" : "hover:bg-blue-50"
                                            }`
                                        }
                                        onClick={toggleDrawer(false)}
                                    >
                                        <span className="text-xl">{icon}</span>
                                        <span className="text-sm">{label}</span>
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
                </Drawer>

                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
export default DefaultLayout;