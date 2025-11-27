import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { FileText, Image as ImageIcon, Video, Sparkles, ChevronDown } from 'lucide-react';
import { motion, LayoutGroup, AnimatePresence } from 'framer-motion';
import { TechShell } from '@/components/layout/TechShell';

// Simplified schema
const promptSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  shortDesc: z.string().min(10, 'Description must be at least 10 characters').max(500),
  type: z.enum(['text', 'image', 'video']),
  content: z.string().min(10, 'Content is required'),
  industryTags: z.array(z.string()).min(1, 'Select at least one tag'),
  modelCompatibility: z.array(z.string()).min(1, 'Select at least one AI model'),
  visibility: z.enum(['public', 'private', 'unlisted']),
  license: z.enum(['MIT', 'CC-BY', 'CC-BY-SA', 'CC-BY-NC', 'Proprietary']),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']),
});

type PromptFormValues = z.infer<typeof promptSchema>;

const AI_MODELS = {
  text: [
    { name: 'GPT-4', icon: '🧠' },
    { name: 'GPT-3.5', icon: '🤖' },
    { name: 'Claude 3', icon: '🎭' },
    { name: 'Gemini Pro', icon: '✨' },
    { name: 'LLaMA 2', icon: '🦙' },
  ],
  image: [
    { name: 'DALL-E 3', icon: '🎨' },
    { name: 'Midjourney', icon: '⛵' },
    { name: 'Stable Diffusion XL', icon: '🌊' },
  ],
  video: [
    { name: 'Runway Gen-3', icon: '✈️' },
    { name: 'Pika 1.0', icon: '🐭' },
    { name: 'Luma Dream Machine', icon: '🌙' },
  ],
};

const POPULAR_TAGS = [
  { name: 'Marketing', emoji: '📢' },
  { name: 'Coding', emoji: '💻' },
  { name: 'Design', emoji: '🎨' },
  { name: 'Writing', emoji: '✍️' },
  { name: 'Education', emoji: '🎓' },
  { name: 'Data Science', emoji: '📊' },
  { name: 'Sales', emoji: '💼' },
  { name: 'Customer Support', emoji: '🎧' },
  { name: 'Research', emoji: '🔬' },
  { name: 'Creative', emoji: '💡' },
];

export default function CreatePrompt() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const form = useForm<PromptFormValues>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      title: '',
      shortDesc: '',
      type: 'text',
      content: '',
      industryTags: [],
      modelCompatibility: [],
      visibility: 'public',
      license: 'MIT',
      difficulty: 'Beginner',
    },
  });

  const watchedType = form.watch('type');

  const createPromptMutation = useMutation({
    mutationFn: async (formData: PromptFormValues) => {
      return await apiRequest('POST', '/api/prompts', {
        type: formData.type,
        title: formData.title,
        shortDesc: formData.shortDesc,
        industryTags: formData.industryTags,
        socialTags: [],
        visibility: formData.visibility,
        license: formData.license,
        content: { main: formData.content },
        modelCompatibility: formData.modelCompatibility,
        difficulty: formData.difficulty,
        status: 'reviewed',
      });
    },
    onSuccess: async (response) => {
      const prompt = await response.json();
      queryClient.invalidateQueries({ queryKey: ['/api/prompts'] });
      toast({
        title: 'Success',
        description: 'Your prompt has been created successfully',
      });
      setLocation(`/prompts/${prompt.slug}`);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create prompt',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: PromptFormValues) => {
    createPromptMutation.mutate(data);
  };

  const toggleTag = (tag: string) => {
    const current = form.getValues('industryTags');
    if (current.includes(tag)) {
      form.setValue('industryTags', current.filter(t => t !== tag));
    } else {
      form.setValue('industryTags', [...current, tag]);
    }
  };

  return (
    <LayoutGroup>
      <div className="min-h-screen bg-background text-foreground overflow-hidden relative flex flex-col p-4 md:p-6">

        {/* Splash Screen State */}
        <AnimatePresence>
          {loading && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                layoutId="logo"
                className="text-4xl md:text-6xl font-black tracking-tighter font-display text-white"
              >
                CREATE
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <TechShell loading={loading} logoText="CREATE">
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="min-h-full p-4 md:p-8 max-w-4xl mx-auto">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">CREATE PROMPT</h1>
                <p className="text-muted-foreground font-mono">Share your best prompts with the world</p>
              </motion.div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Basic Info Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Basic Information</CardTitle>
                      <CardDescription>Give your prompt a clear title and description</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="E.g., Professional Email Writer"
                                className="rounded-full"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>{field.value.length}/200</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="shortDesc"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe what your prompt does..."
                                className="min-h-[100px] rounded-3xl"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>{field.value.length}/500</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Type Selection */}
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prompt Type *</FormLabel>
                            <div className="grid grid-cols-3 gap-3">
                              {[
                                { value: 'text', icon: FileText, label: 'Text' },
                                { value: 'image', icon: ImageIcon, label: 'Image' },
                                { value: 'video', icon: Video, label: 'Video' },
                              ].map((type) => (
                                <button
                                  key={type.value}
                                  type="button"
                                  onClick={() => field.onChange(type.value)}
                                  className={`p-4 border-2 rounded-3xl transition-all ${field.value === type.value
                                    ? 'border-blue-400 bg-blue-400/10'
                                    : 'border-white/20 hover:border-white'
                                    }`}
                                >
                                  <type.icon className="w-8 h-8 mx-auto mb-2" />
                                  <p className="text-sm font-bold">{type.label}</p>
                                </button>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Content Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Prompt Content</CardTitle>
                      <CardDescription>
                        {watchedType === 'text' && 'Write your text prompt'}
                        {watchedType === 'image' && 'Describe the image you want to generate'}
                        {watchedType === 'video' && 'Describe your video concept'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                placeholder={
                                  watchedType === 'text'
                                    ? 'Enter your prompt text...'
                                    : watchedType === 'image'
                                      ? 'A photorealistic image of...'
                                      : 'Scene 1: Opening shot...'
                                }
                                className="min-h-[200px] rounded-3xl font-mono"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Tags & Models Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Tags & Compatibility</CardTitle>
                      <CardDescription>Help others discover your prompt</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="industryTags"
                        render={() => (
                          <FormItem>
                            <FormLabel>Tags *</FormLabel>
                            <div className="flex flex-wrap gap-2">
                              {POPULAR_TAGS.map((tag) => (
                                <Badge
                                  key={tag.name}
                                  variant={form.watch('industryTags').includes(tag.name) ? 'default' : 'outline'}
                                  className="cursor-pointer px-3 py-1.5 text-sm gap-2"
                                  onClick={() => toggleTag(tag.name)}
                                >
                                  <span>{tag.emoji}</span>
                                  {tag.name}
                                </Badge>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="modelCompatibility"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>AI Models *</FormLabel>
                            <div className="flex flex-wrap gap-2">
                              {AI_MODELS[watchedType].map((model) => (
                                <Badge
                                  key={model.name}
                                  variant={field.value.includes(model.name) ? 'default' : 'outline'}
                                  className="cursor-pointer px-3 py-1.5 text-sm gap-2"
                                  onClick={() => {
                                    if (field.value.includes(model.name)) {
                                      field.onChange(field.value.filter(m => m !== model.name));
                                    } else {
                                      field.onChange([...field.value, model.name]);
                                    }
                                  }}
                                >
                                  <span>{model.icon}</span>
                                  {model.name}
                                </Badge>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Advanced Settings (Collapsible) */}
                  <Card>
                    <CardHeader className="cursor-pointer" onClick={() => setShowAdvanced(!showAdvanced)}>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Advanced Settings</CardTitle>
                          <CardDescription>License, visibility, and difficulty</CardDescription>
                        </div>
                        <ChevronDown className={`w-5 h-5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                      </div>
                    </CardHeader>
                    {showAdvanced && (
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="visibility"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Visibility</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="rounded-full">
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="public">Public</SelectItem>
                                    <SelectItem value="unlisted">Unlisted</SelectItem>
                                    <SelectItem value="private">Private</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="license"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>License</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="rounded-full">
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="MIT">MIT</SelectItem>
                                    <SelectItem value="CC-BY">CC-BY</SelectItem>
                                    <SelectItem value="CC-BY-SA">CC-BY-SA</SelectItem>
                                    <SelectItem value="CC-BY-NC">CC-BY-NC</SelectItem>
                                    <SelectItem value="Proprietary">Proprietary</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="difficulty"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Difficulty</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="rounded-full">
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Beginner">Beginner</SelectItem>
                                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                                    <SelectItem value="Advanced">Advanced</SelectItem>
                                    <SelectItem value="Expert">Expert</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    )}
                  </Card>

                  {/* Submit Button */}
                  <div className="flex justify-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setLocation('/')}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createPromptMutation.isPending}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      {createPromptMutation.isPending ? 'Publishing...' : 'Publish Prompt'}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </TechShell>
      </div>
    </LayoutGroup>
  );
}
