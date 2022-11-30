import React from 'react'
import { useSphere } from '@react-three/cannon'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { Raycaster, Vector3 } from 'three'
import { useKeyboard } from '../hooks/useKeyboard'

const JUMP_FORCE = 5
const SPEED = 300

export const Player = () => {
  const { moveBackward, moveForward, moveLeft, moveRight, jump } = useKeyboard()
  const { camera, scene } = useThree()

  // Player object
  const [playerRef, player] = useSphere(() => ({
    mass: 100,
    fixedRotation: true,
    position: [0, 1, 0],
    args: 0.2,
    material: {
      friction: 0
    }
  }))

  // The velocity of the player object
  // This acts as an instance variable that will persist between re-renders
  // Gets set to the velocity of the sphere object according to outside forces

  const state = useRef({
    vel: [0, 0, 0],
    pos: [0, 0, 0],
    jumping: false
  })
  const { vel, pos } = state.current

  useEffect(() => player.velocity.subscribe((v) => vel = v), [player.velocity])
s
  // The position of the player object, for use by the camera
  // This acts as an instance variable that will persist between re-renders
  // Gets set to the position of the sphere object after outside forces are applied

  useEffect(() => player.position.subscribe((p) => pos = p), [player.position])

  // This runs every frame, so 60 times per second
  useFrame(() => {
    camera.position.copy(new Vector3(pos[0], pos[1], pos[2]))

    const direction = new Vector3()
    const frontVector = new Vector3(0, 0, (moveBackward ? 1 : 0) - (moveForward ? 1 : 0))
    const sideVector = new Vector3((moveLeft ? 1 : 0) - (moveRight ? 1 : 0), 0, 0)

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED)
      .applyEuler(camera.rotation)

    player.velocity.set(direction.x, vel[1], direction.z)

    if (state.current.jumping && vel[1] < 0) {
      /** Ground check */
      const raycaster = new Raycaster(
        player.position,
        new Vector3(0, -1, 0),
        0,
        0.2
      );
      const intersects = raycaster.intersectObjects(scene.children);
      if (intersects.length !== 0) {
        state.current.jumping = false
      }
    }

    if (Math.abs(vel[1]) < 0.05 && !state.current.jumping && jump) {
      player.velocity.set(vel[0], JUMP_FORCE, vel[2])
      state.current.jumping = true
    }
  })

  return <mesh ref={playerRef}></mesh>
}
