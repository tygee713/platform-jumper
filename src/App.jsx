import React from 'react'
import { Physics } from '@react-three/cannon'
import { Sky } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { FPV } from './components/FPV'
import { Player } from './components/Player'
import { Platforms } from './components/Platforms'

export default function App() {
  return (
    <>
      <Canvas>
        <Sky sunPosition={[100,100,20]} />
        <ambientLight intensity={0.5} />
        <FPV />
        <Physics
        gravity={[0, -10, 0]}
        tolerance={0}
        iterations={50}
        broadphase='SAP'
      >
          <Player />
          <Platforms />
        </Physics>
      </Canvas>
    </>
  )
}
