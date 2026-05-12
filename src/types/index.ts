import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id:             string
      role:           string
      organizationId: string | null
    }
  }
}

// ─── Domain Types ───────────────────────────────────────────────

export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'LEARNER'
export type Plan = 'STARTER' | 'GROWTH' | 'ENTERPRISE'
export type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
export type LessonType = 'VIDEO' | 'TEXT' | 'INTERACTIVE'
export type EnrollmentStatus = 'ACTIVE' | 'COMPLETED' | 'DROPPED' | 'OVERDUE'

export interface UserProfile {
  id:             string
  name:           string | null
  email:          string
  avatarUrl:      string | null
  role:           Role
  jobTitle:       string | null
  department:     string | null
  skillLevel:     SkillLevel
  onboarded:      boolean
  organizationId: string | null
}

export interface CourseCard {
  id:           string
  title:        string
  description:  string
  thumbnailUrl: string | null
  level:        SkillLevel
  category:     string
  tags:         string[]
  durationMins: number
  author: {
    id:        string
    name:      string | null
    avatarUrl: string | null
  }
  _count: {
    enrollments: number
    modules:     number
  }
}

export interface EnrollmentWithCourse {
  id:          string
  status:      EnrollmentStatus
  progress:    number
  enrolledAt:  string
  completedAt: string | null
  dueDate:     string | null
  course:      CourseCard
}

export interface AnalyticsSummary {
  totalUsers:          number
  activeUsers:         number
  activeRate:          number
  totalEnrollments:    number
  completedEnrollments: number
  completionRate:      number
  avgProgress:         number
  overdueCount:        number
}

export interface LearningPathCourseItem {
  id:       string
  order:    number
  reason:   string | null
  course:   CourseCard
}

export interface LearningPath {
  id:          string
  title:       string
  description: string | null
  goal:        string
  aiGenerated: boolean
  courses:     LearningPathCourseItem[]
}

export interface ApiResponse<T> {
  data: T
}

export interface PaginatedResponse<T> {
  data: {
    courses: T[]
    total:   number
    page:    number
    totalPages: number
  }
}
