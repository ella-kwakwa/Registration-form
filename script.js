// Photo upload handling
const photoUpload = document.getElementById("photoUpload");
const photoPreview = document.getElementById("photoPreview");

photoUpload.addEventListener("change", function () {
  const file = this.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      photoPreview.src = e.target.result;
      photoPreview.style.display = "block";
      photoPreview.setAttribute("aria-label", "Uploaded photo preview: " + file.name);
    };

    reader.readAsDataURL(file);
  }
});

// EmailJS initialization (uncomment and configure when ready)
// (function () {
//   emailjs.init("pY-azAbJIrvekKzWE");
// })();

// Signature pad functionality
const canvas = document.getElementById("signaturePad");
const ctx = canvas.getContext("2d");
const signatureStatus = document.getElementById("signature-status");

let drawing = false;
let hasSignature = false;

// Fix canvas resolution for high DPI displays
function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  
  // Store existing signature data before resize
  const imageData = hasSignature ? canvas.toDataURL() : null;
  
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  
  ctx.scale(dpr, dpr);
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#000";
  
  // Restore signature if it existed
  if (imageData && hasSignature) {
    const img = new Image();
    img.onload = function() {
      ctx.drawImage(img, 0, 0, rect.width, rect.height);
    };
    img.src = imageData;
  }
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Get canvas coordinates from event
function getCanvasCoordinates(e) {
  const rect = canvas.getBoundingClientRect();
  
  if (e.touches) {
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top
    };
  }
  
  return {
    x: e.offsetX,
    y: e.offsetY
  };
}

// Drawing function
function drawLine(x, y) {
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
  hasSignature = true;
}

// Start drawing
function startDrawing(e) {
  drawing = true;
  const coords = getCanvasCoordinates(e);
  ctx.beginPath();
  ctx.moveTo(coords.x, coords.y);
}

// Stop drawing
function stopDrawing() {
  if (drawing) {
    drawing = false;
    ctx.beginPath();
    if (hasSignature) {
      signatureStatus.textContent = "Signature captured";
    }
  }
}

// Draw while moving
function draw(e) {
  if (!drawing) return;
  e.preventDefault();
  const coords = getCanvasCoordinates(e);
  drawLine(coords.x, coords.y);
}

// Mouse events
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);
canvas.addEventListener("mousemove", draw);

// Touch events
canvas.addEventListener("touchstart", function(e) {
  e.preventDefault();
  startDrawing(e);
}, { passive: false });

canvas.addEventListener("touchend", function(e) {
  e.preventDefault();
  stopDrawing();
}, { passive: false });

canvas.addEventListener("touchmove", function(e) {
  e.preventDefault();
  draw(e);
}, { passive: false });

// Keyboard accessibility for signature pad
canvas.addEventListener("keydown", function(e) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    alert("Please use a mouse, touch screen, or stylus to draw your signature in the canvas area.");
  }
});

// Clear signature
document.getElementById("clearSignature").addEventListener("click", function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  hasSignature = false;
  signatureStatus.textContent = "Signature cleared";
  document.getElementById("signatureData").value = "";
});

// Form submission handler
document.getElementById("registrationForm").addEventListener("submit", function(e) {
  // Convert canvas to Base64 image string
  const signatureDataValue = canvas.toDataURL("image/png");
  document.getElementById("signatureData").value = signatureDataValue;
  
  // Optional: Validate signature exists
  if (!hasSignature) {
    const confirmSubmit = confirm("You haven't added a signature. Do you want to continue without a signature?");
    if (!confirmSubmit) {
      e.preventDefault();
      return;
    }
  }
  
  // Uncomment below for EmailJS integration
  // e.preventDefault();
  // emailjs.sendForm(
  //   "service_p6s4o8h",
  //   "template_ku26fli",
  //   this
  // ).then(
  //   function () {
  //     alert("Registration submitted successfully. A copy has been sent to your email.");
  //   },
  //   function (error) {
  //     alert("Failed to send form. Please try again.");
  //     console.error("EmailJS Error:", error);
  //   }
  // );
});





