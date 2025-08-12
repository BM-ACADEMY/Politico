const Street = require('../models/Street');

const getAllStreets = async (req, res) => {
  try {
    const streets = await Street.find().populate('ward');
    res.json(streets);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getStreetById = async (req, res) => {
  try {
    const street = await Street.findById(req.params.id).populate('ward');
    if (!street) {
      return res.status(404).json({ message: 'Street not found' });
    }
    res.json(street);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createStreet = async (req, res) => {
  try {
    const newStreet = new Street(req.body);
    const savedStreet = await newStreet.save();
    res.status(201).json(savedStreet);
  } catch (error) {
    res.status(400).json({ message: 'Error creating street', error });
  }
};

const updateStreet = async (req, res) => {
  try {
    const updatedStreet = await Street.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedStreet) {
      return res.status(404).json({ message: 'Street not found' });
    }
    res.json(updatedStreet);
  } catch (error) {
    res.status(400).json({ message: 'Error updating street', error });
  }
};

const deleteStreet = async (req, res) => {
  try {
    const deletedStreet = await Street.findByIdAndDelete(req.params.id);
    if (!deletedStreet) {
      return res.status(404).json({ message: 'Street not found' });
    }
    res.json({ message: 'Street deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllStreets,
  getStreetById,
  createStreet,
  updateStreet,
  deleteStreet,
};