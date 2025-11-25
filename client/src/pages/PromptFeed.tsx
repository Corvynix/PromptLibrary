import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useLocation } from 'wouter';
import { PromptCard } from '@/components/PromptCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TrendingUp, Clock, Star } from 'lucide-react';

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

function PromptCardSkeleton() {
  return (
    <div className="space-y-4 p-6 border rounded-xl">
      <div className="flex items-start justify-between">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-6 w-12" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex items-center gap-2 mt-4">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

export default function PromptFeed() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<string>('trending');
  const limit = 20;

  const { data: trendingPrompts, isLoading: trendingLoading } = useQuery<Prompt[]>({
    queryKey: ['/api/feed/trending', { limit }],
    enabled: activeTab === 'trending',
  });

  const { data: newPrompts, isLoading: newLoading } = useQuery<Prompt[]>({
    queryKey: ['/api/feed/new', { limit }],
    enabled: activeTab === 'new',
  });

  const { data: featuredPrompts, isLoading: featuredLoading } = useQuery<Prompt[]>({
    queryKey: ['/api/feed/editors-choice', { limit }],
    enabled: activeTab === 'featured',
  });

  const getCurrentData = () => {
    switch (activeTab) {
      case 'trending': return trendingPrompts;
      case 'new': return newPrompts;
      case 'featured': return featuredPrompts;
      default: return [];
    }
  };

  const isLoading = trendingLoading || newLoading || featuredLoading;
  const prompts = getCurrentData();

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Discover Prompts</h1>
        <p className="text-muted-foreground">
          Explore trending, new, and featured AI prompts from the community
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="trending" className="flex items-center gap-2" data-testid="tab-trending">
            <TrendingUp className="h-4 w-4" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="new" className="flex items-center gap-2" data-testid="tab-new">
            <Clock className="h-4 w-4" />
            New
          </TabsTrigger>
          <TabsTrigger value="featured" className="flex items-center gap-2" data-testid="tab-featured">
            <Star className="h-4 w-4" />
            Featured
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => <PromptCardSkeleton key={i} />)
              : prompts?.map((prompt) => (
                  <PromptCard key={prompt.id} prompt={prompt} />
                ))}
          </div>

          {!isLoading && prompts && prompts.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
              <p className="text-muted-foreground">No prompts found</p>
              <Button 
                onClick={() => setLocation('/prompts/new')}
                data-testid="button-create-prompt"
              >
                Create your first prompt
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
