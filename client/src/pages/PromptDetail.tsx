import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Share2,
  GitFork,
  Heart,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PromptDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  // Fetch prompt from API
  const { data: prompt, isLoading, error } = useQuery({
    queryKey: [`/api/prompts/${id}`],
    enabled: !!id,
  });

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  if (error || !prompt) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-red-500 font-mono">Prompt not found</p>
        <Link href="/feed">
          <Button className="rounded-full">Back to Feed</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono tracking-wider">
        <Link href="/feed" className="hover:text-blue-400 transition-colors">EXPLORE</Link>
        <span>/</span>
        <span>{prompt.type?.toUpperCase()}</span>
        <span>/</span>
        <span className="text-white">{prompt.title?.toUpperCase()}</span>
      </div>

      {/* Header Section */}
      <div className="border-2 border-white/20 bg-black/50 backdrop-blur-sm rounded-3xl p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-4 flex-1">
            <h1 className="text-4xl font-black tracking-tighter leading-tight uppercase">
              {prompt.title}
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8 border-2 border-white/40">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${prompt.ownerId}`} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="text-sm font-mono">
                  <span className="font-bold">@user_{prompt.ownerId}</span>
                  <span className="text-muted-foreground mx-2">•</span>
                  <span className="text-muted-foreground">
                    {new Date(prompt.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              {prompt.featured && (
                <div className="px-2 py-1 border border-green-400 bg-green-400/10 text-green-400 text-[10px] font-mono font-bold flex items-center gap-1 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  FEATURED
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button className="border-2 border-white/20 bg-black hover:border-white hover:bg-white hover:text-black font-bold tracking-wider text-xs rounded-full">
              <Heart className="w-4 h-4 mr-2" />
              LIKE
            </Button>
            <Button className="border-2 border-white/20 bg-black hover:border-white hover:bg-white hover:text-black font-bold tracking-wider text-xs rounded-full">
              <Share2 className="w-4 h-4 mr-2" />
              SHARE
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Prompt Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          {prompt.shortDesc && (
            <div className="border-2 border-white/20 bg-black/50 backdrop-blur-sm rounded-3xl p-6">
              <h2 className="text-sm font-black tracking-widest uppercase mb-4">DESCRIPTION</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {prompt.shortDesc}
              </p>
            </div>
          )}

          {/* Prompt Text */}
          <div className="border-2 border-white/20 bg-black/50 backdrop-blur-sm rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black tracking-widest uppercase">PROMPT</h2>
              <Button
                onClick={handleCopy}
                className="px-4 py-2 border-2 border-white/20 bg-black hover:border-blue-400 hover:bg-blue-400/10 text-xs font-bold tracking-wider rounded-full"
              >
                {isCopied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    COPIED
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    COPY
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm font-mono leading-relaxed text-muted-foreground bg-muted/20 p-4 rounded-2xl">
              {prompt.content?.main || "No content available"}
            </p>
          </div>
        </div>

        {/* Right: Metadata */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="border-2 border-white/20 bg-black/50 backdrop-blur-sm rounded-3xl p-6 space-y-4">
            <h2 className="text-sm font-black tracking-widest uppercase border-b border-white/10 pb-3">STATS</h2>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-mono">LIKES</span>
              <span className="font-bold">{prompt.totalLikes || 0}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-mono">USES</span>
              <span className="font-bold">{prompt.totalUses || 0}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-mono">VIEWS</span>
              <span className="font-bold">{prompt.totalViews || 0}</span>
            </div>
          </div>

          {/* Model Info */}
          <div className="border-2 border-white/20 bg-black/50 backdrop-blur-sm rounded-3xl p-6 space-y-4">
            <h2 className="text-sm font-black tracking-widest uppercase border-b border-white/10 pb-3">MODELS</h2>
            <div className="space-y-2">
              {prompt.modelCompatibility?.map((model: string) => (
                <div key={model} className="flex items-center gap-2 text-sm">
                  <span className="text-blue-400">✓</span>
                  <span>{model}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="border-2 border-white/20 bg-black/50 backdrop-blur-sm rounded-3xl p-6 space-y-4">
            <h2 className="text-sm font-black tracking-widest uppercase border-b border-white/10 pb-3">TAGS</h2>
            <div className="flex flex-wrap gap-2">
              {prompt.industryTags?.map((tag: string) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-[10px] px-3 py-1 rounded-full border-white/20 hover:border-white transition-colors cursor-pointer"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          <Button className="w-full h-12 bg-white text-black hover:bg-white/90 font-bold tracking-widest flex items-center justify-center gap-2 rounded-full">
            <GitFork className="w-4 h-4" />
            FORK PROMPT
          </Button>
        </div>
      </div>
    </div>
  );
}
