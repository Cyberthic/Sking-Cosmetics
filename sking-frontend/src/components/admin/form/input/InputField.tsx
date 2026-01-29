import React, { FC, forwardRef } from "react";
import Tooltip from "../../ui/tooltip/Tooltip";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; // Add label support if used in your forms, based on create/page.tsx usage
  error?: boolean | string; // Allow string error message or boolean
  success?: boolean;
  hint?: string;
  tooltip?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  type = "text",
  className = "",
  disabled = false,
  success = false,
  error = false,
  hint,
  label,
  tooltip,
  ...props
}, ref) => {
  // Determine input styles based on state (disabled, success, error)
  let inputClasses = `h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${className}`;

  // Add styles for the different states
  if (disabled) {
    inputClasses += ` text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
  } else if (error) {
    inputClasses += ` text-error-800 border-error-500 focus:ring-3 focus:ring-error-500/10  dark:text-error-400 dark:border-error-500`;
  } else if (success) {
    inputClasses += ` text-success-500 border-success-400 focus:ring-success-500/10 focus:border-success-300  dark:text-success-400 dark:border-success-500`;
  } else {
    inputClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800`;
  }

  return (
    <div className="relative w-full">
      {label && (
        <label htmlFor={props.id} className="flex items-center text-xs font-black uppercase text-gray-900 dark:text-gray-100 mb-2 tracking-widest">
          {label}
          {tooltip && <Tooltip content={tooltip} />}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        disabled={disabled}
        className={inputClasses}
        {...props}
      />

      {/* Optional Hint Text */}
      {hint && (
        <p
          className={`mt-1.5 text-xs ${error
            ? "text-error-500"
            : success
              ? "text-success-500"
              : "text-gray-500"
            }`}
        >
          {hint}
        </p>
      )}
      {/* Error Message if error is a string */}
      {typeof error === 'string' && (
        <p className="mt-1.5 text-xs text-error-500 font-bold uppercase tracking-wider">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
