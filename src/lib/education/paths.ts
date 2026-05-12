// Learning Paths - Data access functions
import { createClient } from '@/lib/supabase/server';
import { LearningPathConfig, LearningPath, Course } from '@/types/education';

// Static path configurations (metadata - actual courses come from database)
const pathMetadata: Record<LearningPath, Omit<LearningPathConfig, 'courses'>> = {
  beginner: {
    id: 'beginner',
    name: 'Beginner Trader',
    description: 'Start your trading journey with foundational knowledge. Perfect for those new to financial markets.',
    recommendedFor: ['New traders', 'Those wanting to understand basics', 'Anyone seeking structured learning'],
  },
  intermediate: {
    id: 'intermediate',
    name: 'Intermediate Trader',
    description: 'Build on fundamentals with technical analysis and price action strategies. Take your trading to the next level.',
    recommendedFor: ['Traders with 6+ months experience', 'Those wanting technical skills', 'Traders who know the basics'],
  },
  advanced: {
    id: 'advanced',
    name: 'Advanced Trader',
    description: 'Master institutional-level concepts and advanced market analysis. Learn how the pros view the markets.',
    recommendedFor: ['Experienced traders', 'Those wanting institutional knowledge', 'Traders seeking an edge'],
  },
  'psychology-first': {
    id: 'psychology-first',
    name: 'Psychology-First Trader',
    description: 'Build the mental foundation for trading success. Master emotional control and develop winning habits.',
    recommendedFor: ['Traders struggling with emotions', 'Those who have blown accounts', 'Anyone wanting psychological edge'],
  },
};

export async function getLearningPaths(): Promise<LearningPathConfig[]> {
  const supabase = await createClient();
  
  // Fetch all courses from database
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .order('path', { ascending: true })
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Error fetching courses:', error);
    return [];
  }

  // Group courses by path
  const coursesByPath: Record<string, Course[]> = {};
  
  courses?.forEach((course) => {
    const path = course.path as LearningPath;
    if (!coursesByPath[path]) {
      coursesByPath[path] = [];
    }
    
    coursesByPath[path].push({
      id: course.id,
      path: course.path as LearningPath,
      title: course.title,
      description: course.description || '',
      type: course.type as Course['type'],
      durationMinutes: course.duration_minutes,
      orderIndex: course.order_index,
      certificateEligible: course.certificate_eligible,
    });
  });

  // Build learning path configs
  const learningPaths: LearningPathConfig[] = (Object.keys(pathMetadata) as LearningPath[]).map((pathId) => {
    const metadata = pathMetadata[pathId];
    return {
      ...metadata,
      courses: coursesByPath[pathId] || [],
    };
  });

  return learningPaths;
}

export async function getLearningPath(pathId: string): Promise<LearningPathConfig | null> {
  const paths = await getLearningPaths();
  return paths.find((p) => p.id === pathId) || null;
}

export function getPathInfo(pathId: LearningPath): Omit<LearningPathConfig, 'courses'> | null {
  return pathMetadata[pathId] || null;
}

export function getAllPathIds(): LearningPath[] {
  return ['beginner', 'intermediate', 'advanced', 'psychology-first'];
}