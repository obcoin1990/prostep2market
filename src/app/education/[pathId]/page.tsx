// Education Path Detail Page
import { getLearningPath, getAllPathIds } from '@/lib/education/paths';
import { getCoursesByPath } from '@/lib/education/courses';
import { CourseCard } from '@/components/education/CourseCard';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

interface PathPageProps {
  params: Promise<{ pathId: string }>;
}

export async function generateStaticParams() {
  const pathIds = getAllPathIds();
  return pathIds.map((id) => ({ pathId: id }));
}

export async function generateMetadata({ params }: PathPageProps) {
  const resolvedParams = await params;
  const path = await getLearningPath(resolvedParams.pathId);
  
  if (!path) {
    return { title: 'Path Not Found' };
  }

  return {
    title: `${path.name} - Education Hub`,
    description: path.description,
  };
}

export default async function PathPage({ params }: PathPageProps) {
  const resolvedParams = await params;

  // Auth guard
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const path = await getLearningPath(resolvedParams.pathId);

  if (!path) {
    notFound();
  }

  const courses = await getCoursesByPath(resolvedParams.pathId as any);
  const totalMinutes = courses.reduce((sum, c) => sum + c.durationMinutes, 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // Fetch which courses this user has started/enrolled in
  const courseIds = courses.map((c) => c.id);
  let enrolledCourseIds = new Set<string>();
  if (courseIds.length > 0) {
    const { data: progressRows } = await supabase
      .from('course_progress')
      .select('course_id')
      .eq('user_id', user!.id)
      .in('course_id', courseIds);
    enrolledCourseIds = new Set((progressRows || []).map((r: any) => r.course_id));
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <Link 
            href="/education"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Education Hub
          </Link>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{path.name}</h1>
              <p className="text-muted-foreground max-w-xl">{path.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{courses.length}</div>
              <div className="text-sm text-muted-foreground">Courses</div>
              <div className="text-sm text-muted-foreground mt-1">
                {hours}h {minutes}m total
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended For */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Recommended For</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {path.recommendedFor.map((tag) => (
              <span 
                key={tag} 
                className="text-sm px-3 py-1 rounded-full bg-background border"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Courses List */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold mb-6">Courses in this Path</h2>
        
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No courses available in this path yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            {courses.map((course) => (
              <CourseCard 
                key={course.id} 
                course={course}
                isEnrolled={enrolledCourseIds.has(course.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}