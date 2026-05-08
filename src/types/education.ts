// Education Hub TypeScript Type Definitions

export type LearningPath = 'beginner' | 'intermediate' | 'advanced' | 'psychology-first';

export interface LearningPathConfig {
  id: LearningPath;
  name: string;
  description: string;
  courses: Course[];
  recommendedFor: string[];
}

export interface Course {
  id: string;
  path: LearningPath;
  title: string;
  description: string;
  type: 'video' | 'interactive' | 'case-study' | 'workshop';
  durationMinutes: number;
  orderIndex: number;
  lessons?: Lesson[];
  quiz?: Quiz;
  certificateEligible: boolean;
}

export interface Lesson {
  id: string;
  courseId: string;
  order: number;
  title: string;
  content: string;
  type: 'reading' | 'video' | 'interactive';
  durationMinutes: number;
}

export interface Quiz {
  id: string;
  courseId: string;
  questions: QuizQuestion[];
  passingScore: number;
  maxAttempts: number;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface CourseProgress {
  id: string;
  userId: string;
  courseId: string;
  lessonsCompleted: string[];
  quizScore?: number;
  quizAttempts: number;
  completedAt?: Date;
  certificateIssued: boolean;
  certificateUrl?: string;
  createdAt?: Date;
}

export interface Badge {
  id: string;
  userId: string;
  type: BadgeType;
  name: string;
  description?: string;
  awardedAt: Date;
  courseId?: string;
}

export type BadgeType = 
  | 'first_course_complete' 
  | 'path_complete' 
  | 'quiz_perfect' 
  | 'streak_7_days' 
  | 'all_courses_complete';

export interface CertificateData {
  userName: string;
  courseName: string;
  completionDate: string;
  certificateId: string;
}

// Database row types (from Supabase)
export interface CourseRow {
  id: string;
  path: string;
  title: string;
  description: string | null;
  type: string;
  duration_minutes: number;
  order_index: number;
  certificate_eligible: boolean;
}

export interface LessonRow {
  id: string;
  course_id: string;
  title: string;
  content: string;
  type: string;
  duration_minutes: number;
  order_index: number;
}

export interface QuizRow {
  id: string;
  course_id: string;
  passing_score: number;
  max_attempts: number;
}

export interface QuizQuestionRow {
  id: string;
  quiz_id: string;
  question_text: string;
  options: string[];
  correct_index: number;
  explanation: string | null;
  order_index: number;
}

export interface CourseProgressRow {
  id: string;
  user_id: string;
  course_id: string;
  lessons_completed: string[];
  quiz_score: number | null;
  quiz_attempts: number;
  completed_at: string | null;
  certificate_issued: boolean;
  certificate_url: string | null;
  created_at: string;
}

export interface BadgeRow {
  id: string;
  user_id: string;
  type: string;
  name: string;
  description: string | null;
  awarded_at: string;
  course_id: string | null;
}