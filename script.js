const photoUpload = document.getElementById("photoUpload");
const photoPreview = document.getElementById("photoPreview");

// Hide preview initially
photoPreview.style.display = "none";

photoUpload.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      photoPreview.src = e.target.result;
      photoPreview.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});

const canvas = document.getElementById("signaturePad");
const ctx = canvas.getContext("2d");
let drawing = false;

// Fix canvas resolution
function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Mouse events
canvas.addEventListener("mousedown", () => drawing = true);
canvas.addEventListener("mouseup", () => {
  drawing = false;
  ctx.beginPath();
});
canvas.addEventListener("mousemove", (e) => {
  if (!drawing) return;
  drawLine(e.offsetX, e.offsetY);
});

// Touch events
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  drawing = true;
});
canvas.addEventListener("touchend", (e) => {
  e.preventDefault();
  drawing = false;
  ctx.beginPath();
});
canvas.addEventListener("touchmove", (e) => {
  if (!drawing) return;
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  drawLine(touch.clientX - rect.left, touch.clientY - rect.top);
});

// Drawing helper
function drawLine(x, y) {
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#000";
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}

// Clear signature
document.getElementById("clearSignature").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});



