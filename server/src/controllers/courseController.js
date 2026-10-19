const Course = require('../models/Course');

const createCourse = async (req, res) => {
  try {
    const { title, description, category, price } = req.body;

    const instructor = req.user?.id || req.user?._id || req.body.instructor || '650000000000000000000000';

    const newCourse = await Course.create({
      title,
      description,
      category,
      instructor,
      price,
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully!',
      course: newCourse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.status(200).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.status(200).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.status(200).json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const lpMetaFile = path.join(uploadDir, 'learning_paths_meta.json');
const asgMetaFile = path.join(uploadDir, 'assignments_meta.json');

const uploadLearningPathPdf = async (req, res) => {
  try {
    const { pathId = '01', fileName = 'document.pdf', fileData } = req.body;
    if (!fileData) {
      return res.status(400).json({ success: false, message: 'No file data provided' });
    }

    const base64Clean = fileData.replace(/^data:application\/pdf;base64,/, '').replace(/^data:.*?;base64,/, '');
    const buffer = Buffer.from(base64Clean, 'base64');
    const safePathId = String(pathId).padStart(2, '0');
    const targetFile = `learning_path_${safePathId}.pdf`;
    const targetPath = path.join(uploadDir, targetFile);
    fs.writeFileSync(targetPath, buffer);

    let meta = {};
    if (fs.existsSync(lpMetaFile)) {
      try {
        meta = JSON.parse(fs.readFileSync(lpMetaFile, 'utf8'));
      } catch {}
    }
    meta[safePathId] = {
      pathId: safePathId,
      fileName,
      url: `/uploads/${targetFile}?t=${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(lpMetaFile, JSON.stringify(meta, null, 2));

    res.status(200).json({
      success: true,
      message: 'Learning Path PDF uploaded successfully',
      url: meta[safePathId].url,
      fileName,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

const getLearningPathPdf = async (req, res) => {
  try {
    const safePathId = String(req.params.pathId || '01').padStart(2, '0');
    let meta = {};
    if (fs.existsSync(lpMetaFile)) {
      try {
        meta = JSON.parse(fs.readFileSync(lpMetaFile, 'utf8'));
      } catch {}
    }
    const targetFile = `learning_path_${safePathId}.pdf`;
    const targetPath = path.join(uploadDir, targetFile);

    if (fs.existsSync(targetPath)) {
      let pageCount = 12;
      try {
        const content = fs.readFileSync(targetPath, 'latin1');
        const matches = content.match(/\/Type\s*\/Page[^s]/g);
        if (matches && matches.length > 0) pageCount = matches.length;
      } catch {}

      return res.status(200).json({
        success: true,
        exists: true,
        url: meta[safePathId]?.url || `/uploads/${targetFile}`,
        fileName: meta[safePathId]?.fileName || targetFile,
        totalPages: pageCount,
      });
    }
    return res.status(200).json({
      success: true,
      exists: false,
      message: 'No PDF uploaded yet',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

const uploadAssignmentPdf = async (req, res) => {
  try {
    const { assignmentId = '01', fileName = 'assignment.pdf', fileData } = req.body;
    if (!fileData) {
      return res.status(400).json({ success: false, message: 'No file data provided' });
    }

    const base64Clean = fileData.replace(/^data:application\/pdf;base64,/, '').replace(/^data:.*?;base64,/, '');
    const buffer = Buffer.from(base64Clean, 'base64');
    const safeAsgId = String(assignmentId).padStart(2, '0');
    const targetFile = `assignment_${safeAsgId}.pdf`;
    const targetPath = path.join(uploadDir, targetFile);
    fs.writeFileSync(targetPath, buffer);

    let meta = {};
    if (fs.existsSync(asgMetaFile)) {
      try {
        meta = JSON.parse(fs.readFileSync(asgMetaFile, 'utf8'));
      } catch {}
    }
    meta[safeAsgId] = {
      assignmentId: safeAsgId,
      fileName,
      url: `/uploads/${targetFile}?t=${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(asgMetaFile, JSON.stringify(meta, null, 2));

    res.status(200).json({
      success: true,
      message: 'Assignment PDF uploaded successfully',
      url: meta[safeAsgId].url,
      fileName,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

const getAssignmentPdf = async (req, res) => {
  try {
    const safeAsgId = String(req.params.assignmentId || '01').padStart(2, '0');
    let meta = {};
    if (fs.existsSync(asgMetaFile)) {
      try {
        meta = JSON.parse(fs.readFileSync(asgMetaFile, 'utf8'));
      } catch {}
    }
    const targetFile = `assignment_${safeAsgId}.pdf`;
    const targetPath = path.join(uploadDir, targetFile);

    if (fs.existsSync(targetPath)) {
      return res.status(200).json({
        success: true,
        exists: true,
        url: meta[safeAsgId]?.url || `/uploads/${targetFile}`,
        fileName: meta[safeAsgId]?.fileName || targetFile,
      });
    }
    return res.status(200).json({
      success: true,
      exists: false,
      message: 'No assignment PDF uploaded yet',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  uploadLearningPathPdf,
  getLearningPathPdf,
  uploadAssignmentPdf,
  getAssignmentPdf,
};