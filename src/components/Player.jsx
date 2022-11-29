import React from 'react'
import { useSphere } from '@react-three/cannon'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { Vector3 } from 'three'
import { useKeyboard } from '../hooks/useKeyboard'

const JUMP_FORCE = 5
const SPEED = 8

export const Player = () => {
  const { moveBackward, moveForward, moveLeft, moveRight, jump } = useKeyboard()
  const { camera } = useThree()

  // Player object
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: 'Dynamic',
    position: [0, 1, 0],
  }))

  // The velocity of the player object
  // This acts as an instance variable that will persist between re-renders
  // Gets set to the velocity of the sphere object according to outside forces
  const vel = useRef([0, 0, 0])

  useEffect(() => api.velocity.subscribe((v) => vel.current = v), [api.velocity])

  // The position of the player object, for use by the camera
  // This acts as an instance variable that will persist between re-renders
  // Gets set to the position of the sphere object after outside forces are applied
  const pos = useRef([0, 0, 0])

  useEffect(() => api.position.subscribe((p) => pos.current = p), [api.position])

  // This runs every frame, so 60 times per second
  useFrame(() => {
    camera.position.copy(new Vector3(pos.current[0], pos.current[1], pos.current[2]))

    const direction = new Vector3()
    const frontVector = new Vector3(0, 0, (moveBackward ? 1 : 0) - (moveForward ? 1 : 0))
    const sideVector = new Vector3((moveLeft ? 1 : 0) - (moveRight ? 1 : 0), 0, 0)

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED)
      .applyEuler(camera.rotation)

    api.velocity.set(direction.x, vel.current[1], direction.z)

    if (jump && Math.abs(vel.current[1] < 0.05)) {
      api.velocity.set(vel.current[0], JUMP_FORCE, vel.current[2])
    }
  })

  return <mesh ref={ref}></mesh>
}
