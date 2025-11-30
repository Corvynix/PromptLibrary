import { TechShell } from "@/components/layout/TechShell";
import { motion, LayoutGroup } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ApiDocs() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <LayoutGroup>
            <div className="min-h-screen bg-background text-foreground overflow-hidden relative flex flex-col p-4 md:p-6">

                {/* Splash Screen State */}
                {loading && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            layoutId="logo"
                            className="text-4xl md:text-6xl font-black tracking-tighter font-display text-white"
                        >
                        </motion.div>
                    </motion.div>
                )}

                <TechShell loading={loading} logoText="API DOCS">
                    <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                        {/* Background Text */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
                            <h1
                                className="text-[18vw] font-black font-display text-transparent whitespace-nowrap select-none"
                                style={{ WebkitTextStroke: "2px var(--foreground)", opacity: 0.08 }}
                            >
                                API DOCS
                            </h1>
                        </div>

                        <div className="max-w-5xl mx-auto py-12 px-6 relative z-10">
                            <div className="flex items-center justify-between mb-12">
                                <div>
                                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/50">
                                        API DOCS
                                    </h1>
                                    <p className="text-xl text-muted-foreground font-mono tracking-wider">
                                        BUILD THE FUTURE WITH PROMPTLIBRARY
                                    </p>
                                </div>
                                <Button className="h-12 px-8 rounded-full font-bold tracking-widest border-2 border-foreground bg-foreground text-background hover:bg-foreground/90 hover:scale-105 transition-all">
                                    GET API KEY
                                </Button>
                            </div>

                            <Tabs defaultValue="overview" className="space-y-8">
                                <TabsList className="bg-muted/50 border border-border p-1 rounded-full backdrop-blur-md">
                                    <TabsTrigger value="overview" className="rounded-full px-6 font-bold tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">OVERVIEW</TabsTrigger>
                                    <TabsTrigger value="endpoints" className="rounded-full px-6 font-bold tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">ENDPOINTS</TabsTrigger>
                                    <TabsTrigger value="authentication" className="rounded-full px-6 font-bold tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">AUTHENTICATION</TabsTrigger>
                                </TabsList>

                                <TabsContent value="overview">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <Card className="border-2 border-border bg-card/50 backdrop-blur-xl overflow-hidden">
                                            <CardHeader className="border-b border-border bg-muted/20">
                                                <CardTitle className="font-black tracking-tighter uppercase text-2xl">Introduction</CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-8 space-y-6">
                                                <p className="text-lg text-muted-foreground leading-relaxed">
                                                    The PromptLibrary API provides programmatic access to the world's largest collection of AI prompts.
                                                    Build tools, integrations, and workflows powered by our community-curated content.
                                                </p>
                                                <div className="bg-muted border border-border p-6 rounded-xl font-mono text-sm text-primary flex items-center gap-4">
                                                    <span className="text-muted-foreground select-none">$</span>
                                                    https://api.promptlibrary.com/v1
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </TabsContent>

                                <TabsContent value="endpoints">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4 }}
                                        className="space-y-6"
                                    >
                                        <Card className="border-2 border-border bg-card/50 backdrop-blur-xl overflow-hidden">
                                            <CardHeader className="border-b border-border bg-muted/20 flex flex-row items-center justify-between">
                                                <CardTitle className="font-mono text-sm text-primary">GET /prompts</CardTitle>
                                                <span className="px-2 py-1 rounded bg-green-500/20 text-green-600 dark:text-green-400 text-[10px] font-bold tracking-wider border border-green-500/20">PUBLIC</span>
                                            </CardHeader>
                                            <CardContent className="p-6">
                                                <p className="text-sm text-muted-foreground mb-6">List all public prompts with pagination and filtering.</p>
                                                <pre className="bg-muted border border-border p-6 rounded-xl text-xs overflow-x-auto font-mono text-muted-foreground">
                                                    {`{
  "data": [
    {
      "id": 1,
      "title": "Cyberpunk City",
      "content": "..."
    }
  ],
  "meta": {
    "page": 1,
    "total": 100
  }
}`}
                                                </pre>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </TechShell>
            </div>
        </LayoutGroup>
    );
}
