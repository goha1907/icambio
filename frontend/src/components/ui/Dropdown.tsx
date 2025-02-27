// frontend/src/components/ui/Dropdown.tsx
interface DropdownProps {
    options: Array<{ value: string; label: string }>;
    value: string;
    onChange: (value: string) => void;
    label?: string;
  }
  
  export const Dropdown = ({ options, value, onChange, label }: DropdownProps) => {
    return (
      <div className="relative">
        {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  };