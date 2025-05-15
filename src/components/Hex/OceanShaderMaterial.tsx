import * as THREE from "three";
import React, { useRef, useEffect } from "react";
import { useFrame, extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";

const OceanShaderMaterialImpl = shaderMaterial(
  {
    uTime: 0,
    uTexture: null,
    uColor: new THREE.Color(1, 1, 1),
    uOpacity: 1.0,
    uDirection: new THREE.Vector2(1, 0), // default: +x
    uSpeed: 0.05, // default speed
  },
  // vertex shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // fragment shader
  `
    uniform sampler2D uTexture;
    uniform vec3 uColor;
    uniform float uOpacity;
    uniform float uTime;
    uniform vec2 uDirection;
    uniform float uSpeed;
    varying vec2 vUv;
    void main() {
      // Animate the UVs in the given direction, wrapping with fract for seamless repeat
      vec2 uvScroll = fract(vUv + uDirection * uTime * uSpeed);
      vec4 tex = texture2D(uTexture, uvScroll);
      tex.rgb *= uColor;
      tex.a *= uOpacity;
      gl_FragColor = tex;
    }
  `
);
// Extend so <oceanShaderMaterialImpl /> is a valid JSX tag
extend({ OceanShaderMaterialImpl });

// Add TypeScript declaration for the custom JSX intrinsic element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      oceanShaderMaterialImpl: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        ref?: React.Ref<any>;
        key?: React.Key;
      };
    }
  }
}

type OceanShaderMaterialProps = {
  map: THREE.Texture;
  time: number;
  color: string | THREE.Color;
  opacity: number;
  direction?: [number, number]; // e.g. [1,0] for +x, [0,1] for +y, etc.
  speed?: number;
};

// React component wrapper for the custom ocean shader
export const OceanShaderMaterial = React.forwardRef<
  any,
  OceanShaderMaterialProps
>(
  (
    {
      map,
      time = 0,
      color = "#ffffff",
      opacity = 1.0,
      direction = [1, 0],
      speed = 0.05,
    },
    ref
  ) => {
    const materialRef = useRef<any>(null);
    // Animate time uniform
    useFrame(() => {
      if (materialRef.current) {
        materialRef.current.uniforms.uTime.value = time;
      }
    });
    useEffect(() => {
      if (materialRef.current) {
        materialRef.current.uniforms.uTexture.value = map;
        materialRef.current.uniforms.uColor.value = new THREE.Color(color);
        materialRef.current.uniforms.uOpacity.value = opacity;
        materialRef.current.uniforms.uDirection.value = new THREE.Vector2(
          ...direction
        );
        materialRef.current.uniforms.uSpeed.value = speed;
      }
    }, [map, color, opacity, direction, speed]);
    return (
      <oceanShaderMaterialImpl
        ref={ref || materialRef}
        key={"ocean-shader-material"}
      />
    );
  }
);
