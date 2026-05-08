'use client'

import { useState, useCallback, useRef } from 'react'
import { uploadScreenshot } from '@/lib/supabase/storage'
import { createClient } from '@/lib/supabase/client'

interface ScreenshotUploadProps {
  onUploadComplete: (url: string) => void
  initialUrl?: string
}

export function ScreenshotUpload({ onUploadComplete, initialUrl }: ScreenshotUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [preview, setPreview] = useState<string | null>(initialUrl || null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const supabase = createClient()

  const uploadFile = async (file: File) => {
    setError(null)
    
    // Validation
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']
    if (!allowedTypes.includes(file.type)) {
      setError('File type not allowed. Use PNG or JPG.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File too large. Maximum 5MB.')
      return
    }

    setUploading(true)
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('Please log in to upload screenshots')
        return
      }

      // Create local preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      // Upload to storage
      const result = await uploadScreenshot(user.id, 'pending', file)
      
      if (result.error) {
        setError(result.error)
        setPreview(null)
      } else if (result.url) {
        onUploadComplete(result.url)
      }
    } catch (err: any) {
      setError(err.message || 'Upload failed')
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) uploadFile(file)
  }, [])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
  }

  const handleRemove = () => {
    setPreview(null)
    onUploadComplete('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div>
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${dragOver 
            ? 'border-red-500 bg-red-50' 
            : 'border-gray-300 hover:border-red-500'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg"
          onChange={handleFileChange}
          className="hidden"
        />
        
        {uploading ? (
          <div className="py-4">
            <div className="animate-spin h-8 w-8 border-2 border-red-500 border-t-transparent rounded-full mx-auto mb-2" />
            <p className="text-gray-600">Uploading...</p>
          </div>
        ) : preview ? (
          <div className="relative">
            <img 
              src={preview} 
              alt="Trade screenshot" 
              className="max-h-48 mx-auto rounded"
            />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleRemove() }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
            >
              &times;
            </button>
          </div>
        ) : (
          <div className="py-4">
            <svg 
              className="mx-auto h-12 w-12 text-gray-400 mb-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
            <p className="text-gray-600 mb-1">
              Drag screenshot here or click to upload
            </p>
            <p className="text-gray-500 text-sm">
              PNG or JPG, max 5MB
            </p>
          </div>
        )}
      </div>
      
      {/* Error */}
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  )
}