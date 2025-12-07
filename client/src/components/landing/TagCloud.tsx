import { motion } from "framer-motion";
import { Tag } from "lucide-react";

const POPULAR_TAGS = [
    { name: "Midjourney", icon: "⛵" },
    { name: "GPT-4", icon: "🧠" },
    { name: "Claude", icon: "🎭" },
    { name: "Arabic", icon: "🇸🇦" },
    { name: "SEO", icon: "🔍" },
    { name: "Real Estate", icon: "🏠" },
    { name: "Marketing", icon: "📢" },
    { name: "Coding", icon: "💻" },
    { name: "Design", icon: "🎨" },
    { name: "Sales", icon: "💼" },
    { name: "Islamic Studies", icon: "🕌" },
    { name: "Education", icon: "🎓" },
    { name: "Legal", icon: "⚖️" },
    { name: "Medical", icon: "⚕️" },
    { name: "Video", icon: "🎥" },
    { name: "3D", icon: "🧊" },
    { name: "Automation", icon: "🤖" },
    { name: "Data Science", icon: "📊" },
    { name: "Copywriting", icon: "✍️" },
    { name: "Agents", icon: "🕵️" }
];

export function TagCloud() {
    return (
        <div className="py-12 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-2 mb-6">
                    <Tag className="w-5 h-5" />
                    <h2 className="text-xl font-black tracking-widest uppercase">POPULAR TAGS</h2>
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                    {POPULAR_TAGS.map((tag, idx) => (
                        <motion.a
                            key={tag.name}
                            href={`/tags/${tag.name.toLowerCase().replace(/\s+/g, '-')}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            whileHover={{ scale: 1.05 }}
                            className="px-4 py-2 border-2 border-border bg-card hover:border-blue-400 hover:bg-blue-400/10 transition-all text-xs font-bold tracking-wider uppercase cursor-pointer rounded-full flex items-center gap-2"
                        >
                            <span>{tag.icon}</span>
                            {tag.name}
                        </motion.a>
                    ))}
                </div>
            </div>
        </div>
    );
}
