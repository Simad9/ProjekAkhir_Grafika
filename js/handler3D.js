// Ambil elemen tombol dan input
const btnObjek1 = document.getElementById("objek1");
const btnObjek2 = document.getElementById("objek2");
const btnObjek3 = document.getElementById("objek3");
const btnReset = document.getElementById("reset");

const btnRotate = document.getElementById("rotasi");
const inputRotate = document.getElementById("nilaiRotasi");

const btnScale = document.getElementById("skala");
const inputScale = document.getElementById("nilaiSkala");

const inputColor = document.getElementById("fillColor");

const btnAtas = document.getElementById("atas");
const btnBawah = document.getElementById("bawah");
const btnKiri = document.getElementById("kiri");
const btnKanan = document.getElementById("kanan");
const btnMaju = document.getElementById("maju");
const btnMundur = document.getElementById("mundur");
const inputTranslate = document.getElementById("nilaiTranslate");

// Setup scene, camera, renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 3, 6);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// OrbitControls untuk navigasi kamera
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

// Group untuk objek aktif dan transformasinya
const objectGroup = new THREE.Group();
scene.add(objectGroup);

// Variabel global objek dan material agar bisa diakses
let activeObject = null;
let activeMaterial = null;

// Fungsi buat objek donat (torus)
function createDonat(color) {
  const geometry = new THREE.TorusGeometry(1, 0.3, 16, 100);
  const material = new THREE.MeshStandardMaterial({ color });
  const torus = new THREE.Mesh(geometry, material);
  return { mesh: torus, material };
}

// Fungsi buat objek panah 3D (tabung + kerucut)
function createArrow3D(color) {
  const group = new THREE.Group();

  // Tabung sebagai batang panah
  const cylinderGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.5);
  const material = new THREE.MeshStandardMaterial({ color });
  const cylinder = new THREE.Mesh(cylinderGeo, material);
  cylinder.position.y = 0.75; // geser ke atas supaya ujung di (0,0,0)
  group.add(cylinder);

  // Kerucut sebagai ujung panah
  const coneGeo = new THREE.ConeGeometry(0.2, 0.5, 32);
  const cone = new THREE.Mesh(coneGeo, material);
  cone.position.y = 1.75; // ujung kerucut di atas tabung
  group.add(cone);

  return { mesh: group, material };
}

// Fungsi buat setengah bola
function createHalfSphere(color) {
  // SphereGeometry dengan phiLength = PI (180 derajat)
  const geometry = new THREE.SphereGeometry(
    1,
    32,
    32,
    0,
    Math.PI * 2,
    0,
    Math.PI / 2
  );
  const material = new THREE.MeshStandardMaterial({
    color,
    side: THREE.DoubleSide,
  });
  const halfSphere = new THREE.Mesh(geometry, material);
  return { mesh: halfSphere, material };
}

// Fungsi hapus objek lama dari group
function clearActiveObject() {
  if (activeObject) {
    objectGroup.remove(activeObject);
    // Dispose geometry dan material jika ada
    if (activeObject.geometry) activeObject.geometry.dispose();
    if (activeMaterial) activeMaterial.dispose();
    activeObject = null;
    activeMaterial = null;
  }
}

// Fungsi tampilkan objek baru
function showObject(type) {
  clearActiveObject();
  const color = inputColor.value;

  let objData;
  switch (type) {
    case 1:
      objData = createDonat(color);
      break;
    case 2:
      objData = createArrow3D(color);
      break;
    case 3:
      objData = createHalfSphere(color);
      break;
  }
  activeObject = objData.mesh;
  activeMaterial = objData.material;

  objectGroup.add(activeObject);

  resetTransform();
}

// Fungsi reset posisi, rotasi, dan skala objek aktif
function resetTransform() {
  if (!activeObject) return;
  objectGroup.position.set(0, 0, 0);
  objectGroup.rotation.set(0, 0, 0);
  objectGroup.scale.set(1, 1, 1);
}

// Event handler tombol objek
btnObjek1.addEventListener("click", () => showObject(1));
btnObjek2.addEventListener("click", () => showObject(2));
btnObjek3.addEventListener("click", () => showObject(3));
btnReset.addEventListener("click", () => {
  console.log("reset oke");

  resetTransform();
  if (activeMaterial && inputColor.value) {
    activeMaterial.color.set(inputColor.value);
  }
});

// Event handler rotate
btnRotate.addEventListener("click", () => {
  if (!activeObject) return;
  const deg = parseFloat(inputRotate.value);

  // Putar di sumbu Y (atas bawah)
  objectGroup.rotation.z += THREE.MathUtils.degToRad(deg);
  objectGroup.rotation.y += THREE.MathUtils.degToRad(deg);
});

// Event handler scale
btnScale.addEventListener("click", () => {
  if (!activeObject) return;
  const scaleFactor = parseFloat(inputScale.value);
  console.log(scaleFactor);

  if (scaleFactor === 0) {
    alert("Scale factor cannot be zero");
  } else if (scaleFactor <= -1) {
    const scaleValue = 0.9 * scaleFactor;
    objectGroup.scale.multiplyScalar(scaleValue < 0 ? 0.5 : scaleValue); // Scale down
    console.log("Scale down = ", scaleValue < 0 ? 0.1 : scaleValue);
  } else if (scaleFactor >= 1) {
    objectGroup.scale.multiplyScalar(1.1 * scaleFactor); // Scale up
    console.log("Scale up = ", 1.1 * scaleFactor);
  }
});

// Event handler warna (langsung update warna material)
inputColor.addEventListener("input", () => {
  if (!activeMaterial) return;
  activeMaterial.color.set(inputColor.value);
});

// Event handler translate
function translateActiveObject(dx, dy, dz = 0) {
  objectGroup.position.x += dx;
  objectGroup.position.y += dy;
  objectGroup.position.z += dz;
}

btnAtas.addEventListener("click", () => {
  const val = parseFloat(inputTranslate.value);
  translateActiveObject(0, val, 0);
});

btnBawah.addEventListener("click", () => {
  const val = parseFloat(inputTranslate.value);
  translateActiveObject(0, -val, 0);
});

btnKiri.addEventListener("click", () => {
  const val = parseFloat(inputTranslate.value);
  translateActiveObject(-val, 0, 0);
});

btnKanan.addEventListener("click", () => {
  const val = parseFloat(inputTranslate.value);
  translateActiveObject(val, 0, 0);
});

btnMaju.addEventListener("click", () => {
  const val = parseFloat(inputTranslate.value);
  translateActiveObject(0, 0, val);
});

btnMundur.addEventListener("click", () => {
  const val = parseFloat(inputTranslate.value);
  translateActiveObject(0, 0, -val);
});

// Event handler keyboard Transalte
document.addEventListener("keydown", (event) => {
  if (event.key === "a") {
    const val = parseFloat(inputTranslate.value);
    translateActiveObject(-val, 0, 0);
  } else if (event.key === "d") {
    const val = parseFloat(inputTranslate.value);
    translateActiveObject(val, 0, 0);
  } else if (event.key === "w") {
    const val = parseFloat(inputTranslate.value);
    translateActiveObject(0, 0, val);
  } else if (event.key === "s") {
    const val = parseFloat(inputTranslate.value);
    translateActiveObject(0, 0, -val);
  } else if (event.key === "q") {
    const val = parseFloat(inputTranslate.value);
    translateActiveObject(0, val, 0);
  } else if (event.key === "e") {
    const val = parseFloat(inputTranslate.value);
    translateActiveObject(0, -val, 0);
  }
});

// Event handler keyboard Scale
document.addEventListener("keydown", (event) => {
  if (event.key === "-") {
    objectGroup.scale.multiplyScalar(0.9); // Scale down
    console.log("Scale down = ", scaleValue < 0 ? 0.1 : scaleValue);
  } else if (event.key === "=") {
    objectGroup.scale.multiplyScalar(1.1); // Scale up
    console.log("Scale up = ", 1.1 * scaleFactor);
  }
});

// Event handler keyboard Rotate
document.addEventListener("keydown", (event) => {
  if (event.key === "r") {
    const deg = parseFloat(inputRotate.value);
    objectGroup.rotation.y += THREE.MathUtils.degToRad(deg);
  }
});

// Resize handler
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Render loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Tampilkan objek default donat saat halaman pertama kali load
showObject(1);
