import User from '../models/User.js';
import Property from '../models/Property.js';

// @desc    Add property to favorites
// @route   POST /api/favorites/:propertyId
// @access  Private (Buyer)
export const addToFavorites = async (req, res) => {
  try {
    const { propertyId } = req.params;

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if already in favorites
    if (req.user.favorites.includes(propertyId)) {
      return res.status(400).json({ message: 'Property already in favorites' });
    }

    // Add to favorites
    req.user.favorites.push(propertyId);
    await req.user.save();

    res.json({ 
      message: 'Property added to favorites',
      favorites: req.user.favorites 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove property from favorites
// @route   DELETE /api/favorites/:propertyId
// @access  Private (Buyer)
export const removeFromFavorites = async (req, res) => {
  try {
    const { propertyId } = req.params;

    // Remove from favorites
    req.user.favorites = req.user.favorites.filter(
      id => id.toString() !== propertyId
    );
    await req.user.save();

    res.json({ 
      message: 'Property removed from favorites',
      favorites: req.user.favorites 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's favorites
// @route   GET /api/favorites
// @access  Private (Buyer)
export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'favorites',
        populate: { path: 'owner', select: 'name email' }
      });

    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check if property is in favorites
// @route   GET /api/favorites/check/:propertyId
// @access  Private (Buyer)
export const checkFavorite = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const isFavorite = req.user.favorites.includes(propertyId);
    
    res.json({ isFavorite });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
