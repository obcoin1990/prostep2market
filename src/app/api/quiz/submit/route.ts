// Quiz Submit API - Server-side scoring
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { quizId, answers } = body;

  if (!quizId || !answers) {
    return NextResponse.json(
      { error: 'Quiz ID and answers are required' },
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

  // Fetch quiz with correct answers
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

  // Check attempts
  const { data: existingProgress } = await supabase
    .from('course_progress')
    .select('quiz_attempts, completed_at')
    .eq('user_id', user.id)
    .eq('course_id', quiz.course_id)
    .single();

  const currentAttempts = existingProgress?.quiz_attempts || 0;
  
  if (currentAttempts >= quiz.max_attempts) {
    return NextResponse.json(
      { error: 'Maximum attempts reached' },
      { status: 400 }
    );
  }

  // Fetch questions with correct answers
  const { data: questions, error: questionsError } = await supabase
    .from('quiz_questions')
    .select('id, correct_index')
    .eq('quiz_id', quizId);

  if (questionsError || !questions) {
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }

  // Calculate score server-side (CRITICAL: don't trust client scores)
  let correctCount = 0;
  const questionResults: Record<string, { correct: boolean; correctIndex: number; explanation?: string }> = {};

  for (const question of questions) {
    const userAnswer = answers[question.id];
    const isCorrect = userAnswer === question.correct_index;
    
    if (isCorrect) {
      correctCount++;
    }

    // Get explanation
    const { data: fullQuestion } = await supabase
      .from('quiz_questions')
      .select('explanation')
      .eq('id', question.id)
      .single();

    questionResults[question.id] = {
      correct: isCorrect,
      correctIndex: question.correct_index,
      explanation: fullQuestion?.explanation || undefined,
    };
  }

  const totalQuestions = questions.length;
  const score = Math.round((correctCount / totalQuestions) * 100);
  const passed = score >= quiz.passing_score;

  // Update progress
  const newAttempts = currentAttempts + 1;
  
  await supabase
    .from('course_progress')
    .upsert({
      user_id: user.id,
      course_id: quiz.course_id,
      quiz_score: score,
      quiz_attempts: newAttempts,
    }, {
      onConflict: 'user_id,course_id'
    });

  // If passed and first time, issue certificate
  if (passed && !existingProgress?.completed_at) {
    // Mark course as completed
    await supabase
      .from('course_progress')
      .update({
        completed_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .eq('course_id', quiz.course_id);

    // TODO: Issue certificate via certificates.ts
  }

  return NextResponse.json({
    score,
    passed,
    totalQuestions,
    correctCount,
    passingScore: quiz.passing_score,
    results: questionResults,
    attemptsRemaining: quiz.max_attempts - newAttempts,
  });
}