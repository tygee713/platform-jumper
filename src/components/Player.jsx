import React from 'react'
import { useSphere } from '@react-three/cannon'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { Color, Raycaster, Vector3 } from 'three'
import { useKeyboard } from '../hooks/useKeyboard'
import { useStore } from "../hooks/useStore"

const JUMP_FORCE = 4
const SPEED = 5

export const Player = () => {
  const { moveBackward, moveForward, moveLeft, moveRight, jump } = useKeyboard()
  const { camera, scene } = useThree()

  // Player object
  const [playerRef, player] = useSphere(() => ({
    mass: 100,
    fixedRotation: true,
    position: [0, 1, 0],
    args: [0.5],
    material: {
      friction: 0
    }
  }))

  const [interval, addPlatform] = useStore((state) => [state.interval, state.addPlatform])

  const state = useRef({
    vel: [0, 0, 0],
    pos: [0, 0, 0],
    jumping: false
  })

  // The velocity of the player object
  // This acts as an instance variable that will persist between re-renders
  // Gets set to the velocity of the sphere object according to outside forces
  useEffect(() => player.velocity.subscribe((v) => state.current.vel = v), [player.velocity])

  // The position of the player object, for use by the camera
  // This acts as an instance variable that will persist between re-renders
  // Gets set to the position of the sphere object after outside forces are applied
  useEffect(() => player.position.subscribe((p) => state.current.pos = p), [player.position])

  // This runs every frame, so 60 times per second
  useFrame(() => {
    camera.position.set(state.current.pos[0], state.current.pos[1], state.current.pos[2])

    const direction = new Vector3()
    const frontVector = new Vector3(0, 0, (moveBackward ? 1 : 0) - (moveForward ? 1 : 0))
    const sideVector = new Vector3((moveLeft ? 1 : 0) - (moveRight ? 1 : 0), 0, 0)

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED)
      .applyEuler(camera.rotation)

    player.velocity.set(direction.x, state.current.vel[1], direction.z)

    if (state.current.jumping && state.current.vel[1] <= 0) {
      /** Ground check */
      const raycaster = new Raycaster(
        camera.position,
        new Vector3(0, -1, 0),
        0,
        1
      )
      const intersects = raycaster.intersectObjects(scene.children)
      if (intersects.length !== 0) {
        state.current.jumping = false
        const intersect = intersects[intersects.length - 1]
        intersect.object.material.color = new Color('yellow')
        addPlatform(intersect.object.position.x + interval, intersect.object.position.y, intersect.object.position.z + Math.sign(intersect.object.position.z) * interval)
        addPlatform(intersect.object.position.x - interval, intersect.object.position.y, intersect.object.position.z + Math.sign(intersect.object.position.z) * interval)
      }
    }

    if (Math.abs(state.current.vel[1]) < 0.1 && !state.current.jumping && jump) {
      player.velocity.set(state.current.vel[0], JUMP_FORCE, state.current.vel[2])
      state.current.jumping = true
    }
  })

  return <mesh ref={playerRef}></mesh>
}
