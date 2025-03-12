<?php
session_start();
include 'connect.php';

// Get user data
if (isset($_GET['id'])) {
    $id = intval($_GET['id']);
    $result = $conn->query("SELECT * FROM users WHERE id = $id");
    $user = $result->fetch_assoc();
}

// Update user data
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    $id = intval($_POST['id']);

    $conn->query("UPDATE users SET username='$username', email='$email' WHERE id=$id");
    $_SESSION['success'] = "User updated successfully!";
    header("Location: manageUsers.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <title>Edit User</title>
    <link rel="stylesheet" href="updateUser.css">
</head>
<body>
    <h2>Edit User</h2>
    <form method="POST">
        <input type="hidden" name="id" value="<?= $user['id']; ?>">
        <label>Username: <input type="text" name="username" value="<?= $user['username']; ?>" required></label><br>
        <label>Email: <input type="email" name="email" value="<?= $user['email']; ?>" required></label><br>
        <button type="submit">Update User</button>
    </form>
    <a href="manageUsers.php">Back to Manage Users</a>
</body>
</html>
