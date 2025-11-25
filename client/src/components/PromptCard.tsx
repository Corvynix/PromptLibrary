import { Link } from 'wouter';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye, Copy, Star } from 'lucide-react';

interface PromptCardProps {
  prompt: {
    id: number;
    slug: string;
    title: string;
    shortDesc: string | null;
    type: string;
    industryTags: string[];
    socialTags: string[];
    totalUses: number;
    owner?: {
      id: number;
      displayName: string | null;
      email: string;
      avatarUrl: string | null;
    };
  };
  pqasScore?: number;
}

export function PromptCard({ prompt, pqasScore }: PromptCardProps) {
  const getPQASBadgeVariant = (score?: number) => {
    if (!score) return 'secondary';
    if (score >= 90) return 'default'; // Gold
    if (score >= 75) return 'secondary'; // Silver
    return 'outline'; // Bronze
  };

  return (
    <Link href={`/prompts/${prompt.slug}`}>
      <Card
        className="hover-elevate cursor-pointer h-full flex flex-col"
        data-testid={`card-prompt-${prompt.id}`}
      >
        <CardHeader className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold line-clamp-2">{prompt.title}</h3>
            </div>
            {pqasScore && (
              <Badge variant={getPQASBadgeVariant(pqasScore)} className="shrink-0">
                {pqasScore >= 90 && <Star className="h-3 w-3 mr-1" />}
                {pqasScore.toFixed(0)}
              </Badge>
            )}
          </div>

          {prompt.industryTags.length > 0 && (
            <div className="flex gap-1">
              <Badge variant="outline" className="text-xs">
                {prompt.industryTags[0]}
              </Badge>
            </div>
          )}
        </CardHeader>

        <CardContent className="flex-1">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {prompt.shortDesc || 'No description available'}
          </p>

          {prompt.socialTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-4">
              {prompt.socialTags.slice(0, 3).map((tag, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
              {prompt.socialTags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{prompt.socialTags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex items-center justify-between gap-4">
          {prompt.owner && (
            <div className="flex items-center gap-2 min-w-0">
              <Avatar className="h-6 w-6 shrink-0">
                <AvatarImage src={prompt.owner.avatarUrl || undefined} />
                <AvatarFallback className="text-xs">
                  {prompt.owner.displayName?.charAt(0) || prompt.owner.email.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground truncate">
                {prompt.owner.displayName || prompt.owner.email}
              </span>
            </div>
          )}

          <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{prompt.totalUses}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
