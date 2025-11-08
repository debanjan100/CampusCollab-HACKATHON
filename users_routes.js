const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all users (with search and filter)
router.get('/', auth, async (req, res) => {
  try {
    const { search, skill, department, year } = req.query;
    let query = {};

    if (search) {
      query.$text = { $search: search };
    }

    if (skill) {
      query.skillsHave = { $in: [skill] };
    }

    if (department) {
      query.department = department;
    }

    if (year) {
      query.year = parseInt(year);
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ reputation: -1, createdAt: -1 })
      .limit(50);

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('projects');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    const allowedUpdates = ['name', 'bio', 'skillsHave', 'skillsWant', 'contact', 'department', 'year'];
    const updateKeys = Object.keys(updates);
    const isValidOperation = updateKeys.every(key => allowedUpdates.includes(key));

    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates' });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Search users by skill
router.get('/search/skills', auth, async (req, res) => {
  try {
    const { have, want } = req.query;
    let query = {};

    if (have) {
      query.skillsHave = { $in: [have] };
    }

    if (want) {
      query.skillsWant = { $in: [want] };
    }

    const users = await User.find(query)
      .select('-password')
      .limit(30);

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

// Endorse a skill
router.post('/:id/endorse', auth, async (req, res) => {
  try {
    const { skill } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already endorsed
    const alreadyEndorsed = user.endorsements.some(
      e => e.skill === skill && e.endorsedBy.toString() === req.userId
    );

    if (alreadyEndorsed) {
      return res.status(400).json({ error: 'Already endorsed this skill' });
    }

    user.endorsements.push({
      skill,
      endorsedBy: req.userId
    });

    user.reputation += 1;
    await user.save();

    res.json({ message: 'Endorsement added successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to endorse' });
  }
});

module.exports = router;