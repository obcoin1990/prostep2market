// Courses and Lessons - Data access functions
import { createClient } from '@/lib/supabase/server';
import { 
  Course, 
  Lesson, 
  Quiz, 
  QuizQuestion,
  CourseRow, 
  LessonRow, 
  QuizRow, 
  QuizQuestionRow,
  LearningPath 
} from '@/types/education';

export async function getCoursesByPath(path: LearningPath): Promise<Course[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('path', path)
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Error fetching courses by path:', error);
    return [];
  }

  return (data || []).map(mapCourseRow);
}

export async function getCourseById(courseId: string): Promise<Course | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .single();

  if (error) {
    console.error('Error fetching course:', error);
    return null;
  }

  if (!data) return null;

  // Fetch lessons for this course
  const lessons = await getLessonsByCourse(courseId);
  
  // Fetch quiz for this course
  const quiz = await getQuizByCourse(courseId);

  return {
    ...mapCourseRow(data),
    lessons,
    quiz: quiz ?? undefined,
  };
}

export async function getLessonsByCourse(courseId: string): Promise<Lesson[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', courseId)
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Error fetching lessons:', error);
    return [];
  }

  return (data || []).map(mapLessonRow);
}

export async function getLessonById(lessonId: string): Promise<Lesson | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', lessonId)
    .single();

  if (error) {
    console.error('Error fetching lesson:', error);
    return null;
  }

  return data ? mapLessonRow(data) : null;
}

export async function getQuizByCourse(courseId: string): Promise<Quiz | null> {
  const supabase = await createClient();
  
  const { data: quizData, error: quizError } = await supabase
    .from('quizzes')
    .select('*')
    .eq('course_id', courseId)
    .single();

  if (quizError || !quizData) {
    return null;
  }

  // Fetch questions for this quiz
  const { data: questionsData, error: questionsError } = await supabase
    .from('quiz_questions')
    .select('*')
    .eq('quiz_id', quizData.id)
    .order('order_index', { ascending: true });

  if (questionsError) {
    console.error('Error fetching quiz questions:', questionsError);
    return null;
  }

  return {
    id: quizData.id,
    courseId: quizData.course_id,
    passingScore: quizData.passing_score,
    maxAttempts: quizData.max_attempts,
    questions: (questionsData || []).map(mapQuizQuestionRow),
  };
}

export async function getQuizById(quizId: string): Promise<Quiz | null> {
  const supabase = await createClient();
  
  const { data: quizData, error: quizError } = await supabase
    .from('quizzes')
    .select('*')
    .eq('id', quizId)
    .single();

  if (quizError || !quizData) {
    return null;
  }

  // Fetch questions for this quiz
  const { data: questionsData, error: questionsError } = await supabase
    .from('quiz_questions')
    .select('*')
    .eq('quiz_id', quizId)
    .order('order_index', { ascending: true });

  if (questionsError) {
    console.error('Error fetching quiz questions:', questionsError);
    return null;
  }

  return {
    id: quizData.id,
    courseId: quizData.course_id,
    passingScore: quizData.passing_score,
    maxAttempts: quizData.max_attempts,
    questions: (questionsData || []).map(mapQuizQuestionRow),
  };
}

export async function getAllCourses(): Promise<Course[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('path', { ascending: true })
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Error fetching all courses:', error);
    return [];
  }

  return (data || []).map(mapCourseRow);
}

// Helper functions to map database rows to types
function mapCourseRow(row: CourseRow): Course {
  return {
    id: row.id,
    path: row.path as LearningPath,
    title: row.title,
    description: row.description || '',
    type: row.type as Course['type'],
    durationMinutes: row.duration_minutes,
    orderIndex: row.order_index,
    certificateEligible: row.certificate_eligible,
  };
}

function mapLessonRow(row: LessonRow): Lesson {
  return {
    id: row.id,
    courseId: row.course_id,
    order: row.order_index,
    title: row.title,
    content: row.content,
    type: row.type as Lesson['type'],
    durationMinutes: row.duration_minutes,
  };
}

function mapQuizQuestionRow(row: QuizQuestionRow): QuizQuestion {
  return {
    id: row.id,
    text: row.question_text,
    options: row.options,
    correctIndex: row.correct_index,
    explanation: row.explanation || undefined,
  };
}