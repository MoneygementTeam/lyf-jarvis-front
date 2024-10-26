'use client'

import MapComponent from '@/components/mapbox/MapBox'
import { Content } from '@/components/canvas/Content'
import Modal from '@/components/modal/modal/Modal'
import { useModalStore } from '@/store/useModalStore'
import styles from '@/styles/Home.module.scss'
import { useDijkstraStore } from '@/store/useDijkstraStore'

export default function Home() {
  const { isShow, setIsShow } = useModalStore()
  const { setIsSimulation } = useDijkstraStore()

  return (
    <div id="bodyWrapper">
      <Modal
        isVisible={isShow}
        heading=""
        onClickCloseBtn={() => setIsShow(false)}
      >
        <p className={styles.text}>Follow the travel route.</p>

        <button
          type="button"
          onClick={() => {
            setIsShow(false)
            setIsSimulation(true)
          }}
          className={styles.confirmBtn}
        >
          OK
        </button>
      </Modal>
      <MapComponent />
      <Content />
    </div>
  )
}
