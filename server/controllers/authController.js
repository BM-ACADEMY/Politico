// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const User = require('../models/User');
// const Role = require('../models/Role');

// const register = async (req, res) => {
//   const { name, phone, email, password, roleName, ward } = req.body;
//   try {
//     let user = await User.findOne({ phone });
//     if (user) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const role = await Role.findOne({ name: roleName });
//     if (!role) {
//       return res.status(400).json({ message: 'Role not found' });
//     }

//     user = new User({
//       name,
//       phone,
//       email,
//       password: hashedPassword,
//       role: role._id,
//       ward
//     });

//     await user.save();

//     const payload = { user: { id: user.id } };
//     const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

//     res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send('Server Error');
//   }
// };

// const login = async (req, res) => {
//   const { phone, password } = req.body;
//   try {
//     const user = await User.findOne({ phone }).populate('role');
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     const payload = { user: { id: user.id } };
//     const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

//     res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
//     res.json({ message: 'Logged in successfully' });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send('Server Error');
//   }
// };

// const logout = (req, res) => {
//   res.clearCookie('token');
//   res.json({ message: 'Logged out successfully' });
// };

// const getProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select('-password').populate('role').populate('ward');
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.json(user);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send('Server Error');
//   }
// };

// module.exports = { register, login, logout, getProfile };



const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  const { name, phone, email, password, roleId, ward } = req.body;

  try {
    // Validate input
    if (!name || !phone || !password || !roleId) {
      return res
        .status(400)
        .json({ message: "Name, phone, password, and role are required" });
    }

    // Check if phone or email already exists
    const existingUser = await User.findOne({
      $or: [{ phone }, { email: email ? email.toLowerCase() : null }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "Phone or email already registered" });
    }

    // Create new user (password will be hashed by model)
    const user = new User({
      name,
      phone,
      email: email ? email.toLowerCase() : null,
      password,
      role: roleId,
      ward: ward || null,
      status: "active",
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Register - Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, phone, password,  } = req.body;
  console.log(req.body);
  try {
    // Validate input
    if ((!email && !phone) || !password ) {
      return res.status(400).json({ message: 'Email or phone, password, and access type are required' });
    }

    // Find user by email or phone
    const user = await User.findOne({
      $or: [{ email: email ? email.toLowerCase() : null }, { phone }],
    }).populate({
      path: 'role',
      select: 'role_id name',
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check role
    const userRole = user.role.role_name;
    // if (access !== userRole) {
    //   return res.status(403).json({ message: `Unauthorized: ${access} access required` });
    // }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id.toString(), role: userRole },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Set token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id.toString(),
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login - Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'role',
        select: 'role_id name',
      })
      .select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.role) {
      return res.status(500).json({ message: 'Role not found for user' });
    }

    res.status(200).json({
      user: {
        id: user._id.toString(),
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        ward: user.ward,
        status: user.status,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error('getUserInfo - Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    res.cookie('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0),
    });
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout - Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};