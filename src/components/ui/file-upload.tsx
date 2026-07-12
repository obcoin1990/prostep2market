"use client"

import * as React from "react"
import { Upload, X, FileText, Image, Film, Music, Archive, File } from "lucide-react"
import { cn } from "@/lib/utils"
import { useT } from "@/contexts/LanguageContext"

export interface FileUploadFile extends File {
  id: string
  progress?: number
  status?: "pending" | "uploading" | "done" | "error"
  previewUrl?: string
}

export interface FileUploadProps {
  accept?: string
  multiple?: boolean
  maxFiles?: number
  maxSize?: number
  files: FileUploadFile[]
  onFilesChange: (files: FileUploadFile[]) => void
  onUpload?: (file: FileUploadFile) => Promise<void>
  disabled?: boolean
  className?: string
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 11)
}

function getFileIcon(file: FileUploadFile) {
  const type = file.type
  if (type.startsWith("image/")) return <Image className="h-4 w-4 text-[#fcd535]" />
  if (type.startsWith("video/")) return <Film className="h-4 w-4 text-[#3b82f6]" />
  if (type.startsWith("audio/")) return <Music className="h-4 w-4 text-[#a78bfa]" />
  if (type.includes("zip") || type.includes("rar") || type.includes("tar")) return <Archive className="h-4 w-4 text-[#fb923c]" />
  if (type.includes("pdf") || type.includes("document") || type.includes("text")) return <FileText className="h-4 w-4 text-[#0ecb81]" />
  return <File className="h-4 w-4 text-[#848e9c]" />
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
}

function isImageFile(file: File): boolean {
  return file.type.startsWith("image/")
}

function FileUpload({
  accept,
  multiple = true,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024,
  files,
  onFilesChange,
  onUpload,
  disabled = false,
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const t = useT()

  const addFiles = React.useCallback(
    (incoming: FileList | File[]) => {
      const newFiles: FileUploadFile[] = []
      const remaining = maxFiles - files.length

      Array.from(incoming).forEach((file) => {
        if (newFiles.length >= remaining) return
        if (file.size > maxSize) return
        const uploadFile: FileUploadFile = Object.assign(file, {
          id: generateId(),
          progress: 0,
          status: "pending" as const,
        })
        if (isImageFile(file)) {
          uploadFile.previewUrl = URL.createObjectURL(file)
        }
        newFiles.push(uploadFile)
      })

      if (newFiles.length > 0) {
        onFilesChange([...files, ...newFiles])
      }
    },
    [files, maxFiles, maxSize, onFilesChange]
  )

  const removeFile = React.useCallback(
    (id: string) => {
      const file = files.find((f) => f.id === id)
      if (file?.previewUrl) URL.revokeObjectURL(file.previewUrl)
      onFilesChange(files.filter((f) => f.id !== id))
    },
    [files, onFilesChange]
  )

  const updateFileProgress = React.useCallback(
    (id: string, progress: number, status: FileUploadFile["status"]) => {
      onFilesChange(
        files.map((f) => (f.id === id ? { ...f, progress, status } : f))
      )
    },
    [files, onFilesChange]
  )

  const handleUploadAll = React.useCallback(async () => {
    if (!onUpload) return
    const pending = files.filter((f) => f.status === "pending")
    await Promise.all(
      pending.map(async (file) => {
        updateFileProgress(file.id, 0, "uploading")
        try {
          await onUpload(file)
          updateFileProgress(file.id, 100, "done")
        } catch {
          updateFileProgress(file.id, 0, "error")
        }
      })
    )
  }, [files, onUpload, updateFileProgress])

  const handleDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      if (disabled) return
      if (e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files)
      }
    },
    [disabled, addFiles]
  )

  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        addFiles(e.target.files)
        e.target.value = ""
      }
    },
    [addFiles]
  )

  const pendingCount = files.filter((f) => f.status === "pending").length
  const totalSize = files.reduce((sum, f) => sum + f.size, 0)

  return (
    <div className={cn("w-full", className)}>
      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-[12px] border-2 border-dashed p-8 text-center transition-colors cursor-pointer",
          isDragging
            ? "border-[#fcd535] bg-[rgba(252,213,53,0.05)]"
            : "border-[#2b3139] bg-[#1e2329] hover:border-[#3a3a5c] hover:bg-[rgba(255,255,255,0.02)]",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(252,213,53,0.1)]">
          <Upload className="h-5 w-5 text-[#fcd535]" />
        </div>
        <p className="text-sm font-medium text-white">
          {isDragging ? t("ui.fileUploadDropHere") : t("ui.fileUploadClickToUpload")}
        </p>
        <p className="mt-1 text-xs text-[#848e9c]">
          {accept ? accept.replace(/,/g, ", ") : t("ui.fileUploadAnyType")}
          {maxSize && ` • ${t("ui.fileUploadMax")} ${formatFileSize(maxSize)}`}
          {maxFiles && ` • ${t("ui.fileUploadUpTo")} ${maxFiles} files`}
        </p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className={cn(
                "flex items-center gap-3 rounded-[8px] border border-[#2b3139] bg-[#1e2329] p-3 transition-colors",
                file.status === "error" && "border-[rgba(246,70,93,0.3)]",
                file.status === "done" && "border-[rgba(14,203,129,0.3)]"
              )}
            >
              {/* Preview or icon */}
              {file.previewUrl ? (
                <img
                  src={file.previewUrl}
                  alt={file.name}
                  className="h-10 w-10 shrink-0 rounded-[6px] object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] bg-[#2b3139]">
                  {getFileIcon(file)}
                </div>
              )}

              {/* Info */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{file.name}</p>
                <p className="text-xs text-[#848e9c]">
                  {formatFileSize(file.size)}
                  {file.status === "uploading" && file.progress !== undefined && (
                    <span className="ml-2 text-[#fcd535]">{file.progress}%</span>
                  )}
                  {file.status === "done" && (
                    <span className="ml-2 text-[#0ecb81]">{t("ui.fileUploadUploaded")}</span>
                  )}
                  {file.status === "error" && (
                    <span className="ml-2 text-[#f6465d]">{t("ui.fileUploadFailed")}</span>
                  )}
                </p>

                {/* Progress bar */}
                {file.status === "uploading" && file.progress !== undefined && (
                  <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-[#2b3139]">
                    <div
                      className="h-full rounded-full bg-[#fcd535] transition-all duration-300"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile(file.id)
                }}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] text-[#848e9c] transition-colors hover:bg-[#2b3139] hover:text-white"
                aria-label={`Remove ${file.name}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Footer actions */}
      {files.length > 0 && (
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-[#848e9c]">
            {files.length} file{files.length !== 1 ? "s" : ""} • {formatFileSize(totalSize)}
          </p>
          {onUpload && pendingCount > 0 && (
            <button
              type="button"
              onClick={handleUploadAll}
              disabled={disabled}
              className="rounded-[6px] bg-[#fcd535] px-4 py-1.5 text-xs font-semibold text-[#181a20] transition-colors hover:bg-[#e6c02e] disabled:opacity-50"
            >
              {t("ui.fileUploadUpload")} {pendingCount} file{pendingCount !== 1 ? "s" : ""}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export { FileUpload }
