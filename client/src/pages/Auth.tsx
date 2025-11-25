import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { LayoutGrid, ArrowRight, Loader2, Github } from "lucide-react";

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
                variant: "success",
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
        <div className="min-h-screen w-full flex overflow-hidden bg-background">
            {/* Left Side - Cinematic Visuals */}
            <div className="hidden lg:flex w-1/2 relative bg-black items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-50" />
                <div className="absolute inset-0 bg-gradient-to-tr from-violet-900/80 to-indigo-900/80 mix-blend-multiply" />

                <div className="relative z-10 max-w-xl px-12 text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center mb-8 border border-white/20 shadow-2xl">
                            <LayoutGrid className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-5xl font-display font-bold mb-6 leading-tight">
                            Master the Art of <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Prompt Engineering</span>
                        </h1>
                        <p className="text-lg text-white/70 leading-relaxed mb-8">
                            Join the world's most advanced community of prompt engineers. Discover, remix, and deploy production-ready prompts in seconds.
                        </p>

                        <div className="flex gap-4">
                            <div className="flex -space-x-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-gray-800" />
                                ))}
                            </div>
                            <div className="flex flex-col justify-center">
                                <span className="font-bold">10k+ Creators</span>
                                <span className="text-xs text-white/50">Joined this week</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Auth Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-100/40 via-transparent to-transparent dark:from-violet-900/20 pointer-events-none" />

                <Card className="w-full max-w-md border-0 shadow-none bg-transparent">
                    <CardHeader className="space-y-1 px-0">
                        <CardTitle className="text-3xl font-display font-bold tracking-tight">
                            {isLogin ? "Welcome back" : "Create an account"}
                        </CardTitle>
                        <CardDescription className="text-base">
                            {isLogin
                                ? "Enter your credentials to access your workspace."
                                : "Enter your email below to create your account."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {!isLogin && (
                                <div className="space-y-2">
                                    <Input
                                        placeholder="Username"
                                        {...form.register("username")}
                                        className="h-11 bg-muted/30 border-muted-foreground/20 focus:bg-background transition-all"
                                    />
                                    {form.formState.errors.username && (
                                        <p className="text-sm text-destructive">{form.formState.errors.username.message}</p>
                                    )}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Input
                                    placeholder="name@example.com"
                                    type="email"
                                    {...form.register("email")}
                                    className="h-11 bg-muted/30 border-muted-foreground/20 focus:bg-background transition-all"
                                />
                                {form.formState.errors.email && (
                                    <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Input
                                    placeholder="Password"
                                    type="password"
                                    {...form.register("password")}
                                    className="h-11 bg-muted/30 border-muted-foreground/20 focus:bg-background transition-all"
                                />
                                {form.formState.errors.password && (
                                    <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-indigo-500/20 transition-all duration-300"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <>
                                        {isLogin ? "Sign In" : "Create Account"}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-muted-foreground/20" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline" className="h-11 hover:bg-muted/50 transition-colors">
                                <Github className="mr-2 h-4 w-4" />
                                Github
                            </Button>
                            <Button variant="outline" className="h-11 hover:bg-muted/50 transition-colors">
                                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                Google
                            </Button>
                        </div>
                    </CardContent>
                    <CardFooter className="px-0 justify-center">
                        <p className="text-sm text-muted-foreground">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-primary hover:underline font-medium transition-all"
                            >
                                {isLogin ? "Sign up" : "Sign in"}
                            </button>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
