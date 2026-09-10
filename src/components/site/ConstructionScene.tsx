import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Construction site background, rebuilt to match the reference scene:
 * perspective camera orbiting a road + rising building, tower crane and truck.
 */
export function ConstructionScene({ progressRef }: { progressRef: { current: number } }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const BG = 0xeef1f7;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(BG);
    scene.fog = new THREE.Fog(BG, 40, 105);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(-6.7, 11.2, 33.2);

    // Environment (matches the reference lightformer rig)
    const envScene = new THREE.Scene();
    const top = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }),
    );
    top.position.set(0, 12, 0);
    top.rotation.set(Math.PI / 2, 0, 0);
    top.scale.set(16, 16, 1);
    envScene.add(top);
    const sideLf = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ color: 0x98abd6, side: THREE.DoubleSide }),
    );
    sideLf.position.set(-10, 4, -4);
    sideLf.rotation.set(0.785, 1.056, -0.716);
    sideLf.scale.set(24, 3, 1);
    envScene.add(sideLf);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(envScene).texture;
    scene.environment = envTex;

    const hemi = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.7);
    hemi.position.set(0, 1, 0);
    scene.add(hemi);
    const dir = new THREE.DirectionalLight(0xffffff, 2.1);
    dir.position.set(14, 22, 10);
    scene.add(dir);

    // Ground
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(140, 140),
      new THREE.MeshStandardMaterial({ color: 0xdfe3ea, roughness: 1, metalness: 0 }),
    );
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const root = new THREE.Group();
    root.position.set(8, 0, 0);
    scene.add(root);

    const std = (color: number, roughness: number, metalness = 0) =>
      new THREE.MeshStandardMaterial({ color, roughness, metalness });

    const boxMesh = (
      w: number,
      h: number,
      d: number,
      material: THREE.Material,
      x: number,
      y: number,
      z: number,
    ) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
      m.position.set(x, y, z);
      return m;
    };

    // --- Road ---
    const road = new THREE.Group();
    root.add(road);
    const asphalt = new THREE.Mesh(new THREE.PlaneGeometry(12, 60), std(0x3b3f46, 0.95));
    asphalt.position.set(0, 0.02, 0);
    asphalt.rotation.x = -Math.PI / 2;
    road.add(asphalt);
    const kerbMat = std(0xc9ccd2, 0.8);
    road.add(boxMesh(0.5, 0.3, 60, kerbMat, -6.2, 0.16, 0));
    road.add(boxMesh(0.5, 0.3, 60, kerbMat, 6.2, 0.16, 0));
    const dashMat = std(0xe8c76a, 0.6);
    for (let z = -26; z <= 26; z += 4) {
      const dash = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 2), dashMat);
      dash.position.set(0, 0.04, z);
      dash.rotation.x = -Math.PI / 2;
      road.add(dash);
    }

    // --- Foundation pads ---
    const pads = new THREE.Group();
    pads.position.set(0, 0, -6);
    root.add(pads);
    const padMat = std(0xa9adb4, 0.9);
    for (const x of [-3.2, 0, 3.2]) {
      for (const z of [-3.2, 3.2]) {
        pads.add(boxMesh(2.6, 0.5, 2.6, padMat, x, 0, z));
      }
    }

    // --- Building ---
    const building = new THREE.Group();
    building.position.set(0, 0.25, -6);
    root.add(building);

    const columnMat = std(0xb7bcc4, 0.75, 0.15);
    const slabMat = std(0x8e949d, 0.9);
    const FLOORS = 6;
    const floors: { group: THREE.Group; glass: THREE.MeshStandardMaterial }[] = [];
    for (let i = 0; i < FLOORS; i++) {
      const g = new THREE.Group();
      g.position.set(0, 0.25 + i * 1.5, 0);
      g.scale.set(0.9, 0.02, 0.9);
      for (const cx of [-3.1, 3.1]) {
        for (const cz of [-3.1, 3.1]) {
          g.add(boxMesh(0.42, 1.5, 0.42, columnMat, cx, 0.75, cz));
        }
      }
      g.add(boxMesh(7.4, 0.28, 7.4, slabMat, 0, 1.5, 0));
      const glass = new THREE.MeshStandardMaterial({
        color: 0x2f3f8f,
        roughness: 0.15,
        metalness: 0.6,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
      });
      if (i < FLOORS - 1) {
        const front = new THREE.Mesh(new THREE.PlaneGeometry(5.9, 1.17), glass);
        front.position.set(0, 0.75, 3.1);
        g.add(front);
        const back = front.clone();
        back.position.set(0, 0.75, -3.1);
        g.add(back);
        const right = new THREE.Mesh(new THREE.PlaneGeometry(5.9, 1.17), glass);
        right.position.set(3.1, 0.75, 0);
        right.rotation.y = Math.PI / 2;
        g.add(right);
        const left = right.clone();
        left.position.set(-3.1, 0.75, 0);
        g.add(left);
      }
      building.add(g);
      floors.push({ group: g, glass });
    }

    // --- Tower crane ---
    const crane = new THREE.Group();
    crane.position.set(7.5, 0, -8);
    root.add(crane);
    crane.add(boxMesh(2, 0.6, 2, std(0x8e949d, 0.9), 0, 0.3, 0));
    const craneMat = std(0xe0b23c, 0.5, 0.35);
    crane.add(boxMesh(0.55, 10, 0.55, craneMat, 0, 5.5, 0));
    const jib = new THREE.Group();
    jib.position.set(0, 10.6, 0);
    crane.add(jib);
    jib.add(boxMesh(10, 0.36, 0.36, craneMat, 3.2, 0, 0));
    jib.add(boxMesh(1.4, 0.9, 0.9, std(0x39406a, 0.6), -2.4, -0.2, 0));
    const hook = new THREE.Group();
    hook.position.set(6, -1.65, 0);
    jib.add(hook);
    const cable = boxMesh(0.08, 4.4, 0.08, std(0x5b6270, 1), 0, 0, 0);
    hook.add(cable);
    hook.add(boxMesh(1.1, 0.7, 1.1, std(0x2f3f8f, 0.6, 0.2), 0, -0.6, 0));

    // --- Material stacks ---
    const stacks = new THREE.Group();
    stacks.position.set(-8, 0.4, -3);
    root.add(stacks);
    const woodMat = std(0xc98a3c, 0.8);
    const navyMat = std(0x39406a, 0.8);
    const s1 = boxMesh(1.3, 0.8, 1.3, woodMat, 0, 0, 0);
    const s2 = boxMesh(1.3, 0.8, 1.3, navyMat, 1.6, 0, 0.9);
    s2.scale.setScalar(0.946);
    const s3 = boxMesh(1.3, 0.8, 1.3, woodMat, 0.5, 0.85, 0.3);
    s3.scale.setScalar(0.687);
    const s4 = boxMesh(1.3, 0.8, 1.3, navyMat, -1.5, 0, 1.4);
    s4.scale.setScalar(0.75);
    stacks.add(s1, s2, s3, s4);

    // --- Truck ---
    const truck = new THREE.Group();
    truck.position.set(-2.6, 0.5, 0);
    root.add(truck);
    truck.add(boxMesh(1.9, 1.3, 4.2, std(0xf2f4f8, 0.5, 0.2), 0, 0.55, 0));
    truck.add(boxMesh(1.8, 1, 1.4, std(0x2f3f8f, 0.4, 0.3), 0, 0.35, 2.6));
    const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.25, 16);
    const wheelMat = std(0x26282d, 0.9);
    const wheelSpots: [number, number][] = [
      [-0.95, 2.3],
      [0.95, 2.3],
      [-0.95, -1.2],
      [0.95, -1.2],
    ];
    for (const [wx, wz] of wheelSpots) {

      const w = new THREE.Mesh(wheelGeo, wheelMat);
      w.position.set(wx, -0.1, wz);
      w.rotation.z = Math.PI / 2;
      truck.add(w);
    }

    // --- Animation ---
    const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
    const target = new THREE.Vector3();
    let smoothP = clamp01(progressRef.current);
    let t = 0;
    let raf = 0;
    let last = performance.now();

    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    const render = () => {
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t += dt;

      const p = clamp01(progressRef.current);
      smoothP += (p - smoothP) * (1 - Math.exp(-2.2 * dt));

      // Camera orbits the building, rising as the tower grows
      const theta = -0.36 + smoothP * 0.51;
      const radius = 41.8 - smoothP * 3.7;
      const camY = 11.2 + smoothP * 3.8;
      camera.position.set(8 + Math.sin(theta) * radius, camY, -6 + Math.cos(theta) * radius);
      target.set(8, 3.4 + smoothP * 3.4, -6);
      camera.lookAt(target);

      // Floors rise in sequence
      const P = clamp01(0.127 + 0.873 * Math.pow(smoothP, 0.8));
      floors.forEach((f, i) => {
        const a = clamp01(P * FLOORS - i);
        f.group.scale.set(0.9 + a * 0.1, 0.02 + a * 0.98, 0.9 + a * 0.1);
        f.glass.opacity = 0.55 * a;
      });

      // Crane sweeps, hook bobs
      jib.rotation.y = Math.sin(t * 0.22) * 0.75 + 0.28;
      const hookY = -2.25 + Math.sin(t * 0.75) * 1.15;
      hook.position.y = hookY;
      cable.scale.y = Math.max(0.05, (-hookY + 0.4) / 2.2);
      cable.position.y = (4.4 * cable.scale.y) / 2 - 0.35;

      // Truck drives along the road
      truck.position.z = ((((t * 4 + 28) % 56) + 56) % 56) - 28;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      pmrem.dispose();
      envTex.dispose();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        if (m.material) {
          const mat = m.material as THREE.Material | THREE.Material[];
          if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
          else mat.dispose();
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [progressRef]);

  return (
    <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
  );
}

export default ConstructionScene;
