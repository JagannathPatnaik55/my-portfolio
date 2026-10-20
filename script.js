const CONTACT_EMAIL = ""; // Add a public email before launch.
const PROFILE_URLS = {
  github: "", // Example: https://github.com/username
  linkedin: "", // Example: https://www.linkedin.com/in/username/
};

document.documentElement.classList.replace("no-js", "js");

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const navToggle = $(".nav-toggle");
const navLinks = $(".nav-links");
const navItems = $$(".nav-link");
const themeToggle = $(".theme-toggle");
const themeToggleLabel = $(".theme-toggle__label");
const systemThemePreference = window.matchMedia("(prefers-color-scheme: dark)");
let activeSceneName = "hero";

function getSavedTheme() {
  try {
    const savedTheme = localStorage.getItem("jagannath-portfolio-theme");
    return savedTheme === "dark" || savedTheme === "light" ? savedTheme : null;
  } catch {
    return null;
  }
}

function syncThemeControl(theme) {
  const isDark = theme === "dark";
  themeToggle?.setAttribute("aria-pressed", String(isDark));
  if (themeToggleLabel) themeToggleLabel.textContent = "Dark mode";
}

function applyTheme(theme, persist = false) {
  document.documentElement.dataset.theme = theme;
  syncThemeControl(theme);
  const themeColor = $("meta[name='theme-color']");
  if (themeColor) themeColor.content = theme === "dark" ? "#111714" : "#f3f2ed";
  if (persist) {
    try { localStorage.setItem("jagannath-portfolio-theme", theme); } catch { /* Theme still works for this visit. */ }
  }
  window.dispatchEvent(new CustomEvent("portfolio:theme", { detail: theme }));
}

syncThemeControl(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
themeToggle?.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme, true);
});
systemThemePreference.addEventListener?.("change", (event) => {
  if (!getSavedTheme()) applyTheme(event.matches ? "dark" : "light");
});

function closeMobileNav(returnFocus = false) {
  if (!navToggle || !navLinks) return;
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation");
  navLinks.classList.remove("is-open");
  document.body.classList.remove("menu-open");
  if (returnFocus) navToggle.focus();
}

navToggle?.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  navLinks.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navToggle?.getAttribute("aria-expanded") === "true") {
    closeMobileNav(true);
  }
});

function activateSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;
  if (section.dataset.scene) {
    activeSceneName = section.dataset.scene;
    window.dispatchEvent(new CustomEvent("portfolio:scene", { detail: activeSceneName }));
  }
  navItems.forEach((item) => {
    const active = item.getAttribute("href") === `#${sectionId}`;
    item.classList.toggle("is-active", active);
    if (active) item.setAttribute("aria-current", "location");
    else item.removeAttribute("aria-current");
  });
}

navItems.forEach((item) => item.addEventListener("click", () => {
  const sectionId = item.getAttribute("href")?.slice(1);
  if (sectionId) activateSection(sectionId);
  closeMobileNav();
}));

$(".brand")?.addEventListener("click", () => activateSection("home"));
$(".scroll-cue")?.addEventListener("click", () => activateSection("about"));
$(".back-top")?.addEventListener("click", () => activateSection("home"));

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const current = entries
      .filter((entry) => entry.isIntersecting)
      .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];
    if (current) activateSection(current.target.id);
  }, { rootMargin: "-26% 0px -52% 0px", threshold: [0, 0.18, 0.38, 0.62] });
  $$("main section[data-scene]").forEach((section) => sectionObserver.observe(section));
}

const systemSketches = {
  commerce: {
    title: "Commerce Control Plane",
    description: "A reference flow that separates order decisions from payment and inventory work, using explicit service boundaries.",
    nodes: ["Client", "API boundary", "Order service", "Event handoff", "Payment · stock"],
  },
  stream: {
    title: "Signal Event Gateway",
    description: "A conceptual ingestion path with distinct producer, processing, and consumer responsibilities.",
    nodes: ["Producers", "Ingress", "Event stream", "Consumers", "Data sinks"],
  },
  fleet: {
    title: "FleetOps Service Suite",
    description: "A conceptual service map that keeps telemetry intake separate from operational workflows and the user interface.",
    nodes: ["Device edge", "Telemetry API", "Service layer", "Ops workflow", "Web interface"],
  },
};

const architectureDialog = $("#architecture-dialog");
const architectureFlow = $("#architecture-flow");
$$('[data-architecture]').forEach((button) => button.addEventListener("click", () => {
  const sketch = systemSketches[button.dataset.architecture];
  if (!sketch || !architectureDialog) return;
  $("#dialog-title").textContent = sketch.title;
  $("#dialog-description").textContent = sketch.description;
  architectureFlow.replaceChildren();
  sketch.nodes.forEach((node, index) => {
    const nodeElement = document.createElement("span");
    nodeElement.className = "architecture-node";
    nodeElement.textContent = node;
    architectureFlow.append(nodeElement);
    if (index < sketch.nodes.length - 1) {
      const arrow = document.createElement("span");
      arrow.className = "architecture-arrow";
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "→";
      architectureFlow.append(arrow);
    }
  });
  if (typeof architectureDialog.showModal === "function") architectureDialog.showModal();
  else architectureDialog.setAttribute("open", "");
}));

const contactLinks = $("#contact-links");
const socialProfiles = { ...PROFILE_URLS, email: CONTACT_EMAIL ? `mailto:${CONTACT_EMAIL}` : "" };
Object.entries(socialProfiles).forEach(([label, destination]) => {
  if (!destination || !contactLinks) return;
  const link = document.createElement("a");
  link.href = destination;
  link.textContent = label === "github" ? "GitHub" : label === "linkedin" ? "LinkedIn" : "Email";
  const arrow = document.createElement("span");
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = " ↗";
  link.append(arrow);
  if (!destination.startsWith("mailto:")) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }
  contactLinks.append(link);
});
if (contactLinks?.childElementCount) contactLinks.hidden = false;

$$('[data-contact-intent]').forEach((button) => button.addEventListener("click", () => {
  const messageField = $("#contact-message");
  if (messageField) messageField.value = button.dataset.contactIntent;
  activateSection("contact");
  $("#contact")?.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
  window.setTimeout(() => $("#contact-name")?.focus({ preventScroll: true }), reducedMotion.matches ? 0 : 450);
}));

const contactForm = $("#contact-form");
const formStatus = $("#form-status");
contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;

  const data = new FormData(contactForm);
  const name = String(data.get("name")).trim();
  const sender = String(data.get("email")).trim();
  const message = String(data.get("message")).trim();
  const subject = `Portfolio inquiry from ${name}`;
  const body = `${message}\n\n— ${name}\n${sender}`;
  const recipient = CONTACT_EMAIL ? encodeURIComponent(CONTACT_EMAIL) : "";
  window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  formStatus.classList.add("is-success");
  formStatus.textContent = CONTACT_EMAIL
    ? "An email draft should open. Review it and send it from your email app."
    : "Your email app may open a draft. Add Jagannath’s email address before sending; the site does not deliver or store messages.";
});

$("#current-year").textContent = String(new Date().getFullYear());

let sceneScheduled = false;
function scheduleScene() {
  if (sceneScheduled || reducedMotion.matches) return;
  sceneScheduled = true;
  const loadScene = () => import("three").then((THREE) => initializeThreeScene(THREE)).catch(() => {
    sceneScheduled = false;
    $("#scene-canvas")?.remove();
  });
  if ("requestIdleCallback" in window) window.requestIdleCallback(loadScene, { timeout: 900 });
  else window.setTimeout(loadScene, 220);
}
reducedMotion.addEventListener?.("change", () => {
  if (!reducedMotion.matches) scheduleScene();
});
scheduleScene();

function initializeThreeScene(THREE) {
  const canvas = $("#scene-canvas");
  if (!canvas) { sceneScheduled = false; return; }
  if (reducedMotion.matches) { sceneScheduled = false; return; }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
  } catch {
    canvas.remove();
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 12;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.3));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.setClearColor(0xf3f2ed, 0);

  const root = new THREE.Group();
  scene.add(root);
  const groups = {};
  const pointer = new THREE.Vector2();
  const easedPointer = new THREE.Vector2();
  const pointerWorld = new THREE.Vector3();
  const raycaster = new THREE.Raycaster();
  const pointerPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  let activeScene = "hero";
  let previousTime = 0;
  let frameTime = 0;
  let isVisible = !document.hidden;
  let loopRunning = false;

  function randomFrom(seed) {
    let value = seed >>> 0;
    return () => {
      value = (value * 1664525 + 1013904223) >>> 0;
      return value / 4294967296;
    };
  }

  function createSceneGroup(name, opacity = 0) {
    const group = new THREE.Group();
    group.userData.weight = opacity;
    group.userData.target = opacity;
    groups[name] = group;
    root.add(group);
    return group;
  }

  function addVisual(group, object) {
    group.add(object);
    const materials = Array.isArray(object.material) ? object.material : object.material ? [object.material] : [];
    materials.forEach((material) => {
      material.transparent = true;
      material.userData.fadeBase = material.opacity ?? 1;
      if (material.color) material.userData.baseThemeColor = material.color.clone();
    });
    return object;
  }

  function addConstellation() {
    const group = createSceneGroup("hero", 1);
    const random = randomFrom(1701);
    const points = [];
    const count = window.innerWidth < 720 ? 52 : 84;
    for (let index = 0; index < count; index += 1) {
      points.push(new THREE.Vector3((random() - 0.5) * 9.4, (random() - 0.5) * 5.5, (random() - 0.5) * 2.2));
    }
    const positions = new Float32Array(points.length * 3);
    points.forEach((point, index) => point.toArray(positions, index * 3));
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    addVisual(group, new THREE.Points(particleGeometry, new THREE.PointsMaterial({ color: 0x397b68, size: 0.035, opacity: 0.48, sizeAttenuation: true, depthWrite: false })));

    const links = [];
    points.forEach((point, index) => {
      const nearest = points
        .map((candidate, candidateIndex) => ({ candidate, candidateIndex, distance: point.distanceToSquared(candidate) }))
        .filter((item) => item.candidateIndex > index && item.distance < 1.1)
        .sort((first, second) => first.distance - second.distance)
        .slice(0, 2);
      nearest.forEach(({ candidate }) => links.push(point.x, point.y, point.z, candidate.x, candidate.y, candidate.z));
    });
    const linksGeometry = new THREE.BufferGeometry();
    linksGeometry.setAttribute("position", new THREE.Float32BufferAttribute(links, 3));
    addVisual(group, new THREE.LineSegments(linksGeometry, new THREE.LineBasicMaterial({ color: 0x628575, opacity: 0.21, depthWrite: false })));

    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.0, 1), new THREE.MeshBasicMaterial({ color: 0x668977, wireframe: true, opacity: 0.28, depthWrite: false }));
    core.position.set(1.25, 0, 0);
    group.userData.core = addVisual(group, core);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.42, 0.004, 4, 88), new THREE.MeshBasicMaterial({ color: 0xb5744d, opacity: 0.24, depthWrite: false }));
    ring.position.copy(core.position);
    ring.rotation.set(0.9, 0.3, -0.2);
    addVisual(group, ring);
  }

  function addProjectBlocks() {
    const group = createSceneGroup("projects");
    const random = randomFrom(71);
    const geometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(0.8, 0.8, 0.8));
    const colors = [0x356e59, 0x667d91, 0xb5744d];
    for (let index = 0; index < 18; index += 1) {
      const material = new THREE.LineBasicMaterial({ color: colors[index % colors.length], opacity: 0.45, depthWrite: false });
      const block = new THREE.LineSegments(geometry, material);
      block.position.set((random() - 0.5) * 7.6, (random() - 0.5) * 4.5, (random() - 0.5) * 1.8);
      const size = 0.38 + random() * 1.15;
      block.scale.setScalar(size);
      block.rotation.set(random() * 0.7, random() * 0.7, random() * 0.7);
      block.userData.floatPhase = random() * Math.PI * 2;
      addVisual(group, block);
    }
  }

  function addCubeMatrix() {
    const group = createSceneGroup("about");
    const matrix = new THREE.Group();
    const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(0.64, 0.64, 0.64));
    let index = 0;
    for (let x = -1; x <= 1; x += 1) {
      for (let y = -1; y <= 1; y += 1) {
        for (let z = -1; z <= 1; z += 1) {
          const cube = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: (x + y + z) % 2 ? 0x638675 : 0xb5744d, opacity: (x + y + z) % 2 ? 0.28 : 0.43, depthWrite: false }));
          cube.position.set(x * 0.88, y * 0.88, z * 0.88);
          cube.userData.order = index++;
          addVisual(matrix, cube);
        }
      }
    }
    group.add(matrix);
    group.userData.matrix = matrix;
    const halo = new THREE.Mesh(new THREE.TorusGeometry(2.05, 0.004, 4, 100), new THREE.MeshBasicMaterial({ color: 0x758f7e, opacity: 0.18, depthWrite: false }));
    halo.rotation.set(0.8, 0.2, 0.4);
    addVisual(group, halo);
  }

  function addVortex() {
    const group = createSceneGroup("contact");
    const random = randomFrom(90210);
    const count = window.innerWidth < 720 ? 420 : 760;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const phase = new Float32Array(count);
    const radius = new Float32Array(count);
    const height = new Float32Array(count);
    for (let index = 0; index < count; index += 1) {
      phase[index] = random() * Math.PI * 2;
      radius[index] = 0.25 + random() * 4.1;
      height[index] = (random() - 0.5) * 3.8;
      new THREE.Color(index % 3 === 0 ? 0xb5744d : 0x33765f).toArray(colors, index * 3);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    addVisual(group, new THREE.Points(geometry, new THREE.PointsMaterial({ size: 0.028, vertexColors: true, opacity: 0.56, depthWrite: false, sizeAttenuation: true })));
    group.userData.vortex = { geometry, positions, phase, radius, height };
  }

  addConstellation();
  addProjectBlocks();
  addCubeMatrix();
  addVortex();

  function updateSceneTheme(theme) {
    const isDark = theme === "dark";
    const darkTint = new THREE.Color(0xb5d8c1);
    scene.traverse((object) => {
      const materials = Array.isArray(object.material) ? object.material : object.material ? [object.material] : [];
      materials.forEach((material) => {
        const baseColor = material.userData.baseThemeColor;
        if (!baseColor || !material.color) return;
        material.color.copy(baseColor);
        if (isDark) material.color.lerp(darkTint, 0.42);
      });
    });
  }
  window.addEventListener("portfolio:theme", (event) => updateSceneTheme(event.detail));
  updateSceneTheme(document.documentElement.dataset.theme);

  function changeScene(name) {
    if (!groups[name]) return;
    activeScene = name;
    Object.entries(groups).forEach(([groupName, group]) => { group.userData.target = groupName === name ? 1 : 0; });
  }
  window.addEventListener("portfolio:scene", (event) => changeScene(event.detail));
  changeScene(activeSceneName);

  window.addEventListener("pointermove", (event) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }, { passive: true });
  window.addEventListener("pointerleave", () => pointer.set(0, 0), { passive: true });
  document.addEventListener("visibilitychange", () => {
    isVisible = !document.hidden;
    if (isVisible) startLoop();
    else loopRunning = false;
  });

  function resize() {
    const width = window.innerWidth;
    camera.aspect = width / window.innerHeight;
    camera.position.z = width < 600 ? 14 : 12;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, width < 720 ? 1.1 : 1.3));
    renderer.setSize(width, window.innerHeight, false);
    root.position.x = width > 900 ? 0.35 : 0;
  }
  window.addEventListener("resize", resize, { passive: true });

  function render(time) {
    if (!loopRunning || reducedMotion.matches || !isVisible) {
      loopRunning = false;
      return;
    }
    requestAnimationFrame(render);
    if (time - frameTime < 1000 / 30) return;
    frameTime = time;
    const seconds = time / 1000;
    const delta = previousTime ? Math.min((time - previousTime) / 1000, 0.06) : 1 / 30;
    previousTime = time;
    easedPointer.lerp(pointer, 0.045);
    const easing = 1 - Math.exp(-delta * 3.6);

    Object.entries(groups).forEach(([name, group]) => {
      group.userData.weight += (group.userData.target - group.userData.weight) * easing;
      const opacity = group.userData.weight;
      group.visible = opacity > 0.006;
      group.scale.setScalar(0.88 + opacity * 0.12);
      group.position.x = easedPointer.x * (name === "projects" ? 0.15 : 0.05);
      group.position.y = -easedPointer.y * 0.04;
      group.traverse((object) => {
        const materials = Array.isArray(object.material) ? object.material : object.material ? [object.material] : [];
        materials.forEach((material) => {
          if (material.userData.fadeBase !== undefined) material.opacity = material.userData.fadeBase * opacity;
        });
      });
    });

    const hero = groups.hero;
    hero.rotation.y = seconds * 0.035;
    hero.rotation.x = Math.sin(seconds * 0.17) * 0.018;
    hero.userData.core.rotation.y += 0.0018;

    groups.projects.children.forEach((block) => {
      if (block.userData.floatPhase === undefined) return;
      block.rotation.x += 0.0011;
      block.rotation.y += 0.0014;
      block.position.y += Math.sin(seconds * 0.55 + block.userData.floatPhase) * 0.00045;
    });

    const matrix = groups.about.userData.matrix;
    matrix.rotation.y = Math.sin(seconds * 0.14) * 0.08 + easedPointer.x * 0.055;
    matrix.rotation.x = Math.cos(seconds * 0.12) * 0.04 - easedPointer.y * 0.04;

    if (activeScene === "contact" || groups.contact.userData.weight > 0.04) {
      const vortex = groups.contact.userData.vortex;
      raycaster.setFromCamera(easedPointer, camera);
      raycaster.ray.intersectPlane(pointerPlane, pointerWorld);
      for (let index = 0; index < vortex.phase.length; index += 1) {
        const angle = vortex.phase[index] + seconds * 0.1;
        const x = Math.cos(angle) * vortex.radius[index];
        const y = Math.sin(angle) * vortex.radius[index] * 0.55 + vortex.height[index] * 0.15;
        const pull = activeScene === "contact" ? 0.09 : 0.02;
        const offset = index * 3;
        vortex.positions[offset] = x + (pointerWorld.x - x) * pull;
        vortex.positions[offset + 1] = y + (pointerWorld.y - y) * pull;
        vortex.positions[offset + 2] = Math.sin(angle * 2) * 0.45;
      }
      vortex.geometry.attributes.position.needsUpdate = true;
    }

    renderer.render(scene, camera);
  }

  function startLoop() {
    if (loopRunning || reducedMotion.matches || !isVisible) return;
    loopRunning = true;
    requestAnimationFrame(render);
  }

  resize();
  startLoop();
  reducedMotion.addEventListener?.("change", () => {
    if (reducedMotion.matches) loopRunning = false;
    else startLoop();
  });
  window.addEventListener("pagehide", () => {
    renderer.dispose();
    scene.traverse((object) => {
      object.geometry?.dispose?.();
      if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
      else object.material?.dispose?.();
    });
  }, { once: true });
}
