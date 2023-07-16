import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Preload } from "@react-three/drei";
import { useGameStore } from "../state/useStore";

type Props = {
  color: string;
  bgColor: string;
};
export default function CubeWorld({ color, bgColor }: Props) {
  const directionalLight = useGameStore((s) => s.directionalLight);

  return (
    <>
      <Canvas
        gl={{ antialias: false, alpha: false }}
        dpr={[1, 1.3]}
        style={{ backgroundColor: "powderblue" }}
      >
        <Suspense fallback={"Loading..."}>
          <p>.....</p>
        </Suspense>
      </Canvas>
    </>
  );
}
