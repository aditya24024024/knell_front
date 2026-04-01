import { useEffect, useRef } from "react";

const FBX_URL = "https://res.cloudinary.com/de0h4hisr/raw/upload/knellminecraftblock_b8egl4.fbx";

export default function MinecraftBlock() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer, animId, fbxMesh;

    async function init() {
      // Dynamic imports so they only run client-side
      const THREE = await import("three");
      const { FBXLoader } = await import("three/examples/jsm/loaders/FBXLoader");

      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
      camera.position.set(2.6, 2.0, 2.6);
      camera.lookAt(0, 0.05, 0);

      scene.add(new THREE.AmbientLight(0xffffff, 0.45));
      const key = new THREE.DirectionalLight(0xffffff, 1.0);
      key.position.set(6, 9, 5);
      scene.add(key);
      const fill = new THREE.DirectionalLight(0x4ea83d, 0.4);
      fill.position.set(-6, 2, -4);
      scene.add(fill);
      const rim = new THREE.DirectionalLight(0xede9dc, 0.2);
      rim.position.set(0, -4, -6);
      scene.add(rim);

      // Particles
      const pGeo = new THREE.BufferGeometry();
      const pArr = new Float32Array(90 * 3);
      for (let i = 0; i < pArr.length; i++) pArr[i] = (Math.random() - 0.5) * 4.5;
      pGeo.setAttribute("position", new THREE.BufferAttribute(pArr, 3));
      scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({
        color: 0x5dc94a, size: 0.012, transparent: true, opacity: 0.4,
      })));

      // Try loading FBX
      try {
        const loader = new FBXLoader();
        const fbx = await new Promise((resolve, reject) => {
          loader.load(FBX_URL, resolve, undefined, reject);
        });

        // Auto-scale to fit ~1.5 units
        const box = new THREE.Box3().setFromObject(fbx);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 1.5 / maxDim;
        fbx.scale.setScalar(scale);

        // Center it
        const center = box.getCenter(new THREE.Vector3());
        fbx.position.sub(center.multiplyScalar(scale));

        fbx.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
          }
        });

        scene.add(fbx);
        fbxMesh = fbx;
      } catch (err) {
        console.warn("FBX failed, using procedural block:", err);
        fbxMesh = buildProceduralBlock(THREE, scene);
      }

      // Mouse parallax
      let mx = 0, my = 0;
      const onMouseMove = (e) => {
        mx = (e.clientX / window.innerWidth - 0.5) * 2;
        my = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener("mousemove", onMouseMove);

      let t = 0;
      function animate() {
        animId = requestAnimationFrame(animate);
        const w = canvas.clientWidth, h = canvas.clientHeight;
        if (canvas.width !== w || canvas.height !== h) {
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        }
        t += 0.007;
        if (fbxMesh) {
          fbxMesh.rotation.y = 0.55 + t * 0.38 + mx * 0.28;
          fbxMesh.rotation.x = -0.08 + my * 0.09;
          fbxMesh.position.y = Math.sin(t * 0.9) * 0.055;
        }
        renderer.render(scene, camera);
      }
      animate();

      return () => {
        window.removeEventListener("mousemove", onMouseMove);
      };
    }

    let cleanup;
    init().then((fn) => { cleanup = fn; });

    return () => {
      if (animId) cancelAnimationFrame(animId);
      if (renderer) renderer.dispose();
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}

function buildProceduralBlock(THREE, scene) {
  function pixelTex(grid, size) {
    const c = document.createElement("canvas");
    c.width = size; c.height = size;
    const ctx = c.getContext("2d");
    const side = Math.round(Math.sqrt(grid.length));
    const ps = size / side;
    grid.forEach((col, i) => {
      ctx.fillStyle = col;
      ctx.fillRect((i % side) * ps, Math.floor(i / side) * ps, ps, ps);
    });
    const t = new THREE.CanvasTexture(c);
    t.magFilter = t.minFilter = THREE.NearestFilter;
    return t;
  }

  const G1="#4ea83d",G2="#5dc94a",G3="#3d8f2f";
  const D1="#7a5530",D2="#8c6438",D3="#6b4928";

  const topPx=[G2,G1,G2,G3,G2,G1,G2,G1,G1,G3,G1,G2,G1,G3,G1,G2,G2,G1,G3,G1,G2,G1,G3,G1,G3,G2,G1,G2,G3,G2,G1,G3,G1,G3,G2,G1,G1,G3,G2,G1,G2,G1,G3,G2,G1,G2,G3,G2,G3,G2,G1,G3,G2,G1,G2,G3,G1,G3,G2,G1,G3,G2,G1,G2];
  const dirtPx=[D1,D2,D1,D3,D1,D2,D1,D1,D2,D1,D3,D1,D2,D1,D3,D2,D1,D3,D1,D2,D1,D1,D2,D1,D3,D1,D2,D1,D3,D2,D1,D3,D1,D2,D1,D3,D1,D2,D3,D1,D2,D1,D3,D1,D2,D1,D1,D2,D1,D3,D1,D2,D1,D3,D2,D1,D3,D1,D2,D1,D3,D1,D2,D3];

  const sideC = document.createElement("canvas");
  sideC.width = 64; sideC.height = 64;
  const sCtx = sideC.getContext("2d");
  dirtPx.forEach((col,i) => { sCtx.fillStyle=col; sCtx.fillRect((i%8)*8,Math.floor(i/8)*8,8,8); });
  [G2,G1,G2,G3,G2,G1,G2,G1].forEach((col,x) => {
    sCtx.fillStyle=col; sCtx.fillRect(x*8,0,8,8);
    sCtx.fillStyle=x%2?G3:G1; sCtx.fillRect(x*8,8,8,8);
  });
  const sT = new THREE.CanvasTexture(sideC);
  sT.magFilter = sT.minFilter = THREE.NearestFilter;

  const bellC = document.createElement("canvas");
  bellC.width=256; bellC.height=256;
  const bCtx = bellC.getContext("2d");
  bCtx.fillStyle="#3a8a2c"; bCtx.fillRect(0,0,256,256);
  bCtx.fillStyle="#ede9dc"; bCtx.shadowColor="rgba(0,0,0,0.4)"; bCtx.shadowBlur=14;
  bCtx.fillRect(120,44,16,28);
  bCtx.beginPath(); bCtx.arc(128,44,12,0,Math.PI*2); bCtx.fill();
  bCtx.beginPath(); bCtx.arc(128,108,58,Math.PI,0); bCtx.lineTo(196,160); bCtx.lineTo(60,160); bCtx.closePath(); bCtx.fill();
  bCtx.fillRect(58,154,140,16);
  bCtx.beginPath(); bCtx.arc(128,180,16,0,Math.PI*2); bCtx.fill();
  const bT = new THREE.CanvasTexture(bellC);
  bT.magFilter = bT.minFilter = THREE.NearestFilter;

  const mats = [
    new THREE.MeshLambertMaterial({ map: sT }),
    new THREE.MeshLambertMaterial({ map: sT }),
    new THREE.MeshLambertMaterial({ map: pixelTex(topPx,64) }),
    new THREE.MeshLambertMaterial({ map: pixelTex(dirtPx,64) }),
    new THREE.MeshLambertMaterial({ map: bT }),
    new THREE.MeshLambertMaterial({ map: sT }),
  ];

  const block = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), mats);
  scene.add(block);

  const mini = new THREE.Mesh(new THREE.BoxGeometry(0.32,0.32,0.32), mats);
  mini.position.set(0.72,-0.67,0.25);
  scene.add(mini);

  // Return a group so the animation loop can rotate everything together
  const group = new THREE.Group();
  scene.remove(block); scene.remove(mini);
  group.add(block); group.add(mini);
  scene.add(group);
  return group;
}
