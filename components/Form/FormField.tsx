'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FormFieldProps {
  label?: string;
  name: string;
  error?: string;
  touched?: boolean;
  icon?: LucideIcon;
  children: React.ReactElement<any>;
  required?: boolean;
  className?: string;
  helpText?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  error,
  touched,
  icon: Icon,
  children,
  required,
  className = "",
  helpText,
}) => {
  const hasError = !!(touched && error);
  const isValid = !!(touched && !error);

  // Clone the child and inject standard props like role, aria-invalid, etc.
  const inputElement = React.cloneElement(children, {
    id: name,
    name,
    'aria-invalid': hasError ? 'true' : 'false',
    'aria-describedby': hasError ? `${name}-error` : undefined,
    required,
    className: `
      w-full transition-all duration-200 outline-none
      ${Icon ? "pl-10" : "px-4"} 
      py-3 rounded-xl border
      ${hasError 
        ? "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200 animate-shake" 
        : isValid 
          ? "border-emerald-500 bg-emerald-50 focus:ring-2 focus:ring-emerald-200" 
          : "border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500/20"
      }
      ${children.props.className || ""}
    `.trim(),
  });

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label 
          htmlFor={name} 
          className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative group">
        {Icon && (
          <Icon 
            size={18} 
            className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200
              ${hasError ? "text-red-400" : isValid ? "text-emerald-500" : "text-gray-400 group-focus-within:text-blue-500"}
            `} 
          />
        )}
        {inputElement}
      </div>

      {hasError && (
        <p 
          id={`${name}-error`} 
          className="text-red-500 text-[10px] font-medium mt-1 ml-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1"
        >
          <span>⚠</span> {error}
        </p>
      )}

      {!hasError && helpText && (
        <p className="text-gray-400 text-[10px] mt-1 ml-1 leading-relaxed">
          {helpText}
        </p>
      )}
    </div>
  );
};

export default FormField;
