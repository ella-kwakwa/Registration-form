const photoUpload = document.getElementById("photoUpload");
const photoPreview = document.getElementById("photoPreview");

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
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Mouse events
canvas.addEventListener("mousedown", () => drawing = true);
canvas.addEventListener("mouseup", () => {
  drawing = false;
  ctx.beginPath();
});
canvas.addEventListener("mousemove", draw);

// Touch events (for phones)
canvas.addEventListener("touchstart", () => drawing = true);
canvas.addEventListener("touchend", () => {
  drawing = false;
  ctx.beginPath();
});
canvas.addEventListener("touchmove", drawTouch);

function draw(e) {
  if (!drawing) return;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#000";

  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
}

function drawTouch(e) {
  if (!drawing) return;
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;

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


