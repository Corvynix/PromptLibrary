import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { Loader2, ArrowRight } from "lucide-react";

const authSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    username: z.string().optional(),
});

type AuthFormData = z.infer<typeof authSchema>;

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const [, setLocation] = useLocation();
    const { setUser } = useUser();

    const form = useForm<AuthFormData>({
        resolver: zodResolver(authSchema),
        defaultValues: {
            email: "",
            password: "",
            username: "",
        },
    });

    const onSubmit = async (data: AuthFormData) => {
        setIsLoading(true);
        try {
            const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || "Authentication failed");
            }

            setUser(result.user);
            toast({
                title: isLogin ? "Welcome back!" : "Account created!",
                description: isLogin ? "It's great to see you again." : "Welcome to the future of prompting.",
            });
            setLocation("/");
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-black p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-2">
                        PROMPTLIBRARY
                    </h1>
                    <p className="text-sm text-muted-foreground font-mono tracking-widest">
                        THE WORLD'S PROMPT LIBRARY
                    </p>
                </motion.div>

                {/* Form Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="border-2 border-white bg-black p-8"
                >
                    <div className="mb-6">
                        <h2 className="text-2xl font-black tracking-tight uppercase mb-2">
                            {isLogin ? "SIGN IN" : "CREATE ACCOUNT"}
                        </h2>
                        <p className="text-xs text-muted-foreground font-mono tracking-wide">
                            {isLogin
                                ? "ENTER YOUR CREDENTIALS TO CONTINUE"
                                : "JOIN THE COMMUNITY OF PROMPT ENGINEERS"}
                        </p>
                    </div>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {!isLogin && (
                            <div className="space-y-2">
                                <Input
                                    placeholder="USERNAME"
                                    {...form.register("username")}
                                    className="h-12 bg-black border-2 border-white/20 focus:border-blue-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.3)] text-white placeholder:text-muted-foreground font-mono"
                                />
                                {form.formState.errors.username && (
                                    <p className="text-xs text-red-400 font-mono">{form.formState.errors.username.message}</p>
                                )}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Input
                                placeholder="EMAIL"
                                type="email"
                                {...form.register("email")}
                                className="h-12 bg-black border-2 border-white/20 focus:border-blue-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.3)] text-white placeholder:text-muted-foreground font-mono"
                            />
                            {form.formState.errors.email && (
                                <p className="text-xs text-red-400 font-mono">{form.formState.errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Input
                                placeholder="PASSWORD"
                                type="password"
                                {...form.register("password")}
                                className="h-12 bg-black border-2 border-white/20 focus:border-blue-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.3)] text-white placeholder:text-muted-foreground font-mono"
                            />
                            {form.formState.errors.password && (
                                <p className="text-xs text-red-400 font-mono">{form.formState.errors.password.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 bg-white text-black hover:bg-white/90 font-bold tracking-widest uppercase flex items-center justify-center gap-2"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    {isLogin ? "SIGN IN" : "CREATE ACCOUNT"}
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-muted-foreground font-mono">
                            {isLogin ? "DON'T HAVE AN ACCOUNT? " : "ALREADY HAVE AN ACCOUNT? "}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-blue-400 hover:text-blue-300 font-bold transition-colors"
                            >
                                {isLogin ? "SIGN UP" : "SIGN IN"}
                            </button>
                        </p>
                    </div>
                </motion.div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-center mt-8 text-xs text-muted-foreground font-mono"
                >
                    BY CONTINUING, YOU AGREE TO OUR{" "}
                    <a href="/terms" className="text-white hover:text-blue-400 transition-colors">
                        TERMS
                    </a>
                    {" & "}
                    <a href="/privacy" className="text-white hover:text-blue-400 transition-colors">
                        PRIVACY
                    </a>
                </motion.div>
            </div>
        </div>
    );
}
