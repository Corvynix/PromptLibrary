import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Home,
    Search,
    PlusSquare,
    Heart,
    User,
    Settings,
    LogOut,
    Menu,
    X,
    Zap,
    LayoutGrid
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/hooks/use-user";

interface SidebarProps {
    className?: string;
}

export function Sidebar({ className }: SidebarProps) {
    const [location] = useLocation();
    const { user, logout } = useUser();
    const [collapsed, setCollapsed] = useState(false);

    const navItems = [
        { icon: Home, label: "Home", href: "/" },
        { icon: Search, label: "Explore", href: "/explore" },
        { icon: Zap, label: "Workflows", href: "/workflows" },
        { icon: PlusSquare, label: "Create", href: "/create" },
        { icon: Heart, label: "Activity", href: "/activity" },
        { icon: User, label: "Profile", href: `/profile/${user?.username}` },
    ];

    return (
        <motion.div
            className={cn(
                "relative flex flex-col h-screen border-r bg-card/50 backdrop-blur-xl z-40 hidden md:flex transition-all duration-300",
                collapsed ? "w-20" : "w-64",
                className
            )}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "circOut" }}
        >
            {/* Logo Area */}
            <div className="flex items-center h-16 px-6 border-b border-border/40">
                <Link href="/">
                    <a className="flex items-center gap-2 group">
                        <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform duration-300">
                            <LayoutGrid className="w-5 h-5 text-white" />
                        </div>
                        {!collapsed && (
                            <span className="font-display font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                                PromptLib
                            </span>
                        )}
                    </a>
                </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
                {navItems.map((item) => {
                    const isActive = location === item.href;
                    return (
                        <Link key={item.href} href={item.href}>
                            <a
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                    isActive
                                        ? "bg-primary/10 text-primary font-medium"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        "w-5 h-5 transition-colors",
                                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                    )}
                                />
                                {!collapsed && <span>{item.label}</span>}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    />
                                )}
                            </a>
                        </Link>
                    );
                })}
            </div>

            {/* User Area */}
            <div className="p-4 border-t border-border/40">
                {user ? (
                    <div className={cn("flex items-center gap-3", collapsed ? "justify-center" : "")}>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 p-[2px]">
                            <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                                {/* Avatar Image would go here */}
                                <span className="font-bold text-xs">{user.username.substring(0, 2).toUpperCase()}</span>
                            </div>
                        </div>
                        {!collapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{user.username}</p>
                                <p className="text-xs text-muted-foreground truncate">Pro Member</p>
                            </div>
                        )}
                        {!collapsed && (
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => logout()}>
                                <LogOut className="w-4 h-4 text-muted-foreground" />
                            </Button>
                        )}
                    </div>
                ) : (
                    !collapsed && (
                        <Link href="/auth">
                            <Button className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all">
                                Sign In
                            </Button>
                        </Link>
                    )
                )}
            </div>
        </motion.div>
    );
}
