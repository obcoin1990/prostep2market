// Course Player Page
import { getCourseById } from '@/lib/education/courses';
import { getCourseProgress } from '@/lib/education/progress';
import { createClient } from '@/lib/supabase/server';
import { ClientLessonPlayer } from './ClientLessonPlayer';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, CheckCircle, Circle, Clock, BookOpen } from 'lucide-react';

interface CoursePageProps {
  params: Promise<{ pathId: string; courseId: string }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const resolvedParams = await params;
  const course = await getCourseById(resolvedParams.courseId);

  if (!course) {
    notFound();
  }

  const lessons = course.lessons || [];

  // Get real user progress
  const progress = await getCourseProgress(user.id, course.id);
  const completedLessons = progress?.lessonsCompleted || [];
  
  // Get the first incomplete lesson, or the first lesson
  const currentLessonId = lessons.find(l => !completedLessons.includes(l.id))?.id || lessons[0]?.id;
  const currentLesson = lessons.find(l => l.id === currentLessonId) || lessons[0];

  // Quiz info
  const quiz = course.quiz;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href={`/education/${resolvedParams.pathId}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {course.path}
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{course.title}</h1>
              <p className="text-muted-foreground text-sm mt-1">{course.description}</p>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {lessons.length} lessons
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {Math.floor(course.durationMinutes / 60)}h {course.durationMinutes % 60}m
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar - Lesson List */}
          <div className="w-80 flex-shrink-0">
            <div className="rounded-lg border bg-card sticky top-6">
              <div className="p-4 border-b">
                <h2 className="font-semibold">Course Content</h2>
                <div className="text-sm text-muted-foreground mt-1">
                  {completedLessons.length} of {lessons.length} completed
                </div>
              </div>
              
              <div className="divide-y max-h-[60vh] overflow-y-auto">
                {lessons.map((lesson, index) => {
                  const isCompleted = completedLessons.includes(lesson.id);
                  const isCurrent = lesson.id === currentLessonId;
                  
                  return (
                    <Link
                      key={lesson.id}
                      href={`?lesson=${lesson.id}`}
                      className={`block p-4 hover:bg-muted/50 transition-colors ${
                        isCurrent ? 'bg-primary/5 border-l-2 border-primary' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {isCompleted ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">
                            {index + 1}. {lesson.title}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                            <span className="capitalize">{lesson.type}</span>
                            <span>•</span>
                            <span>{lesson.durationMinutes} min</span>
                          </div>
                        </div>
                        {isCurrent && (
                          <ChevronRight className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Quiz Section */}
              {quiz && (
                <div className="p-4 border-t">
                  <h3 className="font-medium mb-2">Course Quiz</h3>
                  <div className="text-sm text-muted-foreground mb-3">
                    {quiz.questions.length} questions • {quiz.passingScore}% to pass
                  </div>
                  <Link
                    href={`/education/quiz/${quiz.id}`}
                    className="inline-flex items-center justify-center w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Take Quiz
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Main Content - Lesson Player */}
          <div className="flex-1 min-w-0">
            {currentLesson ? (
              <ClientLessonPlayer 
                lesson={currentLesson}
                isCompleted={completedLessons.includes(currentLesson.id)}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No lessons available.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}