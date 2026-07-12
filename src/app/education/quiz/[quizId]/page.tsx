// Quiz Page
import { getQuizById } from '@/lib/education/courses';
import { QuizPlayer } from '@/components/quiz/QuizPlayer';
import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface QuizPageProps {
  params: Promise<{ quizId: string }>;
}

export default async function QuizPage({ params }: QuizPageProps) {
  // Auth guard
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const resolvedParams = await params;
  const quiz = await getQuizById(resolvedParams.quizId);

  if (!quiz) {
    notFound();
  }

  const mappedQuiz = {
    id:          quiz.id,
    title:       `Quiz — ${quiz.courseId}`,
    passMark:    quiz.passingScore,
    maxAttempts: quiz.maxAttempts,
    questions: quiz.questions.map((q, i) => ({
      id:    q.id,
      text:  q.text,
      type:  'SINGLE' as const,
      order: i,
      options: q.options.map((opt, j) => ({
        id:    `${q.id}-opt-${j}`,
        text:  opt,
        order: j,
      })),
    })),
  };

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
          quiz={mappedQuiz}
          attemptsUsed={0}
        />
      </div>
    </div>
  );
}
