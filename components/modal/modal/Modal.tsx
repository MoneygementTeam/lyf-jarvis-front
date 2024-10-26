'use client'

import React, { PropsWithChildren, useCallback, useEffect, useId } from 'react'
import {
  AnimatePresence,
  AnimationProps,
  motion,
  useReducedMotion,
} from 'framer-motion'
import Image from 'next/image'
import cn from 'classnames'
import {
  defaultModalAnimation,
  defaultModalBackdropAnimation,
} from '@/utils/modal/modal'
import { ClientSidePortal } from '../ClientSidePortal'
import CrossSvg from '@/public/cross.svg'
import styles from './Modal.module.scss'

type ModalProps = PropsWithChildren<{
  isVisible: boolean
  heading: string
  onClickCloseBtn: (e: React.MouseEvent) => void
  onClickBackdrop?: (e: React.MouseEvent) => void
  onPressEscKey?: (e: KeyboardEvent) => void
  modalClassName?: string
  animation?: AnimationProps
  backdropAnimation?: AnimationProps
}>

const Modal = ({
  isVisible,
  heading,
  onClickCloseBtn,
  onClickBackdrop = () => null,
  onPressEscKey = () => null,
  modalClassName,
  animation = defaultModalAnimation,
  backdropAnimation = defaultModalBackdropAnimation,
  children,
}: ModalProps) => {
  const shouldReduceMotion = useReducedMotion()
  const headingId = useId()

  const modalMainClassName = cn(styles.modal, modalClassName)

  const modalAnimation = shouldReduceMotion ? {} : animation
  const modalBackdropAnimation = shouldReduceMotion ? {} : backdropAnimation

  const handleWindowKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onPressEscKey(e)
      }
    },
    [onPressEscKey]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleWindowKeyDown)
    return () => window.removeEventListener('keydown', handleWindowKeyDown)
  }, [handleWindowKeyDown])

  return (
    <ClientSidePortal>
      <AnimatePresence>
        {isVisible && (
          <>
            <motion.div
              key="modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby={headingId}
              {...modalAnimation}
              className={modalMainClassName}
            >
              <button
                type="button"
                className={styles.closeModalBtn}
                onClick={onClickCloseBtn}
              >
                <Image src={CrossSvg} alt="" width={16} height={16} />
                <span className={styles.srOnly} style={{ display: 'none' }}>
                  Close
                </span>
              </button>

              <div className={styles.modalHeader}>
                <h2 id={headingId} className={styles.modalHeading}>
                  {heading}
                </h2>
              </div>

              <div className={styles.modalContent}>{children}</div>
            </motion.div>

            <motion.div
              key="modal-backdrop"
              {...modalBackdropAnimation}
              onClick={onClickBackdrop}
              className={styles.modalBackdrop}
            />
          </>
        )}
      </AnimatePresence>
    </ClientSidePortal>
  )
}

export type { ModalProps }

export default Modal
