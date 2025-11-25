import { useState } from 'react';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { FileText, Image, Video } from 'lucide-react';

const promptSchema = z.object({
  type: z.enum(['text', 'image', 'video']),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  shortDesc: z.string().min(10, 'Description must be at least 10 characters'),
  industryTags: z.array(z.string()).min(1, 'Select at least one industry tag'),
  socialTags: z.string(),
  visibility: z.enum(['public', 'private', 'unlisted']),
  license: z.enum(['MIT', 'CC-BY', 'CC-BY-SA', 'CC-BY-NC', 'Proprietary']),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  modelCompatibility: z.array(z.string()).min(1, 'Select at least one model'),
});

type PromptFormValues = z.infer<typeof promptSchema>;

const AI_MODELS = [
  'GPT-4', 'GPT-3.5', 'Claude 3 Opus', 'Claude 3 Sonnet', 'Claude 2',
  'Gemini Pro', 'Gemini Ultra', 'PaLM 2', 'LLaMA 2', 'Mistral',
  'DALL-E 3', 'DALL-E 2', 'Midjourney', 'Stable Diffusion XL', 'Stable Diffusion',
  'Runway Gen-2', 'Pika', 'Synthesia', 'D-ID', 'HeyGen',
];

const INDUSTRY_TAGS = [
  'Marketing', 'Software Development', 'Data Science', 'Design',
  'Writing', 'Education', 'Healthcare', 'Finance', 'Legal', 'Sales',
];

export default function CreatePrompt() {
  const [step, setStep] = useState(1);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<PromptFormValues>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      type: 'text',
      title: '',
      shortDesc: '',
      industryTags: [],
      socialTags: '',
      visibility: 'public',
      license: 'MIT',
      content: '',
      modelCompatibility: [],
    },
  });

  const createPromptMutation = useMutation({
    mutationFn: async (data: PromptFormValues) => {
      const socialTagsArray = data.socialTags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      return await apiRequest('POST', '/api/prompts', {
        type: data.type,
        title: data.title,
        shortDesc: data.shortDesc,
        industryTags: data.industryTags,
        socialTags: socialTagsArray,
        visibility: data.visibility,
        license: data.license,
        content: data.content,
        modelCompatibility: data.modelCompatibility,
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

  const nextStep = async () => {
    const fields = getFieldsForStep(step);
    const isValid = await form.trigger(fields as any);
    if (isValid) {
      setStep(step + 1);
    }
  };

  const getFieldsForStep = (currentStep: number) => {
    switch (currentStep) {
      case 1: return ['type'];
      case 2: return ['title', 'shortDesc', 'industryTags', 'socialTags', 'visibility', 'license'];
      case 3: return ['content'];
      case 4: return ['modelCompatibility'];
      default: return [];
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">Create New Prompt</h1>
          <p className="text-muted-foreground">Step {step} of 5</p>
        </div>

        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full ${
                s <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Choose Prompt Type</CardTitle>
                  <CardDescription>Select the type of AI model this prompt is designed for</CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 md:grid-cols-3 gap-4"
                          >
                            <Card className="cursor-pointer hover-elevate">
                              <CardContent className="flex flex-col items-center gap-2 p-6">
                                <RadioGroupItem value="text" id="text" className="sr-only" />
                                <label htmlFor="text" className="cursor-pointer w-full text-center">
                                  <FileText className="h-12 w-12 mx-auto mb-2" />
                                  <div className="font-semibold">Text</div>
                                  <div className="text-sm text-muted-foreground">For LLMs like GPT, Claude</div>
                                </label>
                              </CardContent>
                            </Card>
                            <Card className="cursor-pointer hover-elevate">
                              <CardContent className="flex flex-col items-center gap-2 p-6">
                                <RadioGroupItem value="image" id="image" className="sr-only" />
                                <label htmlFor="image" className="cursor-pointer w-full text-center">
                                  <Image className="h-12 w-12 mx-auto mb-2" />
                                  <div className="font-semibold">Image</div>
                                  <div className="text-sm text-muted-foreground">For DALL-E, Midjourney</div>
                                </label>
                              </CardContent>
                            </Card>
                            <Card className="cursor-pointer hover-elevate">
                              <CardContent className="flex flex-col items-center gap-2 p-6">
                                <RadioGroupItem value="video" id="video" className="sr-only" />
                                <label htmlFor="video" className="cursor-pointer w-full text-center">
                                  <Video className="h-12 w-12 mx-auto mb-2" />
                                  <div className="font-semibold">Video</div>
                                  <div className="text-sm text-muted-foreground">For Runway, Pika</div>
                                </label>
                              </CardContent>
                            </Card>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Provide details about your prompt</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="My Awesome Prompt" data-testid="input-title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shortDesc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe what your prompt does..."
                            data-testid="input-description"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="industryTags"
                    render={() => (
                      <FormItem>
                        <FormLabel>Industry Tags</FormLabel>
                        <FormDescription>Select relevant industries</FormDescription>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {INDUSTRY_TAGS.map((tag) => (
                            <FormField
                              key={tag}
                              control={form.control}
                              name="industryTags"
                              render={({ field }) => (
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(tag)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, tag])
                                          : field.onChange(field.value?.filter((value) => value !== tag));
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    {tag}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="socialTags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Social Tags</FormLabel>
                        <FormDescription>Comma-separated tags (e.g., marketing, copywriting)</FormDescription>
                        <FormControl>
                          <Input placeholder="tag1, tag2, tag3" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="visibility"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Visibility</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select visibility" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="public">Public</SelectItem>
                              <SelectItem value="unlisted">Unlisted</SelectItem>
                              <SelectItem value="private">Private</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
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
                              <SelectTrigger>
                                <SelectValue placeholder="Select license" />
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Prompt Content</CardTitle>
                  <CardDescription>Enter your prompt template</CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter your prompt here..."
                            className="min-h-[300px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Use variables in brackets like [topic] or [style] for reusable prompts
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {step === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Model Compatibility</CardTitle>
                  <CardDescription>Select compatible AI models</CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="modelCompatibility"
                    render={() => (
                      <FormItem>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                          {AI_MODELS.map((model) => (
                            <FormField
                              key={model}
                              control={form.control}
                              name="modelCompatibility"
                              render={({ field }) => (
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(model)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, model])
                                          : field.onChange(field.value?.filter((value) => value !== model));
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal cursor-pointer">
                                    {model}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {step === 5 && (
              <Card>
                <CardHeader>
                  <CardTitle>Review & Submit</CardTitle>
                  <CardDescription>Review your prompt before publishing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Type</h3>
                    <p className="text-muted-foreground">{form.watch('type')}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Title</h3>
                    <p className="text-muted-foreground">{form.watch('title')}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Description</h3>
                    <p className="text-muted-foreground">{form.watch('shortDesc')}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Content Preview</h3>
                    <pre className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted p-4 rounded-md">
                      {form.watch('content')?.substring(0, 200)}...
                    </pre>
                  </div>
                  <div>
                    <h3 className="font-semibold">Models</h3>
                    <p className="text-muted-foreground">
                      {form.watch('modelCompatibility')?.join(', ')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                  Previous
                </Button>
              )}
              {step < 5 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto"
                  data-testid="button-next-step"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="ml-auto"
                  disabled={createPromptMutation.isPending}
                  data-testid="button-create-prompt"
                >
                  {createPromptMutation.isPending ? 'Creating...' : 'Create Prompt'}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
