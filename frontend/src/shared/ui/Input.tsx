import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  isTextarea?: boolean;
}

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ className, type, label, error, helperText, isTextarea = false, ...props }, ref) => {
    const hasError = !!error;
    const commonClasses = cn(
      'form-input',
      { 'border-red-500 focus:ring-red-500': hasError },
      className
    );

    const inputProps = {
      className: commonClasses,
      ...props,
    };

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={props.id} className="form-label">
            {label}
          </label>
        )}
        {isTextarea ? (
          <textarea
            ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
            {...(inputProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            type={type}
            ref={ref as React.ForwardedRef<HTMLInputElement>}
            {...inputProps}
          />
        )}
        {helperText && !hasError && (
          <p className="mt-1 text-xs text-gray-500">{helperText}</p>
        )}
        {hasError && <p className="form-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input'; 