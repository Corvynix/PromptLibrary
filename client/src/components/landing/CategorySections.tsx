import { PromptCard, Prompt } from "@/components/PromptCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface CategorySectionProps {
    title: string;
    description?: string;
    prompts: Prompt[];
    color?: string;
}

export function CategorySection({ title, description, prompts, color = "blue" }: CategorySectionProps) {
    const { t } = useTranslation();
    return (
        <section className="py-12 border-t border-white/5">
            <div className="flex items-end justify-between mb-8 px-4 md:px-0">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3">
                        <span className={`w-2 h-8 rounded-full bg-${color}-500`} />
                        {title}
                    </h2>
                    {description && (
                        <p className="text-muted-foreground mt-2 max-w-2xl">
                            {description}
                        </p>
                    )}
                </div>
                <Button variant="ghost" className="hidden md:flex gap-2 hover:bg-white/5">
                    {t('common.viewAll')} <ArrowRight className="w-4 h-4" />
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 md:px-0">
                {prompts.slice(0, 4).map((prompt, index) => (
                    <motion.div
                        key={prompt.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <PromptCard prompt={prompt} className="h-full" />
                    </motion.div>
                ))}
            </div>

            <div className="mt-6 md:hidden px-4">
                <Button variant="outline" className="w-full gap-2 border-white/10 bg-white/5">
                    {t('common.viewAll')} {title} <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
        </section>
    );
}

// Mock Data Helper for Preview
export const MOCK_CATEGORIES = [
    {
        title: "Real Estate & Property",
        description: "High-converting scripts, listing descriptions, and lead gen workflows.",
        color: "emerald"
    },
    {
        title: "Islamic Content Engine",
        description: "Respectful, accurate, and creative prompts for Islamic content creation.",
        color: "amber"
    },
    {
        title: "Viral Marketing Hooks",
        description: "Stop the scroll with these psychology-backed hook generators.",
        color: "rose"
    },
    {
        title: "SaaS Growth Systems",
        description: "Complete workflows for onboarding, retention, and churn reduction.",
        color: "blue"
    }
];
