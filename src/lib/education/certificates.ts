// Certificates - PDF generation using pdf-lib
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { createClient } from '@/lib/supabase/server';
import { CertificateData } from '@/types/education';

export async function generateCertificate(data: CertificateData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]); // A4 landscape
  const { width, height } = page.getSize();

  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Background
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: rgb(0.98, 0.98, 0.99),
  });

  // Decorative border
  page.drawRectangle({
    x: 30,
    y: 30,
    width: width - 60,
    height: height - 60,
    borderColor: rgb(0.1, 0.3, 0.5),
    borderWidth: 2,
  });

  // Inner border
  page.drawRectangle({
    x: 40,
    y: 40,
    width: width - 80,
    height: height - 80,
    borderColor: rgb(0.2, 0.4, 0.6),
    borderWidth: 1,
  });

  // Title
  page.drawText('Certificate of Completion', {
    x: width / 2 - 150,
    y: height - 120,
    size: 30,
    font: timesRomanBoldFont,
    color: rgb(0.1, 0.3, 0.5),
  });

  // Decorative line
  page.drawLine({
    start: { x: width / 2 - 120, y: height - 135 },
    end: { x: width / 2 + 120, y: height - 135 },
    thickness: 1,
    color: rgb(0.3, 0.5, 0.7),
  });

  // "This certifies that"
  page.drawText('This certifies that', {
    x: width / 2 - 55,
    y: height - 180,
    size: 14,
    font: timesRomanFont,
    color: rgb(0.4, 0.4, 0.4),
  });

  // User name
  page.drawText(data.userName, {
    x: width / 2 - 100,
    y: height - 220,
    size: 28,
    font: timesRomanBoldFont,
    color: rgb(0, 0, 0),
  });

  // Decorative line under name
  page.drawLine({
    start: { x: width / 2 - 80, y: height - 230 },
    end: { x: width / 2 + 80, y: height - 230 },
    thickness: 0.5,
    color: rgb(0.5, 0.5, 0.5),
  });

  // "has successfully completed"
  page.drawText('has successfully completed', {
    x: width / 2 - 75,
    y: height - 270,
    size: 14,
    font: timesRomanFont,
    color: rgb(0.3, 0.3, 0.3),
  });

  // Course name
  page.drawText(data.courseName, {
    x: width / 2 - 120,
    y: height - 310,
    size: 22,
    font: timesRomanBoldFont,
    color: rgb(0, 0.5, 0.3),
  });

  // Date
  page.drawText(`Date: ${data.completionDate}`, {
    x: 60,
    y: 60,
    size: 10,
    font: helveticaFont,
    color: rgb(0.4, 0.4, 0.4),
  });

  // Certificate ID
  page.drawText(`Certificate ID: ${data.certificateId}`, {
    x: width - 220,
    y: 60,
    size: 10,
    font: helveticaFont,
    color: rgb(0.4, 0.4, 0.4),
  });

  // Prostep2market branding
  page.drawText('Prostep2market', {
    x: width / 2 - 50,
    y: height - 420,
    size: 16,
    font: timesRomanBoldFont,
    color: rgb(0.2, 0.2, 0.2),
  });

  return pdfDoc.save();
}

export async function issueCertificate(
  userId: string,
  courseId: string,
  userName: string,
  courseName: string
): Promise<string> {
  const supabase = await createClient();

  // Generate certificate ID
  const certificateId = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  
  // Generate PDF
  const certificateData: CertificateData = {
    userName,
    courseName,
    completionDate: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    certificateId,
  };

  const pdfBytes = await generateCertificate(certificateData);

  // Upload to Supabase Storage
  const fileName = `certificates/${userId}/${courseId}/${certificateId}.pdf`;
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('certificates')
    .upload(fileName, pdfBytes, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (uploadError) {
    console.error('Error uploading certificate:', uploadError);
    throw uploadError;
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('certificates')
    .getPublicUrl(fileName);

  // Update course_progress with certificate info
  await supabase
    .from('course_progress')
    .upsert({
      user_id: userId,
      course_id: courseId,
      certificate_issued: true,
      certificate_url: publicUrl,
      completed_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,course_id'
    });

  return publicUrl;
}

export async function getUserCertificates(userId: string): Promise<Array<{
  id: string;
  courseId: string;
  courseName: string;
  certificateUrl: string;
  completedAt: Date;
}>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('course_progress')
    .select(`
      id,
      course_id,
      certificate_url,
      completed_at,
      courses (
        title
      )
    `)
    .eq('user_id', userId)
    .eq('certificate_issued', true)
    .not('certificate_url', 'is', null);

  if (error) {
    console.error('Error fetching certificates:', error);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    courseId: row.course_id,
    courseName: row.courses?.title || 'Unknown Course',
    certificateUrl: row.certificate_url,
    completedAt: new Date(row.completed_at),
  }));
}