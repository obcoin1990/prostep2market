'use client';

import { Award } from 'lucide-react';

interface CertificatePreviewProps {
  userName: string;
  courseName: string;
  completionDate: string;
  certificateId: string;
}

export function CertificatePreview({
  userName,
  courseName,
  completionDate,
  certificateId,
}: CertificatePreviewProps) {
  return (
    <div className="rounded-lg border overflow-hidden bg-card">
      {/* Preview Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 border-b">
        <h3 className="font-semibold">Certificate Preview</h3>
      </div>

      {/* Certificate Design */}
      <div className="p-6 bg-gradient-to-br from-amber-50 to-amber-100">
        <div className="rounded-lg border-2 border-amber-200 bg-white p-8 aspect-[1.414] flex flex-col">
          {/* Title */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Award className="h-8 w-8 text-amber-600" />
              <span className="text-xl font-bold text-amber-800">Certificate</span>
            </div>
            <div className="text-lg font-semibold text-gray-800">of Completion</div>
          </div>

          {/* Recipient */}
          <div className="text-center mb-4 flex-1 flex flex-col justify-center">
            <div className="text-sm text-gray-500 mb-1">This certifies that</div>
            <div className="text-2xl font-bold text-gray-900">{userName}</div>
            <div className="text-sm text-gray-500 mt-2">has successfully completed</div>
            <div className="text-lg font-semibold text-green-700 mt-2">{courseName}</div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-end text-xs text-gray-500">
            <div>Date: {completionDate}</div>
            <div className="text-right">
              <div>Certificate ID:</div>
              <div className="font-mono">{certificateId}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 border-t bg-muted/30">
        <div className="text-sm text-muted-foreground">
          This is how your certificate will appear. Click download to get the full PDF.
        </div>
      </div>
    </div>
  );
}