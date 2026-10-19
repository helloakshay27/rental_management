import * as React from "react"
import { Upload } from "lucide-react"

import { cn } from "@/lib/utils"

export interface FileUploadZoneProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "className"> {
  /** Name(s) of the file(s) currently chosen; shown in place of the prompt. */
  fileName?: string | null
  /** Secondary line, e.g. "PDF, DOC, JPG or PNG (Max 10MB)". */
  hint?: React.ReactNode
  className?: string
}

/**
 * The app's single attachment input: a dashed drop zone with an upload icon,
 * "Drop a file or choose one", and the chosen file name once selected. The
 * native input covers the zone, so click and drag-and-drop both work.
 */
export const FileUploadZone = React.forwardRef<HTMLInputElement, FileUploadZoneProps>(
  ({ fileName, hint, className, disabled, ...inputProps }, ref) => (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-4 py-10 text-center transition-colors hover:bg-gray-50",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        className
      )}
    >
      <input
        ref={ref}
        type="file"
        disabled={disabled}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        {...inputProps}
      />
      <Upload className="mb-2 h-5 w-5 text-gray-700" />
      <p className="max-w-full truncate text-[14px] font-medium text-gray-900">
        {fileName || "Drop a file or choose one"}
      </p>
      <p className="mt-1 text-[13px] text-gray-400">
        {hint ?? (fileName ? "Click to change" : "No file chosen")}
      </p>
    </div>
  )
)
FileUploadZone.displayName = "FileUploadZone"

export default FileUploadZone
