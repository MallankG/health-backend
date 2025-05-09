const User = require('../models/User');

exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    let users;
    if (!q) {
      // Return all users if no query provided (limit to 50 for safety)
      users = await User.find().select('_id name email role').limit(50);
    } else {
      users = await User.find({
        name: { $regex: q, $options: 'i' }
      }).select('_id name email role');
    }
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};