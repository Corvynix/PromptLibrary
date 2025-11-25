import * as React from "react";
import { Command } from "cmdk";
import { Search, Zap, User, FileText, Plus, Hash } from "lucide-react";
import { useLocation } from "wouter";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function SpotlightSearch() {
    const [open, setOpen] = React.useState(false);
    const [, setLocation] = useLocation();

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = React.useCallback((command: () => void) => {
        setOpen(false);
        command();
    }, []);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="p-0 overflow-hidden max-w-2xl bg-transparent border-0 shadow-2xl">
                <div className="relative bg-background/80 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden">
                    <Command className="bg-transparent">
                        <div className="flex items-center border-b px-4" cmdk-input-wrapper="">
                            <Search className="mr-2 h-5 w-5 shrink-0 opacity-50" />
                            <Command.Input
                                placeholder="Type a command or search..."
                                className="flex h-14 w-full rounded-md bg-transparent py-3 text-lg outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                        <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden py-2 px-2 custom-scrollbar">
                            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                                No results found.
                            </Command.Empty>

                            <Command.Group heading="Suggestions" className="text-xs font-medium text-muted-foreground px-2 py-1.5">
                                <Command.Item
                                    onSelect={() => runCommand(() => setLocation("/create"))}
                                    className="flex items-center px-2 py-2 rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground aria-selected:bg-accent aria-selected:text-accent-foreground transition-colors"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    <span>Create New Prompt</span>
                                    <span className="ml-auto text-xs text-muted-foreground">⌘C</span>
                                </Command.Item>
                                <Command.Item
                                    onSelect={() => runCommand(() => setLocation("/explore"))}
                                    className="flex items-center px-2 py-2 rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground aria-selected:bg-accent aria-selected:text-accent-foreground transition-colors"
                                >
                                    <Search className="mr-2 h-4 w-4" />
                                    <span>Explore Prompts</span>
                                </Command.Item>
                            </Command.Group>

                            <Command.Group heading="Navigation" className="text-xs font-medium text-muted-foreground px-2 py-1.5 mt-2">
                                <Command.Item
                                    onSelect={() => runCommand(() => setLocation("/workflows"))}
                                    className="flex items-center px-2 py-2 rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground aria-selected:bg-accent aria-selected:text-accent-foreground transition-colors"
                                >
                                    <Zap className="mr-2 h-4 w-4" />
                                    <span>Workflows</span>
                                </Command.Item>
                                <Command.Item
                                    onSelect={() => runCommand(() => setLocation("/profile/me"))}
                                    className="flex items-center px-2 py-2 rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground aria-selected:bg-accent aria-selected:text-accent-foreground transition-colors"
                                >
                                    <User className="mr-2 h-4 w-4" />
                                    <span>My Profile</span>
                                </Command.Item>
                            </Command.Group>

                            <Command.Group heading="Trending Topics" className="text-xs font-medium text-muted-foreground px-2 py-1.5 mt-2">
                                <Command.Item
                                    onSelect={() => runCommand(() => setLocation("/tag/gpt-4"))}
                                    className="flex items-center px-2 py-2 rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground aria-selected:bg-accent aria-selected:text-accent-foreground transition-colors"
                                >
                                    <Hash className="mr-2 h-4 w-4 text-blue-400" />
                                    <span>GPT-4</span>
                                </Command.Item>
                                <Command.Item
                                    onSelect={() => runCommand(() => setLocation("/tag/midjourney"))}
                                    className="flex items-center px-2 py-2 rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground aria-selected:bg-accent aria-selected:text-accent-foreground transition-colors"
                                >
                                    <Hash className="mr-2 h-4 w-4 text-purple-400" />
                                    <span>Midjourney</span>
                                </Command.Item>
                            </Command.Group>
                        </Command.List>
                    </Command>
                </div>
            </DialogContent>
        </Dialog>
    );
}
