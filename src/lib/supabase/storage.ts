import { createClient } from '@supabase/supabase-js'

function getStorageClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Set them in Vercel project settings.'
    )
  }
  return createClient(url, anon)
}

const BUCKET_NAME = 'trade-screenshots'
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg']
const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg']

export interface UploadResult {
  url?: string
  error?: string
}

export interface DeleteResult {
  error?: string
}

export interface ListResult {
  paths?: string[]
  error?: string
}

/**
 * Upload a screenshot to Supabase storage
 * @param userId - The user's ID
 * @param tradeId - The trade ID (or 'pending' for new trades)
 * @param file - The file to upload
 * @returns UploadResult with url or error
 */
export async function uploadScreenshot(
  userId: string,
  tradeId: string,
  file: File
): Promise<UploadResult> {
  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: `File type not allowed. Use: ${ALLOWED_EXTENSIONS.join(', ')}` }
  }
  
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return { error: `File too large. Maximum 5MB.` }
  }

  // Validate file extension
  const fileExt = file.name.split('.').pop()?.toLowerCase()
  if (!fileExt || !ALLOWED_EXTENSIONS.includes(`.${fileExt}`)) {
    return { error: `Invalid file extension. Use: ${ALLOWED_EXTENSIONS.join(', ')}` }
  }

  // Generate unique filename
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
  const filePath = `${userId}/${tradeId || 'pending'}/${fileName}`

  // Upload to storage
  const { data, error } = await getStorageClient().storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    return { error: error.message }
  }

  // Get public URL
  const { data: { publicUrl } } = getStorageClient().storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath)

  return { url: publicUrl }
}

/**
 * Get the public URL for a screenshot
 * @param userId - The user's ID
 * @param path - The file path within the user's folder
 * @returns The public URL or null
 */
export async function getScreenshotUrl(userId: string, path: string): Promise<string | null> {
  const { data: { publicUrl } } = getStorageClient().storage
    .from(BUCKET_NAME)
    .getPublicUrl(`${userId}/${path}`)

  return publicUrl
}

/**
 * Delete a screenshot from storage
 * @param userId - The user's ID
 * @param path - The file path within the user's folder
 * @returns DeleteResult with error if any
 */
export async function deleteScreenshot(userId: string, path: string): Promise<DeleteResult> {
  const { error } = await getStorageClient().storage
    .from(BUCKET_NAME)
    .remove([`${userId}/${path}`])

  if (error) {
    return { error: error.message }
  }

  return { }
}

/**
 * List all screenshots for a user (optionally filtered by trade)
 * @param userId - The user's ID
 * @param tradeId - Optional trade ID to filter by
 * @returns ListResult with paths or error
 */
export async function listScreenshots(userId: string, tradeId?: string): Promise<ListResult> {
  const path = tradeId ? `${userId}/${tradeId}` : userId
  
  const { data, error } = await getStorageClient().storage
    .from(BUCKET_NAME)
    .list(path, { limit: 100 })

  if (error) {
    return { error: error.message }
  }

  return { paths: data?.map(f => f.name) || [] }
}

// Export constants for external use
export { BUCKET_NAME, MAX_FILE_SIZE, ALLOWED_TYPES, ALLOWED_EXTENSIONS }
