import { Link } from 'wouter';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye, Heart, MessageCircle, Share2, Copy, GitFork, Star, Info, Zap, Box, Layers, FileCode, Image as ImageIcon, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface Prompt {
  id: number;
  slug: string;
  title: string;
  shortDesc: string | null;
  type: 'Chat' | 'Image' | 'Workflow' | 'System' | 'Multi-step' | 'Template';
  industryTags: string[] | null;
  socialTags: string[] | null;
  totalUses: number;
  totalLikes?: number;
  owner?: {
    id: number;
    displayName: string | null;
    email: string;
    avatarUrl: string | null;
    verified?: boolean;
  };
  // New Fields for Perfect Card
  thumbnail?: string;
  modelCompatibility?: string[];
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  popularityScore?: number; // 0-100
  version?: string;
  commentCount?: number;
  license?: string;
  tokenCount?: number;
  lastUpdated?: string;
  relatedTags?: string[];
  exampleOutput?: string;
}

interface PromptCardProps {
  prompt: Prompt;
  className?: string;
}

const TypeIcons = {
  Chat: MessageSquare,
  Image: ImageIcon,
  Workflow: GitFork,
  System: Box,
  "Multi-step": Layers,
  Template: FileCode,
};

const DifficultyColors = {
  Beginner: "text-green-400 border-green-400/30 bg-green-400/10",
  Intermediate: "text-blue-400 border-blue-400/30 bg-blue-400/10",
  Advanced: "text-purple-400 border-purple-400/30 bg-purple-400/10",
  Expert: "text-red-400 border-red-400/30 bg-red-400/10",
};

export function PromptCard({ prompt, className }: PromptCardProps) {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const TypeIcon = TypeIcons[prompt.type] || MessageSquare;

  return (
    <TooltipProvider>
      <Link href={`/prompt/${prompt.id}`}>
        <motion.div
          className={cn("cursor-pointer group h-full relative", className)}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <div className="border-2 border-white/10 bg-black/40 backdrop-blur-xl rounded-3xl overflow-hidden hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-300 h-full flex flex-col relative">

            {/* 1. Visual Layer (Top Section) */}
            <div className="relative h-48 overflow-hidden bg-muted/20 group-hover:bg-muted/30 transition-colors">
              {prompt.thumbnail ? (
                <img
                  src={prompt.thumbnail}
                  alt={prompt.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-black flex items-center justify-center">
                  <TypeIcon className="w-16 h-16 text-white/10" />
                </div>
              )}

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              {/* 3. Prompt Type Badge */}
              <div className="absolute top-4 right-4 rtl:left-4 rtl:right-auto">
                <Badge className="bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-black/80 uppercase tracking-wider text-[10px] px-3 py-1">
                  <TypeIcon className="w-3 h-3 me-1.5" />
                  {prompt.type}
                </Badge>
              </div>

              {/* 11. Popularity Score */}
              {prompt.popularityScore !== undefined && (
                <div className="absolute top-4 left-4">
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md border border-white/20 rounded-full px-2 py-1 text-[10px] font-mono text-yellow-400">
                        <Zap className="w-3 h-3 fill-yellow-400" />
                        {prompt.popularityScore}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-black border-white/10 text-xs">
                      {t('promptCard.popularity')}
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}
            </div>

            {/* Example Output Overlay */}
            <AnimatePresence>
              {showOutput && prompt.exampleOutput && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute inset-0 z-20 bg-black/90 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-green-400 uppercase tracking-wider">{t('promptCard.popupTitle')}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 rounded-full hover:bg-white/10"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowOutput(false);
                      }}
                    >
                      <Zap className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-white/80 font-mono whitespace-pre-wrap leading-relaxed">
                    {prompt.exampleOutput}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>


            {/* 2. Core Content Layer (Middle Section) */}
            <div className="p-5 flex-1 flex flex-col relative">
              {/* 13. Version Number */}
              <div className="absolute top-0 right-5 -translate-y-1/2">
                <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] px-2">
                  {prompt.version || 'v1.0'}
                </Badge>
              </div>

              {/* 4. Prompt Title */}
              <h3 className="text-xl font-black tracking-tight text-white group-hover:text-blue-400 transition-colors mb-2 line-clamp-2 leading-tight">
                {prompt.title}
              </h3>

              {/* 5. Short Description */}
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                {prompt.shortDesc || t('promptCard.noDesc')}
              </p>

              {/* 6. Industry Tags */}
              {prompt.industryTags && prompt.industryTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {prompt.industryTags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-[10px] font-medium text-white/60 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* 3. Metadata Layer (Power Section) */}
              <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-white/5 rounded-xl border border-white/5">
                {/* 8. Model Compatibility */}
                <div className="col-span-2 flex items-center gap-2 overflow-hidden">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Models:</span>
                  <div className="flex gap-1">
                    {prompt.modelCompatibility?.slice(0, 3).map(model => (
                      <Badge key={model} variant="outline" className="text-[9px] h-4 px-1 border-white/10 text-white/70">
                        {model}
                      </Badge>
                    )) || <span className="text-[10px] text-muted-foreground">Any</span>}
                  </div>
                </div>

                {/* 9. Difficulty */}
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={cn("text-[9px] h-5 px-2 border-0", DifficultyColors[prompt.difficulty || 'Beginner'])}>
                    {prompt.difficulty || 'Beginner'}
                  </Badge>
                </div>

                {/* 20. Prompt Length (Visible here for balance) */}
                <div className="flex items-center justify-end gap-1 text-[10px] text-muted-foreground font-mono">
                  <FileCode className="w-3 h-3" />
                  {prompt.tokenCount || 0} toks
                </div>
              </div>

              {/* 12. Created By */}
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/10">
                {prompt.owner && (
                  <div className="flex items-center gap-2 group/owner cursor-pointer">
                    <div className="relative">
                      <Avatar className="h-8 w-8 border border-white/10 ring-2 ring-transparent group-hover/owner:ring-blue-500/50 transition-all">
                        <AvatarImage src={prompt.owner.avatarUrl || undefined} />
                        <AvatarFallback className="bg-blue-500/20 text-blue-400 text-xs font-bold">
                          {prompt.owner.displayName?.substring(0, 2).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      {prompt.owner.verified && (
                        <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-[2px] border-2 border-black">
                          <Zap className="w-2 h-2 fill-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white group-hover/owner:text-blue-400 transition-colors">
                        {prompt.owner.displayName || "Unknown"}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {t('promptCard.creator')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 4. Social Interaction Layer (Bottom Section) */}
            <div className="bg-black/40 p-3 flex items-center justify-between gap-2 border-t border-white/5">
              <div className="flex items-center gap-3">
                {/* 14. Upvote */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-muted-foreground hover:text-white hover:bg-white/10 gap-1.5 rounded-full"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span className="text-xs font-mono font-bold">{prompt.totalLikes || 0}</span>
                </Button>

                {/* 15. Comments */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-muted-foreground hover:text-white hover:bg-white/10 gap-1.5 rounded-full"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span className="text-xs font-mono font-bold">{prompt.commentCount || 0}</span>
                </Button>

                {/* Example Output Toggle */}
                {prompt.exampleOutput && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-8 px-2 text-muted-foreground hover:text-white hover:bg-white/10 gap-1.5 rounded-full",
                          showOutput && "text-green-400 bg-green-400/10 hover:bg-green-400/20"
                        )}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowOutput(!showOutput);
                        }}
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span className="text-xs font-mono font-bold">{t('promptCard.preview')}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-black border-white/10 text-xs">
                      {showOutput ? t('promptCard.hideOutput') : t('promptCard.viewOutput')}
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>

              <div className="flex items-center gap-1">
                {/* 16. Copy Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn("h-8 w-8 rounded-full hover:bg-blue-500/20 hover:text-blue-400 transition-all", copied && "bg-green-500/20 text-green-400")}
                      onClick={handleCopy}
                    >
                      {copied ? <Zap className="w-3.5 h-3.5 fill-current" /> : <Copy className="w-3.5 h-3.5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-black border-white/10 text-xs">
                    {copied ? t('promptCard.copied') : t('promptCard.copy')}
                  </TooltipContent>
                </Tooltip>

                {/* 17. Remix Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-purple-500/20 hover:text-purple-400 transition-all"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    >
                      <GitFork className="w-3.5 h-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-black border-white/10 text-xs">
                    {t('promptCard.remix')}
                  </TooltipContent>
                </Tooltip>

                {/* 24. Save Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-yellow-500/20 hover:text-yellow-400 transition-all"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    >
                      <Star className="w-3.5 h-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-black border-white/10 text-xs">
                    {t('promptCard.save')}
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* 5. Hidden Advanced Data (Hover Tooltip) */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity delay-700">
                  <Button variant="outline" size="icon" className="h-6 w-6 rounded-full bg-black/80 border-white/20 backdrop-blur-md">
                    <Info className="w-3 h-3" />
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent side="left" className="w-64 bg-black/90 backdrop-blur-xl border-white/10 p-4 space-y-3">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t('promptCard.advanced.title')}</h4>
                  <div className="h-px bg-white/10 w-full" />
                </div>
                <div className="grid grid-cols-2 gap-y-2 text-[10px]">
                  <span className="text-muted-foreground">{t('promptCard.advanced.license')}:</span>
                  <span className="text-white text-right font-mono">{prompt.license || t('promptCard.unknown')}</span>

                  <span className="text-muted-foreground">{t('promptCard.advanced.tokens')}:</span>
                  <span className="text-white text-right font-mono">{prompt.tokenCount || 0}</span>

                  <span className="text-muted-foreground">{t('promptCard.advanced.updated')}:</span>
                  <span className="text-white text-right">{prompt.lastUpdated || 'Recently'}</span>

                  <span className="text-muted-foreground">{t('promptCard.advanced.uses')}:</span>
                  <span className="text-white text-right font-mono">{prompt.totalUses.toLocaleString()}</span>
                </div>
                {prompt.relatedTags && (
                  <div className="pt-2 border-t border-white/10">
                    <span className="text-[10px] text-muted-foreground block mb-1">{t('promptCard.advanced.related')}:</span>
                    <div className="flex flex-wrap gap-1">
                      {prompt.relatedTags.map(tag => (
                        <span key={tag} className="text-[9px] text-blue-400">#{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
              </TooltipContent>
            </Tooltip>

          </div>
        </motion.div>
      </Link>
    </TooltipProvider >
  );
}
