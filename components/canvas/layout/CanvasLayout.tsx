import { ReactNode } from 'react'

interface CanvasLayoutProps {
  children: ReactNode
}

export const CanvasLayout = ({ children }: CanvasLayoutProps) => {
  return <>{children}</>
}
