import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Copy, Star, GitFork, Eye } from 'lucide-react';
import { Link } from 'wouter';
import { apiRequest, queryClient } from '@/lib/queryClient';

interface PromptDetailProps {
  slug: string;
}

interface Prompt {
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
}

interface PromptVersion {
  id: number;
  promptId: number;
  versionNumber: number;
  content: string | any;
  modelCompatibility: string[];
  pqasScore?: {
    quality?: number;
    consistency?: number;
    safety?: number;
    efficiency?: number;
    composite?: number;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function PromptDetail({ slug }: PromptDetailProps) {
  const { toast } = useToast();

  const { data: prompt, isLoading: promptLoading } = useQuery<Prompt>({
    queryKey: ['/api/prompts/slug', slug],
  });

  const { data: versions, isLoading: versionsLoading } = useQuery<PromptVersion[]>({
    queryKey: ['/api/prompts', prompt?.id, 'versions'],
    enabled: !!prompt?.id,
  });

  const handleCopyPrompt = async () => {
    if (!versions || versions.length === 0 || !prompt) return;

    const latestVersion = versions[0];
    const content = typeof latestVersion.content === 'string'
      ? latestVersion.content
      : JSON.stringify(latestVersion.content);

    try {
      await navigator.clipboard.writeText(content);
      
      // Log usage
      await apiRequest('POST', '/api/usage', {
        promptId: prompt.id,
        versionId: latestVersion.id,
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/prompts/slug', slug] });
      
      toast({
        title: 'Copied to clipboard',
        description: 'Prompt has been copied and usage logged',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy prompt',
        variant: 'destructive',
      });
    }
  };

  const getPQASBadgeVariant = (score?: number) => {
    if (!score) return 'secondary';
    if (score >= 90) return 'default';
    if (score >= 75) return 'secondary';
    return 'outline';
  };

  if (promptLoading) {
    return (
      <div className="container max-w-4xl mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">Prompt not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const latestVersion = versions?.[0];
  const pqasScore = latestVersion?.pqasScore?.composite;

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-semibold mb-2">{prompt.title}</h1>
          <p className="text-muted-foreground">{prompt.shortDesc}</p>
        </div>
        {pqasScore && (
          <Badge variant={getPQASBadgeVariant(pqasScore)} className="text-lg px-4 py-2">
            <Star className="h-4 w-4 mr-2" />
            <span data-testid="text-pqas-score">{pqasScore.toFixed(0)}</span>
          </Badge>
        )}
      </div>

      {prompt.owner && (
        <div className="flex items-center gap-4">
          <Link href={`/profile/${prompt.owner.id}`}>
            <div className="flex items-center gap-2 hover-elevate p-2 rounded-md cursor-pointer">
              <Avatar className="h-10 w-10">
                <AvatarImage src={prompt.owner.avatarUrl || undefined} />
                <AvatarFallback>
                  {prompt.owner.displayName?.charAt(0) || prompt.owner.email.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">
                  {prompt.owner.displayName || 'User'}
                </p>
                <p className="text-xs text-muted-foreground">{prompt.owner.email}</p>
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{prompt.totalUses} uses</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {prompt.industryTags?.map((tag: string, idx: number) => (
          <Badge key={idx} variant="outline">{tag}</Badge>
        ))}
        {prompt.socialTags?.map((tag: string, idx: number) => (
          <Badge key={idx} variant="secondary">#{tag}</Badge>
        ))}
      </div>

      <div className="flex gap-2">
        <Button onClick={handleCopyPrompt} data-testid="button-copy-prompt">
          <Copy className="h-4 w-4 mr-2" />
          Copy Prompt
        </Button>
        <Button variant="outline" data-testid="button-fork">
          <GitFork className="h-4 w-4 mr-2" />
          Fork
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="versions">Versions</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Prompt Content</CardTitle>
            </CardHeader>
            <CardContent>
              {latestVersion ? (
                <pre className="whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-md">
                  {typeof latestVersion.content === 'string'
                    ? latestVersion.content
                    : JSON.stringify(latestVersion.content, null, 2)}
                </pre>
              ) : (
                <p className="text-muted-foreground">No content available</p>
              )}
            </CardContent>
          </Card>

          {latestVersion?.modelCompatibility && latestVersion.modelCompatibility.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Compatible Models</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {latestVersion.modelCompatibility.map((model: string, idx: number) => (
                    <Badge key={idx} variant="secondary">{model}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="versions" className="space-y-4">
          {versionsLoading ? (
            <Card>
              <CardContent className="py-12">
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ) : versions && versions.length > 0 ? (
            versions.map((version: any) => (
              <Card key={version.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Version {version.versionNumber}
                    </CardTitle>
                    <Badge variant={version.status === 'production' ? 'default' : 'secondary'}>
                      {version.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Created {new Date(version.createdAt).toLocaleDateString()}
                  </p>
                </CardHeader>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No versions available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="comments">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Comments coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
