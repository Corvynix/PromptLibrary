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
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useAuth } from '@/lib/auth';
import { 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Sparkles,
  CheckCircle2,
  Circle,
  X
} from 'lucide-react';

// Extended schema with all required fields
const promptSchema = z.object({
  // Step 1: Title & Description
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters'),
  shortDesc: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters'),
  type: z.enum(['text', 'image', 'video']),
  
  // Step 2: Content (type-specific)
  // Text prompts
  systemMessage: z.string().optional(),
  userMessage: z.string().optional(),
  instructions: z.string().optional(),
  
  // Image prompts
  mainPrompt: z.string().optional(),
  negativePrompt: z.string().optional(),
  cfgScale: z.coerce.number().min(1).max(20).optional(),
  steps: z.coerce.number().min(1).max(150).optional(),
  seed: z.coerce.number().optional(),
  
  // Video prompts
  storyboardSteps: z.string().optional(),
  cameraMovements: z.string().optional(),
  styleParameters: z.string().optional(),
  
  // Step 3: Metadata & Tags
  industryTags: z.array(z.string()).min(1, 'Select at least one industry tag'),
  modelCompatibility: z.array(z.string()).min(1, 'Select at least one AI model'),
  customTags: z.string(),
  socialTags: z.string(),
  
  // Step 4: Settings
  visibility: z.enum(['public', 'private', 'unlisted', 'domain_restricted']),
  license: z.enum(['MIT', 'CC-BY', 'CC-BY-SA', 'CC-BY-NC', 'Proprietary']),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']),
});

type PromptFormValues = z.infer<typeof promptSchema>;

const AI_MODELS = {
  text: ['GPT-4', 'GPT-3.5 Turbo', 'Claude 3 Opus', 'Claude 3 Sonnet', 'Claude 2', 'Gemini Pro', 'Gemini Ultra', 'PaLM 2', 'LLaMA 2', 'Mistral'],
  image: ['DALL-E 3', 'DALL-E 2', 'Midjourney v6', 'Midjourney v5', 'Stable Diffusion XL', 'Stable Diffusion 2.1', 'Leonardo.ai'],
  video: ['Runway Gen-2', 'Runway Gen-3', 'Pika 1.0', 'Synthesia', 'D-ID', 'HeyGen', 'Luma Dream Machine'],
};

const INDUSTRY_TAGS = [
  'Marketing', 'Software Development', 'Data Science', 'Design',
  'Writing', 'Education', 'Healthcare', 'Finance', 'Legal', 'Sales',
  'Customer Support', 'HR', 'Research', 'Art & Creative', 'E-commerce'
];

const POPULAR_TAGS = [
  'copywriting', 'code-generation', 'data-analysis', 'creative-writing',
  'social-media', 'email-marketing', 'seo', 'brainstorming', 'summarization',
  'translation', 'debugging', 'image-generation', 'video-script', 'presentation'
];

export default function CreatePrompt() {
  const [step, setStep] = useState(1);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { currentUser } = useAuth();

  const form = useForm<PromptFormValues>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      title: '',
      shortDesc: '',
      type: 'text',
      systemMessage: '',
      userMessage: '',
      instructions: '',
      mainPrompt: '',
      negativePrompt: '',
      cfgScale: 7,
      steps: 30,
      seed: undefined,
      storyboardSteps: '',
      cameraMovements: '',
      styleParameters: '',
      industryTags: [],
      modelCompatibility: [],
      customTags: '',
      socialTags: '',
      visibility: 'public',
      license: 'MIT',
      difficulty: 'Beginner',
    },
  });

  const watchedType = form.watch('type');
  const watchedTitle = form.watch('title');
  const watchedShortDesc = form.watch('shortDesc');

  const createPromptMutation = useMutation({
    mutationFn: async (data: { formData: PromptFormValues; isDraft: boolean }) => {
      const { formData, isDraft } = data;
      
      // Build content object based on type
      let content: any = {};
      if (formData.type === 'text') {
        content = {
          systemMessage: formData.systemMessage,
          userMessage: formData.userMessage,
          instructions: formData.instructions,
        };
      } else if (formData.type === 'image') {
        content = {
          mainPrompt: formData.mainPrompt,
          negativePrompt: formData.negativePrompt,
          cfgScale: formData.cfgScale,
          steps: formData.steps,
          seed: formData.seed,
        };
      } else if (formData.type === 'video') {
        content = {
          storyboardSteps: formData.storyboardSteps,
          cameraMovements: formData.cameraMovements,
          styleParameters: formData.styleParameters,
        };
      }

      const customTagsArray = formData.customTags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const socialTagsArray = formData.socialTags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      return await apiRequest('POST', '/api/prompts', {
        type: formData.type,
        title: formData.title,
        shortDesc: formData.shortDesc,
        industryTags: formData.industryTags,
        socialTags: [...customTagsArray, ...socialTagsArray],
        visibility: formData.visibility,
        license: formData.license,
        content,
        modelCompatibility: formData.modelCompatibility,
        difficulty: formData.difficulty,
        status: isDraft ? 'draft' : 'reviewed',
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

  const onSubmit = (isDraft: boolean = false) => {
    const formData = form.getValues();
    createPromptMutation.mutate({ formData, isDraft });
  };

  const nextStep = async () => {
    const fields = getFieldsForStep(step);
    const isValid = await form.trigger(fields as any);
    if (isValid) {
      setStep(step + 1);
    }
  };

  const getFieldsForStep = (currentStep: number): string[] => {
    switch (currentStep) {
      case 1: 
        return ['title', 'shortDesc', 'type'];
      case 2: {
        const type = form.getValues('type');
        if (type === 'text') return ['systemMessage', 'userMessage', 'instructions'];
        if (type === 'image') return ['mainPrompt'];
        if (type === 'video') return ['storyboardSteps'];
        return [];
      }
      case 3: 
        return ['industryTags', 'modelCompatibility'];
      case 4: 
        return ['visibility', 'license', 'difficulty'];
      default: 
        return [];
    }
  };

  // Mock PQAS score calculation
  const calculateMockPQAS = () => {
    const baseScore = 65;
    const titleBonus = Math.min(watchedTitle.length / 10, 10);
    const descBonus = Math.min(watchedShortDesc.length / 25, 10);
    const tagsBonus = form.watch('industryTags').length * 2;
    const modelsBonus = form.watch('modelCompatibility').length * 1.5;
    
    const total = Math.min(baseScore + titleBonus + descBonus + tagsBonus + modelsBonus, 100);
    return Math.round(total);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Title & Description</CardTitle>
              <CardDescription>Give your prompt a clear title and description</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="E.g., Professional Email Writer" 
                        data-testid="input-title" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      {field.value.length}/200 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shortDesc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe what your prompt does and who it's for..."
                        className="min-h-[120px]"
                        data-testid="input-description"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {field.value.length}/500 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prompt Type *</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                      >
                        <Card className="cursor-pointer hover-elevate" data-testid="select-type-text">
                          <CardContent className="flex flex-col items-center gap-2 p-6">
                            <RadioGroupItem value="text" id="text" className="sr-only" />
                            <label htmlFor="text" className="cursor-pointer w-full text-center">
                              <FileText className="h-12 w-12 mx-auto mb-2" />
                              <div className="font-semibold">Text</div>
                              <div className="text-sm text-muted-foreground">For LLMs like GPT, Claude</div>
                            </label>
                          </CardContent>
                        </Card>
                        <Card className="cursor-pointer hover-elevate" data-testid="select-type-image">
                          <CardContent className="flex flex-col items-center gap-2 p-6">
                            <RadioGroupItem value="image" id="image" className="sr-only" />
                            <label htmlFor="image" className="cursor-pointer w-full text-center">
                              <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                              <div className="font-semibold">Image</div>
                              <div className="text-sm text-muted-foreground">For DALL-E, Midjourney</div>
                            </label>
                          </CardContent>
                        </Card>
                        <Card className="cursor-pointer hover-elevate" data-testid="select-type-video">
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
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Content Editor</CardTitle>
              <CardDescription>
                {watchedType === 'text' && 'Define system prompts, user messages, and instructions'}
                {watchedType === 'image' && 'Create your image generation prompt with parameters'}
                {watchedType === 'video' && 'Define your video storyboard and style'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {watchedType === 'text' && (
                <>
                  <FormField
                    control={form.control}
                    name="systemMessage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>System Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="You are a helpful assistant that..."
                            className="min-h-[100px]"
                            data-testid="input-system-message"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Set the behavior and role of the AI
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="userMessage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>User Message Template</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write a [type] about [topic] in [tone] tone..."
                            className="min-h-[150px]"
                            data-testid="input-user-message"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Use [variable] syntax for customizable parts
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="instructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Instructions</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Additional context or constraints..."
                            className="min-h-[100px]"
                            data-testid="input-instructions"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {watchedType === 'image' && (
                <>
                  <FormField
                    control={form.control}
                    name="mainPrompt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Main Prompt *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="A photorealistic image of a futuristic city at sunset, neon lights, cyberpunk style..."
                            className="min-h-[150px]"
                            data-testid="input-main-prompt"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Describe the image you want to generate in detail
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="negativePrompt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Negative Prompt</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="blurry, low quality, distorted, watermark..."
                            className="min-h-[80px]"
                            data-testid="input-negative-prompt"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          What to avoid in the generated image
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="cfgScale"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CFG Scale</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              max={20}
                              data-testid="input-cfg-scale"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>1-20 (default: 7)</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="steps"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Steps</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              max={150}
                              data-testid="input-steps"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>1-150 (default: 30)</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="seed"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Seed (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Random"
                              data-testid="input-seed"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                              value={field.value ?? ''}
                            />
                          </FormControl>
                          <FormDescription>For reproducibility</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}

              {watchedType === 'video' && (
                <>
                  <FormField
                    control={form.control}
                    name="storyboardSteps"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Storyboard Steps *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Scene 1: Opening shot of city skyline&#10;Scene 2: Camera zooms into building&#10;Scene 3: ..."
                            className="min-h-[150px]"
                            data-testid="input-storyboard-steps"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Describe each scene or step of the video
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cameraMovements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Camera Movements</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Slow pan left to right, zoom in on subject, dolly forward..."
                            className="min-h-[100px]"
                            data-testid="input-camera-movements"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Describe camera angles and movements
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="styleParameters"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Style Parameters</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Cinematic, 4K, film grain, warm color grading, golden hour lighting..."
                            className="min-h-[100px]"
                            data-testid="input-style-parameters"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Visual style and aesthetics
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Metadata & Tags</CardTitle>
              <CardDescription>Help others discover your prompt</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="industryTags"
                render={() => (
                  <FormItem>
                    <FormLabel>Domain/Industry Tags *</FormLabel>
                    <FormDescription>Select all relevant domains (at least one)</FormDescription>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
                                  data-testid={`checkbox-industry-${tag.toLowerCase().replace(/\s+/g, '-')}`}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer text-sm">
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
                name="modelCompatibility"
                render={() => (
                  <FormItem>
                    <FormLabel>AI Model Compatibility *</FormLabel>
                    <FormDescription>
                      Select compatible models for {watchedType} generation
                    </FormDescription>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {AI_MODELS[watchedType as keyof typeof AI_MODELS].map((model) => (
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
                                  data-testid={`checkbox-model-${model.toLowerCase().replace(/\s+/g, '-')}`}
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

              <FormField
                control={form.control}
                name="customTags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Tags</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="marketing, copywriting, email"
                        data-testid="input-custom-tags"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Comma-separated tags. Popular: {POPULAR_TAGS.slice(0, 5).join(', ')}
                    </FormDescription>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {field.value.split(',').filter(t => t.trim()).map((tag, idx) => (
                        <Badge key={idx} variant="secondary" data-testid={`badge-custom-tag-${idx}`}>
                          {tag.trim()}
                          <button
                            type="button"
                            onClick={() => {
                              const tags = field.value.split(',').filter(t => t.trim());
                              tags.splice(idx, 1);
                              field.onChange(tags.join(', '));
                            }}
                            className="ml-1"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
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
                    <FormLabel>Social Hashtags</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="#AIPrompts, #ProductivityHacks"
                        data-testid="input-social-tags"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Comma-separated hashtags for social sharing
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Configure visibility, licensing, and difficulty</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visibility *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-visibility">
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="public">Public - Anyone can view and use</SelectItem>
                        <SelectItem value="unlisted">Unlisted - Only with link</SelectItem>
                        <SelectItem value="private">Private - Only you</SelectItem>
                        <SelectItem value="domain_restricted">Domain Restricted - Specific domains only</SelectItem>
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
                    <FormLabel>License *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-license">
                          <SelectValue placeholder="Select license" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MIT">MIT - Most permissive</SelectItem>
                        <SelectItem value="CC-BY">CC-BY - Attribution required</SelectItem>
                        <SelectItem value="CC-BY-SA">CC-BY-SA - Share-alike</SelectItem>
                        <SelectItem value="CC-BY-NC">CC-BY-NC - Non-commercial</SelectItem>
                        <SelectItem value="Proprietary">Proprietary - All rights reserved</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How others can use your prompt
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty Level *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-difficulty">
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner - Easy to use, no customization needed</SelectItem>
                        <SelectItem value="Intermediate">Intermediate - Some parameters to adjust</SelectItem>
                        <SelectItem value="Advanced">Advanced - Requires understanding of concepts</SelectItem>
                        <SelectItem value="Expert">Expert - Complex, for experienced users</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Help users know if this prompt is right for them
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        );

      case 5:
        const mockPQAS = calculateMockPQAS();
        const pqasTier = mockPQAS >= 85 ? 'gold' : mockPQAS >= 70 ? 'silver' : 'bronze';
        
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preview & Publish</CardTitle>
                <CardDescription>Review how your prompt will appear to others</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Preview Card */}
                <div className="border rounded-xl p-6 space-y-4 bg-card" data-testid="preview-card">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" data-testid="preview-type">
                          {watchedType}
                        </Badge>
                        <Badge variant="secondary" data-testid="preview-difficulty">
                          {form.watch('difficulty')}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-semibold mb-2" data-testid="preview-title">
                        {watchedTitle || 'Untitled Prompt'}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3" data-testid="preview-description">
                        {watchedShortDesc || 'No description provided'}
                      </p>
                    </div>
                    
                    {/* PQAS Score Badge */}
                    <div className={`flex flex-col items-center justify-center p-4 rounded-lg ${
                      pqasTier === 'gold' ? 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/20' :
                      pqasTier === 'silver' ? 'bg-gradient-to-br from-gray-400/20 to-gray-500/20' :
                      'bg-gradient-to-br from-orange-600/20 to-orange-700/20'
                    }`} data-testid="preview-pqas">
                      <div className="text-3xl font-bold tabular-nums">{mockPQAS}</div>
                      <div className="text-xs text-muted-foreground">PQAS Score</div>
                      <Sparkles className="h-4 w-4 mt-1 text-yellow-500" />
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {form.watch('industryTags').slice(0, 3).map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {form.watch('industryTags').length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{form.watch('industryTags').length - 3} more
                      </Badge>
                    )}
                  </div>

                  {/* Model Compatibility */}
                  <div className="flex flex-wrap gap-2">
                    {form.watch('modelCompatibility').slice(0, 3).map((model, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {model}
                      </Badge>
                    ))}
                    {form.watch('modelCompatibility').length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{form.watch('modelCompatibility').length - 3} more
                      </Badge>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-semibold">
                        {currentUser?.displayName?.[0] || currentUser?.email[0].toUpperCase()}
                      </div>
                      <span>{currentUser?.displayName || currentUser?.email}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {form.watch('license')}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* PQAS Breakdown */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Estimated PQAS Breakdown</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 border rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Quality</div>
                      <div className="text-2xl font-bold">{Math.min(mockPQAS + 5, 100)}</div>
                      <Progress value={Math.min(mockPQAS + 5, 100)} className="h-1 mt-2" />
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Consistency</div>
                      <div className="text-2xl font-bold">{Math.max(mockPQAS - 3, 0)}</div>
                      <Progress value={Math.max(mockPQAS - 3, 0)} className="h-1 mt-2" />
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Safety</div>
                      <div className="text-2xl font-bold">{Math.min(mockPQAS + 2, 100)}</div>
                      <Progress value={Math.min(mockPQAS + 2, 100)} className="h-1 mt-2" />
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Efficiency</div>
                      <div className="text-2xl font-bold">{mockPQAS}</div>
                      <Progress value={mockPQAS} className="h-1 mt-2" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    * PQAS scores are calculated after publication based on usage and community feedback
                  </p>
                </div>

                {/* Summary */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium capitalize">{watchedType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Visibility:</span>
                    <span className="font-medium capitalize">{form.watch('visibility').replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">License:</span>
                    <span className="font-medium">{form.watch('license')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Industry Tags:</span>
                    <span className="font-medium">{form.watch('industryTags').length} selected</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Compatible Models:</span>
                    <span className="font-medium">{form.watch('modelCompatibility').length} selected</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold">Create New Prompt</h1>
          <p className="text-muted-foreground">Step {step} of 5</p>
        </div>

        {/* Progress Stepper */}
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                    s < step
                      ? 'bg-primary border-primary text-primary-foreground'
                      : s === step
                      ? 'border-primary text-primary'
                      : 'border-muted text-muted-foreground'
                  }`}
                  data-testid={`step-indicator-${s}`}
                >
                  {s < step ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                </div>
                <span className="text-xs mt-1 text-muted-foreground hidden md:block">
                  {s === 1 && 'Details'}
                  {s === 2 && 'Content'}
                  {s === 3 && 'Tags'}
                  {s === 4 && 'Settings'}
                  {s === 5 && 'Preview'}
                </span>
              </div>
              {s < 5 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    s < step ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <Form {...form}>
          <form className="space-y-6">
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center gap-4">
              <div>
                {step > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setStep(step - 1)}
                    data-testid="button-back"
                  >
                    Back
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                {step === 5 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onSubmit(true)}
                    disabled={createPromptMutation.isPending}
                    data-testid="button-save-draft"
                  >
                    Save Draft
                  </Button>
                )}
                
                {step < 5 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    data-testid="button-next"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={() => onSubmit(false)}
                    disabled={createPromptMutation.isPending}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    data-testid="button-publish"
                  >
                    {createPromptMutation.isPending ? 'Publishing...' : 'Publish Prompt'}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
