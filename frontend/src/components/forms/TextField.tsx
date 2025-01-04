import React from 'react';
import { Form } from 'react-bootstrap';

interface TextFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  error,
  required = false,
}) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label>
        {label}
        {required && <span className="text-danger">*</span>}
      </Form.Label>
      <Form.Control
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        isInvalid={!!error}
      />
      {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
    </Form.Group>
  );
};