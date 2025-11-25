import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { PromptCard } from '@/components/PromptCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

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
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const { data: prompts, isLoading, error } = useQuery<Prompt[]>({
    queryKey: ['/api/prompts', { limit, offset }],
  });

  const handleLoadMore = () => {
    setOffset(offset + limit);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">Failed to load prompts. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Prompt Feed</h1>
        <p className="text-muted-foreground">
          Discover and share AI prompts from the community
        </p>
      </div>

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
          <Button onClick={() => window.location.href = '/prompts/new'}>
            Create your first prompt
          </Button>
        </div>
      )}

      {!isLoading && prompts && prompts.length >= limit && (
        <div className="flex justify-center">
          <Button
            onClick={handleLoadMore}
            variant="outline"
            data-testid="button-load-more"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
