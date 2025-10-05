import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function MountainScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current; // <-- capture current ref value

    // --- Scene setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbfd1e5);
    scene.fog = new THREE.FogExp2(0xbfd1e5, 0.02);

    // --- Camera ---
    const camera = new THREE.PerspectiveCamera(
      60,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 10);

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);

    // --- Lights ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(10, 10, 10);
    scene.add(dirLight);

    // --- Simple Mountain ---
    const mountainGeometry = new THREE.ConeGeometry(5, 8, 32);
    const mountainMaterial = new THREE.MeshStandardMaterial({
      color: 0x888888,
      roughness: 1,
      metalness: 0.1,
    });
    const mountain = new THREE.Mesh(mountainGeometry, mountainMaterial);
    mountain.position.y = -2;
    scene.add(mountain);

    // --- Clouds ---
    const cloudTexture = new THREE.TextureLoader().load('./assets/img/vecteezy_soft-white-fluffy-clouds-shape-floating-special-effect-3d_42726218.png');
    const cloudMaterial = new THREE.MeshBasicMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
    });

    const clouds = [];
    for (let i = 0; i < 10; i++) {
      const cloud = new THREE.Mesh(new THREE.PlaneGeometry(4, 2), cloudMaterial);
      cloud.position.set(Math.random() * 20 - 10, Math.random() * 5 + 2, Math.random() * -10);
      cloud.rotation.y = Math.random() * Math.PI;
      scene.add(cloud);
      clouds.push(cloud);
    }

    // --- Controls ---
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.03;

    // --- Animation Loop ---
    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      controls.update();

      clouds.forEach((c) => {
        c.position.x += 0.01;
        if (c.position.x > 10) c.position.x = -10;
      });

      renderer.render(scene, camera);
    };
    animate();

    // --- Handle Resize ---
    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
}

export default MountainScene;
