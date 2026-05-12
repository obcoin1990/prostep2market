// Badges - Badge awarding logic
import { createClient } from '@/lib/supabase/server';
import { Badge, BadgeRow } from '@/types/education';

export async function getUserBadges(userId: string): Promise<Badge[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('badges')
    .select('*')
    .eq('user_id', userId)
    .order('awarded_at', { ascending: false });

  if (error) {
    console.error('Error fetching badges:', error);
    return [];
  }

  return (data || []).map(mapBadgeRow);
}

export async function checkAndAwardBadge(
  userId: string, 
  type: Badge['type'], 
  courseId?: string
): Promise<Badge | null> {
  const supabase = await createClient();
  
  // Check if badge already exists
  const { data: existing } = await supabase
    .from('badges')
    .select('*')
    .eq('user_id', userId)
    .eq('type', type)
    .eq('course_id', courseId || null)
    .single();

  if (existing) {
    return null; // Badge already awarded
  }

  // Define badge details
  const badgeDetails = getBadgeDetails(type);

  const { data, error } = await supabase
    .from('badges')
    .insert({
      user_id: userId,
      type,
      name: badgeDetails.name,
      description: badgeDetails.description,
      course_id: courseId || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error awarding badge:', error);
    return null;
  }

  return data ? mapBadgeRow(data) : null;
}

export async function checkFirstCourseComplete(userId: string, courseId: string): Promise<Badge | null> {
  return checkAndAwardBadge(userId, 'first_course_complete', courseId);
}

export async function checkQuizPerfect(userId: string, courseId: string): Promise<Badge | null> {
  return checkAndAwardBadge(userId, 'quiz_perfect', courseId);
}

export async function checkPathComplete(userId: string, path: string): Promise<Badge | null> {
  const supabase = await createClient();
  
  // Get all courses in path
  const { data: courses } = await supabase
    .from('courses')
    .select('id')
    .eq('path', path);

  if (!courses || courses.length === 0) return null;

  // Check if all courses are completed
  const courseIds = courses.map(c => c.id);
  const { data: progress } = await supabase
    .from('course_progress')
    .select('completed_at')
    .eq('user_id', userId)
    .in('course_id', courseIds)
    .not('completed_at', 'is', null);

  if (progress && progress.length === courses.length) {
    return checkAndAwardBadge(userId, 'path_complete');
  }

  return null;
}

function getBadgeDetails(type: Badge['type']): { name: string; description: string } {
  const details = {
    first_course_complete: {
      name: 'First Steps',
      description: 'Completed your first course',
    },
    path_complete: {
      name: 'Path Master',
      description: 'Completed all courses in a learning path',
    },
    quiz_perfect: {
      name: 'Perfect Score',
      description: 'Scored 100% on a course quiz',
    },
    streak_7_days: {
      name: '7-Day Streak',
      description: 'Logged in and learned for 7 consecutive days',
    },
    all_courses_complete: {
      name: 'Trading Scholar',
      description: 'Completed all available courses',
    },
  };

  return details[type];
}

function mapBadgeRow(row: BadgeRow): Badge {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type as Badge['type'],
    name: row.name,
    description: row.description ?? undefined,
    awardedAt: new Date(row.awarded_at),
    courseId: row.course_id ?? undefined,
  };
}