import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { PromptCard } from '@/components/PromptCard';
import { UserPlus, UserMinus, Edit } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';

interface UserProfileProps {
  userId: number;
}

interface User {
  id: number;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  karmaScore: number;
  metrics?: {
    followers?: number;
    following?: number;
  };
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
}

export default function UserProfile({ userId }: UserProfileProps) {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const isOwnProfile = currentUser?.id === userId;

  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ['/api/users', userId],
  });

  const { data: prompts, isLoading: promptsLoading } = useQuery<Prompt[]>({
    queryKey: ['/api/prompts', { ownerId: userId }],
  });

  const followMutation = useMutation({
    mutationFn: async (action: 'follow' | 'unfollow') => {
      return await apiRequest('POST', `/api/users/${userId}/${action}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId] });
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    },
  });

  const handleFollow = () => {
    followMutation.mutate('follow');
  };

  const handleUnfollow = () => {
    followMutation.mutate('unfollow');
  };

  if (userLoading) {
    return (
      <div className="container max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-start gap-6">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container max-w-6xl mx-auto p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">User not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatarUrl || undefined} />
              <AvatarFallback className="text-3xl">
                {user.displayName?.charAt(0) || user.email.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-semibold">
                  {user.displayName || 'User'}
                </h1>
                <p className="text-muted-foreground">{user.email}</p>
              </div>

              {user.bio && (
                <p className="text-sm">{user.bio}</p>
              )}

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-base px-3 py-1">
                    <span data-testid="text-karma-score">{user.karmaScore}</span>
                  </Badge>
                  <span className="text-sm text-muted-foreground">Karma</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">{user.metrics?.followers || 0}</span> followers
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">{user.metrics?.following || 0}</span> following
                </div>
              </div>

              <div className="flex gap-2">
                {isOwnProfile ? (
                  <Button variant="outline" data-testid="button-edit-profile">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <Button
                    onClick={handleFollow}
                    disabled={followMutation.isPending}
                    data-testid="button-follow"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Follow
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">
          {isOwnProfile ? 'My Prompts' : `${user.displayName || 'User'}'s Prompts`}
        </h2>

        {promptsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : prompts && prompts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((prompt: any) => (
              <PromptCard key={prompt.id} prompt={{ ...prompt, owner: user }} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {isOwnProfile ? 'You haven\'t created any prompts yet' : 'No prompts found'}
              </p>
              {isOwnProfile && (
                <Button className="mt-4" onClick={() => window.location.href = '/prompts/new'}>
                  Create your first prompt
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
