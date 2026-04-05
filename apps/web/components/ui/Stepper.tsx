import React from 'react'
import { Check } from 'lucide-react'

type StepperProps = {
  steps: string[]
  currentStep: number
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        padding: '0 1rem',
      }}
    >
      {steps.map((label, index) => {
        const isCompleted = index < currentStep
        const isCurrent = index === currentStep
        const isLast = index === steps.length - 1

        return (
          <React.Fragment key={label}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                minWidth: 'fit-content',
              }}
            >
              <div
                style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  transition: 'all var(--transition-base)',
                  ...(isCompleted
                    ? {
                        backgroundColor: 'var(--color-gray-950)',
                        color: 'var(--color-white)',
                      }
                    : isCurrent
                      ? {
                          backgroundColor: 'var(--color-gray-950)',
                          color: 'var(--color-white)',
                        }
                      : {
                          backgroundColor: 'var(--color-gray-100)',
                          color: 'var(--color-text-tertiary)',
                          border: '1px solid var(--color-border)',
                        }),
                }}
              >
                {isCompleted ? <Check size={14} strokeWidth={3} /> : index + 1}
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: isCurrent || isCompleted ? 500 : 400,
                  color:
                    isCurrent || isCompleted
                      ? 'var(--color-text-primary)'
                      : 'var(--color-text-tertiary)',
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </span>
            </div>
            {!isLast && (
              <div
                style={{
                  flex: 1,
                  height: '1px',
                  backgroundColor: isCompleted
                    ? 'var(--color-gray-950)'
                    : 'var(--color-border)',
                  margin: '0 0.75rem',
                  marginBottom: '1.5rem',
                  transition: 'background-color var(--transition-base)',
                }}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
