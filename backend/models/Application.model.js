const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    internship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Internship',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'interview', 'withdrawn'],
      default: 'pending',
    },
    coverLetter: {
      type: String,
      required: true,
    },
    cvUrl: String,
    feedback: String,
    interviewDate: Date,
    interviewDetails: String,
  },
  { timestamps: true }
);

// Indexation pour améliorer les performances
applicationSchema.index({ student: 1, internship: 1 }, { unique: true });
applicationSchema.index({ status: 1 });

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
