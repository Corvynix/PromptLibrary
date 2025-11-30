import { Button } from "@/components/ui/button";
import { AlertTriangle, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ErrorStateProps {
    icon?: LucideIcon;
    title?: string;
    description?: string;
    retryLabel?: string;
    onRetry?: () => void;
    className?: string;
}

export function ErrorState({
    icon: Icon = AlertTriangle,
    title = "Something went wrong",
    description = "We encountered an error while loading this content.",
    retryLabel = "Try Again",
    onRetry,
    className,
}: ErrorStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
                "flex flex-col items-center justify-center min-h-[400px] p-8 text-center rounded-3xl bg-red-500/5 border-2 border-red-500/10",
                className
            )}
        >
            <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-red-500/10 text-red-500">
                <Icon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold tracking-tight mb-2 text-red-500">{title}</h3>
            <p className="text-muted-foreground max-w-sm mb-8 text-sm leading-relaxed">
                {description}
            </p>
            {onRetry && (
                <Button
                    onClick={onRetry}
                    variant="outline"
                    className="border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-600 hover:border-red-500/30"
                >
                    {retryLabel}
                </Button>
            )}
        </motion.div>
    );
}
