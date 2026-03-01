"use client"

interface FieldInputProps {
  label: string
  value: number
  onChange: (v: number) => void
  suffix?: string
  prefix?: string
  step?: number
  min?: number
  max?: number
  disabled?: boolean
}

export function FieldInput({
  label,
  value,
  onChange,
  suffix = "",
  prefix = "",
  step = 1,
  min,
  max,
  disabled,
}: FieldInputProps) {
  return (
    <div className="mb-3">
      <label className="block text-[11px] text-dimmed mb-1 font-mono tracking-wide">
        {label}
      </label>
      <div
        className={`flex items-center gap-1.5 bg-input border border-border rounded-md px-2.5 py-1.5 ${
          disabled ? "opacity-50" : ""
        }`}
      >
        {prefix && (
          <span className="text-subtle text-[13px]">{prefix}</span>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          step={step}
          min={min}
          max={max}
          disabled={disabled}
          className="flex-1 bg-transparent border-none outline-none text-foreground text-sm font-serif w-full disabled:cursor-not-allowed"
        />
        {suffix && (
          <span className="text-subtle text-xs whitespace-nowrap">
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}

interface TextFieldProps {
  label: string
  value: string
  onChange: (v: string) => void
  disabled?: boolean
  placeholder?: string
}

export function TextField({
  label,
  value,
  onChange,
  disabled,
  placeholder,
}: TextFieldProps) {
  return (
    <div className="mb-3">
      <label className="block text-[11px] text-dimmed mb-1 font-mono tracking-wide">
        {label}
      </label>
      <div
        className={`flex items-center gap-1.5 bg-input border border-border rounded-md px-2.5 py-1.5 ${
          disabled ? "opacity-50" : ""
        }`}
      >
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-none outline-none text-foreground text-sm font-serif w-full disabled:cursor-not-allowed"
        />
      </div>
    </div>
  )
}

interface SelectFieldProps {
  label: string
  value: number
  onChange: (v: number) => void
  options: { value: number; label: string }[]
  disabled?: boolean
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  disabled,
}: SelectFieldProps) {
  return (
    <div className="mb-3">
      <label className="block text-[11px] text-dimmed mb-1 font-mono tracking-wide">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="w-full bg-input border border-border rounded-md px-2.5 py-2 text-foreground text-sm font-serif outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}
