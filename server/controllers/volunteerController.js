const Volunteer = require('../models/Volunteer');
const User = require('../models/User');
const Role = require('../models/Role'); // Added import for Role model

const getAllVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find().populate('user').populate('ward').populate('assignedStreet');
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getVolunteerById = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id).populate('user').populate('ward').populate('assignedStreet');
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }
    res.json(volunteer);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createVolunteer = async (req, res) => {
  try {
    const { name, email, phone, password, wardId, streetId } = req.body;
    
    // Find the volunteer role
    const volunteerRole = await Role.findOne({ name: 'volunteer' });
    if (!volunteerRole) {
      return res.status(400).json({ message: 'Volunteer role not found' });
    }
    
    // Create User with the correct role ID
    const newUser = new User({
      role: volunteerRole._id,
      name,
      phone,
      email,
      password, // Will be hashed via pre-save hook
      ward: wardId,
    });
    const savedUser = await newUser.save();

    const newVolunteer = new Volunteer({
      user: savedUser._id,
      ward: wardId,
      assignedStreet: streetId,
    });
    const savedVolunteer = await newVolunteer.save();
    
    // Populate for response
    const populatedVolunteer = await Volunteer.findById(savedVolunteer._id)
      .populate('user')
      .populate('ward')
      .populate('assignedStreet');
    
    res.status(201).json(populatedVolunteer);
  } catch (error) {
    console.error('Error creating volunteer:', error);
    res.status(400).json({ message: 'Error creating volunteer', error: error.message });
  }
};

const updateVolunteer = async (req, res) => {
  try {
    const { name, email, phone, wardId, streetId, userId } = req.body;
    
    // Update User if provided
    if (userId) {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, email, phone, ward: wardId },
        { new: true, runValidators: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
    }

    const updatedVolunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { ward: wardId, assignedStreet: streetId },
      { new: true, runValidators: true }
    ).populate('user').populate('ward').populate('assignedStreet');
    
    if (!updatedVolunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }
    res.json(updatedVolunteer);
  } catch (error) {
    console.error('Error updating volunteer:', error);
    res.status(400).json({ message: 'Error updating volunteer', error: error.message });
  }
};

const deleteVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }
    
    // Delete associated User
    await User.findByIdAndDelete(volunteer.user);
    
    // Delete Volunteer
    await Volunteer.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Volunteer deleted successfully' });
  } catch (error) {
    console.error('Error deleting volunteer:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllVolunteers,
  getVolunteerById,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer,
};