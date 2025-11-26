import { useState } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Copy,
  Share2,
  GitFork,
  Heart,
  Zap,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PromptDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("Sample prompt text...");
    setIsCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "Ready to paste into your favorite model.",
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono tracking-wider">
        <Link href="/feed" className="hover:text-blue-400 transition-colors">EXPLORE</Link>
        <span>/</span>
        <span>MIDJOURNEY</span>
        <span>/</span>
        <span className="text-white">PORTRAITS</span>
      </div>

      {/* Header Section */}
      <div className="border-2 border-white/20 bg-black p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-4 flex-1">
            <h1 className="text-4xl font-black tracking-tighter leading-tight uppercase">
              CINEMATIC CYBERPUNK PORTRAIT GENERATOR V4
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8 border-2 border-white/40">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>PW</AvatarFallback>
                </Avatar>
                <div className="text-sm font-mono">
                  <span className="font-bold">@prompt_wizard</span>
                  <span className="text-muted-foreground mx-2">•</span>
                  <span className="text-muted-foreground">2H AGO</span>
                </div>
              </div>
              <div className="px-2 py-1 border border-green-400 bg-green-400/10 text-green-400 text-[10px] font-mono font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                VERIFIED
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button className="border-2 border-white/20 bg-black hover:border-white hover:bg-white hover:text-black px-4 py-2 font-bold tracking-wider text-xs">
              <Heart className="w-4 h-4 mr-2" />
              LIKE
            </Button>
            <Button className="border-2 border-white/20 bg-black hover:border-white hover:bg-white hover:text-black px-4 py-2 font-bold tracking-wider text-xs">
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
          {/* Prompt Text */}
          <div className="border-2 border-white/20 bg-black p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black tracking-widest uppercase">PROMPT</h2>
              <Button
                onClick={handleCopy}
                className="px-4 py-2 border-2 border-white/20 bg-black hover:border-blue-400 hover:bg-blue-400/10 text-xs font-bold tracking-wider"
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
            <p className="text-sm font-mono leading-relaxed text-muted-foreground">
              A cinematic portrait of a cyberpunk character, neon-lit streets in the background, dramatic lighting, ultra-detailed, 8k resolution, photorealistic, depth of field, bokeh effect, professional photography --ar 2:3 --style raw --v 6
            </p>
          </div>

          {/* Example Output */}
          <div className="border-2 border-white/20 bg-black p-6">
            <h2 className="text-sm font-black tracking-widest uppercase mb-4">EXAMPLE OUTPUT</h2>
            <div className="aspect-[2/3] bg-gradient-to-br from-violet-900 to-indigo-900 border-2 border-white/10 flex items-center justify-center">
              <span className="text-xs text-muted-foreground font-mono">IMAGE PREVIEW</span>
            </div>
          </div>
        </div>

        {/* Right: Metadata */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="border-2 border-white/20 bg-black p-6 space-y-4">
            <h2 className="text-sm font-black tracking-widest uppercase border-b border-white/10 pb-3">STATS</h2>


            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-mono">LIKES</span>
              <span className="font-bold">1,234</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-mono">FORKS</span>
              <span className="font-bold">567</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-mono">VIEWS</span>
              <span className="font-bold">12.4K</span>
            </div>
          </div>

          {/* Model Info */}
          <div className="border-2 border-white/20 bg-black p-6 space-y-4">
            <h2 className="text-sm font-black tracking-widest uppercase border-b border-white/10 pb-3">MODEL</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-xs text-muted-foreground font-mono block mb-1">TYPE</span>
                <span className="font-bold">Midjourney</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground font-mono block mb-1">VERSION</span>
                <span className="font-bold">v6.1</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground font-mono block mb-1">CATEGORY</span>
                <span className="font-bold">Image Generation</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="border-2 border-white/20 bg-black p-6 space-y-4">
            <h2 className="text-sm font-black tracking-widest uppercase border-b border-white/10 pb-3">TAGS</h2>
            <div className="flex flex-wrap gap-2">
              {["CYBERPUNK", "PORTRAIT", "CINEMATIC", "4K"].map(tag => (
                <span key={tag} className="px-2 py-1 border border-white/20 text-[10px] font-mono font-bold tracking-wider hover:border-white transition-colors cursor-pointer">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <Button className="w-full h-12 bg-white text-black hover:bg-white/90 font-bold tracking-widest flex items-center justify-center gap-2">
            <GitFork className="w-4 h-4" />
            FORK PROMPT
          </Button>
        </div>
      </div>
    </div>
  );
}
