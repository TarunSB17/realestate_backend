import User from '../models/User.js';
import Property from '../models/Property.js';
import Inquiry from '../models/Inquiry.js';

// @desc    Get dashboard analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin)
export const getAnalytics = async (req, res) => {
  try {
    // Total counts
    const totalProperties = await Property.countDocuments({ owner: req.user._id });
    const totalBuyers = await User.countDocuments({ role: 'buyer' });
    const totalInquiries = await Inquiry.countDocuments({
      property: { $in: await Property.find({ owner: req.user._id }).select('_id') }
    });

    // Properties by status
    const availableProperties = await Property.countDocuments({ 
      owner: req.user._id, 
      status: 'available' 
    });
    const pendingProperties = await Property.countDocuments({ 
      owner: req.user._id, 
      status: 'pending' 
    });
    const soldProperties = await Property.countDocuments({ 
      owner: req.user._id, 
      status: 'sold' 
    });

    // Recent inquiries
    const recentInquiries = await Inquiry.find({
      property: { $in: await Property.find({ owner: req.user._id }).select('_id') }
    })
      .populate('property', 'title price')
      .sort({ createdAt: -1 })
      .limit(5);

    // Most viewed properties
    const topProperties = await Property.find({ owner: req.user._id })
      .sort({ views: -1 })
      .limit(5)
      .select('title views price images');

    // Properties by type
    const propertiesByType = await Property.aggregate([
      { $match: { owner: req.user._id } },
      { $group: { _id: '$propertyType', count: { $sum: 1 } } }
    ]);

    // Monthly statistics (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyStats = await Property.aggregate([
      {
        $match: {
          owner: req.user._id,
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      overview: {
        totalProperties,
        totalBuyers,
        totalInquiries,
        availableProperties,
        pendingProperties,
        soldProperties
      },
      recentInquiries,
      topProperties,
      propertiesByType,
      monthlyStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all buyers
// @route   GET /api/admin/buyers
// @access  Private (Admin)
export const getAllBuyers = async (req, res) => {
  try {
    const buyers = await User.find({ role: 'buyer' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(buyers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle user active status
// @route   PUT /api/admin/buyers/:id/toggle-status
// @access  Private (Admin)
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot modify admin accounts' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: `User ${user.isActive ? 'activated' : 'suspended'}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/buyers/:id
// @access  Private (Admin)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin accounts' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get inquiries for admin's properties
// @route   GET /api/admin/inquiries
// @access  Private (Admin)
export const getAdminInquiries = async (req, res) => {
  try {
    const adminProperties = await Property.find({ owner: req.user._id }).select('_id');
    const propertyIds = adminProperties.map(p => p._id);

    const inquiries = await Inquiry.find({ property: { $in: propertyIds } })
      .populate('property', 'title price images')
      .sort({ createdAt: -1 });

    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update property status
// @route   PUT /api/admin/properties/:id/status
// @access  Private (Admin)
export const updatePropertyStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if user is the owner
    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    property.status = status;
    await property.save();

    res.json({ message: 'Property status updated', property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
