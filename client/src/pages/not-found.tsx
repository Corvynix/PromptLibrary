import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black overflow-hidden relative">

            {/* Background Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
                <h1
                    className="text-[25vw] font-black font-display text-transparent whitespace-nowrap select-none"
                    style={{ WebkitTextStroke: "2px var(--foreground)", opacity: 0.05 }}
                >
                    404
                </h1>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 flex flex-col items-center text-center space-y-8 p-6"
            >
                <div className="w-32 h-32 border-4 border-white flex items-center justify-center mb-4">
                    <span className="text-6xl font-black tracking-tighter">404</span>
                </div>

                <div className="space-y-2">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">
                        PAGE NOT FOUND
                    </h2>
                    <p className="text-sm md:text-base text-muted-foreground font-mono tracking-wider max-w-md mx-auto">
                        THE SYSTEM COULD NOT LOCATE THE REQUESTED RESOURCE. PLEASE VERIFY YOUR COORDINATES.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/">
                        <Button className="h-14 px-8 text-lg border-2 border-white bg-transparent text-white hover:bg-white hover:text-black transition-all font-black tracking-widest flex items-center gap-2">
                            <Home className="w-5 h-5" />
                            RETURN HOME
                        </Button>
                    </Link>

                    <Link href="/feed">
                        <Button className="h-14 px-8 text-lg border-2 border-white bg-transparent text-white hover:bg-white hover:text-black transition-all font-black tracking-widest flex items-center gap-2">
                            <Search className="w-5 h-5" />
                            EXPLORE
                        </Button>
                    </Link>
                </div>
            </motion.div>

            {/* Corner Accents */}
            <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-white/20" />
            <div className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4 border-white/20" />
            <div className="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4 border-white/20" />
            <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-white/20" />
        </div>
    );
}