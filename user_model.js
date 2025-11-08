const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  usn: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  department: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true,
    min: 1,
    max: 4
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  skillsHave: [{
    type: String,
    trim: true
  }],
  skillsWant: [{
    type: String,
    trim: true
  }],
  contact: {
    phone: String,
    linkedin: String,
    github: String
  },
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  endorsements: [{
    skill: String,
    endorsedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  reputation: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for search optimization
userSchema.index({ name: 'text', department: 'text', skillsHave: 'text', skillsWant: 'text' });

module.exports = mongoose.model('User', userSchema);