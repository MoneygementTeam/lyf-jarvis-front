'use client'

import React from 'react'
import { CanvasLayout } from '@/components/canvas/layout/CanvasLayout'
import { MainCanvas } from '@/components/canvas/main/MainCanvas'

export const Content = () => {
  return (
    <CanvasLayout>
      <MainCanvas />
    </CanvasLayout>
  )
}
