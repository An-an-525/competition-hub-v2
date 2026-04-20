import { type InputHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from 'react'
import clsx from 'clsx'
import type { ReactNode } from 'react'

interface InputBaseProps {
  label?: string
  error?: string
  icon?: ReactNode
}

type InputAsInput = InputBaseProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
    multiline?: false
  }

type InputAsTextarea = InputBaseProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> & {
    multiline: true
  }

type InputProps = InputAsInput | InputAsTextarea

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  (props, ref) => {
    const { label, error, icon, className, ...rest } = props
    const isTextarea = props.multiline === true

    const inputClasses = clsx(
      'w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors duration-150',
      'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
      error
        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
        : 'border-gray-300',
      icon && !isTextarea && 'pl-10',
      className,
    )

    return (
      <div className="w-full">
        {label && (
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && !isTextarea && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          {isTextarea ? (
            <textarea
              ref={ref as React.Ref<HTMLTextAreaElement>}
              className={inputClasses}
              {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <input
              ref={ref as React.Ref<HTMLInputElement>}
              className={inputClasses}
              {...(rest as InputHTMLAttributes<HTMLInputElement>)}
            />
          )}
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    )
  },
)

Input.displayName = 'Input'

export default Input
