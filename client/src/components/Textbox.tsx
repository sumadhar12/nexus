import React from "react";
import clsx from "clsx";

interface TextboxProps {
  type?: string;
  placeholder?: string;
  label?: string;
  className?: string;
  register?: any;
  name?: string;
  error?: string;
  defaultValue?: string;
}

const Textbox = React.forwardRef<HTMLInputElement, TextboxProps>(
  (
    {
      type,
      placeholder,
      label,
      className,
      register,
      name,
      error,
      defaultValue,
    },
    ref
  ) => {
    return (
      <div className="w-full flex flex-col gap-2">
        {label && (
          <label htmlFor={name} className="text-sm font-medium text-gray-300">
            {label}
          </label>
        )}

        <div>
          <input
            type={type}
            name={name}
            placeholder={placeholder}
            defaultValue={defaultValue}
            ref={ref}
            {...register}
            aria-invalid={error ? "true" : "false"}
            className={clsx(
              "w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg placeholder-gray-400 text-gray-100 outline-none text-base transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent",
              error && "border-red-400 focus:ring-red-500",
              className
            )}
          />
        </div>
        {error && (
          <span className="text-xs text-red-400 mt-1 font-medium">{error}</span>
        )}
      </div>
    );
  }
);

Textbox.displayName = "Textbox";

export default Textbox;

