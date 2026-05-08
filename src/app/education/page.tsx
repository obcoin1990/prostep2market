// Education Hub - Main Page
import { getLearningPaths } from '@/lib/education/paths';
import { LearningPathCard } from '@/components/education/LearningPathCard';
import { BookOpen, Award, TrendingUp } from 'lucide-react';

export const metadata = {
  title: 'Education Hub - Prostep2market',
  description: 'Structured learning paths for traders. Master trading psychology, technical analysis, and strategy development.',
};

export default async function EducationPage() {
  const learningPaths = await getLearningPaths();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="container relative mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-primary/10 px-4 py-1.5 mb-4">
              <BookOpen className="h-4 w-4 text-primary mr-2" />
              <span className="text-sm font-medium text-primary">Education Hub</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Master Trading with Structured Learning
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Four comprehensive learning paths designed to take you from beginner to professional trader. 
              Build skills progressively with courses, quizzes, and certifications.
            </p>
            
            {/* Stats */}
            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-500" />
                <span>Certificates on completion</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span>Progress tracked</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Paths Grid */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold mb-6">Choose Your Learning Path</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {learningPaths.map((path) => (
            <LearningPathCard 
              key={path.id} 
              path={path}
              progress={0} // TODO: Fetch user progress per path
            />
          ))}
        </div>
      </section>

      {/* Info Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold mb-4">How It Works</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">1</span>
                <span className="font-medium">Choose a Path</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Select from beginner, intermediate, advanced, or psychology-first tracks.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">2</span>
                <span className="font-medium">Complete Courses</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Work through micro-lessons at your own pace. Track your progress as you go.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">3</span>
                <span className="font-medium">Earn Certificates</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Pass quizzes to earn certificates and boost your Edge Score.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}