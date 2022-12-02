import React from 'react'
import { useFrame } from '@react-three/fiber'
import { useStore } from "../hooks/useStore"
import { Platform } from "./Platform"

export const Platforms = () => {
  const [platforms, addPlatform] = useStore((state) => [
    state.platforms,
    state.addPlatform
  ])

  useFrame(() => {
    if (!platforms.length) {
      addPlatform(0, 0, 0)
      addPlatform(4, 0, 0)
      addPlatform(0, 0, 4)
      addPlatform(-4, 0, 0)
      addPlatform(0, 0, -4)
    }
  })
  return platforms.map(({ key, pos, color }) => <Platform key={key} position={pos} color={color} />)
}