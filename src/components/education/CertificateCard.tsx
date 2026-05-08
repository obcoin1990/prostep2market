'use client';

import { Download, Share2, Award } from 'lucide-react';
import { useState } from 'react';

interface CertificateCardProps {
  certificateId: string;
  courseName: string;
  completedAt: Date;
  certificateUrl: string;
}

export function CertificateCard({ 
  certificateId, 
  courseName, 
  completedAt, 
  certificateUrl 
}: CertificateCardProps) {
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    window.open(certificateUrl, '_blank');
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(certificateUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formattedDate = completedAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="rounded-lg border bg-card p-6">
      {/* Certificate Preview Thumbnail */}
      <div className="aspect-[1.414] bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg mb-4 flex items-center justify-center border">
        <div className="text-center p-4">
          <Award className="h-12 w-12 text-amber-500 mx-auto mb-2" />
          <div className="text-xs text-amber-800 font-medium">Certificate</div>
        </div>
      </div>

      {/* Certificate Info */}
      <h3 className="font-semibold mb-1 truncate">{courseName}</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Completed {formattedDate}
      </p>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleDownload}
          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
        >
          <Download className="h-4 w-4" />
          Download
        </button>
        <button
          onClick={handleShare}
          className="inline-flex items-center justify-center px-3 py-2 rounded-lg border hover:bg-accent text-sm"
        >
          <Share2 className="h-4 w-4" />
          {copied ? 'Copied!' : 'Share'}
        </button>
      </div>
    </div>
  );
}