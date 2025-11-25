import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useLocation } from 'wouter';
import { PromptCard } from '@/components/PromptCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TrendingUp, Clock, Star, Filter, Search } from 'lucide-react';
import { MasonryGrid } from '@/components/ui/MasonryGrid';
import { MotionWrapper, StaggerContainer, StaggerItem } from '@/components/ui/MotionWrapper';
import { Input } from '@/components/ui/input';

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
    <div className="space-y-4 p-6 border rounded-xl bg-card">
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
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0 px-6">
          <div className="flex gap-6 md:gap-10">
            <h1 className="text-xl font-bold tracking-tight hidden md:block">
              Discover
            </h1>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-transparent p-0 h-auto gap-2">
                <TabsTrigger
                  value="trending"
                  className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-full px-4 py-1.5 transition-all"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Trending
                </TabsTrigger>
                <TabsTrigger
                  value="new"
                  className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-full px-4 py-1.5 transition-all"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  New
                </TabsTrigger>
                <TabsTrigger
                  value="featured"
                  className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-full px-4 py-1.5 transition-all"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Featured
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <div className="w-full max-w-sm relative hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search prompts..."
                className="pl-9 rounded-full bg-muted/50 border-transparent focus:bg-background focus:border-primary transition-all"
              />
            </div>
            <Button size="sm" variant="ghost" className="rounded-full">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button size="sm" onClick={() => setLocation('/prompts/new')} className="rounded-full">
              Create
            </Button>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto p-6">
        <StaggerContainer>
          {isLoading ? (
            <MasonryGrid columns={{ default: 1, sm: 2, lg: 3, xl: 4 }} gap={24}>
              {Array.from({ length: 8 }).map((_, i) => (
                <PromptCardSkeleton key={i} />
              ))}
            </MasonryGrid>
          ) : (
            <MasonryGrid columns={{ default: 1, sm: 2, lg: 3, xl: 4 }} gap={24}>
              {prompts?.map((prompt) => (
                <StaggerItem key={prompt.id} className="mb-6">
                  <PromptCard prompt={prompt} />
                </StaggerItem>
              ))}
            </MasonryGrid>
          )}

          {!isLoading && prompts && prompts.length === 0 && (
            <MotionWrapper className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
              <div className="p-4 rounded-full bg-muted">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold">No prompts found</h3>
              <p className="text-muted-foreground">Be the first to contribute to this category!</p>
              <Button
                onClick={() => setLocation('/prompts/new')}
                variant="outline"
                className="mt-4"
              >
                Create Prompt
              </Button>
            </MotionWrapper>
          )}
        </StaggerContainer>
      </div>
    </div>
  );
}
