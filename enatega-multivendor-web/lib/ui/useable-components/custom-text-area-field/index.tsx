import { ICustomTextAreaField } from "@/lib/utils/interfaces";
import { InputTextarea } from "primereact/inputtextarea";

export default function CustomTextAreaField({
  label,
  className,
  placeholder,
  showLabel,
  value,
  name,
  error,
  onChange,
  rows = 0,
  maxLength,
  ...props
}: ICustomTextAreaField) {
  return (
    <div className="flex flex-col justify-center gap-y-1">
      {showLabel && (
        <label htmlFor={name ?? "text-area"} className="text-sm font-[500]">
          {label}
        </label>
      )}
      <InputTextarea
        value={value}
        className={`min-h-20 w-full rounded-lg border ${error ? "border-red-500" : "border-gray-300"} dark:bg-gray-800 dark:text-white px-2 pt-1 text-sm focus:shadow-none focus:outline-none ${className ?? ""}`}
        id={name}
        placeholder={placeholder}
        onChange={onChange}
        maxLength={maxLength}
        name={name}
        rows={rows}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
