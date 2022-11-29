import React from 'react'
import { useBox } from '@react-three/cannon'

export const Platform = ({ position, color }) => {
  const [ref] = useBox(() => ({
    type: 'Static',
    position,
  }))

  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, .1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}
