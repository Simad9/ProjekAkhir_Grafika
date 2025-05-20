// == Init Awal ==
// Canvas
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 400;
// Object
const objek = document.querySelectorAll(".objek");
// Reset
const reset = document.getElementById("reset");
// Tambahan
const warna = document.getElementById("fillColor");
const rotasi = document.getElementById("rotasi");
const skala = document.getElementById("skala");
// Translate
const translateBtns = document.querySelectorAll(".translate");
const nilaiTranslate = document.getElementById("nilaiTranslate");
const nilaiSkala = document.getElementById("nilaiSkala");
const nilaiRotasi = document.getElementById("nilaiRotasi");

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
let objectAktif = "objek1";

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Objek Satu = Bulan Sabit
function drawObjekSatu() {
  const radius = 50;

  // Lingkaran besar (bentuk utama bulan)
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, false);
  ctx.fillStyle = warna.value;
  ctx.fill();

  // Lingkaran kecil untuk memotong sisi kiri → membentuk sabit
  ctx.beginPath();
  ctx.globalCompositeOperation = "destination-out"; // mode untuk menghapus bagian
  ctx.arc(centerX - 40, centerY, radius, 0, Math.PI * 2, false);
  ctx.fill();

  // Kembalikan mode normal
  ctx.globalCompositeOperation = "source-over";
}

// Objek Dua = Pentagram
function drawObjekDua() {
  ctx.fillStyle = warna.value;
  ctx.beginPath();

  const outerRadius = 50;
  const center = { x: centerX, y: centerY };
  const step = Math.PI / 5; // 36° per step (karena total 10 titik)
  const rotation = -Math.PI / 2; // Mulai dari atas

  // Loop untuk menggambar 10 titik (5 luar, 5 dalam)
  for (let i = 0; i < 10; i++) {
    const isEven = i % 2 === 0;
    const radius = isEven ? outerRadius : outerRadius * 0.4;
    const angle = i * step + rotation;

    const x = center.x + radius * Math.cos(angle);
    const y = center.y + radius * Math.sin(angle);

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.closePath();
  ctx.fill();
}

// Objek Tiga =
function drawObjekTiga() {
  // Planet (Saturnus)
  ctx.beginPath();
  ctx.arc(centerX, centerY, 40, 0, 2 * Math.PI);
  ctx.fillStyle = warna.value; // warna kuning keemasan
  ctx.fill();

  // Cincin (menggunakan ellipse miring)
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, 70, 15, Math.PI / 6, 0, 2 * Math.PI);
  ctx.strokeStyle = "#B9770E"; // warna coklat kekuningan
  ctx.lineWidth = 4;
  ctx.stroke();
}

function resetFunction() {
  ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transformations
  nilaiTranslate.value = 20;
  nilaiRotasi.value = 90;
  nilaiSkala.value = 2;
  warna.value = "#F4D03F";
  clearCanvas();
}

function drawActiveObject() {
  switch (objectAktif) {
    case "objek1":
      drawObjekSatu();
      break;
    case "objek2":
      drawObjekDua();
      break;
    case "objek3":
      drawObjekTiga();
      break;
  }
}

// Event Listener
objek.forEach((obj) => {
  obj.addEventListener("click", () => {
    clearCanvas();
    objectAktif = obj.id;
    drawActiveObject();
  });
});

translateBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    clearCanvas();
    switch (btn.id) {
      case "atas":
        ctx.translate(0, -nilaiTranslate.value);
        break;
      case "kiri":
        ctx.translate(-nilaiTranslate.value, 0);
        break;
      case "kanan":
        ctx.translate(nilaiTranslate.value, 0);
        break;
      case "bawah":
        ctx.translate(0, nilaiTranslate.value);
        break;
    }
    drawActiveObject();
  });
});

warna.addEventListener("input", () => {
  clearCanvas();
  drawActiveObject();
});

reset.addEventListener("click", () => {
  resetFunction();
});

rotasi.addEventListener("click", () => {
  clearCanvas();
  ctx.translate(centerX, centerY);
  ctx.rotate((nilaiRotasi.value * Math.PI) / 180);
  ctx.translate(-centerX, -centerY);
  drawActiveObject();
});

skala.addEventListener("click", () => {
  clearCanvas();
  ctx.translate(centerX, centerY);
  if (nilaiSkala.value <= 1 && nilaiSkala.value >= -1) {
    alert("Nilai Salah, harus dibawah -1 dan diatas 1");
  }
  ctx.scale(
    nilaiSkala.value <= 0 ? 1 / Math.abs(nilaiSkala.value) : nilaiSkala.value,
    nilaiSkala.value <= 0 ? 1 / Math.abs(nilaiSkala.value) : nilaiSkala.value
  );
  ctx.translate(-centerX, -centerY);
  drawActiveObject();
});

// Keyboard Input
document.addEventListener("keydown", (event) => {
  clearCanvas();
  switch (event.key) {
    case "ArrowUp":
    case "w":
      ctx.translate(0, -nilaiTranslate.value);
      break;
    case "ArrowLeft":
    case "a":
      ctx.translate(-nilaiTranslate.value, 0);
      break;
    case "ArrowRight":
    case "d":
      ctx.translate(nilaiTranslate.value, 0);
      break;
    case "ArrowDown":
    case "s":
      ctx.translate(0, nilaiTranslate.value);
      break;
  }
  drawActiveObject();
});

document.addEventListener("keydown", (event) => {
  clearCanvas();
  switch (event.key) {
    case "q":
      ctx.translate(centerX, centerY);
      ctx.rotate(-(nilaiRotasi.value * Math.PI) / 180);
      ctx.translate(-centerX, -centerY);
      break;
    case "e":
      ctx.translate(centerX, centerY);
      ctx.rotate((nilaiRotasi.value * Math.PI) / 180);
      ctx.translate(-centerX, -centerY);
      break;
  }
  drawActiveObject();
});

document.addEventListener("keydown", (event) => {
  clearCanvas();
  ctx.translate(centerX, centerY);
  switch (event.key) {
    case "r":
      ctx.scale(1.1, 1.1);
      break;
    case "t":
      ctx.scale(0.9, 0.9);
      break;
  }
  ctx.translate(-centerX, -centerY);
  drawActiveObject();
});

document.addEventListener("keydown", (event) => {
  if (event.key === " ") {
    resetFunction();
  }
});

// Mouse Input
document.addEventListener("wheel", (event) => {
  clearCanvas();
  ctx.translate(centerX, centerY);
  if (event.deltaY > 0) {
    ctx.scale(1.1, 1.1);
  } else {
    ctx.scale(0.9, 0.9);
  }
  ctx.translate(-centerX, -centerY);
  drawActiveObject();
});

let isDragging = false;

canvas.addEventListener("mousedown", (event) => {
  if (event.button === 0) {
    // Check for left mouse button
    isDragging = true;
  }
});

canvas.addEventListener("mousemove", (event) => {
  if (isDragging) {
    clearCanvas();
    ctx.translate(event.clientX - prevX, event.clientY - prevY);
    drawActiveObject();
    prevX = event.clientX;
    prevY = event.clientY;
  }
});

let prevX = 0;
let prevY = 0;

canvas.addEventListener("mousedown", (event) => {
  prevX = event.clientX;
  prevY = event.clientY;
});

canvas.addEventListener("mouseup", () => {
  isDragging = false;
});

drawActiveObject();

