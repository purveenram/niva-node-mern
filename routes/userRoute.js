const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const router = express.Router();

// User registration route
router.post("/register", async (req, res) => {
  const { userName, userEmail, userPassword } = req.body;

  if (!userName || !userEmail || !userPassword) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ userEmail });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userPassword, salt);

    // Create new user
    const newUser = new User({
      userName,
      userEmail,
      userPassword: hashedPassword,
    });

    // Save user to the database
    const savedUser = await newUser.save();
    res.status(201).json({ message: "User registered successfully", user: savedUser });
  } catch (error) {
    console.error("Error during user registration:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Route to get all users
router.get("/getAllUsers", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Update user by ID
router.put("/updateUser/:id", async (req, res) => {
  const { userName, userEmail, userPassword } = req.body;
  const { id } = req.params;

  try {
    // Find user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields if provided
    if (userName) user.userName = userName;
    if (userEmail) user.userEmail = userEmail;

    // If a new password is provided, hash it
    if (userPassword) {
      const salt = await bcrypt.genSalt(10);
      user.userPassword = await bcrypt.hash(userPassword, salt);
    }

    // Save updated user
    const updatedUser = await user.save();
    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete user by ID
router.delete("/deleteUser/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Find and delete user by ID
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
