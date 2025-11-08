const express = require('express');
const Project = require('../models/Project');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all projects
router.get('/', auth, async (req, res) => {
  try {
    const { search, type, category, status } = req.query;
    let query = {};

    if (search) {
      query.$text = { $search: search };
    }

    if (type) {
      query.type = type;
    }

    if (category) {
      query.category = category;
    }

    if (status) {
      query.status = status;
    } else {
      query.status = { $ne: 'closed' };
    }

    const projects = await Project.find(query)
      .populate('creator', 'name department year')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get single project
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('creator', 'name email department year skillsHave')
      .populate('interestedUsers', 'name department year skillsHave')
      .populate('selectedUsers', 'name department year');

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Create project
router.post('/', auth, async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      creator: req.userId
    });

    await project.save();

    // Add project to user's projects
    await User.findByIdAndUpdate(req.userId, {
      $push: { projects: project._id }
    });

    const populatedProject = await Project.findById(project._id)
      .populate('creator', 'name department year');

    res.status(201).json(populatedProject);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project', details: error.message });
  }
});

// Update project
router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.creator.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to update this project' });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('creator', 'name department year');

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.creator.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this project' });
    }

    await Project.findByIdAndDelete(req.params.id);
    await User.findByIdAndUpdate(req.userId, {
      $pull: { projects: req.params.id }
    });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Express interest in project
router.post('/:id/interest', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.interestedUsers.includes(req.userId)) {
      return res.status(400).json({ error: 'Already expressed interest' });
    }

    project.interestedUsers.push(req.userId);
    await project.save();

    res.json({ message: 'Interest expressed successfully', project });
  } catch (error) {
    res.status(500).json({ error: 'Failed to express interest' });
  }
});

// Select users for project
router.post('/:id/select', auth, async (req, res) => {
  try {
    const { userIds } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.creator.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    project.selectedUsers = [...new Set([...project.selectedUsers, ...userIds])];
    await project.save();

    res.json({ message: 'Users selected successfully', project });
  } catch (error) {
    res.status(500).json({ error: 'Failed to select users' });
  }
});

module.exports = router;