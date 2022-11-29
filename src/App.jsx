import { Physics } from '@react-three/cannon'
import { Sky } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { FPV } from './components/FPV'

export default function App() {
  return (
    <>
      <Canvas>
        <Sky sunPosition={[100,100,20]} />
        <ambientLight intensity={0.5} />
        <FPV />
        <Physics>
        </Physics>
      </Canvas>
    </>
  )
}
