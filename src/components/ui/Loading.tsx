import clsx from 'clsx'

/* ---- Spinner ---- */

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const spinnerSizes: Record<string, string> = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
}

function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <div
      className={clsx(
        'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
        spinnerSizes[size],
        className,
      )}
      role="status"
      aria-label="加载中"
    />
  )
}

/* ---- Skeleton ---- */

interface SkeletonProps {
  className?: string
}

function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={clsx('animate-pulse rounded-md bg-gray-200', className)}
      aria-hidden="true"
    />
  )
}

export { Spinner, Skeleton }
export default Spinner
