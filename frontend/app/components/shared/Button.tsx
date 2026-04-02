'use client'

import React from 'react'

// 1. Define the base props
interface BaseProps {
  children: React.ReactNode
  className?: string
}

// 2. Create a Union Type:
// If 'as' is 'label', use Label attributes (like htmlFor).
// If 'as' is 'button' (or undefined), use Button attributes (like onClick).
type ButtonProps =
  | (BaseProps &
      React.ButtonHTMLAttributes<HTMLButtonElement> & { as?: 'button' })
  | (BaseProps & React.LabelHTMLAttributes<HTMLLabelElement> & { as: 'label' })

export default function Button({
  children,
  className = '',
  as = 'button',
  ...props
}: ButtonProps) {
  // We cast to 'any' internally so React can render the dynamic tag,
  // but the outside world sees the strict types from ButtonProps.
  const Component = as as any

  return (
    <Component
      className={`active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}
