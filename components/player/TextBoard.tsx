import { Billboard, Text } from '@react-three/drei'
import React from 'react'
import { Object3D } from 'three'

interface textBoardProps {
  text: string
  ref?: React.MutableRefObject<Object3D | null>
}

const TextBoard = (textBoardProps: textBoardProps) => {
  return (
    <Billboard ref={textBoardProps.ref}>
      <Text fontSize={0.4} color={'0x000000'}>
        {textBoardProps.text}
      </Text>
    </Billboard>
  )
}

export default TextBoard
