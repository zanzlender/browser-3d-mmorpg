"use-client"

import React, { MutableRefObject, Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls, KeyboardControls, useGLTF, useAnimations, Environment, useTexture, useFBX, Html, useProgress, Sky, KeyboardControlsEntry, useKeyboardControls, SpotLight } from '@react-three/drei'
import { Group, Mesh } from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'


function Loader() {
  const { progress } = useProgress()
  return <Html center>{progress} % loaded</Html>
}


const Scene = () => {
  const fbx = useFBX("town.fbx");

  return <mesh>
    <primitive object={fbx} scale={0.004} />
  </mesh>
};

const Character = () => {
  const walkingAnimation = useFBX("/animations/Walking.fbx")
  const walkingBackwardsAnimation = useFBX("/animations/Walking_Backwards.fbx")
  const turnAnimation = useFBX("/animations/Turn.fbx")

  const animations = [...walkingAnimation.animations]

  const characterRef = useRef() as MutableRefObject<Group>
  const fbx = useFBX("/characters/BeachBabe.fbx")
  const textureProps = useTexture("/images/SimplePeople_BeachBabe_White.png")
  const { actions, clips, mixer, names, ref } = useAnimations(animations, characterRef)

  fbx.children.forEach((m, i) => {
    //@ts-ignore
    if (m?.isMesh) {
      //@ts-ignore
      m.material.map = textureProps
    }
  })

  useEffect(() => {
    actions[names[0]]?.reset().fadeIn(0.5).play()
  }, [])

  return <group ref={characterRef}>
    <primitive object={fbx} scale={0.05} />
    <meshStandardMaterial map={textureProps} />
  </group>
}

export default function Map() {
  enum Controls {
    forward = 'forward',
    back = 'back',
    left = 'left',
    right = 'right',
    jump = 'jump',
  }

  const controlsMap = useMemo<KeyboardControlsEntry<Controls>[]>(() => [
    { name: Controls.forward, keys: ['ArrowUp', 'w', 'W'] },
    { name: Controls.back, keys: ['ArrowDown', 's', 'S'] },
    { name: Controls.left, keys: ['ArrowLeft', 'a', 'A'] },
    { name: Controls.right, keys: ['ArrowRight', 'd', 'D'] },
    { name: Controls.jump, keys: ['Space'] },
  ], [])

  function Foo() {
    const forwardPressed = useKeyboardControls<Controls>(state => state.forward)
  }

  return (
    <div className='relative w-full h-full z-10 bg-black'>
      <Canvas className='w-full h-full'>
        <ambientLight intensity={0.8} />
        <directionalLight color="red" position={[50, 50, 50]} />
        <Suspense fallback={<Loader />}>
          <KeyboardControls map={controlsMap}>
            <OrbitControls />
            <Character />
            <Environment
              background={false}
              blur={0}
              files={["/images/px.jpg", "/images/nx.jpg", "/images/py.jpg", "/images/ny.jpg", "/images/pz.jpg", "/images/nz.jpg"]}
              ground={{
                height: 30,
                radius: 100,
                scale: 100
              }}
            />
          </KeyboardControls>
        </Suspense>
      </Canvas>
    </div>
  )
}

