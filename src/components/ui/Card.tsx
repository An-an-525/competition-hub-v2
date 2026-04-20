import { type ReactNode } from 'react'
import clsx from 'clsx'

interface CardProps {
  title?: string
  description?: string
  hoverable?: boolean
  className?: string
  children: ReactNode
}

function Card({ title, description, hoverable = false, className, children }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-xl border border-gray-200 bg-white p-6',
        hoverable && 'transition-shadow duration-200 hover:shadow-md',
        className,
      )}
    >
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
      )}
      {children}
    </div>
  )
}

export default Card
