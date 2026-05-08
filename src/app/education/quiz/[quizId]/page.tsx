// Quiz Page
import { getQuizById } from '@/lib/education/courses';
import { QuizPlayer } from '@/components/education/QuizPlayer';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface QuizPageProps {
  params: Promise<{ quizId: string }>;
}

export default async function QuizPage({ params }: QuizPageProps) {
  const resolvedParams = await params;
  const quiz = await getQuizById(resolvedParams.quizId);

  if (!quiz) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href={`/education`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Education Hub
          </Link>
        </div>
      </div>

      {/* Quiz Content */}
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <QuizPlayer
          quizId={quiz.id}
          passingScore={quiz.passingScore}
          maxAttempts={quiz.maxAttempts}
        />
      </div>
    </div>
  );
}