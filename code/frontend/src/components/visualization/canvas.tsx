import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useEffect } from 'react'
import { Mesh } from 'three'

export default function Box(props: JSX.IntrinsicElements['mesh']) {
  const ref = useRef<Mesh>(null!)

  useEffect(() => {
    console.log(Boolean(ref.current))
  }, [])

  return (
    <mesh {...props} ref={ref}>
      <boxGeometry />
      <meshBasicMaterial />
    </mesh>
  )
}
