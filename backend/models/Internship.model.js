const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['PFE', 'PFA', 'Stage d\'observation', 'Stage d\'été', 'Autre'],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: {
      type: String,
      required: true,
    },
    location: {
      city: {
        type: String,
        required: true,
      },
      address: String,
      remote: {
        type: Boolean,
        default: false,
      },
    },
    domain: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: Date,
    isCompensated: {
      type: Boolean,
      default: false,
    },
    compensation: {
      type: Number,
      default: 0,
    },
    maxApplications: Number,
    skills: [String],
    applicationDeadline: Date,
    status: {
      type: String,
      enum: ['open', 'closed', 'draft'],
      default: 'open',
    },
    applicationsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Indexation pour la recherche
internshipSchema.index({ title: 'text', description: 'text', 'location.city': 'text', domain: 'text', skills: 'text' });

const Internship = mongoose.model('Internship', internshipSchema);

module.exports = Internship;
