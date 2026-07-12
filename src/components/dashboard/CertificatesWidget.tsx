'use client';

import Link from 'next/link';
import { Award, ArrowRight, Download, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Certificate } from '@/hooks/useCertificates';

interface CertificatesWidgetProps {
  certificates: Certificate[];
  isLoading: boolean;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function CertificatesWidget({ certificates, isLoading }: CertificatesWidgetProps) {
  return (
    <Card style={{ backgroundColor: '#1e2329', border: '1px solid #2b3139' }}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4" style={{ color: '#fcd535' }} />
          <CardTitle className="text-sm font-semibold" style={{ color: '#eaecef' }}>
            Certificates
          </CardTitle>
          {!isLoading && certificates.length > 0 && (
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: 'rgba(252,213,53,0.15)', color: '#fcd535' }}
            >
              {certificates.length}
            </span>
          )}
        </div>
        <Link
          href="/education/certificates"
          className="flex items-center gap-1 text-xs font-medium transition-opacity hover:opacity-70"
          style={{ color: '#fcd535' }}
        >
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </CardHeader>

      <CardContent className="pt-1">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((n) => (
              <Skeleton key={n} className="h-14 w-full rounded-lg" style={{ backgroundColor: '#2b3139' }} />
            ))}
          </div>
        ) : certificates.length === 0 ? (
          <div className="py-6 text-center">
            <Award className="w-8 h-8 mx-auto mb-2" style={{ color: '#2b3139' }} />
            <p className="text-xs" style={{ color: '#9ea3ad' }}>No certificates earned yet.</p>
            <Link
              href="/education"
              className="text-xs font-medium mt-1 inline-block transition-opacity hover:opacity-70"
              style={{ color: '#fcd535' }}
            >
              Start a course
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {certificates.slice(0, 4).map((cert) => (
              <div
                key={cert.id}
                className="flex items-center gap-3 p-2.5 rounded-lg"
                style={{ backgroundColor: 'rgba(252,213,53,0.05)', border: '1px solid rgba(252,213,53,0.1)' }}
              >
                {/* Badge icon */}
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(252,213,53,0.15)' }}
                >
                  <Award className="w-4 h-4" style={{ color: '#fcd535' }} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: '#eaecef' }}>
                    {cert.course?.title ?? cert.title}
                  </p>
                  <p className="text-[10px]" style={{ color: '#9ea3ad' }}>
                    Issued {formatDate(cert.issueDate)}
                  </p>
                </div>

                {/* Download / verify link */}
                <a
                  href={`/api/certificates/${cert.id}/pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Download PDF"
                  className="p-1 rounded transition-opacity hover:opacity-70 flex-shrink-0"
                  style={{ color: '#9ea3ad' }}
                >
                  <Download className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
