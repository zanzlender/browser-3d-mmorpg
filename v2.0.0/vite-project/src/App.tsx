import { Suspense } from "react";
import "./App.css";
import { Canvas, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

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
          <AnimeModel />
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
