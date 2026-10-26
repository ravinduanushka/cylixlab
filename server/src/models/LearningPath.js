const mongoose = require('mongoose');

const learningPathSchema = new mongoose.Schema(
  {
    pathId: { type: String, required: true, unique: true },
    fileName: { type: String, required: true },
    url: { type: String, required: true },
    cloudinaryPublicId: { type: String },
    totalPages: { type: Number, default: 12 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LearningPath', learningPathSchema);
