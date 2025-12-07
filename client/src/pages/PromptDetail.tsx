import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TechShell } from "@/components/layout/TechShell";
import {
  Copy,
  Share2,
  GitFork,
  Heart,
  Loader2,
  CheckCircle2,
  Zap,
  Eye,
  Calendar,
  Shield,
  FileCode,
  MessageSquare,
  Tag
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PromptCard } from "@/components/PromptCard";

export default function PromptDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  // Mock data for now since we updated the schema
  const prompt = {
    id: Number(id),
    title: "Real Estate Lead Generator – High Conversion Script",
    shortDesc: "Generate high-quality leads with this battle-tested script designed for real estate agents. Includes objection handling and follow-up sequences.",
    content: { main: "Act as an expert real estate agent with 20 years of experience..." },
    type: "Chat",
    industryTags: ["Marketing", "Real Estate", "Sales"],
    socialTags: ["#viral", "#automation"],
    totalUses: 14293,
    totalLikes: 2134,
    totalViews: 45000,
    ownerId: 1,
    createdAt: new Date().toISOString(),
    featured: true,
    modelCompatibility: ["GPT-4", "Claude 3"],
    difficulty: "Intermediate",
    popularityScore: 98,
    version: "v1.4",
    license: "MIT",
    tokenCount: 304,
    owner: {
      id: 1,
      displayName: "Alex Chen",
      email: "alex@example.com",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      verified: true
    }
  };

  const handleCopy = () => {
    const text = prompt?.content?.main || "Sample prompt text...";
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "Ready to paste into your favorite model.",
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <TechShell>
      <div className="max-w-5xl mx-auto p-6 pb-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono tracking-wider mb-8">
          <Link href="/feed" className="hover:text-blue-400 transition-colors">EXPLORE</Link>
          <span>/</span>
          <span>{prompt.type?.toUpperCase()}</span>
          <span>/</span>
          <span className="text-white">{prompt.title?.toUpperCase()}</span>
        </div>

        <div className="space-y-12">
          {/* Header Section */}
          <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-black/40 p-8 md:p-12">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent" />
            <div className="relative z-10 space-y-8">
              {/* Top Row: Badges & Actions */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/20 hover:bg-blue-500/30 px-3 py-1 text-sm">
                    {prompt.type} Prompt
                  </Badge>
                  <Badge variant="outline" className="border-white/10 bg-black/50 backdrop-blur-md px-3 py-1">
                    {prompt.version}
                  </Badge>
                  <Badge variant="outline" className="border-white/10 bg-black/50 backdrop-blur-md text-yellow-400 border-yellow-400/20 px-3 py-1">
                    <Zap className="w-3 h-3 mr-1 fill-yellow-400" />
                    {prompt.popularityScore} Score
                  </Badge>
                </div>

                <div className="flex items-center gap-3">
                  <Button variant="outline" className="h-10 border-white/10 hover:bg-white/10 hover:text-white font-bold text-xs tracking-wider rounded-full">
                    <Heart className="w-4 h-4 mr-2" />
                    {prompt.totalLikes}
                  </Button>
                  <Button variant="outline" className="h-10 border-white/10 hover:bg-white/10 hover:text-white font-bold text-xs tracking-wider rounded-full">
                    <Share2 className="w-4 h-4 mr-2" />
                    SHARE
                  </Button>
                  <Button className="h-10 bg-blue-600 hover:bg-blue-500 text-white font-bold tracking-wider text-xs rounded-full shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                    <GitFork className="w-4 h-4 mr-2" />
                    FORK
                  </Button>
                </div>
              </div>

              {/* Title & Author */}
              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight text-white max-w-4xl">
                  {prompt.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-t border-white/10 pt-6">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-10 h-10 border border-white/20">
                      <AvatarImage src={prompt.owner.avatarUrl} />
                      <AvatarFallback>AC</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest font-mono">Created By</span>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-white">{prompt.owner.displayName}</span>
                        {prompt.owner.verified && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                      </div>
                    </div>
                  </div>
                  <div className="w-px h-8 bg-white/10 hidden md:block" />
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-white/5 border border-white/10">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest font-mono">Last Updated</span>
                      <span className="text-white">2 days ago</span>
                    </div>
                  </div>
                  <div className="w-px h-8 bg-white/10 hidden md:block" />
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-white/5 border border-white/10">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest font-mono">License</span>
                      <span className="text-white">{prompt.license}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {prompt.industryTags.concat(prompt.socialTags).map(tag => (
                  <Badge key={tag} variant="outline" className="border-white/10 hover:border-blue-400 hover:text-blue-400 cursor-pointer transition-colors py-1.5 px-3 bg-black/20 backdrop-blur-sm">
                    <Tag className="w-3 h-3 mr-1.5 opacity-50" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left: Description & Prompt */}
            <div className="lg:col-span-2 space-y-8">
              <div className="prose prose-invert max-w-none">
                <h3 className="text-xl font-black tracking-tight text-white mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                  About this Prompt
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {prompt.shortDesc}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/40 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-bold text-white">PROMPT CONTENT</span>
                  </div>
                  <Button
                    onClick={handleCopy}
                    size="sm"
                    className={`
                                font-bold tracking-wide transition-all
                                ${isCopied ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-blue-400'}
                            `}
                  >
                    {isCopied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        COPIED
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        COPY PROMPT
                      </>
                    )}
                  </Button>
                </div>
                <div className="p-6 font-mono text-sm leading-relaxed text-muted-foreground bg-black/50">
                  {prompt.content.main}
                </div>
                <div className="p-3 bg-white/5 border-t border-white/10 flex justify-between items-center text-xs text-muted-foreground font-mono">
                  <span>{prompt.tokenCount} Tokens</span>
                  <span>Model: {prompt.modelCompatibility.join(", ")}</span>
                </div>
              </div>
            </div>

            {/* Right: Stats & Info (Simplified) */}
            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-black/40 p-6 space-y-6">
                <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest">Performance</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Uses</span>
                    <span className="font-bold text-xl text-white">{prompt.totalUses.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1">
                    <div className="bg-blue-500 h-1 rounded-full" style={{ width: '75%' }} />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Views</span>
                    <span className="font-bold text-xl text-white">{prompt.totalViews.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1">
                    <div className="bg-purple-500 h-1 rounded-full" style={{ width: '45%' }} />
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/40 p-6 space-y-6">
                <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest">Model Compatibility</h3>
                <div className="space-y-3">
                  {prompt.modelCompatibility.map(model => (
                    <div key={model} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <Zap className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-sm">{model}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Related Prompts */}
          <div className="pt-12 border-t border-white/10">
            <h3 className="text-2xl font-black tracking-tight text-white mb-8">Related Prompts</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-[400px]">
                  <PromptCard
                    prompt={{
                      ...prompt,
                      id: i + 10,
                      title: `Related Prompt ${i}`,
                      thumbnail: `https://picsum.photos/seed/${i + 200}/400/300`
                    }}
                    className="h-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </TechShell>
  );
}
