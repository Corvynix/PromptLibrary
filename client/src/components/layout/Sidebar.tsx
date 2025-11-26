import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Home,
    Search,
    PlusSquare,
    Heart,
    User,
    LogOut,
    Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { useUser } from "@/hooks/use-user";

interface SidebarProps {
    className?: string;
}

export function Sidebar({ className }: SidebarProps) {
    const [location] = useLocation();
    const { user, logout } = useUser();

    const navItems = [
        { icon: Home, label: "HOME", href: "/" },
        { icon: Search, label: "EXPLORE", href: "/feed" },
        { icon: Zap, label: "TRENDING", href: "/trending" },
        { icon: PlusSquare, label: "CREATE", href: "/create" },
        { icon: Heart, label: "SAVED", href: "/saved" },
        { icon: User, label: "PROFILE", href: `/profile/${user?.username}` },
    ];

    return (
        <motion.div
            className={cn(
                "relative flex flex-col h-screen border-r-2 border-white/10 bg-black z-40 hidden md:flex w-64",
                className
            )}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Logo Area */}
            <div className="flex items-center h-16 px-6 border-b-2 border-white/10">
                <Link href="/">
                    <a className="flex items-center gap-2 group">
                        <span className="font-display font-black text-xl tracking-tighter uppercase">
                            PROMPTLIB
                        </span>
                    </a>
                </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
                {navItems.map((item) => {
                    const isActive = location === item.href;
                    return (
                        <Link key={item.href} href={item.href}>
                            <a
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 border-2 transition-all duration-200 group relative",
                                    isActive
                                        ? "border-blue-400 bg-blue-400/10 text-blue-400"
                                        : "border-white/20 text-muted-foreground hover:border-white hover:text-white"
                                )}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="text-sm font-bold tracking-wider">{item.label}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute left-0 w-1 h-8 bg-blue-400"
                                    />
                                )}
                            </a>
                        </Link>
                    );
                })}
            </div>

            {/* User Area */}
            <div className="p-4 border-t-2 border-white/10">
                {user ? (
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 border-2 border-white/40 bg-black flex items-center justify-center">
                                <span className="font-black text-xs">
                                    {user.username.substring(0, 2).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold truncate">@{user.username}</p>
                                <p className="text-xs text-muted-foreground font-mono">PRO</p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full border-2 border-white/20 hover:border-white hover:bg-white hover:text-black font-bold tracking-wider text-xs"
                            onClick={() => logout()}
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            LOGOUT
                        </Button>
                    </div>
                ) : (
                    <Link href="/auth">
                        <Button className="w-full bg-white text-black hover:bg-white/90 font-bold tracking-widest">
                            SIGN IN
                        </Button>
                    </Link>
                )}
            </div>
        </motion.div>
    );
}
