<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $name    = strip_tags(trim($_POST["name"]));
  $email   = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
  $message = trim($_POST["message"]);

  if (empty($name) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo "Please complete the form and try again.";
    exit;
  }

  $recipient = "your@email.com";  // 🔁 Replace with your email
  $subject = "New message from $name";
  $email_content = "Name: $name\n";
  $email_content .= "Email: $email\n\n";
  $email_content .= "Message:\n$message\n";

  $headers = "From: $name <$email>";

  if (mail($recipient, $subject, $email_content, $headers)) {
    echo "Thank you! Your message has been sent.";
  } else {
    http_response_code(500);
    echo "Oops! Something went wrong.";
  }
} else {
  http_response_code(403);
  echo "There was a problem with your submission.";
}
?>
