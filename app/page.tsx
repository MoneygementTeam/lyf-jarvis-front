'use client'

import { useState } from 'react'
import MapComponent from '@/components/mapbox/MapBox'
import { Content } from '@/components/canvas/Content'
import Modal from '@/components/modal/modal/Modal'
import { useModalStore } from '@/store/useModalStore'
import styles from '@/styles/Home.module.scss'
import { useDijkstraStore } from '@/store/useDijkstraStore'

export default function Home() {
  const { isShow, setIsShow } = useModalStore()
  const { setIsSimulation } = useDijkstraStore()
  const [isFinalModal, setIsFinalModal] = useState(false)

  const handleStartSimulation = () => {
    setIsShow(false)
    setIsSimulation(true)
    setIsFinalModal(false)
  }

  const handleEndSimulation = () => {
    setIsShow(false)
    setIsSimulation(false)
    setIsFinalModal(true)
    window.location.href = ('/history')
  }

  return (
    <div id="bodyWrapper">
      <Modal
        isVisible={isShow}
        heading=""
        onClickCloseBtn={() => setIsShow(false)}
      >
        {isFinalModal ? (
          <>
            <p className={styles.text}>You have completed the route!</p>
            <button
              type="button"
              onClick={handleEndSimulation}
              className={styles.confirmBtn}
            >
              Finish
            </button>
          </>
        ) : (
          <>
            <p className={styles.text}>Follow the travel route.</p>
            <button
              type="button"
              onClick={handleStartSimulation}
              className={styles.confirmBtn}
            >
              OK
            </button>
          </>
        )}
      </Modal>
      <MapComponent setIsFinalModal={setIsFinalModal} setIsShow={setIsShow} />
      <Content />
    </div>
  )
}
