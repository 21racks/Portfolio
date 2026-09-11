import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, MeshTransmissionMaterial, Sparkles } from "@react-three/drei";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import * as THREE from "three";
import "./styles.css";

const projects = [
  { n:"01", title:"Emerald / Motion", tag:"3D EXPERIENCE", copy:"A reactive visual system built around light, depth and spatial motion.", className:"wide" },
  { n:"02", title:"Rack / Studio", tag:"CREATIVE DIRECTION", copy:"A sharp digital identity for a future-facing creative studio.", className:"tall" },
  { n:"03", title:"Neon / Interface", tag:"UI / UX", copy:"Glass surfaces, tactile interactions and a deliberately quiet visual language.", className:"" },
  { n:"04", title:"After / Dark", tag:"EXPERIMENTAL", copy:"An immersive playground where typography and particles become the interface.", className:"" }
];

function Gem() {
  const ref = useRef();
  const target = useRef(new THREE.Vector3());
  useFrame((state, delta) => {
    if (!ref.current) return;
    const { pointer } = state;
    target.current.set(pointer.x * 0.45, pointer.y * 0.32, 0);
    ref.current.position.lerp(target.current, 1 - Math.pow(0.001, delta));
    ref.current.rotation.x += delta * 0.17 + pointer.y * delta * 0.1;
    ref.current.rotation.y += delta * 0.32 + pointer.x * delta * 0.15;
  });
  return (
    <Float speed={1.25} rotationIntensity={0.28} floatIntensity={0.55}>
      <mesh ref={ref} scale={2.05}>
        <icosahedronGeometry args={[1, 2]} />
        <MeshTransmissionMaterial
          backside
          samples={6}
          thickness={0.55}
          chromaticAberration={0.12}
          anisotropy={0.25}
          distortion={0.18}
          distortionScale={0.3}
          temporalDistortion={0.08}
          transmission={1}
          roughness={0.12}
          color="#04F06A"
          attenuationColor="#04F06A"
          attenuationDistance={1.8}
        />
      </mesh>
      <mesh scale={2.13}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#04F06A" wireframe transparent opacity={0.22} />
      </mesh>
    </Float>
  );
}

function Scene() {
  return (
    <Canvas
      className="canvas"
      camera={{ position: [0, 0, 7], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.25} />
      <pointLight position={[3, 3, 4]} color="#04F06A" intensity={8} distance={12} />
      <pointLight position={[-4, -2, 3]} color="#00ff88" intensity={3} distance={10} />
      <Gem />
      <Sparkles count={90} scale={[9, 6, 8]} size={1.2} speed={0.22} color="#04F06A" opacity={0.55} />
      <Environment preset="night" />
    </Canvas>
  );
}

function TiltCard({ project, index }) {
  const ref = useRef();
  const [transform, setTransform] = useState("");
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    setTransform(`perspective(900px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 9).toFixed(2)}deg) translateZ(8px)`);
  };
  return (
    <motion.article
      ref={ref}
      className={`project-card ${project.className}`}
      style={{ transform }}
      onMouseMove={onMove}
      onMouseLeave={() => setTransform("")}
      initial={{ opacity:0, y:45 }}
      whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true, amount:0.2 }}
      transition={{ duration:.7, delay:index*.08 }}
    >
      <div className="card-glow" />
      <div className="card-top"><span>{project.n}</span><span>{project.tag}</span></div>
      <div>
        <h3>{project.title}</h3>
        <p>{project.copy}</p>
      </div>
      <div className="card-arrow">↗</div>
    </motion.article>
  );
}

function App() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 70, damping: 20 });
  const orbY = useTransform(smooth, [0,1], ["0vh","80vh"]);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") document.body.style.overflow = "";
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <main>
      <div className="noise" />
      <motion.div className="orb-shadow" style={{ y: orbY }} />
      <section className="hero">
        <Scene />
        <nav className="nav glass">
          <a className="brand" href="#top">YvL<span>®</span></a>
          <div className="nav-links">
            <a href="#racks">Racks</a><a href="#contact">Contact</a>
          </div>
          <a className="status" href="#contact"><i /> Available for work</a>
        </nav>
        <div className="hero-copy" id="top">
          <motion.div initial={{opacity:0,y:25}} animate={{opacity:1,y:0}} transition={{duration:.8}}>
            <div className="eyebrow">DIGITAL ARTIST / CREATIVE DEVELOPER</div>
            <h1>YvL<br/><em>Racks</em></h1>
            <p className="hero-sub">I build digital worlds where code, motion and visual identity collide.</p>
          </motion.div>
        </div>
        <div className="scroll-cue"><span /> SCROLL TO EXPLORE</div>
        <div className="hero-meta"><span>© 2026</span><span>IND / WORLDWIDE</span></div>
      </section>

      <section className="intro">
        <div className="section-kicker">01 — SELECTED RACKS</div>
        <div className="intro-copy">
          <p>Not just websites.</p>
          <h2>Digital experiences<br/><span>with a pulse.</span></h2>
        </div>
      </section>

      <section id="racks" className="projects">
        {projects.map((p,i) => <TiltCard key={p.n} project={p} index={i} />)}
      </section>

      <section id="contact" className="contact">
        <div className="section-kicker">02 — START A CONVERSATION</div>
        <div className="contact-grid">
          <div>
            <h2>Have a wild<br/><span>idea?</span></h2>
            <p>Tell me what you're building. The stranger, the better.</p>
          </div>
          <form className="contact-form glass" onSubmit={submit}>
            <label>Name<input required name="name" placeholder="Your name" /></label>
            <label>Email<input required type="email" name="email" placeholder="you@domain.com" /></label>
            <label>Project brief<textarea required name="brief" rows="4" placeholder="A few words about the vision..." /></label>
            <button type="submit">{sent ? "MESSAGE READY ✓" : "SEND TRANSMISSION ↗"}</button>
          </form>
        </div>
      </section>

      <footer>
        <div className="brand">YvL<span>®</span></div>
        <div>DESIGNED + BUILT IN THE DARK</div>
        <div>SCROLL / 01—02</div>
      </footer>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
