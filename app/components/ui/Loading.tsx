import { cn } from "../../utils/cn"

interface LoadingProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Loading({ className, size = 'md' }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className={cn("flex items-center justify-center bg-background text-foreground", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-4 border-border border-t-blue-600",
          sizeClasses[size]
        )}
      />
    </div>
  )
} 