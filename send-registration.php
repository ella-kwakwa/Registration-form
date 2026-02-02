<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {

  // Sanitize inputs
  function clean($data) {
    return htmlspecialchars(strip_tags(trim($data)));
  }

  $surname   = clean($_POST['surname']);
  $firstname = clean($_POST['firstname']);
  $othernames = clean($_POST['othernames']);
  $sex       = clean($_POST['sex'] ?? '');
  $nationality = clean($_POST['nationality']);
  $dob       = clean($_POST['dob']);
  $phone     = clean($_POST['phone']);
  $email     = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);

  $emergency_name  = clean($_POST['emergency_name']);
  $emergency_phone = clean($_POST['emergency_phone']);

  $training = isset($_POST['training']) ? implode(", ", $_POST['training']) : "None";

  // Handle signature
  $signature = $_POST['signature'];
  $signature = str_replace('data:image/png;base64,', '', $signature);
  $signature = base64_decode($signature);

  $signatureFile = "signature_" . time() . ".png";
  file_put_contents($signatureFile, $signature);

  // Handle photo upload
  $photoPath = "";
  if (!empty($_FILES['photo']['name'])) {
    $photoPath = "photo_" . time() . "_" . $_FILES['photo']['name'];
    move_uploaded_file($_FILES['photo']['tmp_name'], $photoPath);
  }

  // Email setup
  $to = "info@hsedrivegh.com, emmanuellakwakwaaboagye@gmail.com"; // YOU receive this
  $subject = "New HSE Drive Registration";

  $message = "
NEW REGISTRATION RECEIVED

Name: $surname $firstname $othernames
Sex: $sex
Nationality: $nationality
Date of Birth: $dob
Phone: $phone
Email: $email

Emergency Contact:
Name: $emergency_name
Phone: $emergency_phone

Training Selected:
$training
";

  $headers  = "From: HSE Drive <no-reply@hsedrivegh.com>\r\n";
  $headers .= "Reply-To: $email\r\n";
  $headers .= "Cc: $email\r\n"; // Send copy to applicant

  // Attach files
  $boundary = md5(time());
  $headers .= "MIME-Version: 1.0\r\n";
  $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";

  $body  = "--$boundary\r\n";
  $body .= "Content-Type: text/plain; charset=UTF-8\r\n\r\n";
  $body .= $message . "\r\n";

  foreach ([$photoPath, $signatureFile] as $file) {
    if ($file && file_exists($file)) {
      $fileData = chunk_split(base64_encode(file_get_contents($file)));
      $body .= "--$boundary\r\n";
      $body .= "Content-Type: application/octet-stream; name=\"$file\"\r\n";
      $body .= "Content-Disposition: attachment; filename=\"$file\"\r\n";
      $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
      $body .= $fileData . "\r\n";
    }
  }

  $body .= "--$boundary--";

  if (mail($to, $subject, $body, $headers)) {
    echo "✅ Registration submitted successfully. A copy has been sent to your email.";
  } else {
    echo "❌ Failed to submit registration.";
  }
}
?>
