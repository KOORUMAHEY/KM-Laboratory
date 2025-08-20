'use client'; // Ensure this is a Client Component in Next.js

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import FOG from 'vanta/dist/vanta.fog.min'; // Import the FOG effect

// Define the props interface for TypeScript
interface VantaBackgroundProps {
  highlightColor?: number;
  midtoneColor?: number;
  lowlightColor?: number;
  baseColor?: number;
  blurFactor?: number;
  speed?: number;
  zoom?: number;
  mouseControls?: boolean;
  touchControls?: boolean;
  gyroControls?: boolean;
  minHeight?: number;
  minWidth?: number;
}

const VantaBackground: React.FC<VantaBackgroundProps> = ({
  highlightColor = 0xc09a1e, // Default values
  midtoneColor = 0xffa500,
  lowlightColor = 0x2f4f4f,
  baseColor = 0xffd700,
  blurFactor = 0.6,
  speed = 1,
  zoom = 1,
  mouseControls = true,
  touchControls = true,
  gyroControls = false,
  minHeight = 200.0,
  minWidth = 200.0,
}) => {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
      // Initialize Vanta.js FOG effect with props
      setVantaEffect(
        FOG({
          el: vantaRef.current,
          THREE: THREE, // Pass Three.js
          mouseControls,
          touchControls,
          gyroControls,
          minHeight,
          minWidth,
          highlightColor,
          midtoneColor,
          lowlightColor,
          baseColor,
          blurFactor,
          speed,
          zoom,
        })
      );
    }

    // Cleanup on component unmount
    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
      }
    };
  }, [
    vantaEffect,
    highlightColor,
    midtoneColor,
    lowlightColor,
    baseColor,
    blurFactor,
    speed,
    zoom,
    mouseControls,
    touchControls,
    gyroControls,
    minHeight,
    minWidth,
  ]);

  return (
    <div
      ref={vantaRef}
      style={{
        width: '100%',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1, // Ensure it stays in the background
      }}
    />
  );
};

export default VantaBackground;