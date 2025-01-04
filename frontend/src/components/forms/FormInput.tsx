import React from 'react';
import { Form } from 'react-bootstrap';

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  error
}) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        isInvalid={!!error}
      />
      {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
    </Form.Group>
  );
};