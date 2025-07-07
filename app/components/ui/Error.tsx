import { cn } from "@/app/utils/cn"

interface ErrorProps {
  message: string
  className?: string
}

export function Error({ message, className }: ErrorProps) {
  return (
    <div
      className={cn(
        "rounded-lg bg-red-50 p-4 text-red-700",
        className
      )}
      role="alert"
    >
      <div className="flex items-center">
        <svg
          className="mr-2 h-5 w-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <span className="font-medium">{message}</span>
      </div>
    </div>
  )
} 