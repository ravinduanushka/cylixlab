const mongoose = require('mongoose');

const assignmentSubmissionSchema = new mongoose.Schema(
  {
    assignmentId: { type: String, required: true },
    studentEmail: { type: String, required: true },
    studentName: { type: String, default: 'Student' },
    marks: { type: Number, default: 0 },
    total: { type: Number, default: 30 },
    answeredCount: { type: Number, default: 0 },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AssignmentSubmission', assignmentSubmissionSchema);
