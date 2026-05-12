import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib'
import { prisma } from '@/lib/prisma'
import { requireAuth, apiError } from '@/lib/api'
import { format } from 'date-fns'

type Params = { params: { id: string } }

// Brand colors
const BRAND   = rgb(0.388, 0.400, 0.945)  // #6366f1
const BRAND_L = rgb(0.780, 0.816, 0.988)  // #c7d2fe
const DARK    = rgb(0.067, 0.094, 0.153)  // #111827
const GRAY    = rgb(0.420, 0.447, 0.502)  // #6b7280
const WHITE   = rgb(1, 1, 1)

// GET /api/certificates/[id]/pdf — stream PDF download
export async function GET(req: NextRequest, { params }: Params) {
  const { session, error } = await requireAuth()
  if (error) return error

  const cert = await prisma.certificate.findUnique({
    where:   { id: params.id },
    include: { user: { select: { name: true } } },
  })
  if (!cert) return apiError('Certificate not found', 404)

  if (cert.userId !== session!.user.id && session!.user.role === 'LEARNER') {
    return apiError('Forbidden', 403)
  }

  const course = await prisma.course.findUnique({
    where:  { id: cert.courseId },
    select: { title: true, author: { select: { name: true } } },
  })

  const org = await prisma.organization.findFirst({
    where:  { users: { some: { id: cert.userId } } },
    select: { name: true },
  })

  const recipientName  = cert.user?.name ?? 'Learner'
  const courseTitle    = course?.title ?? 'Course'
  const instructorName = course?.author?.name ?? 'ProStep Instructor'
  const orgName        = org?.name ?? 'ProStep'
  const issueDate      = format(cert.issueDate, 'MMMM d, yyyy')
  const verifyUrl      = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://prostep2market.vercel.app'}/verify/${cert.verifyToken}`

  // ── Build PDF ────────────────────────────────────────────────────
  const doc    = await PDFDocument.create()
  // A4 landscape: 841.89 x 595.28 pt
  const page   = doc.addPage([841.89, 595.28])
  const { width: W, height: H } = page.getSize()

  const fontBold   = await doc.embedFont(StandardFonts.HelveticaBold)
  const fontNormal = await doc.embedFont(StandardFonts.Helvetica)

  // ── Outer border ─────────────────────────────────────────────────
  page.drawRectangle({
    x: 20, y: 20,
    width: W - 40, height: H - 40,
    borderColor: BRAND, borderWidth: 3,
    color: WHITE,
  })
  // Inner accent border
  page.drawRectangle({
    x: 28, y: 28,
    width: W - 56, height: H - 56,
    borderColor: BRAND_L, borderWidth: 1,
    color: undefined,
  })

  // ── Decorative corner squares ─────────────────────────────────────
  const corners = [
    { x: 24, y: 24 }, { x: W - 36, y: 24 },
    { x: 24, y: H - 36 }, { x: W - 36, y: H - 36 },
  ]
  for (const c of corners) {
    page.drawRectangle({ x: c.x, y: c.y, width: 12, height: 12, color: BRAND })
  }

  // ── Brand name (top centre) ──────────────────────────────────────
  const logoText  = 'ProStep'
  const logoSize  = 28
  const logoWidth = fontBold.widthOfTextAtSize(logoText, logoSize)
  page.drawText(logoText, {
    x: (W - logoWidth) / 2, y: H - 80,
    size: logoSize, font: fontBold, color: BRAND,
  })

  const subText  = 'CORPORATE LEARNING PLATFORM'
  const subSize  = 8
  const subWidth = fontNormal.widthOfTextAtSize(subText, subSize)
  page.drawText(subText, {
    x: (W - subWidth) / 2, y: H - 96,
    size: subSize, font: fontNormal, color: BRAND_L,
  })

  // ── "Certificate of Completion" label ────────────────────────────
  const labelText  = 'CERTIFICATE OF COMPLETION'
  const labelSize  = 10
  const labelWidth = fontBold.widthOfTextAtSize(labelText, labelSize)
  page.drawText(labelText, {
    x: (W - labelWidth) / 2, y: H - 136,
    size: labelSize, font: fontBold, color: GRAY,
  })

  // ── "This is to certify that" ────────────────────────────────────
  const bodySize = 12
  const t1       = 'This is to certify that'
  page.drawText(t1, {
    x: (W - fontNormal.widthOfTextAtSize(t1, bodySize)) / 2,
    y: H - 170,
    size: bodySize, font: fontNormal, color: GRAY,
  })

  // ── Recipient name (large) ────────────────────────────────────────
  const nameSize  = 40
  const nameWidth = fontBold.widthOfTextAtSize(recipientName, nameSize)
  page.drawText(recipientName, {
    x: (W - nameWidth) / 2, y: H - 218,
    size: nameSize, font: fontBold, color: DARK,
  })

  // ── Divider line ─────────────────────────────────────────────────
  const lineY = H - 234
  page.drawLine({
    start: { x: W / 2 - 40, y: lineY },
    end:   { x: W / 2 + 40, y: lineY },
    thickness: 2, color: BRAND,
  })

  // ── "has successfully completed the course" ──────────────────────
  const t2 = 'has successfully completed the course'
  page.drawText(t2, {
    x: (W - fontNormal.widthOfTextAtSize(t2, bodySize)) / 2,
    y: H - 258,
    size: bodySize, font: fontNormal, color: GRAY,
  })

  // ── Course title ─────────────────────────────────────────────────
  const ctSize  = 22
  // Truncate if too long
  const maxCourseTitleWidth = W - 160
  let displayTitle = courseTitle
  while (
    fontBold.widthOfTextAtSize(displayTitle, ctSize) > maxCourseTitleWidth &&
    displayTitle.length > 10
  ) {
    displayTitle = displayTitle.slice(0, -4) + '…'
  }
  const ctWidth = fontBold.widthOfTextAtSize(displayTitle, ctSize)
  page.drawText(displayTitle, {
    x: (W - ctWidth) / 2, y: H - 292,
    size: ctSize, font: fontBold, color: BRAND,
  })

  // ── Issue date ───────────────────────────────────────────────────
  const dateText  = `Issued on ${issueDate}`
  const dateWidth = fontNormal.widthOfTextAtSize(dateText, 10)
  page.drawText(dateText, {
    x: (W - dateWidth) / 2, y: H - 316,
    size: 10, font: fontNormal, color: GRAY,
  })

  // ── Signature lines (3 columns) ──────────────────────────────────
  const sigY      = 90
  const lineLen   = 160
  const sigNames  = [instructorName, orgName, 'ProStep Platform']
  const sigRoles  = ['Course Instructor', 'Organization', 'Certification Authority']
  const sigXStarts = [W * 0.18, W * 0.44, W * 0.70]

  for (let i = 0; i < 3; i++) {
    const lx = sigXStarts[i]
    // Signature line
    page.drawLine({
      start: { x: lx, y: sigY }, end: { x: lx + lineLen, y: sigY },
      thickness: 1, color: rgb(0.82, 0.84, 0.87),
    })
    // Name above line
    const nameW = fontBold.widthOfTextAtSize(sigNames[i], 9)
    page.drawText(sigNames[i], {
      x: lx + (lineLen - nameW) / 2, y: sigY + 10,
      size: 9, font: fontBold, color: DARK,
    })
    // Role below line
    const roleW = fontNormal.widthOfTextAtSize(sigRoles[i], 8)
    page.drawText(sigRoles[i], {
      x: lx + (lineLen - roleW) / 2, y: sigY - 14,
      size: 8, font: fontNormal, color: GRAY,
    })
  }

  // ── Verify URL ────────────────────────────────────────────────────
  const vLabel = 'Verify at: '
  const vLabelW = fontNormal.widthOfTextAtSize(vLabel, 7)
  const vUrlW   = fontBold.widthOfTextAtSize(verifyUrl, 7)
  const vTotal  = vLabelW + vUrlW
  const vX      = (W - vTotal) / 2
  page.drawText(vLabel, {
    x: vX, y: 46,
    size: 7, font: fontNormal, color: GRAY,
  })
  page.drawText(verifyUrl, {
    x: vX + vLabelW, y: 46,
    size: 7, font: fontBold, color: BRAND,
  })

  // ── Verified badge (top-right) ────────────────────────────────────
  const badgeCX = W - 80
  const badgeCY = H - 80
  const badgeR  = 34
  page.drawCircle({
    x: badgeCX, y: badgeCY, size: badgeR,
    borderColor: BRAND, borderWidth: 2,
    color: rgb(0.933, 0.941, 1.0),
  })
  const bText  = 'VERIFIED'
  const bSize  = 7
  const bWidth = fontBold.widthOfTextAtSize(bText, bSize)
  page.drawText(bText, {
    x: badgeCX - bWidth / 2, y: badgeCY + 4,
    size: bSize, font: fontBold, color: BRAND,
  })
  const b2Text  = 'CERT'
  const b2Width = fontBold.widthOfTextAtSize(b2Text, bSize)
  page.drawText(b2Text, {
    x: badgeCX - b2Width / 2, y: badgeCY - 8,
    size: bSize, font: fontBold, color: BRAND,
  })

  // ── Serialise ─────────────────────────────────────────────────────
  const pdfBytes = await doc.save()
  const filename = `certificate-${cert.verifyToken.slice(0, 8)}.pdf`

  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      'Content-Type':        'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length':      pdfBytes.byteLength.toString(),
    },
  })
}
