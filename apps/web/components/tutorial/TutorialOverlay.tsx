'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useTutorial } from './TutorialContext'
import { ArrowRight, ArrowLeft, X, PartyPopper } from 'lucide-react'

export function TutorialOverlay() {
  const {
    isActive,
    currentStep,
    steps,
    nextStep,
    prevStep,
    skipTutorial,
    endTutorial,
  } = useTutorial()

  const [tooltipPos, setTooltipPos] = useState<{
    top: number
    left: number
    placement: string
  } | null>(null)
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null)

  const isLastStep = currentStep === steps.length - 1

  const positionTooltip = useCallback(() => {
    if (!isActive || !steps[currentStep]) return

    const step = steps[currentStep]
    const el = document.querySelector(step.target)

    if (!el) {
      setSpotlightRect(null)
      setTooltipPos({
        top: window.innerHeight / 2 - 100,
        left: window.innerWidth / 2 - 175,
        placement: 'center',
      })
      return
    }

    const rect = el.getBoundingClientRect()
    setSpotlightRect(rect)

    // Scroll element into view if needed
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })

    const tooltipWidth = 350
    const tooltipHeight = 200
    const gap = 16

    let top = 0
    let left = 0

    switch (step.placement) {
      case 'right':
        top = rect.top + rect.height / 2 - tooltipHeight / 2
        left = rect.right + gap
        break
      case 'left':
        top = rect.top + rect.height / 2 - tooltipHeight / 2
        left = rect.left - tooltipWidth - gap
        break
      case 'bottom':
        top = rect.bottom + gap
        left = rect.left + rect.width / 2 - tooltipWidth / 2
        break
      case 'top':
        top = rect.top - tooltipHeight - gap
        left = rect.left + rect.width / 2 - tooltipWidth / 2
        break
    }

    // Keep within viewport
    top = Math.max(16, Math.min(top, window.innerHeight - tooltipHeight - 16))
    left = Math.max(16, Math.min(left, window.innerWidth - tooltipWidth - 16))

    setTooltipPos({ top, left, placement: step.placement })
  }, [isActive, currentStep, steps])

  useEffect(() => {
    if (!isActive) return

    // Small delay to let DOM settle after navigation
    const timer = setTimeout(positionTooltip, 150)
    window.addEventListener('resize', positionTooltip)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', positionTooltip)
    }
  }, [isActive, currentStep, positionTooltip])

  if (!isActive) return null

  const step = steps[currentStep]
  if (!step) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        pointerEvents: 'none',
      }}
    >
      {/* Dark overlay with spotlight hole */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'auto',
        }}
        onClick={skipTutorial}
      >
        <defs>
          <mask id="tutorial-spotlight-mask">
            <rect width="100%" height="100%" fill="white" />
            {spotlightRect && (
              <rect
                x={spotlightRect.left - 6}
                y={spotlightRect.top - 6}
                width={spotlightRect.width + 12}
                height={spotlightRect.height + 12}
                rx="8"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.55)"
          mask="url(#tutorial-spotlight-mask)"
        />
      </svg>

      {/* Spotlight border glow */}
      {spotlightRect && (
        <div
          style={{
            position: 'absolute',
            left: spotlightRect.left - 6,
            top: spotlightRect.top - 6,
            width: spotlightRect.width + 12,
            height: spotlightRect.height + 12,
            borderRadius: '8px',
            border: '2px solid var(--color-gray-950)',
            boxShadow: '0 0 0 4px rgba(0, 0, 0, 0.15)',
            pointerEvents: 'none',
            transition: 'all 300ms ease',
          }}
        />
      )}

      {/* Tooltip card */}
      {tooltipPos && (
        <div
          style={{
            position: 'absolute',
            top: tooltipPos.top,
            left: tooltipPos.left,
            width: '350px',
            backgroundColor: 'var(--color-white)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-xl)',
            pointerEvents: 'auto',
            animation: 'fadeInUp 250ms ease-out',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem 1.25rem 0.5rem',
            }}
          >
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--color-text-tertiary)',
              }}
            >
              {currentStep + 1} de {steps.length}
            </span>
            <button
              onClick={skipTutorial}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '1.5rem',
                height: '1.5rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                backgroundColor: 'transparent',
                color: 'var(--color-text-tertiary)',
                cursor: 'pointer',
              }}
              aria-label="Fechar tutorial"
            >
              <X size={14} />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: '0.25rem 1.25rem 1rem' }}>
            <h4
              style={{
                fontWeight: 700,
                fontSize: '1rem',
                marginBottom: '0.375rem',
              }}
            >
              {step.title}
            </h4>
            <p
              style={{
                fontSize: '0.8125rem',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.5,
              }}
            >
              {step.description}
            </p>
          </div>

          {/* Progress bar */}
          <div
            style={{
              height: '2px',
              backgroundColor: 'var(--color-gray-100)',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${((currentStep + 1) / steps.length) * 100}%`,
                backgroundColor: 'var(--color-gray-950)',
                transition: 'width 300ms ease',
              }}
            />
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 1.25rem',
              borderTop: '1px solid var(--color-border)',
            }}
          >
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.375rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-white)',
                color:
                  currentStep === 0
                    ? 'var(--color-text-tertiary)'
                    : 'var(--color-text-primary)',
                fontSize: '0.8125rem',
                fontWeight: 500,
                cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                opacity: currentStep === 0 ? 0.5 : 1,
                fontFamily: 'inherit',
              }}
            >
              <ArrowLeft size={14} />
              Anterior
            </button>

            <button
              onClick={isLastStep ? endTutorial : nextStep}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.375rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                backgroundColor: 'var(--color-gray-950)',
                color: 'var(--color-white)',
                fontSize: '0.8125rem',
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {isLastStep ? (
                <>
                  Concluir
                  <PartyPopper size={14} />
                </>
              ) : (
                <>
                  Próximo
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
