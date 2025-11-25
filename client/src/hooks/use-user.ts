import { useState, useEffect } from "react";
import { useLocation } from "wouter";

// Mock user type
export interface User {
    id: number;
    username: string;
    email: string;
    avatarUrl?: string;
    roles: string[];
}

export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [, setLocation] = useLocation();

    useEffect(() => {
        // Check for existing session
        const checkSession = async () => {
            try {
                const res = await fetch("/api/user");
                if (res.ok) {
                    const userData = await res.json();
                    setUser(userData);
                }
            } catch (error) {
                console.error("Session check failed", error);
            } finally {
                setIsLoading(false);
            }
        };

        checkSession();
    }, []);

    const logout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            setUser(null);
            setLocation("/auth");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return {
        user,
        isLoading,
        logout,
        setUser // Exposed for login/register to update state
    };
}
