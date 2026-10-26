const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
  {
    assignmentId: { type: String, required: true, unique: true },
    fileName: { type: String, required: true },
    url: { type: String, required: true },
    cloudinaryPublicId: { type: String },
    questions: { type: Array, default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Assignment', assignmentSchema);
