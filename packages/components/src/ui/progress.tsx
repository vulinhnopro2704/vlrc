import * as React from "react"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className = "", value = 0, ...props }, ref) => {
    const safeValue = Math.min(Math.max(value, 0), 100);
    
    return (
      <div
        ref={ref}
        className={`relative h-4 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700 ${className}`}
        {...props}
      >
        <div
          className="h-full w-full bg-blue-500 dark:bg-blue-600 transition-all"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    )
  }
)

Progress.displayName = "Progress"

export { Progress }
