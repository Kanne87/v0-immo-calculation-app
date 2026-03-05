"use client"

import { useState, useCallback } from "react"

// Formatiert eine Zahl fuer die Anzeige (de-DE: 309.000)
function formatNumber(value: number, decimals?: number): string {
  if (decimals === undefined) {
    const str = String(value)
    const dotIndex = str.indexOf(".")
    decimals = dotIndex >= 0 ? Math.min(str.length - dotIndex - 1, 4) : 0
  }
  return value.toLocaleString("de-DE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

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
  const [isFocused, setIsFocused] = useState(false)
  const [editValue, setEditValue] = useState("")

  const handleFocus = useCallback(() => {
    setIsFocused(true)
    setEditValue(String(value))
  }, [value])

  const handleBlur = useCallback(() => {
    setIsFocused(false)
    const cleaned = editValue.replace(/\./g, "").replace(",", ".")
    const num = Number(cleaned)
    if (!isNaN(num)) {
      onChange(num)
    }
  }, [editValue, onChange])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value)
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      ;(e.target as HTMLInputElement).blur()
    }
  }, [])

  const increment = useCallback(() => {
    const next = value + step
    onChange(max !== undefined ? Math.min(next, max) : next)
  }, [value, step, max, onChange])

  const decrement = useCallback(() => {
    const next = value - step
    onChange(min !== undefined ? Math.max(next, min) : next)
  }, [value, step, min, onChange])

  return (
    <div className="mb-3">
      <label className="block text-[11px] text-dimmed mb-1 font-mono tracking-wide">
        {label}
      </label>
      <div
        className={`flex items-center gap-1.5 bg-input border border-border rounded-md px-2.5 py-1.5 ${
          disabled ? "opacity-50" : ""
        } ${isFocused ? "ring-1 ring-primary border-primary" : ""}`}
      >
        {!disabled && (
          <button
            type="button"
            onClick={decrement}
            className="text-subtle hover:text-foreground transition-colors text-sm font-mono leading-none select-none px-0.5"
            tabIndex={-1}
          >
            {"−"}
          </button>
        )}
        {prefix && (
          <span className="text-subtle text-[13px]">{prefix}</span>
        )}
        {isFocused ? (
          <input
            type="text"
            inputMode="decimal"
            value={editValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-foreground text-sm font-serif w-full"
          />
        ) : (
          <input
            type="text"
            value={formatNumber(value)}
            onFocus={handleFocus}
            readOnly={disabled}
            disabled={disabled}
            className="flex-1 bg-transparent border-none outline-none text-foreground text-sm font-serif w-full disabled:cursor-not-allowed cursor-text"
          />
        )}
        {suffix && (
          <span className="text-subtle text-xs whitespace-nowrap">
            {suffix}
          </span>
        )}
        {!disabled && (
          <button
            type="button"
            onClick={increment}
            className="text-subtle hover:text-foreground transition-colors text-sm font-mono leading-none select-none px-0.5"
            tabIndex={-1}
          >
            +
          </button>
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
