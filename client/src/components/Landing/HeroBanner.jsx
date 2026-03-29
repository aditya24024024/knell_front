"use client";
import { useRouter } from "next/router";
import React, { useState } from "react";
import dynamic from "next/dynamic";

const MinecraftBlock = dynamic(() => import("./MinecraftBlock"), {
  ssr: false,
  loading: () => <div style={{ width: "100%", height: "100%" }} />,
});

function MinecraftBlockOLD() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
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
    const fill = new THREE.DirectionalLight(0x4ea83d, 0.25);
    fill.position.set(-6, 2, -4);
    scene.add(fill);

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

    const G1 = "#4ea83d", G2 = "#5dc94a", G3 = "#3d8f2f";
    const D1 = "#7a5530", D2 = "#8c6438", D3 = "#6b4928";

    const topPx = [
      G2,G1,G2,G3,G2,G1,G2,G1, G1,G3,G1,G2,G1,G3,G1,G2,
      G2,G1,G3,G1,G2,G1,G3,G1, G3,G2,G1,G2,G3,G2,G1,G3,
      G1,G3,G2,G1,G1,G3,G2,G1, G2,G1,G3,G2,G1,G2,G3,G2,
      G3,G2,G1,G3,G2,G1,G2,G3, G1,G3,G2,G1,G3,G2,G1,G2,
    ];
    const dirtPx = [
      D1,D2,D1,D3,D1,D2,D1,D1, D2,D1,D3,D1,D2,D1,D3,D2,
      D1,D3,D1,D2,D1,D1,D2,D1, D3,D1,D2,D1,D3,D2,D1,D3,
      D1,D2,D1,D3,D1,D2,D3,D1, D2,D1,D3,D1,D2,D1,D1,D2,
      D1,D3,D1,D2,D1,D3,D2,D1, D3,D1,D2,D1,D3,D1,D2,D3,
    ];

    function grassSideTex() {
      const c = document.createElement("canvas");
      c.width = 64; c.height = 64;
      const ctx = c.getContext("2d");
      const ps = 8;
      dirtPx.forEach((col, i) => {
        ctx.fillStyle = col;
        ctx.fillRect((i % 8) * ps, Math.floor(i / 8) * ps, ps, ps);
      });
      [G2,G1,G2,G3,G2,G1,G2,G1].forEach((col, x) => {
        ctx.fillStyle = col; ctx.fillRect(x * ps, 0, ps, ps);
        ctx.fillStyle = x % 2 ? G3 : G1; ctx.fillRect(x * ps, ps, ps, ps);
      });
      const t = new THREE.CanvasTexture(c);
      t.magFilter = t.minFilter = THREE.NearestFilter;
      return t;
    }

    function bellFaceTex() {
      const c = document.createElement("canvas");
      c.width = 256; c.height = 256;
      const ctx = c.getContext("2d");
      ctx.fillStyle = "#3a8a2c";
      ctx.fillRect(0, 0, 256, 256);
      ctx.strokeStyle = "rgba(0,0,0,0.1)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < 8; i++) {
        ctx.beginPath(); ctx.moveTo(i * 32, 0); ctx.lineTo(i * 32, 256); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i * 32); ctx.lineTo(256, i * 32); ctx.stroke();
      }
      ctx.fillStyle = "#ede9dc";
      ctx.shadowColor = "rgba(0,0,0,0.4)";
      ctx.shadowBlur = 14;
      ctx.fillRect(120, 44, 16, 28);
      ctx.beginPath(); ctx.arc(128, 44, 12, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath();
      ctx.arc(128, 108, 58, Math.PI, 0);
      ctx.lineTo(196, 160); ctx.lineTo(60, 160); ctx.closePath();
      ctx.fill();
      ctx.fillRect(58, 154, 140, 16);
      ctx.beginPath(); ctx.arc(128, 180, 16, 0, Math.PI * 2); ctx.fill();
      const t = new THREE.CanvasTexture(c);
      t.magFilter = t.minFilter = THREE.NearestFilter;
      return t;
    }

    const topT = pixelTex(topPx, 64);
    const dirtT = pixelTex(dirtPx, 64);
    const sideT = grassSideTex();
    const bellT = bellFaceTex();

    function makeMats() {
      return [
        new THREE.MeshLambertMaterial({ map: sideT }),
        new THREE.MeshLambertMaterial({ map: sideT }),
        new THREE.MeshLambertMaterial({ map: topT }),
        new THREE.MeshLambertMaterial({ map: dirtT }),
        new THREE.MeshLambertMaterial({ map: bellT }),
        new THREE.MeshLambertMaterial({ map: sideT }),
      ];
    }

    const block = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), makeMats());
    scene.add(block);
    const mini = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.32, 0.32), makeMats());
    mini.position.set(0.72, -0.67, 0.25);
    scene.add(mini);
    const tiny = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.16), makeMats());
    tiny.position.set(-0.6, -0.55, 0.4);
    scene.add(tiny);

    const pGeo = new THREE.BufferGeometry();
    const pArr = new Float32Array(90 * 3);
    for (let i = 0; i < pArr.length; i++) pArr[i] = (Math.random() - 0.5) * 4.5;
    pGeo.setAttribute("position", new THREE.BufferAttribute(pArr, 3));
    scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x5dc94a, size: 0.012, transparent: true, opacity: 0.4 })));

    let mx = 0, my = 0;
    const onMouseMove = (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    let t = 0, animId;
    function animate() {
      animId = requestAnimationFrame(animate);
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (canvas.width !== w || canvas.height !== h) {
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
      t += 0.007;
      block.rotation.y = 0.55 + t * 0.38 + mx * 0.28;
      block.rotation.x = -0.08 + my * 0.09;
      block.position.y = Math.sin(t * 0.9) * 0.055;
      mini.rotation.y = -t * 0.55;
      mini.position.y = -0.67 + Math.sin(t * 1.3 + 1.2) * 0.038;
      tiny.rotation.y = t * 0.9;
      tiny.position.y = -0.55 + Math.sin(t * 1.6 + 2.5) * 0.03;
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
}

const SUGGESTIONS = [
  { label: "Video Editing", search: "edit" },
  { label: "Stream Overlay", search: "overlay" },
  { label: "Thumbnail Design", search: "thumbnail" },
  { label: "Shorts Editing", search: "shorts" },
  { label: "Channel Art", search: "channel art" },
];

export default function HeroBanner() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div
      className="relative min-h-screen flex overflow-hidden"
      style={{ background: "#09090b" }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(93,201,74,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(93,201,74,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Green glow */}
      <div
        className="absolute z-0 pointer-events-none"
        style={{
          top: "10%", right: "0%",
          width: "55%", height: "80%",
          background: "radial-gradient(ellipse, rgba(58,138,44,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Left: copy */}
      <div className="relative z-10 flex flex-col justify-center px-6 md:px-12 lg:px-20 pt-28 pb-16 w-full lg:w-1/2">
        {/* Pill */}
        <div
          className="inline-flex items-center gap-2 mb-6 w-fit px-4 py-1.5"
          style={{ border: "1px solid rgba(93,201,74,0.25)" }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "#5dc94a", animation: "knell-blink 2s infinite" }}
          />
          <span
            className="uppercase tracking-widest"
            style={{ fontFamily: "Space Mono, monospace", fontSize: "0.6rem", color: "#5dc94a" }}
          >
            Making Live Better · India
          </span>
        </div>

        {/* Headline */}
        <h1
          className="mb-5 leading-none"
          style={{
            fontFamily: "Bebas Neue, sans-serif",
            fontSize: "clamp(3.5rem, 6.5vw, 7rem)",
            letterSpacing: "0.02em",
            color: "#ede9dc",
            lineHeight: 0.92,
          }}
        >
          THE TALENT<br />
          <span style={{ color: "#5dc94a" }}>LAYER</span> FOR<br />
          <span style={{ color: "transparent", WebkitTextStroke: "1.5px rgba(237,233,220,0.22)" }}>
            CREATORS.
          </span>
        </h1>

        <p
          className="mb-6 font-light"
          style={{ color: "#6b7a62", maxWidth: 440, lineHeight: 1.8, fontSize: "0.95rem" }}
        >
          Find <strong style={{ color: "#dbd7ca", fontWeight: 500 }}>editors, designers and developers</strong> who
          live in the creator world. Browse gigs, message sellers, and get your
          content done — in ₹.
        </p>

        {/* Search bar */}
        <div
          className="flex mb-5"
          style={{
            border: "1px solid rgba(93,201,74,0.3)",
            background: "#15171c",
            maxWidth: 500,
          }}
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search 'thumbnail designer' or 'stream overlay'…"
            className="flex-1 bg-transparent outline-none px-4 py-3 text-sm"
            style={{ color: "#dbd7ca", fontFamily: "Inter, sans-serif" }}
          />
          <button
            onClick={handleSearch}
            className="px-5 py-3 flex-shrink-0 transition-colors"
            style={{
              background: "#3a8a2c",
              fontFamily: "Space Mono, monospace",
              fontSize: "0.68rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#ede9dc",
              border: "none",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#4ea83d")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#3a8a2c")}
          >
            Find Gigs
          </button>
        </div>

        {/* Suggestion pills */}
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map(({ label, search }) => (
            <button
              key={label}
              onClick={() => router.push(`/search?q=${encodeURIComponent(search)}`)}
              className="px-3 py-1 text-xs transition-all"
              style={{
                fontFamily: "Space Mono, monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                border: "1px solid rgba(237,233,220,0.1)",
                color: "#6b7a62",
                background: "transparent",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#5dc94a";
                e.currentTarget.style.color = "#5dc94a";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(237,233,220,0.1)";
                e.currentTarget.style.color = "#6b7a62";
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Right: 3D block */}
      <div className="hidden lg:flex relative z-10 w-1/2 items-center justify-center">
        <div className="w-full max-w-[520px] aspect-square">
          <MinecraftBlock />
        </div>
        <div
          className="absolute bottom-8 right-8"
          style={{
            fontFamily: "Space Mono, monospace",
            fontSize: "0.55rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#3d4438",
            border: "1px solid rgba(93,201,74,0.14)",
            padding: "0.25rem 0.6rem",
            background: "#09090b",
          }}
        >
          Knell Block · Interactive
        </div>
      </div>

      <style jsx global>{`
        @keyframes knell-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}