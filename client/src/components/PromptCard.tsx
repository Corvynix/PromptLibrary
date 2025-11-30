import { Link } from 'wouter';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PromptCardProps {
  prompt: {
    id: number;
    slug: string;
    title: string;
    shortDesc: string | null;
    type: string;
    industryTags: string[] | null;
    socialTags: string[] | null;
    totalUses: number;
    totalLikes?: number;
    owner?: {
      id: number;
      displayName: string | null;
      email: string;
      avatarUrl: string | null;
    };
  };
  className?: string;
}

export function PromptCard({ prompt, className }: PromptCardProps) {
  return (
    <Link href={`/prompt/${prompt.id}`}>
      <div className={cn("cursor-pointer group h-full", className)}>
        <div className="border-2 border-white/10 bg-black/50 backdrop-blur-sm rounded-3xl p-6 hover:border-blue-400 hover:bg-blue-400/5 transition-all h-full flex flex-col">
          {/* Header */}
          <div className="space-y-3 mb-4">
            <h3 className="text-xl font-black tracking-tight group-hover:text-blue-400 transition-colors line-clamp-2">
              {prompt.title}
            </h3>

            {prompt.industryTags && prompt.industryTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {prompt.industryTags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-[10px] px-2 py-0.5 rounded-full border-white/20"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 mb-4">
            <p className="text-sm text-muted-foreground line-clamp-3">
              {prompt.shortDesc || 'No description available'}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
            {prompt.owner && (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6 border border-white/20">
                  <AvatarImage src={prompt.owner.avatarUrl || undefined} />
                  <AvatarFallback className="text-[10px]">
                    {prompt.owner.displayName?.substring(0, 2).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs font-mono text-muted-foreground truncate max-w-[100px]">
                  {prompt.owner.displayName || "Unknown"}
                </span>
              </div>
            )}

            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span className="text-xs font-mono">{prompt.totalUses}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                <span className="text-xs font-mono">{prompt.totalLikes || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
