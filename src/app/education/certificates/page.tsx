// Certificates Page - User's earned certificates
import { getUserCertificates } from '@/lib/education/certificates';
import { createClient } from '@/lib/supabase/server';
import { CertificateCard } from '@/components/education/CertificateCard';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Award, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'My Certificates - Prostep2market',
  description: 'View and download your earned course completion certificates.',
};

export default async function CertificatesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const certificates = await getUserCertificates(user.id);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b bg-card/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Award className="h-8 w-8 text-amber-500" />
            <h1 className="text-3xl font-bold">My Certificates</h1>
          </div>
          <p className="text-muted-foreground">
            Your earned course completion certificates
          </p>
        </div>
      </section>

      {/* Certificates Grid */}
      <section className="container mx-auto px-4 py-8">
        {certificates.length === 0 ? (
          <div className="rounded-lg border bg-card p-12 text-center">
            <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No certificates yet</h2>
            <p className="text-muted-foreground mb-6">
              Complete a course and pass the quiz to earn your first certificate.
            </p>
            <Link
              href="/education"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Start Learning
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {certificates.map((cert) => (
              <CertificateCard
                key={cert.id}
                certificateId={cert.id}
                courseName={cert.courseName}
                completedAt={cert.completedAt}
                certificateUrl={cert.certificateUrl}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}