const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  type: {
    type: String,
    enum: ['project', 'help', 'collaboration', 'tutoring'],
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skillsNeeded: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['open', 'in-progress', 'completed', 'closed'],
    default: 'open'
  },
  category: {
    type: String,
    enum: ['academic', 'technical', 'creative', 'research', 'hackathon', 'club', 'other'],
    required: true
  },
  duration: {
    type: String,
    trim: true
  },
  teamSize: {
    type: Number,
    min: 1,
    max: 20
  },
  interestedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  selectedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  tags: [{
    type: String,
    trim: true
  }],
  deadline: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for search
projectSchema.index({ title: 'text', description: 'text', skillsNeeded: 'text', tags: 'text' });

module.exports = mongoose.model('Project', projectSchema);