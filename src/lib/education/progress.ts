// Progress tracking - Data access and manipulation
import { createClient } from '@/lib/supabase/client';
import { CourseProgress, CourseProgressRow } from '@/types/education';

export async function getCourseProgress(userId: string, courseId: string): Promise<CourseProgress | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('course_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .single();

  if (error || !data) {
    return null;
  }

  return mapCourseProgressRow(data);
}

export async function getAllUserProgress(userId: string): Promise<CourseProgress[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('course_progress')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user progress:', error);
    return [];
  }

  return (data || []).map(mapCourseProgressRow);
}

export async function markLessonComplete(userId: string, courseId: string, lessonId: string): Promise<CourseProgress> {
  const supabase = createClient();
  
  // Get current progress or create new
  const { data: existing } = await supabase
    .from('course_progress')
    .select('lessons_completed')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .single();

  let lessonsCompleted: string[] = [];
  
  if (existing) {
    // Check if lesson already completed
    if (existing.lessons_completed && existing.lessons_completed.includes(lessonId)) {
      // Already completed
      const { data } = await supabase
        .from('course_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .single();
      return data ? mapCourseProgressRow(data) : null as any;
    }
    lessonsCompleted = [...existing.lessons_completed, lessonId];
  } else {
    lessonsCompleted = [lessonId];
  }

  // Upsert progress
  const { data, error } = await supabase
    .from('course_progress')
    .upsert({
      user_id: userId,
      course_id: courseId,
      lessons_completed: lessonsCompleted,
    }, {
      onConflict: 'user_id,course_id'
    })
    .select()
    .single();

  if (error) {
    console.error('Error marking lesson complete:', error);
    throw error;
  }

  return mapCourseProgressRow(data);
}

export async function updateQuizScore(
  userId: string, 
  courseId: string, 
  score: number, 
  attempts: number
): Promise<CourseProgress> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('course_progress')
    .upsert({
      user_id: userId,
      course_id: courseId,
      quiz_score: score,
      quiz_attempts: attempts,
    }, {
      onConflict: 'user_id,course_id'
    })
    .select()
    .single();

  if (error) {
    console.error('Error updating quiz score:', error);
    throw error;
  }

  return mapCourseProgressRow(data);
}

export async function markCourseCompleted(userId: string, courseId: string): Promise<CourseProgress> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('course_progress')
    .upsert({
      user_id: userId,
      course_id: courseId,
      completed_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,course_id'
    })
    .select()
    .single();

  if (error) {
    console.error('Error marking course completed:', error);
    throw error;
  }

  return mapCourseProgressRow(data);
}

export async function calculatePathProgress(userId: string, path: string): Promise<number> {
  const supabase = createClient();
  
  // Get all courses for this path
  const { data: courses } = await supabase
    .from('courses')
    .select('id')
    .eq('path', path);

  if (!courses || courses.length === 0) return 0;

  // Get progress for all courses in path
  const courseIds = courses.map(c => c.id);
  const { data: progress } = await supabase
    .from('course_progress')
    .select('lessons_completed, completed_at')
    .eq('user_id', userId)
    .in('course_id', courseIds);

  if (!progress || progress.length === 0) return 0;

  // Calculate total completed courses vs total courses
  const completedCourses = progress.filter(p => p.completed_at !== null).length;
  return (completedCourses / courses.length) * 100;
}

function mapCourseProgressRow(row: CourseProgressRow): CourseProgress {
  return {
    id: row.id,
    userId: row.user_id,
    courseId: row.course_id,
    lessonsCompleted: row.lessons_completed || [],
    quizScore: row.quiz_score ?? undefined,
    quizAttempts: row.quiz_attempts,
    completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
    certificateIssued: row.certificate_issued,
    certificateUrl: row.certificate_url ?? undefined,
    createdAt: row.created_at ? new Date(row.created_at) : undefined,
  };
}