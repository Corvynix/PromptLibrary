import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Sparkles, 
  TrendingUp, 
  Users, 
  Award, 
  Zap, 
  Globe, 
  Code, 
  Heart, 
  Beaker,
  Paintbrush,
  Lightbulb,
  ArrowRight
} from "lucide-react";

export default function Landing() {

  const domains = [
    { icon: Code, name: "Engineering", count: "12K+", color: "text-blue-500" },
    { icon: Heart, name: "Medicine", count: "8K+", color: "text-red-500" },
    { icon: Beaker, name: "Science", count: "15K+", color: "text-purple-500" },
    { icon: Paintbrush, name: "Arts", count: "6K+", color: "text-pink-500" },
    { icon: Lightbulb, name: "Business", count: "9K+", color: "text-yellow-500" },
    { icon: Globe, name: "Languages", count: "4K+", color: "text-green-500" },
  ];

  const stats = [
    { value: "125K+", label: "Prompts Shared" },
    { value: "50K+", label: "Active Creators" },
    { value: "2M+", label: "Total Uses" },
    { value: "95%", label: "Avg Quality Score" },
  ];

  const features = [
    {
      icon: Award,
      title: "PQAS Quality Scoring",
      description: "Every prompt is automatically scored across 6 dimensions: clarity, specificity, effectiveness, consistency, safety, and efficiency."
    },
    {
      icon: TrendingUp,
      title: "Karma & Reputation",
      description: "Build your reputation through high-quality prompts, successful remixes, and community engagement. Transparent algorithm published for all."
    },
    {
      icon: Users,
      title: "Viral Social Platform",
      description: "Follow creators, upvote prompts, share workflows, and discover trending content across all domains through multiple feed algorithms."
    },
    {
      icon: Zap,
      title: "Remix & Iterate",
      description: "Fork any prompt, track lineage with visual graphs, and build upon the community's best work. Complete provenance tracking included."
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-cyan-50">
      {/* Hero Section */}
      <section className="relative min-h-[600px] overflow-hidden">
        {/* Gradient Mesh Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-blue-600 to-cyan-600 opacity-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(147,51,234,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-32">
          <div className="text-center space-y-8">
            {/* Badge */}
            <Badge className="bg-gradient-to-r from-violet-600 to-cyan-600 text-white border-0 px-4 py-2 text-sm">
              <Sparkles className="h-3 w-3 mr-2 inline" />
              Open-Source PQAS Quality Scoring
            </Badge>
            
            {/* Headline */}
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-violet-900 via-blue-900 to-cyan-900 bg-clip-text text-transparent leading-tight">
              The World's Largest
              <br />
              AI Prompt Library
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              Discover, share, and remix high-quality prompts across all domains.
              Free, open-source, and community-driven.
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700 text-white text-lg"
                asChild
                data-testid="button-get-started"
              >
                <Link href="/register">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg border-2"
                asChild
                data-testid="button-browse-prompts"
              >
                <Link href="/feed">
                  Browse Prompts
                </Link>
              </Button>
            </div>
            
            {/* Live Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12">
              {stats.map((stat, idx) => {
                const testId = stat.label.toLowerCase().replace(/\s+/g, '-');
                return (
                  <div 
                    key={idx} 
                    className="backdrop-blur-md bg-white/50 dark:bg-white/10 rounded-xl p-4 border border-white/20"
                    data-testid={`stat-${testId}`}
                  >
                    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Domain Showcase */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Every Domain. Every Use Case.
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From engineering to medicine, from arts to science - find prompts for any field
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {domains.map((domain, idx) => {
              const Icon = domain.icon;
              const testId = domain.name.toLowerCase();
              return (
                <Card 
                  key={idx} 
                  className="p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer group"
                  data-testid={`card-domain-${testId}`}
                >
                  <Icon className={`h-12 w-12 mx-auto mb-3 ${domain.color} group-hover:scale-110 transition-transform`} />
                  <h3 className="font-semibold mb-1">{domain.name}</h3>
                  <p className="text-sm text-muted-foreground">{domain.count} prompts</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Built for Quality & Community
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Features designed to foster high-quality contributions and viral growth
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              const testId = feature.title.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
              return (
                <Card 
                  key={idx} 
                  className="p-8 hover:shadow-xl transition-shadow"
                  data-testid={`card-feature-${testId}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-violet-100 to-cyan-100 dark:from-violet-900 dark:to-cyan-900 p-3 rounded-lg">
                      <Icon className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-violet-600 to-cyan-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to Share Your Prompts?
          </h2>
          <p className="text-xl text-white/90">
            Join 50,000+ creators building the world's best AI prompt library
          </p>
          <Button
            size="lg"
            className="bg-white text-violet-600 hover:bg-gray-100 text-lg font-semibold"
            asChild
            data-testid="button-start-sharing"
          >
            <Link href="/register">
              Start Sharing Today
              <Sparkles className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          
          {/* Avatar Stack */}
          <div className="flex justify-center items-center gap-2 mt-8">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-cyan-400 border-2 border-white"
                />
              ))}
            </div>
            <span className="text-sm text-white/80 ml-4">
              Trusted by creators worldwide
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm">
            © 2024 AI Prompt Library. Open-source and community-driven.
          </p>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <a href="#" className="hover:text-white transition-colors" data-testid="link-about">About</a>
            <a href="#" className="hover:text-white transition-colors" data-testid="link-docs">Docs</a>
            <a href="#" className="hover:text-white transition-colors" data-testid="link-github">GitHub</a>
            <a href="#" className="hover:text-white transition-colors" data-testid="link-terms">Terms</a>
            <a href="#" className="hover:text-white transition-colors" data-testid="link-privacy">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
