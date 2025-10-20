import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function PanoramaViewer() {
  const mountRef = useRef(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const scenes = [
      { src: './assets/img/1.jpg', rotationYDeg: 0 },
      { src: './assets/img/2.jpg', rotationYDeg: 90 },
      { src: './assets/img/3.jpg', rotationYDeg: 180 },
      { src: './assets/img/4.jpg', rotationYDeg: 270 },
    ];

    const currentMount = mountRef.current;

    // --- Scene & Camera ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 0.1);

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    // --- Controls ---
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.rotateSpeed = 0.3;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.2;
    controls.target.set(0, 0, -1);
    controls.update();

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(50, 50, 50);
    scene.add(directionalLight);

    // --- Panorama Sphere ---
    const loader = new THREE.TextureLoader();
    let sphere;
    const loadScene = (sceneData) => {
      if (sphere) scene.remove(sphere);

      const texture = loader.load(sceneData.src);
      texture.colorSpace = THREE.SRGBColorSpace;

      const geometry = new THREE.SphereGeometry(500, 128, 128);
      geometry.scale(-1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ map: texture });

      sphere = new THREE.Mesh(geometry, material);
      sphere.rotation.y = (sceneData.rotationYDeg * Math.PI) / 180;
      sphere.renderOrder = 0;
      scene.add(sphere);
    };
    loadScene(scenes[index]);

    // --- Mountains / Cones ---
    const mountains = [];
    for (let i = 0; i < 5; i++) {
      const geometry = new THREE.ConeGeometry(
        5 + Math.random() * 5, // width variation
        8 + Math.random() * 5, // height variation
        32
      );
      const material = new THREE.MeshStandardMaterial({
        color: 0x888888,
        roughness: 1,
        metalness: 0.1,
      });
      const mountain = new THREE.Mesh(geometry, material);
      mountain.position.set(
        Math.random() * 80 - 40,
        -2,
        -40 - Math.random() * 30
      );
      mountain.renderOrder = 1;
      scene.add(mountain);
      mountains.push(mountain);
    }

    // --- Multiple Clouds ---
    const cloudTexture = loader.load(
      '/assets/img/vecteezy_soft-white-fluffy-clouds-shape-floating-special-effect-3d_42726218.png'
    );
    cloudTexture.colorSpace = THREE.SRGBColorSpace;

    const clouds = [];
    for (let i = 0; i < 10; i++) {
      const cloudMaterial = new THREE.MeshBasicMaterial({
        map: cloudTexture,
        transparent: true,
        opacity: 0.6 + Math.random() * 0.2,
        side: THREE.DoubleSide,
      });
      const cloudGeometry = new THREE.PlaneGeometry(
        20 + Math.random() * 30,
        10 + Math.random() * 20
      );
      const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
      cloud.position.set(
        Math.random() * 200 - 100,
        10 + Math.random() * 30,
        -30 - Math.random() * 40
      );
      cloud.renderOrder = 2;
      cloud.userData.speed = 0.01 + Math.random() * 0.05;
      cloud.userData.rotationSpeed = 0.001 + Math.random() * 0.005;
      scene.add(cloud);
      clouds.push(cloud);
    }

    // --- Animate ---
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();

      // Clouds drift and rotate
      clouds.forEach((cloud) => {
        cloud.position.x += cloud.userData.speed;
        cloud.rotation.z += cloud.userData.rotationSpeed;
        if (cloud.position.x > 100) cloud.position.x = -100;
      });

      renderer.render(scene, camera);
    };
    animate();

    // --- Handle Resize ---
    const handleResize = () => {
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // --- Cleanup ---
    return () => {
      window.removeEventListener('resize', handleResize);
      currentMount.removeChild(renderer.domElement);
    };
  }, [index]);

  return (
    <div className="viewer">
      <div
        ref={mountRef}
        style={{ width: '100%', height: 'calc(100vh - 60px)' }}
      />
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <button type="button" onClick={() => setIndex((index + 3) % 4)} style={{ marginRight: '10px' }}>
          Previous
        </button>
        <button type="button" onClick={() => setIndex((index + 1) % 4)}>
          Next
        </button>
      </div>
    </div>
  );
}

export default PanoramaViewer;
