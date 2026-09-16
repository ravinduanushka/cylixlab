const mongoose = require('mongoose');

// Lesson/Video Schema
const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true,
  },
  videoUrl: {
    type: String,
    required: [true, 'Video URL is required'],
  },
  duration: {
    type: String, // e.g., "10:30" or "15 mins"
  },
  isFreePreview: {
    type: Boolean,
    default: false,
  },
});

// Chapter Schema
const chapterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Chapter title is required'],
    trim: true,
  },
  lessons: [lessonSchema],
});

// Main Course Schema
const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
    },
    category: {
      type: String,
      required: [true, 'Course category is required'],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    price: {
      type: Number,
      required: [true, 'Course price is required'],
      default: 0,
    },
    thumbnail: {
      type: String, // Course Image URL
      default: 'default-course.jpg',
    },
    chapters: [chapterSchema],
    isPublished: {
      type: Boolean,
      default: false, 
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model('Course', courseSchema);