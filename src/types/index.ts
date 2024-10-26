import { ReactNode } from "react";
export type GoogleAuthProps = {
    type: "signIn" | "signUp";
    onClick: () => void;
};

export type NavLinkItem = {
    to: string;
    icon: React.ReactNode;
    label: string;
};

export type NavItemProps = {
    to: string;
    icon: React.ReactNode;
    label: string;
    isDisabled: boolean;
    onClick: () => void;
};
export interface DefaultLayoutProps {
    children: ReactNode;
}

export interface ProtectedRouteProps {
    children: JSX.Element;
}

export interface RedirectIfAuthenticatedProps {
    children: JSX.Element;
}

export interface User {
    uid: string;
    email: string;
    name: string;
}

export interface UserContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    isAuthenticated: boolean
}

export interface ServiceList {
    id:string,
    isAvailable: boolean,
    price: number,
    service_name: string
}