import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import { prisma } from '@/lib/prisma'
import { requireAuth, apiError, apiSuccess } from '@/lib/api'

// Lazy-init so the build doesn't fail when OPENAI_API_KEY isn't set
function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
}

// POST /api/ai — generate or refresh AI learning path for user
export async function POST(req: NextRequest) {
  const { session, error } = await requireAuth()
  if (error) return error

  const { goal, currentSkills } = await req.json()
  if (!goal) return apiError('goal is required')

  const userId = session!.user.id

  // Fetch available courses
  const courses = await prisma.course.findMany({
    where:  { published: true },
    select: { id: true, title: true, description: true, level: true, category: true, tags: true },
  })

  // Fetch existing skill assessments for context
  const assessments = await prisma.skillAssessment.findMany({
    where:   { userId },
    orderBy: { assessedAt: 'desc' },
    take:    10,
  })

  const skillContext = assessments.length > 0
    ? assessments.map(a => `${a.skill}: ${a.level} (score: ${a.score})`).join(', ')
    : currentSkills ?? 'No assessments yet'

  const courseList = courses
    .map(c => `[${c.id}] ${c.title} (${c.level}) — ${c.description.slice(0, 80)}`)
    .join('\n')

  // Call GPT-4o to generate learning path
  const openai = getOpenAI()
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    temperature: 0.3,
    messages: [
      {
        role: 'system',
        content: `You are an expert corporate learning advisor. 
Given a user's career goal and current skill levels, select and order the most relevant courses from the provided list to create a personalized learning path.
Return a JSON object: { "title": string, "description": string, "courses": [{ "id": string, "reason": string }] }
Keep the path to 3-7 courses. Order them logically (prerequisites first).`,
      },
      {
        role: 'user',
        content: `Career Goal: ${goal}\nCurrent Skills: ${skillContext}\n\nAvailable Courses:\n${courseList}`,
      },
    ],
    response_format: { type: 'json_object' },
  })

  const aiResponse = JSON.parse(completion.choices[0].message.content ?? '{}')

  // Validate course IDs exist
  const validIds = new Set(courses.map(c => c.id))
  const selectedCourses = (aiResponse.courses ?? []).filter((c: any) => validIds.has(c.id))

  if (selectedCourses.length === 0) {
    return apiError('AI could not generate a learning path. Try a more specific goal.', 422)
  }

  // Upsert learning path
  const learningPath = await prisma.$transaction(async (tx) => {
    // Delete old path courses
    const existing = await tx.learningPath.findUnique({ where: { userId } })
    if (existing) {
      await tx.learningPathCourse.deleteMany({ where: { learningPathId: existing.id } })
    }

    return tx.learningPath.upsert({
      where:  { userId },
      update: {
        title:       aiResponse.title,
        description: aiResponse.description,
        goal,
        courses: {
          create: selectedCourses.map((c: any, idx: number) => ({
            courseId: c.id,
            order:    idx + 1,
            reason:   c.reason,
          })),
        },
      },
      create: {
        userId,
        title:       aiResponse.title,
        description: aiResponse.description,
        goal,
        aiGenerated: true,
        courses: {
          create: selectedCourses.map((c: any, idx: number) => ({
            courseId: c.id,
            order:    idx + 1,
            reason:   c.reason,
          })),
        },
      },
      include: {
        courses: {
          orderBy: { order: 'asc' },
          include: { course: true },
        },
      },
    })
  })

  return apiSuccess(learningPath, 201)
}

// GET /api/ai — fetch current user's learning path
export async function GET(_req: NextRequest) {
  const { session, error } = await requireAuth()
  if (error) return error

  const learningPath = await prisma.learningPath.findUnique({
    where:   { userId: session!.user.id },
    include: {
      courses: {
        orderBy: { order: 'asc' },
        include: {
          course: {
            include: { _count: { select: { enrollments: true } } },
          },
        },
      },
    },
  })

  if (!learningPath) return apiError('No learning path found', 404)
  return apiSuccess(learningPath)
}
