import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useHorizon } from '../../context/HorizonContext';
import {
  RotateCcw,
  Layers,
  Sparkles,
  Maximize2,
  Eye,
  Sliders,
  Flame,
  Award,
  ShieldCheck,
  FolderGit2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

type TrackerMode = 'hours' | 'dsa' | 'cyber' | 'projects';

export const Trackers3DArena: React.FC = () => {
  const { profile, placementTracker, cyberModules, projects, focusSessions } = useHorizon();

  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTracker, setActiveTracker] = useState<TrackerMode>('hours');
  const [explodedVal, setExplodedVal] = useState<number>(0);
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [hudCollapsed, setHudCollapsed] = useState<boolean>(false);

  // Computed metrics
  const totalFocusHours =
    Math.round(
      (focusSessions.reduce((acc, s) => acc + (s.completed ? s.durationMinutes : 0), 0) / 60) * 10
    ) / 10 + 4; // baseline 4
  const dsaSolved = placementTracker.dsaSolved || 0;
  const dsaTarget = placementTracker.dsaTarget || 200;
  const completedLabs = cyberModules.reduce(
    (acc, m) => acc + m.labs.filter((l) => l.completed).length,
    0
  );
  const totalLabs = cyberModules.reduce((acc, m) => acc + m.labs.length, 0) || 18;
  const completedProjects = projects.filter((p) => p.status === 'Completed').length;
  const inProgressProjects = projects.filter((p) => p.status === 'In Progress').length;

  // Refs for three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const activeGroupRef = useRef<THREE.Group | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Mouse interaction state for dragging
  const mouseStateRef = useRef({
    isDown: false,
    prevX: 0,
    prevY: 0,
    rotX: 0.3,
    rotY: 0.5,
    targetRotX: 0.3,
    targetRotY: 0.5,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    // Detect software gl
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x050816, 0.04);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 5.5);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    containerRef.current.replaceChildren(renderer.domElement);

    // Lighting Rig
    const ambientLight = new THREE.AmbientLight(0x35d9ff, 0.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x8b5cff, 2.5);
    rimLight.position.set(-6, -2, -5);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xff7a59, 1.8, 12);
    fillLight.position.set(0, -3, 2);
    scene.add(fillLight);

    // Ground Contact Shadow Disc
    const groundGeo = new THREE.CircleGeometry(2.5, 32);
    const groundMat = new THREE.MeshBasicMaterial({
      color: 0x030612,
      transparent: true,
      opacity: 0.6,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.8;
    scene.add(ground);

    // Build Current Tracker 3D Model
    buildModel(activeTracker);

    // Render loop
    let lastTime = performance.now();
    const render = () => {
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (activeGroupRef.current) {
        if (autoRotate && !mouseStateRef.current.isDown) {
          mouseStateRef.current.targetRotY += delta * 0.45;
        }

        // Smooth damping
        mouseStateRef.current.rotX +=
          (mouseStateRef.current.targetRotX - mouseStateRef.current.rotX) * 0.1;
        mouseStateRef.current.rotY +=
          (mouseStateRef.current.targetRotY - mouseStateRef.current.rotY) * 0.1;

        activeGroupRef.current.rotation.x = mouseStateRef.current.rotX;
        activeGroupRef.current.rotation.y = mouseStateRef.current.rotY;

        // Animate sub-elements based on delta
        animateSubParts(activeGroupRef.current, delta, activeTracker, explodedVal);
      }

      renderer.render(scene, camera);
      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    // Resize Observer
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Rebuild model when tracker type or wireframe changes
  useEffect(() => {
    buildModel(activeTracker);
  }, [activeTracker, wireframe]);

  // Update exploded distance when slider changes
  useEffect(() => {
    if (!activeGroupRef.current) return;
    updateExplodedDistance(activeGroupRef.current, explodedVal, activeTracker);
  }, [explodedVal]);

  const buildModel = (type: TrackerMode) => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    if (activeGroupRef.current) {
      scene.remove(activeGroupRef.current);
      disposeGroup(activeGroupRef.current);
      activeGroupRef.current = null;
    }

    const group = new THREE.Group();
    activeGroupRef.current = group;

    switch (type) {
      case 'hours':
        buildCelestialGyroscope(group, totalFocusHours, wireframe);
        break;
      case 'dsa':
        buildDsaCrystallinePolyhedron(group, dsaSolved, dsaTarget, wireframe);
        break;
      case 'cyber':
        buildCyberMatrixShield(group, completedLabs, totalLabs, wireframe);
        break;
      case 'projects':
        buildProjectsOrbitalMatrix(group, completedProjects, inProgressProjects, wireframe);
        break;
    }

    scene.add(group);
  };

  // 1. CELESTIAL GYROSCOPE (Hours & Focus)
  const buildCelestialGyroscope = (group: THREE.Group, hours: number, isWire: boolean) => {
    // Core glowing energy sphere
    const coreGeo = new THREE.SphereGeometry(0.7, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x35d9ff,
      emissive: 0x124c7a,
      roughness: 0.2,
      metalness: 0.85,
      wireframe: isWire,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.name = 'gyro_core';
    group.add(core);

    // Inner orbital ring
    const ring1Geo = new THREE.TorusGeometry(1.2, 0.05, 16, 64);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x8b5cff,
      roughness: 0.3,
      metalness: 0.9,
      wireframe: isWire,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.name = 'gyro_ring1';
    ring1.rotation.x = Math.PI / 4;
    group.add(ring1);

    // Middle orbital ring
    const ring2Geo = new THREE.TorusGeometry(1.55, 0.045, 16, 64);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x35d9ff,
      roughness: 0.2,
      metalness: 0.95,
      wireframe: isWire,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.name = 'gyro_ring2';
    ring2.rotation.y = Math.PI / 3;
    group.add(ring2);

    // Outer progress ring with ticks
    const ring3Geo = new THREE.TorusGeometry(1.95, 0.06, 16, 72);
    const ring3Mat = new THREE.MeshStandardMaterial({
      color: 0xff7a59,
      emissive: 0x5a1f10,
      roughness: 0.15,
      metalness: 0.8,
      wireframe: isWire,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.name = 'gyro_ring3';
    group.add(ring3);

    // Orbital satellites (particles)
    const satCount = Math.min(12, Math.max(4, Math.floor(hours)));
    for (let i = 0; i < satCount; i++) {
      const angle = (i / satCount) * Math.PI * 2;
      const satGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
      const satMat = new THREE.MeshBasicMaterial({ color: 0x35d9ff });
      const sat = new THREE.Mesh(satGeo, satMat);
      sat.position.set(Math.cos(angle) * 1.55, Math.sin(angle) * 1.55, 0);
      sat.name = `sat_${i}`;
      ring2.add(sat);
    }
  };

  // 2. DSA CRYSTALLINE POLYHEDRON (LeetCode & Algorithm Mastery)
  const buildDsaCrystallinePolyhedron = (
    group: THREE.Group,
    solved: number,
    target: number,
    isWire: boolean
  ) => {
    // Outer faceted dodecahedron
    const dsaGeo = new THREE.IcosahedronGeometry(1.25, 1);
    const dsaMat = new THREE.MeshPhysicalMaterial({
      color: 0x8b5cff,
      emissive: 0x241147,
      roughness: 0.15,
      metalness: 0.8,
      transmission: 0.35,
      transparent: true,
      opacity: 0.9,
      wireframe: isWire,
    });
    const outerMesh = new THREE.Mesh(dsaGeo, dsaMat);
    outerMesh.name = 'dsa_outer';
    group.add(outerMesh);

    // Inner wireframe matrix
    const innerGeo = new THREE.OctahedronGeometry(0.8, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x35d9ff,
      emissive: 0x0b4b66,
      wireframe: true,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    innerMesh.name = 'dsa_inner';
    group.add(innerMesh);

    // Dynamic Nodes on vertices representing solved challenges
    const posAttribute = dsaGeo.getAttribute('position');
    const nodeCount = Math.min(posAttribute.count, Math.max(6, Math.floor((solved / target) * 42)));
    for (let i = 0; i < nodeCount; i++) {
      const nodeGeo = new THREE.SphereGeometry(0.06, 12, 12);
      const nodeMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(posAttribute.getX(i), posAttribute.getY(i), posAttribute.getZ(i));
      node.name = `node_${i}`;
      outerMesh.add(node);
    }
  };

  // 3. CYBER MATRIX SHIELD
  const buildCyberMatrixShield = (
    group: THREE.Group,
    completed: number,
    total: number,
    isWire: boolean
  ) => {
    // Shield Body Extrusion / Faceted Prism
    const shieldShape = new THREE.Shape();
    shieldShape.moveTo(0, 1.3);
    shieldShape.lineTo(0.95, 0.75);
    shieldShape.lineTo(0.75, -0.6);
    shieldShape.lineTo(0, -1.35);
    shieldShape.lineTo(-0.75, -0.6);
    shieldShape.lineTo(-0.95, 0.75);
    shieldShape.closePath();

    const extrudeSettings = {
      depth: 0.18,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.06,
      bevelThickness: 0.06,
    };

    const shieldGeo = new THREE.ExtrudeGeometry(shieldShape, extrudeSettings);
    const shieldMat = new THREE.MeshStandardMaterial({
      color: 0x0e1c38,
      roughness: 0.25,
      metalness: 0.95,
      wireframe: isWire,
    });
    const shield = new THREE.Mesh(shieldGeo, shieldMat);
    shield.name = 'cyber_shield_body';
    shield.position.z = -0.09;
    group.add(shield);

    // Glowing Cyber Emblem Emissive Ring
    const ringGeo = new THREE.TorusGeometry(0.55, 0.04, 16, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x35d9ff, wireframe: isWire });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.name = 'cyber_emblem';
    ring.position.z = 0.16;
    group.add(ring);

    // Surrounding orbital matrix defense rings
    const orbitGeo = new THREE.TorusGeometry(1.65, 0.03, 16, 64);
    const orbitMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cff,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: isWire,
    });
    const orbit = new THREE.Mesh(orbitGeo, orbitMat);
    orbit.name = 'cyber_orbit';
    group.add(orbit);
  };

  // 4. PROJECTS ORBITAL MATRIX
  const buildProjectsOrbitalMatrix = (
    group: THREE.Group,
    completed: number,
    inProgress: number,
    isWire: boolean
  ) => {
    // Center master modular core cube
    const coreCubeGeo = new THREE.BoxGeometry(0.9, 0.9, 0.9);
    const coreCubeMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cff,
      roughness: 0.2,
      metalness: 0.85,
      wireframe: isWire,
    });
    const coreCube = new THREE.Mesh(coreCubeGeo, coreCubeMat);
    coreCube.name = 'proj_core_cube';
    group.add(coreCube);

    // Orbiting Satellite Cubes (Modules)
    const totalProjects = Math.max(4, completed + inProgress);
    for (let i = 0; i < totalProjects; i++) {
      const angle = (i / totalProjects) * Math.PI * 2;
      const radius = 1.6;
      const satGeo = new THREE.BoxGeometry(0.35, 0.35, 0.35);
      const satMat = new THREE.MeshStandardMaterial({
        color: i < completed ? 0x10b981 : 0x35d9ff,
        roughness: 0.3,
        metalness: 0.7,
        wireframe: isWire,
      });
      const sat = new THREE.Mesh(satGeo, satMat);
      sat.position.set(Math.cos(angle) * radius, Math.sin(angle) * 0.4, Math.sin(angle) * radius);
      sat.name = `proj_sat_${i}`;
      group.add(sat);
    }
  };

  const animateSubParts = (
    group: THREE.Group,
    delta: number,
    type: TrackerMode,
    exploded: number
  ) => {
    switch (type) {
      case 'hours': {
        const ring1 = group.getObjectByName('gyro_ring1');
        const ring2 = group.getObjectByName('gyro_ring2');
        const ring3 = group.getObjectByName('gyro_ring3');
        const core = group.getObjectByName('gyro_core');
        if (ring1) ring1.rotation.z += delta * 0.8;
        if (ring2) ring2.rotation.x += delta * 0.6;
        if (ring3) ring3.rotation.y += delta * 0.35;
        if (core) core.rotation.y -= delta * 0.5;
        break;
      }
      case 'dsa': {
        const outer = group.getObjectByName('dsa_outer');
        const inner = group.getObjectByName('dsa_inner');
        if (outer) outer.rotation.y += delta * 0.3;
        if (inner) {
          inner.rotation.x -= delta * 0.5;
          inner.rotation.z += delta * 0.4;
        }
        break;
      }
      case 'cyber': {
        const emblem = group.getObjectByName('cyber_emblem');
        const orbit = group.getObjectByName('cyber_orbit');
        if (emblem) emblem.rotation.z += delta * 0.9;
        if (orbit) {
          orbit.rotation.x += delta * 0.4;
          orbit.rotation.y += delta * 0.3;
        }
        break;
      }
      case 'projects': {
        const core = group.getObjectByName('proj_core_cube');
        if (core) {
          core.rotation.x += delta * 0.4;
          core.rotation.y += delta * 0.5;
        }
        group.children.forEach((child) => {
          if (child.name.startsWith('proj_sat_')) {
            child.rotation.x += delta * 1.1;
            child.rotation.y += delta * 0.9;
          }
        });
        break;
      }
    }
  };

  const updateExplodedDistance = (group: THREE.Group, val: number, type: TrackerMode) => {
    const scale = 1 + val * 0.6;
    switch (type) {
      case 'hours': {
        const ring1 = group.getObjectByName('gyro_ring1');
        const ring2 = group.getObjectByName('gyro_ring2');
        const ring3 = group.getObjectByName('gyro_ring3');
        if (ring1) ring1.scale.set(1 + val * 0.3, 1 + val * 0.3, 1 + val * 0.3);
        if (ring2) ring2.scale.set(1 + val * 0.5, 1 + val * 0.5, 1 + val * 0.5);
        if (ring3) ring3.scale.set(1 + val * 0.8, 1 + val * 0.8, 1 + val * 0.8);
        break;
      }
      case 'dsa': {
        const outer = group.getObjectByName('dsa_outer');
        const inner = group.getObjectByName('dsa_inner');
        if (outer) outer.scale.set(1 + val * 0.4, 1 + val * 0.4, 1 + val * 0.4);
        if (inner) inner.scale.set(1 - val * 0.2, 1 - val * 0.2, 1 - val * 0.2);
        break;
      }
      case 'cyber': {
        const emblem = group.getObjectByName('cyber_emblem');
        const orbit = group.getObjectByName('cyber_orbit');
        if (emblem) emblem.position.z = 0.16 + val * 0.6;
        if (orbit) orbit.scale.set(1 + val * 0.7, 1 + val * 0.7, 1 + val * 0.7);
        break;
      }
      case 'projects': {
        group.children.forEach((child) => {
          if (child.name.startsWith('proj_sat_')) {
            const originalLength = 1.6;
            const newRadius = originalLength + val * 1.2;
            const dir = new THREE.Vector3(child.position.x, 0, child.position.z).normalize();
            child.position.x = dir.x * newRadius;
            child.position.z = dir.z * newRadius;
          }
        });
        break;
      }
    }
  };

  const disposeGroup = (group: THREE.Group) => {
    group.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else {
          mesh.material.dispose();
        }
      }
    });
  };

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    mouseStateRef.current.isDown = true;
    mouseStateRef.current.prevX = e.clientX;
    mouseStateRef.current.prevY = e.clientY;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!mouseStateRef.current.isDown) return;
    const deltaX = e.clientX - mouseStateRef.current.prevX;
    const deltaY = e.clientY - mouseStateRef.current.prevY;
    mouseStateRef.current.prevX = e.clientX;
    mouseStateRef.current.prevY = e.clientY;
    mouseStateRef.current.targetRotY += deltaX * 0.008;
    mouseStateRef.current.targetRotX += deltaY * 0.008;
  };

  const handleMouseUp = () => {
    mouseStateRef.current.isDown = false;
  };

  const resetCamera = () => {
    mouseStateRef.current.targetRotX = 0.3;
    mouseStateRef.current.targetRotY = 0.5;
    setExplodedVal(0);
  };

  return (
    <div className="relative h-full w-full min-h-0 flex flex-col bg-[#050816] text-slate-100 overflow-hidden select-none">
      {/* TOP HEADER: Unobstructed & Crisp */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-[#8B5CFF]/15 bg-[#0B1228]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CFF] to-[#35D9FF] flex items-center justify-center shadow-lg shadow-[#8B5CFF]/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold tracking-tight text-white">
                3D Metric Trackers Arena
              </h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#8B5CFF]/20 text-[#35D9FF] border border-[#8B5CFF]/30">
                WebGL 2.0
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Procedural interactive spatial metrics for study, DSA, cyber, and projects
            </p>
          </div>
        </div>

        {/* Metric Badges */}
        <div className="flex items-center gap-2 sm:gap-4 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-[#FF7A59]" />
            <span className="text-slate-400">Total Hours:</span>
            <span className="font-bold text-white tabular-nums">{totalFocusHours}h</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2">
            <Award className="w-3.5 h-3.5 text-[#8B5CFF]" />
            <span className="text-slate-400">DSA Solved:</span>
            <span className="font-bold text-white tabular-nums">
              {dsaSolved}/{dsaTarget}
            </span>
          </div>
        </div>
      </div>

      {/* 3D WEBGL CANVAS VIEWPORT (Central, 100% Unobstructed) */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="relative flex-1 w-full h-full cursor-grab active:cursor-grabbing overflow-hidden"
      />

      {/* MINIMAL HINT OVERLAY (Top-Left of Canvas) */}
      <div className="absolute top-20 left-6 pointer-events-none z-10 flex flex-col gap-1 text-[11px] text-slate-400 font-mono bg-black/40 px-3 py-2 rounded-lg border border-white/5 backdrop-blur-sm">
        <span>Click & drag to rotate 3D model</span>
        <span className="text-[#35D9FF]">Active: {activeTracker.toUpperCase()} Model</span>
      </div>

      {/* UNIFIED COLLAPSIBLE BOTTOM CONTROL DOCK (Zero Viewport Occlusion) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-3xl flex flex-col items-center">
        {/* Collapse / Expand Toggle Button */}
        <button
          type="button"
          onClick={() => setHudCollapsed((prev) => !prev)}
          className="mb-1 flex items-center gap-1.5 px-3 py-1 rounded-t-lg bg-[#0B1228] border-t border-x border-[#8B5CFF]/30 text-xs font-medium text-slate-300 hover:text-white shadow-lg cursor-pointer transition-colors"
        >
          {hudCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          <span>{hudCollapsed ? 'Show Controls Dock' : 'Hide Controls'}</span>
        </button>

        {/* Dock Container */}
        {!hudCollapsed && (
          <div className="w-full rounded-2xl bg-[#0B1228]/95 border border-[#8B5CFF]/30 p-3 shadow-2xl shadow-black/80 backdrop-blur-md flex flex-col gap-3">
            {/* Top Row: Tracker Switcher Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setActiveTracker('hours')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTracker === 'hours'
                    ? 'bg-gradient-to-r from-[#8B5CFF] to-[#35D9FF] text-white shadow-md shadow-[#8B5CFF]/20'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-[#FF7A59]" />
                <span>Focus Gyroscope</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTracker('dsa')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTracker === 'dsa'
                    ? 'bg-gradient-to-r from-[#8B5CFF] to-[#35D9FF] text-white shadow-md shadow-[#8B5CFF]/20'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-[#8B5CFF]" />
                <span>DSA Polyhedron</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTracker('cyber')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTracker === 'cyber'
                    ? 'bg-gradient-to-r from-[#8B5CFF] to-[#35D9FF] text-white shadow-md shadow-[#8B5CFF]/20'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#35D9FF]" />
                <span>Cyber Shield</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTracker('projects')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTracker === 'projects'
                    ? 'bg-gradient-to-r from-[#8B5CFF] to-[#35D9FF] text-white shadow-md shadow-[#8B5CFF]/20'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <FolderGit2 className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Projects Array</span>
              </button>
            </div>

            {/* Bottom Row: Sliders & Toggles */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/10 text-xs">
              {/* Exploded View Slider */}
              <div className="flex items-center gap-2 min-w-[200px] flex-1">
                <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-slate-400 whitespace-nowrap">Exploded View:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={explodedVal}
                  onChange={(e) => setExplodedVal(parseFloat(e.target.value))}
                  className="w-full accent-[#8B5CFF] cursor-pointer"
                />
                <span className="font-mono text-slate-300 text-[11px] w-8 tabular-nums">
                  {Math.round(explodedVal * 100)}%
                </span>
              </div>

              {/* Toggles & Reset */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setWireframe((prev) => !prev)}
                  className={`px-3 py-1.5 rounded-lg border font-mono text-[11px] transition-colors cursor-pointer ${
                    wireframe
                      ? 'bg-[#8B5CFF]/20 border-[#8B5CFF] text-[#35D9FF]'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  Wireframe: {wireframe ? 'ON' : 'OFF'}
                </button>

                <button
                  type="button"
                  onClick={() => setAutoRotate((prev) => !prev)}
                  className={`px-3 py-1.5 rounded-lg border font-mono text-[11px] transition-colors cursor-pointer ${
                    autoRotate
                      ? 'bg-[#35D9FF]/20 border-[#35D9FF] text-[#35D9FF]'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  Spin: {autoRotate ? 'ON' : 'PAUSED'}
                </button>

                <button
                  type="button"
                  onClick={resetCamera}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                  title="Reset Camera & Rotation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
