<?php
session_start();
include 'connect.php'; // Connect to the database

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["signUp"])) {
    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);

    // Check if fields are empty
    if (empty($username) || empty($email) || empty($password)) {
        $_SESSION['error'] = "All fields are required!";
        header("Location: index.php");
        exit();
    }

    // Check if email is valid
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $_SESSION['error'] = "Invalid email format!";
        header("Location: index.php");
        exit();
    }

    // Check if password is at least 6 characters
    if (strlen($password) < 6) {
        $_SESSION['error'] = "Password must be at least 6 characters!";
        header("Location: index.php");
        exit();
    }

    $hashed_password = password_hash($password, PASSWORD_DEFAULT); // Secure hashing

    // Check if email or username already exists
    $check_sql = "SELECT id FROM users WHERE email = ? OR username = ?";
    $check_stmt = $conn->prepare($check_sql);
    $check_stmt->bind_param("ss", $email, $username);
    $check_stmt->execute();
    $check_stmt->store_result();

    if ($check_stmt->num_rows > 0) {
        $_SESSION['error'] = "Email or username already taken!";
        header("Location: index.php");
        exit();
    }

    // Insert new user
    $sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sss", $username, $email, $hashed_password);

    if ($stmt->execute()) {
        $_SESSION['success'] = "Registration successful! You can now log in.";
    } else {
        $_SESSION['error'] = "Registration failed. Try again.";
    }

    // Close statements
    $stmt->close();
    $check_stmt->close();
    $conn->close();

    header("Location: index.php");
    exit();
}
?>
