import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

export function UploadCTA() {
    return (
        <Link href="/create">
            <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, type: "spring" }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="fixed bottom-8 right-8 w-16 h-16 bg-green-400 text-black rounded-full flex items-center justify-center shadow-2xl z-50 border-4 border-black hover:bg-green-300 transition-colors group"
            >
                <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform" />
                <span className="sr-only">Upload Prompt</span>
            </motion.button>
        </Link>
    );
}
