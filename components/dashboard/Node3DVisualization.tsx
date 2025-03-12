// components/dashboard/Node3DVisualization.tsx
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Node3DVisualization() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 30;
    
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x6852ff, 2, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
    
    // Create nodes and connections
    const nodesGroup = new THREE.Group();
    scene.add(nodesGroup);
    
    const nodeCount = 15;
    const nodes: THREE.Mesh[] = [];
    const nodePositions: THREE.Vector3[] = [];
    
    // Create node materials
    const nodeMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x6852ff,
      emissive: 0x2a1a99,
      specular: 0xffffff,
      shininess: 100
    });
    
    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
      const geometry = new THREE.SphereGeometry(0.4, 16, 16);
      const node = new THREE.Mesh(geometry, nodeMaterial);
      
      // Random position within a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 12 * Math.pow(Math.random(), 1/3);
      
      node.position.x = radius * Math.sin(phi) * Math.cos(theta);
      node.position.y = radius * Math.sin(phi) * Math.sin(theta);
      node.position.z = radius * Math.cos(phi);
      
      nodePositions.push(node.position.clone());
      nodes.push(node);
      nodesGroup.add(node);
    }
    
    // Create connections
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: 0x6852ff,
      transparent: true,
      opacity: 0.3
    });
    
    for (let i = 0; i < nodeCount; i++) {
      // Each node connects to 2-4 other nodes
      const connectionCount = Math.floor(Math.random() * 3) + 2;
      
      for (let j = 0; j < connectionCount; j++) {
        const targetIndex = Math.floor(Math.random() * nodeCount);
        if (targetIndex !== i) {
          const geometry = new THREE.BufferGeometry().setFromPoints([
            nodePositions[i],
            nodePositions[targetIndex]
          ]);
          
          const line = new THREE.Line(geometry, lineMaterial);
          nodesGroup.add(line);
        }
      }
    }
    
    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate the entire node network
      nodesGroup.rotation.x += 0.002;
      nodesGroup.rotation.y += 0.003;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);
  
  return (
    <div ref={containerRef} className="w-full h-64 rounded-xl overflow-hidden">
      {/* 3D visualization will be rendered here */}
    </div>
  );
}
