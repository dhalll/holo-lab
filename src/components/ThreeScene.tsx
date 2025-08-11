
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

interface ThreeSceneProps {
  className?: string;
  modelPath: string;
  isolatedMeshId?: string | null;
  useVariantModel?: boolean; // ✅ 新增，用来判断是否在切换变体
}

const ThreeScene: React.FC<ThreeSceneProps> = ({
  className,
  modelPath,
  isolatedMeshId,
  useVariantModel = false
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const lastCameraStateRef = useRef<{ position: THREE.Vector3; rotation: THREE.Euler } | null>(null);
  const [scene] = useState(() => new THREE.Scene());

  // 保存当前相机状态
  useEffect(() => {
    if (controlsRef.current && cameraRef.current) {
      const handleChange = () => {
        lastCameraStateRef.current = {
          position: cameraRef.current!.position.clone(),
          rotation: cameraRef.current!.rotation.clone(),
        };
      };
      controlsRef.current.addEventListener('change', handleChange);
      return () => {
        controlsRef.current?.removeEventListener('change', handleChange);
      };
    }
  }, []);

  // 初始化场景
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 5, 10);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
    scene.add(light);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [scene]);

  // 加载模型
  useEffect(() => {
    if (!modelPath) return;

    const loader = new GLTFLoader();
    loader.load(modelPath, (gltf) => {
      // 清空旧模型
      scene.children = scene.children.filter(obj => !(obj as THREE.Mesh).isMesh);

      const model = gltf.scene;

      if (isolatedMeshId) {
        const targetMesh = model.getObjectByName(isolatedMeshId);
        if (targetMesh) {
          scene.add(targetMesh.clone());
        } else {
          scene.add(model);
        }
      } else {
        scene.add(model);
      }

      // 角度保持 + 切换变体时缩放
      if (cameraRef.current && lastCameraStateRef.current && controlsRef.current) {
        const scaleFactor = useVariantModel ? 1.2 : 1; // ✅ 切换变体时拉远 20%
        const direction = new THREE.Vector3()
          .subVectors(lastCameraStateRef.current.position, controlsRef.current.target)
          .multiplyScalar(scaleFactor);

        cameraRef.current.position.copy(
          new THREE.Vector3().addVectors(controlsRef.current.target, direction)
        );
        cameraRef.current.rotation.copy(lastCameraStateRef.current.rotation);
      } else {
        // 第一次加载时自动适配模型
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = cameraRef.current!.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        cameraZ *= 1.2;

        cameraRef.current!.position.set(center.x, center.y + maxDim / 5, cameraZ);
        cameraRef.current!.lookAt(center);
        controlsRef.current!.target.copy(center);
      }
    });
  }, [modelPath, isolatedMeshId, scene, useVariantModel]);

  return <div ref={mountRef} className={className} />;
};

export default ThreeScene;
