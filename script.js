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





