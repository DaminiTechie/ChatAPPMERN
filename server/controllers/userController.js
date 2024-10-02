const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const usernameCheck = await User.findOne({ username });
    if (usernameCheck) {
      return res.status(400).json({ msg: "Username already used", status: false });
    }

    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      return res.status(400).json({ msg: "Email already used", status: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
      isAvatarImageSet: false, // Initialize to false
      avatarImage: '', // Initialize to empty
    });

    user.password = undefined; // Hide password in the response
    return res.status(201).json({ status: true, user });
  } catch (error) {
    next(error);
  }
};


const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required', status: false });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(400).json({ message: 'User not found', status: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password comparison result:", isMatch);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials', status: false });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log("Logged in User Info:", { id: user._id, username: user.username, email: user.email });

    res.status(200).json({ 
      token, 
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email,
        isAvatarImageSet: user.isAvatarImageSet, // Include avatar image set status
        avatarImage: user.avatarImage // Include avatar image
      } 
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    next(error);
  }
};



const SetAvatar = async (req, res) => {
  const userId = req.params.id;
  const { avatar } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const user = await User.findByIdAndUpdate(userId, { avatar, isAvatarImageSet: true }, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ status: true, message: "Avatar updated successfully", user });
  } catch (error) {
    console.error("Error setting avatar:", error);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

const getAllUsers = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    console.error("User ID is undefined");
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    console.log("Current User ID in getAllUsers:", id);
    const users = await User.find({ _id: { $ne: id } });
    console.log("Users fetched:", users);
    
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};




module.exports = {
  register,
  login,
  SetAvatar,
  getAllUsers
};
