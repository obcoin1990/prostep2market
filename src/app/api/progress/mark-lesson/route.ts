import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { markLessonComplete } from '@/lib/education/progress';

/**
 * POST /api/progress/mark-lesson - Mark a lesson as complete for the authenticated user
 * Body: { courseId: string, lessonId: string }
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { courseId, lessonId } = body;

    if (!courseId || typeof courseId !== 'string') {
      return NextResponse.json({ error: 'courseId is required' }, { status: 400 });
    }
    if (!lessonId || typeof lessonId !== 'string') {
      return NextResponse.json({ error: 'lessonId is required' }, { status: 400 });
    }

    const progress = await markLessonComplete(user.id, courseId, lessonId);

    return NextResponse.json({ progress });
  } catch (error) {
    console.error('Error marking lesson complete:', error);
    return NextResponse.json({ error: 'Failed to mark lesson complete' }, { status: 500 });
  }
}
