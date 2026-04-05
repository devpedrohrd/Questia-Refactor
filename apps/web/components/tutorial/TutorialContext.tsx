'use client'

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react'
import type { TutorialStep } from './tutorialSteps'
import { professorSteps, alunoSteps } from './tutorialSteps'

type TutorialContextType = {
  isActive: boolean
  currentStep: number
  steps: TutorialStep[]
  hasCompleted: boolean
  startTutorial: () => void
  nextStep: () => void
  prevStep: () => void
  endTutorial: () => void
  skipTutorial: () => void
}

const TutorialContext = createContext<TutorialContextType | undefined>(
  undefined,
)

function getStorageKey(role: string) {
  return `questia_tutorial_done_${role.toLowerCase()}`
}

function hasCompletedTutorial(role: string): boolean {
  if (typeof window === 'undefined') return true
  return localStorage.getItem(getStorageKey(role)) === 'true'
}

function markTutorialDone(role: string) {
  if (typeof window === 'undefined') return
  localStorage.setItem(getStorageKey(role), 'true')
}

type TutorialProviderProps = {
  role: string
  children: React.ReactNode
}

export function TutorialProvider({ role, children }: TutorialProviderProps) {
  const steps = role === 'PROFESSOR' ? professorSteps : alunoSteps
  const [isActive, setIsActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [hasCompleted, setHasCompleted] = useState(() =>
    hasCompletedTutorial(role),
  )

  const startTutorial = useCallback(() => {
    setCurrentStep(0)
    setIsActive(true)
  }, [])

  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1)
    } else {
      // Tutorial finished
      markTutorialDone(role)
      setHasCompleted(true)
      setIsActive(false)
    }
  }, [currentStep, steps.length, role])

  const prevStep = useCallback(() => {
    setCurrentStep((s) => Math.max(0, s - 1))
  }, [])

  const endTutorial = useCallback(() => {
    markTutorialDone(role)
    setHasCompleted(true)
    setIsActive(false)
  }, [role])

  const skipTutorial = useCallback(() => {
    setIsActive(false)
  }, [])

  const value = useMemo(
    () => ({
      isActive,
      currentStep,
      steps,
      hasCompleted,
      startTutorial,
      nextStep,
      prevStep,
      endTutorial,
      skipTutorial,
    }),
    [
      isActive,
      currentStep,
      steps,
      hasCompleted,
      startTutorial,
      nextStep,
      prevStep,
      endTutorial,
      skipTutorial,
    ],
  )

  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  )
}

export function useTutorial() {
  const ctx = useContext(TutorialContext)
  if (!ctx)
    throw new Error('useTutorial must be used within a TutorialProvider')
  return ctx
}
