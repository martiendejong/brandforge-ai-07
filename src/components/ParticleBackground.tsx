import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { ParticleScene } from "./ParticleScene";

export function ParticleBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ParticleScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
