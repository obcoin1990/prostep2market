/**
 * Tests for Certificate Generation (EDU-05)
 *
 * Validates PDF certificate generation, issuance, and retrieval.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'

// Hoist all mock state and modules so they're available before vi.mock factories
const {
  drawTextCalls,
  drawRectangleCalls,
  embedFontCalls,
  mockUpload,
  mockGetPublicUrl,
  mockDbResponses,
} = vi.hoisted(() => {
  const drawTextCalls: Array<{ text: string; options: any }> = []
  const drawRectangleCalls: any[] = []
  const embedFontCalls: string[] = []

  const mockUpload = vi.fn(async () => ({ data: { path: 'certificates/test.pdf' }, error: null }))
  const mockGetPublicUrl = vi.fn(() => ({ data: { publicUrl: 'https://example.com/cert.pdf' } }))

  const mockDbResponses: Record<string, any> = {}

  return {
    drawTextCalls,
    drawRectangleCalls,
    embedFontCalls,
    mockUpload,
    mockGetPublicUrl,
    mockDbResponses,
  }
})

// Mock pdf-lib with a stateful implementation
vi.mock('pdf-lib', async () => {
  const drawText = vi.fn((text: string, options: any) => {
    drawTextCalls.push({ text, options })
  })
  const drawLine = vi.fn()
  const drawRectangle = vi.fn((opts: any) => {
    drawRectangleCalls.push(opts)
  })
  const getSize = vi.fn(() => ({ width: 842, height: 595 }))
  const embedFont = vi.fn(async (name: string) => {
    embedFontCalls.push(name)
    return { name }
  })
  const save = vi.fn(async () => new Uint8Array([0x25, 0x50, 0x44, 0x46]))
  const addPage = vi.fn(() => ({
    drawText,
    drawLine,
    drawRectangle,
    getSize,
  }))
  const create = vi.fn(async () => ({
    addPage,
    embedFont,
    save,
  }))

  return {
    PDFDocument: { create },
    rgb: vi.fn((r, g, b) => ({ r, g, b })),
    StandardFonts: {
      TimesRoman: 'TimesRoman',
      TimesRomanBold: 'TimesRomanBold',
      Helvetica: 'Helvetica',
    },
  }
})

// Mock Supabase storage + DB
vi.mock('@/lib/supabase/server', () => {
  const mockDbFrom = (table: string) => {
    const queue = mockDbResponses[table] || []
    const response = queue.length > 0 ? queue.shift() : { data: [], error: null }
    const chain: any = {
      select: vi.fn(() => chain),
      eq: vi.fn(() => chain),
      upsert: vi.fn(() => chain),
      update: vi.fn(() => chain),
      insert: vi.fn(() => chain),
      delete: vi.fn(() => chain),
      not: vi.fn(async () => response),
    }
    chain.then = (onF: any) => Promise.resolve(response).then(onF)
    return chain
  }

  return {
    createClient: vi.fn(async () => ({
      storage: {
        from: vi.fn(() => ({
          upload: mockUpload,
          getPublicUrl: mockGetPublicUrl,
        })),
      },
      from: mockDbFrom,
    })),
  }
})

import { generateCertificate, issueCertificate, getUserCertificates } from '@/lib/education/certificates'

describe('Certificate Generation', () => {
  const sampleData = {
    userName: 'John Doe',
    courseName: 'Trading Fundamentals',
    completionDate: 'January 15, 2026',
    certificateId: 'CERT-12345',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    drawTextCalls.length = 0
    drawRectangleCalls.length = 0
    embedFontCalls.length = 0
    // Clear all queued DB responses
    for (const key of Object.keys(mockDbResponses)) {
      delete mockDbResponses[key]
    }
  })

  describe('generateCertificate', () => {
    it('should generate valid PDF bytes', async () => {
      const pdfBytes = await generateCertificate(sampleData)
      expect(pdfBytes).toBeInstanceOf(Uint8Array)
      expect(pdfBytes.length).toBeGreaterThan(0)
    })

    it('should include user name in certificate', async () => {
      await generateCertificate(sampleData)
      const userNameCall = drawTextCalls.find((c) => c.text === sampleData.userName)
      expect(userNameCall).toBeDefined()
    })

    it('should include course name in certificate', async () => {
      await generateCertificate(sampleData)
      const courseNameCall = drawTextCalls.find((c) => c.text === sampleData.courseName)
      expect(courseNameCall).toBeDefined()
    })

    it('should include completion date in certificate', async () => {
      await generateCertificate(sampleData)
      const dateCall = drawTextCalls.find((c) => c.text === `Date: ${sampleData.completionDate}`)
      expect(dateCall).toBeDefined()
    })

    it('should include unique certificate ID', async () => {
      await generateCertificate(sampleData)
      const idCall = drawTextCalls.find((c) => c.text === `Certificate ID: ${sampleData.certificateId}`)
      expect(idCall).toBeDefined()
    })

    it('should add a decorative border', async () => {
      await generateCertificate(sampleData)
      // Should have at least 3 rectangles: background, outer border, inner border
      expect(drawRectangleCalls.length).toBeGreaterThanOrEqual(3)
    })

    it('should embed Times Roman and Helvetica fonts', async () => {
      await generateCertificate(sampleData)
      expect(embedFontCalls).toContain('TimesRoman')
      expect(embedFontCalls).toContain('TimesRomanBold')
      expect(embedFontCalls).toContain('Helvetica')
    })
  })

  describe('issueCertificate', () => {
    it('should generate PDF and upload to Supabase Storage', async () => {
      const url = await issueCertificate('user-1', 'course-1', 'John Doe', 'Trading 101')

      expect(url).toBe('https://example.com/cert.pdf')
      expect(mockUpload).toHaveBeenCalledOnce()
      const [fileName, pdfBytes, options] = mockUpload.mock.calls[0]
      expect(fileName).toMatch(/^certificates\/user-1\/course-1\/CERT-/)
      expect(fileName).toMatch(/\.pdf$/)
      expect(pdfBytes).toBeInstanceOf(Uint8Array)
      expect(options).toEqual({ contentType: 'application/pdf', upsert: true })
    })

    it('should generate a certificate ID with CERT- prefix', async () => {
      await issueCertificate('user-1', 'course-1', 'John', 'Course')

      const [fileName] = mockUpload.mock.calls[0]
      expect(fileName).toMatch(/CERT-\d+-[A-Z0-9]+/)
    })

    it('should throw on upload error', async () => {
      const uploadError = new Error('Upload failed')
      mockUpload.mockRejectedValueOnce(uploadError)

      await expect(
        issueCertificate('user-1', 'course-1', 'John', 'Course')
      ).rejects.toThrow('Upload failed')
    })
  })

  describe('getUserCertificates', () => {
    it('should return empty array when no certificates exist', async () => {
      const certs = await getUserCertificates('user-1')
      expect(certs).toEqual([])
    })
  })
})
