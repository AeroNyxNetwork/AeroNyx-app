'use client';

import { useEffect, useRef } from 'react';

export default function NetworkVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Node network visualization
    const nodes: { x: number; y: number; size: number; speed: number; connections: number[] }[] = [];
    const count = 30;
    
    // Initialize nodes
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 0.5 + 0.1,
        connections: []
      });
    }
    
    // Determine connections between nodes
    for (let i = 0; i < count; i++) {
      const connectionsCount = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < connectionsCount; j++) {
        let target = Math.floor(Math.random() * count);
        if (target !== i && !nodes[i].connections.includes(target)) {
          nodes[i].connections.push(target);
        }
      }
    }
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections
      ctx.strokeStyle = 'rgba(120, 80, 255, 0.15)';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < count; i++) {
        const node = nodes[i];
        for (const target of node.connections) {
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(nodes[target].x, nodes[target].y);
          ctx.stroke();
        }
      }
      
      // Move and draw nodes
      for (let i = 0; i < count; i++) {
        const node = nodes[i];
        
        // Move node
        node.x += Math.sin(Date.now() * 0.001 + i) * node.speed;
        node.y += Math.cos(Date.now() * 0.001 + i) * node.speed;
        
        // Wrap around edges
        if (node.x < 0) node.x = canvas.width;
        if (node.x > canvas.width) node.x = 0;
        if (node.y < 0) node.y = canvas.height;
        if (node.y > canvas.height) node.y = 0;
        
        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(120, 80, 255, 0.7)';
        ctx.fill();
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full -z-10 opacity-20" />;
}
