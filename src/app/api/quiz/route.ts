// Quiz API - GET quiz data
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const quizId = searchParams.get('quizId');

  if (!quizId) {
    return NextResponse.json(
      { error: 'Quiz ID is required' },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Fetch quiz
  const { data: quiz, error: quizError } = await supabase
    .from('quizzes')
    .select('*')
    .eq('id', quizId)
    .single();

  if (quizError || !quiz) {
    return NextResponse.json(
      { error: 'Quiz not found' },
      { status: 404 }
    );
  }

  // Verify user owns the course (has progress record)
  const { data: progress } = await supabase
    .from('course_progress')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', quiz.course_id)
    .single();

  if (!progress) {
    return NextResponse.json(
      { error: 'You must be enrolled in this course to take the quiz' },
      { status: 403 }
    );
  }

  // Fetch questions (without correct answers)
  const { data: questions, error: questionsError } = await supabase
    .from('quiz_questions')
    .select('id, question_text, options, explanation, order_index')
    .eq('quiz_id', quizId)
    .order('order_index', { ascending: true });

  if (questionsError) {
    return NextResponse.json(
      { error: 'Failed to fetch quiz questions' },
      { status: 500 }
    );
  }

  // Get user attempts
  const { data: courseProgress } = await supabase
    .from('course_progress')
    .select('quiz_attempts, quiz_score')
    .eq('user_id', user.id)
    .eq('course_id', quiz.course_id)
    .single();

  return NextResponse.json({
    id: quiz.id,
    courseId: quiz.course_id,
    passingScore: quiz.passing_score,
    maxAttempts: quiz.max_attempts,
    questions: (questions || []).map((q: any) => ({
      id: q.id,
      text: q.question_text,
      options: q.options,
      explanation: q.explanation,
    })),
    attempts: courseProgress?.quiz_attempts || 0,
    previousScore: courseProgress?.quiz_score || null,
  });
}