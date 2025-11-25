import { useState } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Copy,
  Share2,
  GitFork,
  Heart,
  MessageCircle,
  Zap,
  Clock,
  CheckCircle2,
  Play
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
      variant: "success",
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/explore" className="hover:text-primary transition-colors">Explore</Link>
          <span>/</span>
          <span>Midjourney</span>
          <span>/</span>
          <span className="text-foreground">Portraits</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-4 flex-1">
            <h1 className="text-4xl font-display font-bold leading-tight">
              Cinematic Cyberpunk Portrait Generator v4
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>PW</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <span className="font-medium">prompt_wizard</span>
                  <span className="text-muted-foreground mx-2">•</span>
                  <span className="text-muted-foreground">2 hours ago</span>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-0">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="rounded-full">
              <Heart className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <Share2 className="w-5 h-5" />
            </Button>
            <Link href={`/remix/${id}`}>
              <Button className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg shadow-indigo-500/20">
                <GitFork className="w-4 h-4 mr-2" />
                Remix
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Preview & Prompt */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Carousel */}
          <div className="aspect-video rounded-xl overflow-hidden bg-muted relative group">
            <img
              src="https://picsum.photos/seed/cyberpunk/800/600"
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button variant="secondary" className="rounded-full">
                <Play className="w-4 h-4 mr-2" />
                View Gallery
              </Button>
            </div>
          </div>

          {/* Prompt Content */}
          <Card className="border-primary/20 shadow-lg shadow-primary/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Prompt</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">GPT-4</Badge>
                <Badge variant="outline">Midjourney v6</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg font-mono text-sm leading-relaxed border border-border/50">
                /imagine prompt: a cinematic shot of a cyberpunk street samurai, neon rain, volumetric lighting, 8k resolution, unreal engine 5 render --ar 16:9 --v 6.0
              </div>
              <Button
                onClick={handleCopy}
                className={cn(
                  "w-full transition-all duration-300",
                  isCopied ? "bg-green-500 hover:bg-green-600" : ""
                )}
              >
                {isCopied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Prompt
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Parameters & Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Model</div>
                  <div className="font-medium">Midjourney v6</div>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Aspect Ratio</div>
                  <div className="font-medium">16:9</div>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Stylize</div>
                  <div className="font-medium">250</div>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Chaos</div>
                  <div className="font-medium">10</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Stats & Lineage */}
        <div className="space-y-6">
          {/* PQAS Score Widget */}
          <Card className="bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border-violet-500/20">
            <CardContent className="p-6 text-center">
              <div className="text-sm font-medium text-muted-foreground mb-2">PQAS Quality Score</div>
              <div className="text-5xl font-display font-bold text-primary mb-2">98.5</div>
              <div className="flex justify-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Top 1% of prompts this week. Highly reliable and consistent results.
              </p>
            </CardContent>
          </Card>

          {/* Version History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Version History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { ver: "v4", date: "2h ago", active: true },
                { ver: "v3", date: "1d ago", active: false },
                { ver: "v2", date: "3d ago", active: false },
              ].map((v) => (
                <div key={v.ver} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      v.active ? "bg-green-500" : "bg-muted-foreground/30"
                    )} />
                    <span className={cn("font-medium", v.active ? "text-foreground" : "text-muted-foreground")}>
                      {v.ver}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{v.date}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {["Cyberpunk", "Portrait", "Neon", "Cinematic", "8k", "Unreal Engine"].map((tag) => (
              <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
