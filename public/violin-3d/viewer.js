// Rotatable violin viewer (three.js r187, vendored). Loaded lazily by page.js.
//
// One full-size model at a fixed camera distance (no zoom), lit by a fixed studio set-up.
// Rendering is on demand: a frame is drawn only while the user drags, the controls are settling,
// a view transition is running, or something changed. Nothing renders while the stage is off screen
// or the tab is hidden.
import * as THREE from './vendor/three/three.module.js';
import { GLTFLoader } from './vendor/three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from './vendor/three/addons/loaders/DRACOLoader.js';
import { OrbitControls } from './vendor/three/addons/controls/OrbitControls.js';

const DEG = Math.PI / 180;
// Default framing: calm three-quarter view. Fixed camera distance, so the violin keeps one size on screen.
export const VIEWS = {
  reset: { az: 28, pol: 82 },
  front: { az: 0, pol: 90 },
  side: { az: 90, pol: 90 },
  back: { az: 180, pol: 90 },
};
const TARGET = new THREE.Vector3(0, 0.29, 0);
const RADIUS = 1.4;
const FOV = 28;
const TWEEN_MS = 600;

// ---------------------------------------------------------------------------------------------
// Studio: one fixed lighting set-up (any comparison renders use these same values).
// Broad soft boxes give a gentle highlight that travels across the varnish as the violin turns;
// two narrow strips behind give a subtle edge light against the deep green. The rig follows the
// camera, so every side of the instrument is presented in the same light.
// ---------------------------------------------------------------------------------------------
export const STUDIO = {
  background: 0x102922,
  exposure: 1.0,
  envIntensity: 0.62,
  key: { color: 0xfff3e4, intensity: 2.3, pos: [-0.75, 0.95, 0.55] },   // camera space
  rimR: { color: 0xf3efe6, intensity: 2.1, pos: [0.85, 0.55, -2.7] },
  rimL: { color: 0xe9eef0, intensity: 1.05, pos: [-0.95, 0.25, -2.6] },
};

function studioEnvironment(renderer) {
  const env = new THREE.Scene();
  const disposables = [];
  const mat = (hex, k) => {
    const m = new THREE.MeshBasicMaterial({ color: new THREE.Color(hex).multiplyScalar(k), side: THREE.DoubleSide });
    disposables.push(m);
    return m;
  };
  const roomGeo = new THREE.SphereGeometry(8, 32, 16);
  disposables.push(roomGeo);
  env.add(new THREE.Mesh(roomGeo, new THREE.MeshBasicMaterial({ color: new THREE.Color(0x0c201a), side: THREE.BackSide })));
  const panel = (w, h, hex, k, pos) => {
    const g = new THREE.PlaneGeometry(w, h);
    disposables.push(g);
    const m = new THREE.Mesh(g, mat(hex, k));
    m.position.set(...pos);
    m.lookAt(0, 0, 0);
    env.add(m);
  };
  // environment space = camera space before rotation: the camera looks from +Z towards the origin
  panel(3.2, 2.2, 0xfff1e2, 1.7, [-2.2, 2.0, 2.8]);   // key soft box, upper left, in front
  panel(2.6, 3.0, 0xeef1f4, 0.55, [3.0, 0.6, 2.0]);   // broad fill, right
  panel(4.0, 1.2, 0xfff6ec, 0.45, [0.0, 3.6, 0.4]);   // overhead
  panel(0.55, 3.6, 0xf4f1ea, 1.25, [3.0, 0.9, -2.4]); // edge strip, behind right
  panel(0.55, 3.6, 0xf4f1ea, 0.8, [-3.0, 0.9, -2.4]); // edge strip, behind left
  const pmrem = new THREE.PMREMGenerator(renderer);
  const tex = pmrem.fromScene(env, 0.04).texture;
  pmrem.dispose();
  disposables.forEach((d) => d.dispose());
  return tex;
}

function addLights(scene, camera, aim) {
  const make = ({ color, intensity, pos }, shadow) => {
    const l = new THREE.DirectionalLight(color, intensity);
    l.position.set(...pos);
    l.target = aim;
    camera.add(l);
    if (shadow) {
      l.castShadow = true;
      l.shadow.mapSize.set(2048, 2048);
      const c = l.shadow.camera;
      c.left = -0.38; c.right = 0.38; c.top = 0.38; c.bottom = -0.38;
      c.near = 0.2; c.far = 4.0;
      l.shadow.bias = -0.0004;
      l.shadow.normalBias = 0.0012;
      l.shadow.radius = 3;
    }
    return l;
  };
  return [make(STUDIO.key, true), make(STUDIO.rimR, false), make(STUDIO.rimL, false)];
}

// ---------------------------------------------------------------------------------------------
export async function mount(stage, opts) {
  const { modelUrl, label = 'Full-size violin', onReady, onError, reducedMotion } = opts;
  // Draco decoder files sit beside this module, wherever the page serves it from
  const dracoPath = opts.dracoPath || new URL('./vendor/draco/', import.meta.url).href;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = STUDIO.exposure;
  renderer.setClearColor(STUDIO.background, 0);       // transparent: the stage paints the green
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  const canvas = renderer.domElement;
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', `${label}, 3D model. Use the arrow keys to turn it.`);
  canvas.tabIndex = 0;
  // above the still image, below the status line and the view buttons
  stage.insertBefore(canvas, opts.before || stage.querySelector('.status'));

  const scene = new THREE.Scene();
  scene.environment = studioEnvironment(renderer);
  scene.environmentIntensity = STUDIO.envIntensity;

  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.05, 10);
  scene.add(camera);
  const aim = new THREE.Object3D();
  aim.position.copy(TARGET);
  scene.add(aim);
  addLights(scene, camera, aim);

  const controls = new OrbitControls(camera, canvas);
  controls.target.copy(TARGET);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableDamping = !reducedMotion;
  controls.dampingFactor = 0.085;
  controls.rotateSpeed = 0.75;
  controls.minPolarAngle = 30 * DEG;
  controls.maxPolarAngle = 130 * DEG;
  canvas.style.touchAction = 'pan-y';                   // vertical swipes keep scrolling the page

  const sph = new THREE.Spherical();
  const setView = (az, pol) => {
    sph.set(RADIUS, pol, az);
    camera.position.setFromSpherical(sph).add(TARGET);
    camera.lookAt(TARGET);
  };
  const _off = new THREE.Vector3();
  const _cur = new THREE.Spherical();
  // current orbit read straight from the camera (valid during transitions too)
  const orbit = () => {
    _cur.setFromVector3(_off.copy(camera.position).sub(TARGET));
    return { az: _cur.theta, pol: _cur.phi };
  };
  setView(VIEWS.reset.az * DEG, VIEWS.reset.pol * DEG);
  controls.update();

  // ----------------------------------------------------------------- render on demand
  let raf = 0, onScreen = true, pageVisible = !document.hidden, pending = false, firstFrame = true;
  let tween = null;
  const request = () => {
    if (!onScreen || !pageVisible) { pending = true; return; }
    if (!raf) raf = requestAnimationFrame(frame);
  };
  function frame(now) {
    raf = 0;
    let more = false;
    if (tween) {
      const k = Math.min(1, (now - tween.t0) / tween.ms);
      const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      setView(tween.az0 + (tween.az1 - tween.az0) * e, tween.p0 + (tween.p1 - tween.p0) * e);
      if (k >= 1) { tween = null; controls.update(); } else more = true;
    } else {
      more = controls.update();
    }
    // keep the reflections fixed to the camera too (same rig on every side)
    scene.environmentRotation.set(0, orbit().az, 0);
    renderer.render(scene, camera);
    if (firstFrame) { firstFrame = false; onReady?.(); }
    if (more) request();
  }
  controls.addEventListener('change', request);
  controls.addEventListener('start', () => {
    tween = null;
    stage.dataset.state = 'dragging';
  });
  controls.addEventListener('end', () => { stage.dataset.state = 'ready'; });

  function goTo(name) {
    const v = typeof name === 'string' ? VIEWS[name] : name;
    if (!v) return;
    const az1raw = v.az * DEG, p1 = v.pol * DEG;
    const { az: az0, pol: p0 } = orbit();
    let d = (az1raw - az0) % (2 * Math.PI);
    if (d > Math.PI) d -= 2 * Math.PI;
    if (d < -Math.PI) d += 2 * Math.PI;
    if (controls._sphericalDelta) controls._sphericalDelta.set(0, 0, 0);   // drop any leftover damping
    if (reducedMotion) {
      setView(az0 + d, p1);
      controls.update();
      request();
      return;
    }
    tween = { az0, az1: az0 + d, p0, p1, t0: performance.now(), ms: TWEEN_MS };
    request();
  }

  // keyboard: arrows turn the violin in 15° / 10° steps, Home resets
  canvas.addEventListener('keydown', (ev) => {
    const o = orbit();
    const az = o.az / DEG, pol = o.pol / DEG;
    let target = null;
    if (ev.key === 'ArrowLeft') target = { az: az - 15, pol };
    else if (ev.key === 'ArrowRight') target = { az: az + 15, pol };
    else if (ev.key === 'ArrowUp') target = { az, pol: Math.max(30, pol - 10) };
    else if (ev.key === 'ArrowDown') target = { az, pol: Math.min(130, pol + 10) };
    else if (ev.key === 'Home') { ev.preventDefault(); goTo('reset'); return; }
    if (!target) return;
    ev.preventDefault();
    goTo(target);
  });

  // ----------------------------------------------------------------- the model
  const draco = new DRACOLoader().setDecoderPath(dracoPath);
  const loader = new GLTFLoader().setDRACOLoader(draco);
  let model;
  try {
    model = (await loader.loadAsync(modelUrl)).scene;
  } catch (err) {
    controls.dispose();
    scene.environment?.dispose();
    renderer.dispose();
    canvas.remove();
    onError?.(err);
    return null;
  } finally {
    draco.dispose();                                     // one model: the decoder is not needed again
  }
  model.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
  scene.add(model);

  // ----------------------------------------------------------------- size, visibility
  const ro = new ResizeObserver(() => {
    const r = canvas.getBoundingClientRect();          // the stage minus the strip for the view buttons
    const w = Math.max(1, r.width), h = Math.max(1, r.height);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    request();
  });
  ro.observe(stage);
  const io = new IntersectionObserver(([en]) => {
    onScreen = en.isIntersecting;
    if (onScreen && pending) { pending = false; request(); }
  });
  io.observe(stage);
  const onVis = () => {
    pageVisible = !document.hidden;
    if (pageVisible && pending) { pending = false; request(); }
  };
  document.addEventListener('visibilitychange', onVis);

  request();

  return {
    goTo,
    refresh: request,
    info: () => ({ renderer: renderer.info.render, az: orbit().az / DEG, pol: orbit().pol / DEG }),
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      controls.dispose();
      model.traverse((o) => {
        if (!o.isMesh) return;
        o.geometry.dispose();
        for (const m of [].concat(o.material)) {
          for (const k in m) if (m[k] && m[k].isTexture) m[k].dispose();
          m.dispose();
        }
      });
      scene.environment?.dispose();
      renderer.dispose();
      canvas.remove();
    },
  };
}
