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

(function () {
  emailjs.init("pY-azAbJIrvekKzWE"); // from EmailJS
})();

document.getElementById("registrationForm").addEventListener("submit", function (e) {
  e.preventDefault();

  emailjs.sendForm(
    "YOUR_SERVICE_ID",service_p6s4o8h,
    "YOUR_TEMPLATE_ID",template_ku26fli,
    this
  ).then(
    function () {
      alert("Registration submitted successfully. A copy has been sent to your email.");
    },
    function (error) {
      alert("Failed to send form. Please try again.");
      console.log(error);
    }
  );
});

const canvas = document.getElementById("signaturePad");
const ctx = canvas.getContext("2d");

let drawing = false;

// Fix canvas resolution
function resizeCanvas() {
  const rect = canvas.getBoundingClientRect(); 
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Drawing functions
function drawLine(x, y) { 
  ctx.lineWidth = 2; 
  ctx.lineCap = "round"; 
ctx.strokeStyle = "#000";
ctx.lineTo(x, y); 
ctx.stroke(); 
ctx.beginPath();
ctx.moveTo(x, y); }


 // Mouse events 
canvas.addEventListener("mousedown", () => drawing = true);
canvas.addEventListener("mouseup", () => { drawing = false;
ctx.beginPath(); }); 
canvas.addEventListener("mousemove",
(e) => { if (!drawing) return;
drawLine(e.offsetX, e.offsetY);
  });


// Touch events
canvas.addEventListener("touchstart",
(e) => { e.preventDefault();
drawing = true; }); canvas.addEventListener("touchend", 
(e) => { e.preventDefault();
drawing = false; ctx.beginPath(); });
canvas.addEventListener("touchmove",
(e) => { if (!drawing) return; e.preventDefault();
const rect = canvas.getBoundingClientRect(); 
const touch = e.touches[0]; 
drawLine(touch.clientX - rect.left, touch.clientY - rect.top);
  });

// Clear signature
document.getElementById("clearSignature").addEventListener("click",
() => { ctx.clearRect(0, 0, canvas.width, canvas.height);
    }); 
// Save signature on form submit
document.getElementById("registrationForm").addEventListener("submit", (e) => { 
  // Convert canvas to Base64 image string
  const signatureData = canvas.toDataURL("image/png");
  document.getElementById("signatureData").value = signatureData;
  // For demo: log to console
  console.log("Form submitted with signature:", signatureData);
  // In production, this hidden field will be sent with the form 
});
document.getElementById("registrationForm").addEventListener("submit", function () {
  const signatureData = canvas.toDataURL("image/png");
  document.getElementById("signatureInput").value = signatureData;
});





