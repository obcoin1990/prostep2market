'use client'

import {
  Document, Page, Text, View, StyleSheet, Font, Image,
} from '@react-pdf/renderer'

Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiJ-Ek-_EeA.woff', fontWeight: 700 },
  ],
})

const S = StyleSheet.create({
  page: {
    fontFamily: 'Inter',
    backgroundColor: '#ffffff',
    padding: 0,
  },
  border: {
    position: 'absolute',
    top: 20, left: 20, right: 20, bottom: 20,
    border: '3pt solid #6366f1',
    borderRadius: 8,
  },
  innerBorder: {
    position: 'absolute',
    top: 26, left: 26, right: 26, bottom: 26,
    border: '1pt solid #c7d2fe',
    borderRadius: 6,
  },
  content: {
    padding: '60pt 70pt',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 0,
  },
  logo: {
    fontSize: 22,
    fontWeight: 700,
    color: '#6366f1',
    letterSpacing: 2,
    marginBottom: 8,
  },
  logoSub: {
    fontSize: 9,
    color: '#a5b4fc',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 36,
  },
  headline: {
    fontSize: 11,
    color: '#6b7280',
    letterSpacing: 4,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  recipientName: {
    fontSize: 36,
    fontWeight: 700,
    color: '#111827',
    marginBottom: 16,
  },
  divider: {
    width: 80,
    height: 2,
    backgroundColor: '#6366f1',
    marginBottom: 16,
  },
  bodyText: {
    fontSize: 12,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 1.6,
    marginBottom: 8,
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: '#4338ca',
    textAlign: 'center',
    marginBottom: 6,
    marginTop: 4,
  },
  dateRow: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 40,
    marginTop: 6,
  },
  signaturesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 12,
  },
  signatureBlock: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '30%',
  },
  signatureLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#d1d5db',
    marginBottom: 6,
  },
  signatureLabel: {
    fontSize: 9,
    color: '#9ca3af',
    textAlign: 'center',
  },
  signatureName: {
    fontSize: 10,
    color: '#374151',
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: 2,
  },
  verifyRow: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  verifyText: {
    fontSize: 8,
    color: '#9ca3af',
  },
  verifyCode: {
    fontSize: 8,
    color: '#6366f1',
    fontWeight: 700,
  },
  badge: {
    position: 'absolute',
    top: 40,
    right: 60,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#eef2ff',
    border: '2pt solid #6366f1',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 7,
    color: '#4338ca',
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
})

interface CertificatePDFProps {
  recipientName:  string
  courseTitle:    string
  issueDate:      string
  verifyToken:    string
  appUrl:         string
  instructorName: string
  orgName:        string
}

export function CertificatePDF({
  recipientName,
  courseTitle,
  issueDate,
  verifyToken,
  appUrl,
  instructorName,
  orgName,
}: CertificatePDFProps) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={S.page}>
        {/* Decorative borders */}
        <View style={S.border} />
        <View style={S.innerBorder} />

        {/* Badge top-right */}
        <View style={S.badge}>
          <Text style={S.badgeText}>{'VERIFIED\nCERT'}</Text>
        </View>

        {/* Main content */}
        <View style={S.content}>
          <Text style={S.logo}>ProStep</Text>
          <Text style={S.logoSub}>Corporate Learning Platform</Text>

          <Text style={S.headline}>Certificate of Completion</Text>

          <Text style={S.bodyText}>This is to certify that</Text>

          <Text style={S.recipientName}>{recipientName}</Text>

          <View style={S.divider} />

          <Text style={S.bodyText}>has successfully completed the course</Text>

          <Text style={S.courseTitle}>{courseTitle}</Text>

          <Text style={S.dateRow}>Issued on {issueDate}</Text>

          {/* Signatures */}
          <View style={S.signaturesRow}>
            <View style={S.signatureBlock}>
              <View style={S.signatureLine} />
              <Text style={S.signatureName}>{instructorName}</Text>
              <Text style={S.signatureLabel}>Course Instructor</Text>
            </View>
            <View style={S.signatureBlock}>
              <View style={S.signatureLine} />
              <Text style={S.signatureName}>{orgName}</Text>
              <Text style={S.signatureLabel}>Organization</Text>
            </View>
            <View style={S.signatureBlock}>
              <View style={S.signatureLine} />
              <Text style={S.signatureName}>ProStep Platform</Text>
              <Text style={S.signatureLabel}>Certification Authority</Text>
            </View>
          </View>

          {/* Verify link */}
          <View style={S.verifyRow}>
            <Text style={S.verifyText}>Verify at:</Text>
            <Text style={S.verifyCode}>{appUrl}/verify/{verifyToken}</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}
