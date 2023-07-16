import { Suspense, useRef } from "react";
import "./App.css";
import { Canvas, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useGLTF } from "@react-three/drei";
import { useSnapshot } from "valtio";

function App() {
  return (
    <>
      <Canvas
        className="AppWrapper"
        style={{
          width: "100vw",
          height: "100vh",
        }}
      >
        <directionalLight intensity={0.5} />

        <Suspense fallback={<Loading />}>
          <DragonModel />
        </Suspense>
      </Canvas>
    </>
  );
}

export default App;

function Loading() {
  return (
    <mesh visible position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <sphereGeometry attach="geometry" args={[1, 16, 16]} />

      <meshStandardMaterial
        attach="material"
        color="white"
        transparent
        opacity={0.6}
        roughness={1}
        metalness={0}
      />
    </mesh>
  );
}

function AnimeModel() {
  const obj = useLoader(GLTFLoader, "/models/dragon/source/dragon.glb");

  console.log(obj);
  console.log(obj.nodes);

  return (
    <group>
      <mesh visible geometry={obj.nodes.RootNode0.geometry}>
        <meshStandardMaterial attach="material" color="white" roughness={0.3} metalness={0.3} />
      </mesh>
    </group>
  );
}

function DragonModel({ ...props }) {
  const group = useRef(null);
  const p = useGLTF("/models/dragon/source/dragon.glb");
  
  const snap = useSnapshot({});

  return (
    <group ref={group} {...props} dispose={null}>
      <group ref={group} {...props} dispose={null}>
        <mesh geometry={nodes.shoe.geometry} material={materials.laces} />
        <mesh geometry={nodes.shoe_1.geometry} material={materials.mesh} />
        <mesh geometry={nodes.shoe_2.geometry} material={materials.caps} />
        <mesh geometry={nodes.shoe_3.geometry} material={materials.inner} />
        <mesh geometry={nodes.shoe_4.geometry} material={materials.sole} />
        <mesh geometry={nodes.shoe_5.geometry} material={materials.stripes} />
        <mesh geometry={nodes.shoe_6.geometry} material={materials.band} />
        <mesh geometry={nodes.shoe_7.geometry} material={materials.patch} />
      </group>
    </group>
  );
}
