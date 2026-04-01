import { useEffect, useRef } from "react";

export default function MinecraftBlock() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer, animId, model;

    async function init() {
      const THREE = await import("three");
      const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader");
      const { RGBELoader } = await import("three/examples/jsm/loaders/RGBELoader");

      // ✅ RENDERER (FIXED)
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);

      // ✅ NEW COLOR SYSTEM
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      // ✅ TONE MAPPING (huge visual boost)
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;

      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
      camera.position.set(2.6, 2.0, 2.6);
      camera.lookAt(0, 0.05, 0);

      // ✅ ENVIRONMENT LIGHTING (BIGGEST UPGRADE)
      const rgbeLoader = new RGBELoader();
      rgbeLoader.load("/studio.hdr", (hdr) => {
        hdr.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = hdr;
      });

      // ✅ LIGHTING (cleaned up)
      scene.add(new THREE.AmbientLight(0xffffff, 0.4));

      const key = new THREE.DirectionalLight(0xffffff, 1.2);
      key.position.set(5, 6, 5);
      scene.add(key);

      const fill = new THREE.DirectionalLight(0x4ea83d, 0.25);
      fill.position.set(-5, 2, -4);
      scene.add(fill);

      // Particles (unchanged)
      const pGeo = new THREE.BufferGeometry();
      const pArr = new Float32Array(90 * 3);
      for (let i = 0; i < pArr.length; i++) pArr[i] = (Math.random() - 0.5) * 4.5;
      pGeo.setAttribute("position", new THREE.BufferAttribute(pArr, 3));

      scene.add(new THREE.Points(
        pGeo,
        new THREE.PointsMaterial({
          color: 0x5dc94a,
          size: 0.012,
          transparent: true,
          opacity: 0.4,
        })
      ));

      // ✅ LOAD GLB
      const loader = new GLTFLoader();
      loader.load(
        "/knellblock.glb",
        (gltf) => {
          const obj = gltf.scene;

          // Auto-scale
          const box = new THREE.Box3().setFromObject(obj);
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 1.5 / maxDim;
          obj.scale.setScalar(scale);

          // Center
          const center = box.getCenter(new THREE.Vector3());
          obj.position.sub(center.multiplyScalar(scale));

          obj.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;

              // ✅ CRISP TEXTURES (VERY IMPORTANT)
              if (child.material.map) {
                child.material.map.magFilter = THREE.NearestFilter;
                child.material.map.minFilter = THREE.NearestFilter;
                child.material.map.generateMipmaps = false;
                child.material.map.needsUpdate = true;
              }
            }
          });

          scene.add(obj);
          model = obj;
        },
        undefined,
        (err) => {
          console.warn("GLB load failed, using procedural block:", err);
          model = buildProceduralBlock(THREE, scene);
        }
      );

      // Mouse interaction
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

        if (model) {
          model.rotation.y = 0.55 + t * 0.38 + mx * 0.28;
          model.rotation.x = -0.08 + my * 0.09;
          model.position.y = Math.sin(t * 0.9) * 0.055;
        }

        renderer.render(scene, camera);
      }

      animate();

      return () => window.removeEventListener("mousemove", onMouseMove);
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