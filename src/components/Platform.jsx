import React from 'react'
import { useBox } from '@react-three/cannon'
import { DoubleSide } from 'three'

export const Platform = ({ position, color }) => {
  const [ref] = useBox(() => ({
    type: 'Static',
    position,
    material: {
      friction: 1,
      restitution: 0
    },
  }))

  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, .1, 1]} />
      <meshStandardMaterial color={color} side={DoubleSide} />
    </mesh>
  )
}
