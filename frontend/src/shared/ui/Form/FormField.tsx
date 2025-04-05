import { forwardRef } from 'react';
import { Input } from '../Input';
import { Label } from '../Label';

export interface FormFieldProps {
  label?: string;
  error?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  name: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, type = 'text', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && <Label htmlFor={props.name}>{label}</Label>}
        <Input
          ref={ref}
          id={props.name}
          type={type}
          className={error ? 'border-red-500' : ''}
          {...props}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

FormField.displayName = 'FormField'; 