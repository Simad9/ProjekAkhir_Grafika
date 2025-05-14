// === DOM Elements ===
const objekButtons = document.querySelectorAll(".objek");
const resetBtn = document.getElementById("reset");
const warnaInput = document.getElementById("fillColor");

// === Three.js Setup ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// === Lighting ===
scene.add(new THREE.AmbientLight(0xffffff, 0.3));
const light = new THREE.PointLight(0xffffff, 1.2);
light.position.set(30, 30, 30);
scene.add(light);

// === State ===
let activeObject = null;
let materialColor = 0xff0000;
let isDragging = false;
let previousMouse = { x: 0, y: 0 };

// === Helpers ===
function createMaterial(setengahTabung = false) {
  if (setengahTabung) {
    return new THREE.MeshPhongMaterial({
      color: materialColor,
      vertexColors: true,
    });
  } else {
    return new THREE.MeshPhongMaterial({ color: materialColor });
  }
}

// === Objects ===
// Donat (Torus)
const donat = new THREE.Mesh(
  new THREE.TorusGeometry(0.5, 0.2, 16, 100),
  createMaterial()
);

// Kerucut + Tabung
const kerucutTabung = new THREE.Group();

const meshKerucut = new THREE.Mesh(
  new THREE.ConeGeometry(0.8, 2, 16),
  createMaterial()
);
meshKerucut.position.y = 2;
kerucutTabung.add(meshKerucut);

const meshTabung = new THREE.Mesh(
  new THREE.CylinderGeometry(0.5, 0.5, 2, 16),
  createMaterial()
);
kerucutTabung.add(meshTabung);

// Setengah bola (kubah)
const halfSphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2),
  createMaterial()
);

// Permukaan dasar (lingkaran datar)
const circleBase = new THREE.Mesh(
  new THREE.CircleGeometry(1, 32),
  createMaterial(true)
);
circleBase.rotation.x = -Math.PI / 2; // putar agar menghadap ke atas
circleBase.position.y = 0; // sejajar bawah bola
circleBase.geometry.setAttribute(
  "color",
  new THREE.BufferAttribute(new Float32Array(circleBase.geometry.attributes.position.count * 3), 3)
);

// Gabungkan jadi satu Group
const setengahBola = new THREE.Group();
setengahBola.add(halfSphere);
setengahBola.add(circleBase);

// Semua objek
const objects = [donat, kerucutTabung, setengahBola];

// === Event: Pilih Objek ===
objekButtons.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    scene.clear();
    scene.add(light); // tambahkan cahaya lagi setelah clear
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    activeObject = objects[index];
    scene.add(activeObject);
  });
});

// === Event: Ubah Warna ===
warnaInput.addEventListener("input", () => {
  materialColor = parseInt(warnaInput.value.replace(/^#/, ""), 16);
  objects.forEach((obj) => {
    if (obj.type === "Group") {
      obj.children.forEach((child) =>
        child.material.color.setHex(materialColor)
      );
    } else {
      obj.material.color.setHex(materialColor);
    }
  });
});

// === Event: Reset ===
resetBtn.addEventListener("click", () => {
  objects.forEach((obj) => {
    obj.position.set(0, 0, 0);
    obj.rotation.set(0, 0, 0);
    obj.scale.set(1, 1, 1);
  });
});

// === Event: Mouse Drag Rotation ===
document.addEventListener("mousedown", (e) => {
  if (e.button === 0) isDragging = true;
});

document.addEventListener("mousemove", (e) => {
  if (isDragging && activeObject) {
    const dx = e.offsetX - previousMouse.x;
    const dy = e.offsetY - previousMouse.y;
    activeObject.rotation.y += dx * 0.01;
    activeObject.rotation.x += dy * 0.01;
  }
  previousMouse.x = e.offsetX;
  previousMouse.y = e.offsetY;
});

document.addEventListener("mouseup", () => (isDragging = false));

// === Event: Mouse Wheel Scaling ===
document.addEventListener("wheel", (e) => {
  if (activeObject) {
    const scaleFactor = 1 - e.deltaY * 0.001;
    activeObject.scale.multiplyScalar(scaleFactor);
  }
});

// === Render Loop ===
const loader = new THREE.TextureLoader();
loader.load("../images/background.jpg", function (texture) {
  scene.background = texture;
});

renderer.setAnimationLoop(() => renderer.render(scene, camera));
