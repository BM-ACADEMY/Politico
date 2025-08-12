const Volunteer = require('../models/Volunteer');

const getAllVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find().populate('user').populate('assignedStreet');
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getVolunteerById = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id).populate('user').populate('assignedStreet');
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
    const newVolunteer = new Volunteer(req.body);
    const savedVolunteer = await newVolunteer.save();
    res.status(201).json(savedVolunteer);
  } catch (error) {
    res.status(400).json({ message: 'Error creating Volunteer', error });
  }
};

const updateVolunteer = async (req, res) => {
  try {
    const updatedVolunteer = await Volunteer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedVolunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }
    res.json(updatedVolunteer);
  } catch (error) {
    res.status(400).json({ message: 'Error updating Volunteer', error });
  }
};

const deleteVolunteer = async (req, res) => {
  try {
    const deletedVolunteer = await Volunteer.findByIdAndDelete(req.params.id);
    if (!deletedVolunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }
    res.json({ message: 'Volunteer deleted successfully' });
  } catch (error) {
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