import { Button } from "@/components/ui/button";
import { LucideIcon, PackageOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface EmptyStateProps {
    icon?: LucideIcon;
    title?: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
}

export function EmptyState({
    icon: Icon = PackageOpen,
    title = "No items found",
    description = "There are no items to display at this time.",
    actionLabel,
    onAction,
    className,
}: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "flex flex-col items-center justify-center min-h-[400px] p-8 text-center border-2 border-dashed border-muted rounded-3xl bg-muted/5",
                className
            )}
        >
            <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-muted">
                <Icon className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold tracking-tight mb-2">{title}</h3>
            <p className="text-muted-foreground max-w-sm mb-8 text-sm leading-relaxed">
                {description}
            </p>
            {actionLabel && onAction && (
                <Button onClick={onAction} size="lg" className="rounded-full font-bold tracking-wide">
                    {actionLabel}
                </Button>
            )}
        </motion.div>
    );
}
