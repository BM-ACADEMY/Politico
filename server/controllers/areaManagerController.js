const AreaManager = require('../models/AreaManager');
const User = require('../models/User');
const Role = require('../models/Role');
const Ward = require('../models/Ward');

const getAllAreaManagers = async (req, res) => {
  try {
    const areaManagers = await AreaManager.find().populate({
      path: 'user',
      populate: [{ path: 'role', select: 'name' }, { path: 'ward', select: 'ward area district state' }],
    }).populate('ward');
    res.json(areaManagers);
  } catch (error) {
    console.error('Error fetching area managers:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAreaManagerById = async (req, res) => {
  try {
    const areaManager = await AreaManager.findById(req.params.id).populate({
      path: 'user',
      populate: [{ path: 'role', select: 'name' }, { path: 'ward', select: 'ward area district state' }],
    }).populate('ward');
    if (!areaManager) {
      return res.status(404).json({ message: 'Area Manager not found' });
    }
    res.json(areaManager);
  } catch (error) {
    console.error('Error fetching area manager:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const createAreaManager = async (req, res) => {
  try {
    const { name, phone, email, password, wardId } = req.body;

    // Validate inputs
    if (!name || !phone || !email || !password || !wardId) {
      return res.status(400).json({ message: 'Name, phone, email, password, and ward are required' });
    }

    // Check ward
    const ward = await Ward.findById(wardId);
    if (!ward) {
      return res.status(400).json({ message: 'Invalid ward ID' });
    }

    // Check role
    const role = await Role.findOne({ name: 'area_manager' });
    if (!role) {
      return res.status(400).json({ message: 'Area Manager role not found' });
    }

    // Create user
    const user = new User({
      name,
      phone,
      email: email.toLowerCase(),
      password,
      role: role._id,
      ward: ward._id,
      status: 'active',
    });
    const savedUser = await user.save();

    // Create area manager
    const areaManager = new AreaManager({
      user: savedUser._id,
      ward: ward._id,
    });
    const savedAreaManager = await areaManager.save();

    // Update user with areaManager ID
    await User.findByIdAndUpdate(savedUser._id, { areaManager: savedAreaManager._id });

    // Populate response
    const populatedAreaManager = await AreaManager.findById(savedAreaManager._id)
      .populate({
        path: 'user',
        populate: [{ path: 'role', select: 'name' }, { path: 'ward', select: 'ward area district state' }],
      })
      .populate('ward');

    res.status(201).json({
      message: 'Area Manager created successfully',
      areaManager: populatedAreaManager,
    });
  } catch (error) {
    console.error('Error creating area manager:', error.message);
    res.status(400).json({ message: 'Error creating Area Manager', error: error.message });
  }
};

const updateAreaManager = async (req, res) => {
  try {
    const { name, phone, email, wardId, userId } = req.body;

    // Validate inputs
    if (!name || !phone || !email || !wardId || !userId) {
      return res.status(400).json({ message: 'Name, phone, email, ward, and user ID are required' });
    }

    // Check ward
    const ward = await Ward.findById(wardId);
    if (!ward) {
      return res.status(400).json({ message: 'Invalid ward ID' });
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, phone, email: email.toLowerCase(), ward: wardId },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update area manager
    const updatedAreaManager = await AreaManager.findByIdAndUpdate(
      req.params.id,
      { ward: wardId },
      { new: true, runValidators: true }
    );
    if (!updatedAreaManager) {
      return res.status(404).json({ message: 'Area Manager not found' });
    }

    // Populate response
    const populatedAreaManager = await AreaManager.findById(updatedAreaManager._id)
      .populate({
        path: 'user',
        populate: [{ path: 'role', select: 'name' }, { path: 'ward', select: 'ward area district state' }],
      })
      .populate('ward');

    res.json({
      message: 'Area Manager updated successfully',
      areaManager: populatedAreaManager,
    });
  } catch (error) {
    console.error('Error updating area manager:', error.message);
    res.status(400).json({ message: 'Error updating Area Manager', error: error.message });
  }
};

const deleteAreaManager = async (req, res) => {
  try {
    const areaManager = await AreaManager.findById(req.params.id);
    if (!areaManager) {
      return res.status(404).json({ message: 'Area Manager not found' });
    }

    if (areaManager.user) {
      await User.findByIdAndUpdate(areaManager.user, { areaManager: null });
      await User.findByIdAndDelete(areaManager.user);
    }

    await AreaManager.findByIdAndDelete(req.params.id);
    res.json({ message: 'Area Manager deleted successfully' });
  } catch (error) {
    console.error('Error deleting area manager:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllAreaManagers,
  getAreaManagerById,
  createAreaManager,
  updateAreaManager,
  deleteAreaManager,
};