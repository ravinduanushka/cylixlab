const Course = require('../models/Course');
const LearningPath = require('../models/LearningPath');
const Assignment = require('../models/Assignment');
const AssignmentSubmission = require('../models/AssignmentSubmission');
const cloudinary = require('../config/cloudinary');

const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, '../../uploads');
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch {
  // Ignored in read-only environments like Vercel
}

const lpMetaFile = path.join(uploadDir, 'learning_paths_meta.json');
const asgMetaFile = path.join(uploadDir, 'assignments_meta.json');
const submissionsFile = path.join(uploadDir, 'assignment_submissions.json');

// Helper to upload a buffer to Cloudinary
const uploadBufferToCloudinary = (buffer, folder, publicId) => {
  return new Promise((resolve, reject) => {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
      return reject(new Error('Cloudinary credentials not configured'));
    }
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'raw',
        public_id: publicId,
        overwrite: true,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

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

const uploadLearningPathPdf = async (req, res) => {
  try {
    let { pathId = '01', fileName = 'document.pdf', fileData } = req.body;
    let buffer = null;

    if (req.file) {
      buffer = req.file.buffer;
      fileName = req.file.originalname || fileName;
      if (req.body.pathId) pathId = req.body.pathId;
    } else if (fileData) {
      const base64Clean = fileData.replace(/^data:application\/pdf;base64,/, '').replace(/^data:.*?;base64,/, '');
      buffer = Buffer.from(base64Clean, 'base64');
    }

    if (!buffer) {
      return res.status(400).json({ success: false, message: 'No file data provided' });
    }

    const safePathId = String(pathId).padStart(2, '0');
    const targetFile = `learning_path_${safePathId}.pdf`;
    const targetPath = path.join(uploadDir, targetFile);

    // Compute total page count
    let pageCount = 12;
    try {
      const content = buffer.toString('latin1');
      const matches = content.match(/\/Type\s*\/Page[^s]/g);
      if (matches && matches.length > 0) pageCount = matches.length;
    } catch {}

    // 1. Upload to Cloudinary
    let cloudUrl = null;
    let cloudPublicId = null;
    try {
      const cRes = await uploadBufferToCloudinary(
        buffer,
        'cylixlab/learning_paths',
        `learning_path_${safePathId}`
      );
      cloudUrl = cRes.secure_url;
      cloudPublicId = cRes.public_id;
    } catch (cErr) {
      console.warn('Cloudinary upload warning:', cErr.message);
    }

    const finalUrl = cloudUrl || `/uploads/${targetFile}?t=${Date.now()}`;

    // 2. Save metadata to MongoDB
    try {
      await LearningPath.findOneAndUpdate(
        { pathId: safePathId },
        {
          pathId: safePathId,
          fileName,
          url: finalUrl,
          cloudinaryPublicId: cloudPublicId,
          totalPages: pageCount,
        },
        { upsert: true, new: true }
      );
    } catch (dbErr) {
      console.warn('MongoDB LearningPath save warning:', dbErr.message);
    }

    // 3. Fallback: Save locally if running on a writable disk
    try {
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
        url: finalUrl,
        updatedAt: new Date().toISOString(),
      };
      fs.writeFileSync(lpMetaFile, JSON.stringify(meta, null, 2));
    } catch {
      // Ignore read-only errors on serverless
    }

    res.status(200).json({
      success: true,
      message: 'Learning Path PDF uploaded successfully',
      url: finalUrl,
      fileName,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

const getLearningPathPdf = async (req, res) => {
  try {
    const safePathId = String(req.params.pathId || '01').padStart(2, '0');

    // 1. First check MongoDB
    try {
      const doc = await LearningPath.findOne({ pathId: safePathId });
      if (doc) {
        return res.status(200).json({
          success: true,
          exists: true,
          url: doc.url,
          fileName: doc.fileName,
          totalPages: doc.totalPages || 12,
        });
      }
    } catch (dbErr) {
      console.warn('MongoDB query warning:', dbErr.message);
    }

    // 2. Fallback check local file & metadata
    let meta = {};
    if (fs.existsSync(lpMetaFile)) {
      try {
        meta = JSON.parse(fs.readFileSync(lpMetaFile, 'utf8'));
      } catch {}
    }
    const targetFile = `learning_path_${safePathId}.pdf`;
    const targetPath = path.join(uploadDir, targetFile);

    if (fs.existsSync(targetPath) || meta[safePathId]) {
      let pageCount = 12;
      try {
        if (fs.existsSync(targetPath)) {
          const content = fs.readFileSync(targetPath, 'latin1');
          const matches = content.match(/\/Type\s*\/Page[^s]/g);
          if (matches && matches.length > 0) pageCount = matches.length;
        }
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
    let { assignmentId = '01', fileName = 'assignment.pdf', fileData } = req.body;
    let buffer = null;

    if (req.file) {
      buffer = req.file.buffer;
      fileName = req.file.originalname || fileName;
      if (req.body.assignmentId) assignmentId = req.body.assignmentId;
    } else if (fileData) {
      const base64Clean = fileData.replace(/^data:application\/pdf;base64,/, '').replace(/^data:.*?;base64,/, '');
      buffer = Buffer.from(base64Clean, 'base64');
    }

    if (!buffer) {
      return res.status(400).json({ success: false, message: 'No file data provided' });
    }

    const safeAsgId = String(assignmentId).padStart(2, '0');
    const targetFile = `assignment_${safeAsgId}.pdf`;
    const targetPath = path.join(uploadDir, targetFile);

    // 1. Read text from PDF using pdf-parse
    let pdfText = '';
    try {
      const pdfParseModule = require('pdf-parse');
      if (pdfParseModule.PDFParse) {
        const parser = new pdfParseModule.PDFParse({ data: buffer });
        const parsed = await parser.getText();
        pdfText = (parsed && parsed.text) ? parsed.text.trim() : '';
      } else if (typeof pdfParseModule === 'function') {
        const parsed = await pdfParseModule(buffer);
        pdfText = (parsed && parsed.text) ? parsed.text.trim() : '';
      }
    } catch (parseErr) {
      console.warn('pdf-parse reading error:', parseErr.message);
    }

    // 2. Direct structured MCQ parsing if the PDF contains MCQs (Q1..Q30, A/B/C/D)
    const extractPreformattedMcqs = (fullText) => {
      if (!fullText) return [];
      const questions = [];
      const regex = /(?:^|\n)(?:Q|Question\s*)(\d+)[\s\.:\-_A-Za-z0-9]*\n([\s\S]*?)(?=(?:\n(?:Q|Question\s*)\d+|\n-- \d+ of \d+ --|$))/gi;
      let match;
      while ((match = regex.exec(fullText)) !== null) {
        const qNum = parseInt(match[1]);
        const body = match[2];

        const optA = body.match(/(?:^|\n)A\.\s*([\s\S]*?)(?=\nB\.\s+|$)/i);
        const optB = body.match(/(?:^|\n)B\.\s*([\s\S]*?)(?=\nC\.\s+|$)/i);
        const optC = body.match(/(?:^|\n)C\.\s*([\s\S]*?)(?=\nD\.\s+|$)/i);
        const optD = body.match(/(?:^|\n)D\.\s*([\s\S]*?)(?=\n(?:Correct\s*answer|Why\s*it\s*is|--|\n\n|$))/i);

        const correctMatch = body.match(/Correct\s*answer\s*:\s*([A-D])/i);
        const correctLetter = correctMatch ? correctMatch[1].toUpperCase() : 'A';
        const correctNum = { A: 1, B: 2, C: 3, D: 4 }[correctLetter] || 1;

        const qPrompt = body.split(/\n[A-D]\.\s+/)[0].trim().replace(/\s+/g, ' ');

        if (optA && optB && optC && optD && qPrompt) {
          questions.push({
            id: qNum,
            label: `Question ${String(qNum).padStart(2, '0')}`,
            question: qPrompt,
            options: [
              optA[1].trim().replace(/\s+/g, ' '),
              optB[1].trim().replace(/\s+/g, ' '),
              optC[1].trim().replace(/\s+/g, ' '),
              optD[1].trim().replace(/\s+/g, ' '),
            ],
            correctAnswer: correctNum,
          });
        }
      }
      return questions;
    };

    let extractedQuestions = extractPreformattedMcqs(pdfText);

    // 3. AI-powered extraction if direct parsing did not yield questions
    const groqKey = process.env.GROQ_API_KEY || process.env.GROK_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (extractedQuestions.length === 0 && pdfText && pdfText.length > 30) {
      const aiPrompt = `You are an expert educational exam and quiz question generator.
Analyze the following course material extracted from an assignment PDF:
"""
${pdfText.slice(0, 14000)}
"""

CRITICAL INSTRUCTIONS:
1. Extract or generate up to 30 multiple choice questions (MCQs) directly testing the concepts in the text.
2. Return ONLY a valid JSON array of objects. Do not include markdown code block backticks, do not include introductory or concluding words.
3. Every question object must have this exact format:
{
  "id": 1,
  "label": "Question 01",
  "question": "What is the primary role of...",
  "options": [
    "First choice statement",
    "Second choice statement",
    "Third choice statement",
    "Fourth choice statement"
  ],
  "correctAnswer": 1
}
Output STRICT JSON array only:`;

      if (groqKey && groqKey !== 'your_grok_api_key_here') {
        const candidateModels = [
          'openai/gpt-oss-120b',
          'openai/gpt-oss-20b',
          'qwen/qwen3.8-27b',
          'llama-3.3-70b-versatile',
        ];

        for (const model of candidateModels) {
          try {
            const aiRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${groqKey}`,
              },
              body: JSON.stringify({
                model,
                messages: [{ role: 'user', content: aiPrompt }],
                temperature: 0.2,
              }),
            });

            if (aiRes.ok) {
              const aiData = await aiRes.json();
              const rawContent = aiData.choices?.[0]?.message?.content?.trim() || '';
              const match = rawContent.match(/\[\s*\{[\s\S]*\}\s*\]/);
              const jsonStr = match ? match[0] : rawContent.replace(/```json/gi, '').replace(/```/g, '').trim();
              const parsed = JSON.parse(jsonStr);
              if (Array.isArray(parsed) && parsed.length > 0) {
                extractedQuestions = parsed.map((item, idx) => ({
                  id: item.id || idx + 1,
                  label: item.label || `Question ${String(idx + 1).padStart(2, '0')}`,
                  question: item.question || `Question ${idx + 1}`,
                  options: Array.isArray(item.options) && item.options.length >= 4
                    ? item.options.slice(0, 4)
                    : ['Option A', 'Option B', 'Option C', 'Option D'],
                  correctAnswer: Number(item.correctAnswer) || 1,
                }));
                break;
              }
            }
          } catch (groqErr) {
            console.warn(`Groq (${model}) MCQ extraction attempt failed:`, groqErr.message);
          }
        }
      }

      if ((!extractedQuestions || extractedQuestions.length === 0) && geminiKey) {
        try {
          const { GoogleGenerativeAI } = require('@google/generative-ai');
          const genAI = new GoogleGenerativeAI(geminiKey);
          const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
          const result = await model.generateContent(aiPrompt);
          const raw = result.response.text();
          const match = raw.match(/\[\s*\{[\s\S]*\}\s*\]/);
          const jsonStr = match ? match[0] : raw.replace(/```json/gi, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(jsonStr);
          if (Array.isArray(parsed) && parsed.length > 0) {
            extractedQuestions = parsed.map((item, idx) => ({
              id: item.id || idx + 1,
              label: item.label || `Question ${String(idx + 1).padStart(2, '0')}`,
              question: item.question || `Question ${idx + 1}`,
              options: Array.isArray(item.options) && item.options.length >= 4
                ? item.options.slice(0, 4)
                : ['Option A', 'Option B', 'Option C', 'Option D'],
              correctAnswer: Number(item.correctAnswer) || 1,
            }));
          }
        } catch (geminiErr) {
          console.warn('Gemini MCQ extraction failed:', geminiErr.message);
        }
      }
    }

    // 4. Default fallback MCQs
    if (!Array.isArray(extractedQuestions) || extractedQuestions.length === 0) {
      extractedQuestions = Array.from({ length: 30 }, (_, i) => {
        const numStr = String(i + 1).padStart(2, '0');
        return {
          id: i + 1,
          question: `Question ${numStr}: Select the most appropriate option based on the study assignment.`,
          options: [
            'Statement or solution option A',
            'Statement or solution option B',
            'Statement or solution option C',
            'Statement or solution option D',
          ],
          correctAnswer: (i % 4) + 1,
        };
      });
    }

    // 5. Upload PDF to Cloudinary
    let cloudUrl = null;
    let cloudPublicId = null;
    try {
      const cRes = await uploadBufferToCloudinary(
        buffer,
        'cylixlab/assignments',
        `assignment_${safeAsgId}`
      );
      cloudUrl = cRes.secure_url;
      cloudPublicId = cRes.public_id;
    } catch (cErr) {
      console.warn('Cloudinary upload warning:', cErr.message);
    }

    const finalUrl = cloudUrl || `/uploads/${targetFile}?t=${Date.now()}`;

    // 6. Save metadata to MongoDB
    try {
      await Assignment.findOneAndUpdate(
        { assignmentId: safeAsgId },
        {
          assignmentId: safeAsgId,
          fileName,
          url: finalUrl,
          cloudinaryPublicId: cloudPublicId,
          questions: extractedQuestions,
        },
        { upsert: true, new: true }
      );
    } catch (dbErr) {
      console.warn('MongoDB Assignment save warning:', dbErr.message);
    }

    // 7. Save locally if writable
    try {
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
        url: finalUrl,
        questions: extractedQuestions,
        updatedAt: new Date().toISOString(),
      };
      fs.writeFileSync(asgMetaFile, JSON.stringify(meta, null, 2));
    } catch {
      // Ignore read-only errors on serverless
    }

    res.status(200).json({
      success: true,
      message: 'Assignment PDF uploaded and MCQs parsed successfully!',
      url: finalUrl,
      fileName,
      questionsCount: extractedQuestions.length,
      questions: extractedQuestions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

const getAssignmentPdf = async (req, res) => {
  try {
    const safeAsgId = String(req.params.assignmentId || '01').padStart(2, '0');

    // 1. First check MongoDB
    try {
      const doc = await Assignment.findOne({ assignmentId: safeAsgId });
      if (doc) {
        return res.status(200).json({
          success: true,
          exists: true,
          url: doc.url,
          fileName: doc.fileName,
          questions: doc.questions || [],
        });
      }
    } catch (dbErr) {
      console.warn('MongoDB Assignment query warning:', dbErr.message);
    }

    // 2. Fallback check local file & metadata
    let meta = {};
    if (fs.existsSync(asgMetaFile)) {
      try {
        meta = JSON.parse(fs.readFileSync(asgMetaFile, 'utf8'));
      } catch {}
    }
    const targetFile = `assignment_${safeAsgId}.pdf`;
    const targetPath = path.join(uploadDir, targetFile);

    if (fs.existsSync(targetPath) || meta[safeAsgId]) {
      const questions = meta[safeAsgId]?.questions || [];
      return res.status(200).json({
        success: true,
        exists: true,
        url: meta[safeAsgId]?.url || `/uploads/${targetFile}`,
        fileName: meta[safeAsgId]?.fileName || targetFile,
        questions,
      });
    }

    return res.status(200).json({
      success: true,
      exists: false,
      message: 'No assignment PDF uploaded yet',
      questions: [],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

const submitAssignmentProgress = async (req, res) => {
  try {
    const { assignmentId = '01', studentEmail, studentName, marks, total = 30, answeredCount } = req.body;
    const safeAsgId = String(assignmentId).padStart(2, '0');
    const email = (studentEmail && studentEmail.trim()) || 'student@cylixlab.com';

    const newRecord = {
      id: Date.now(),
      assignmentId: safeAsgId,
      studentEmail: email,
      studentName: studentName || 'Student',
      marks: Number(marks) || 0,
      total: Number(total) || 30,
      answeredCount: Number(answeredCount) || 0,
      submittedAt: new Date(),
    };

    // 1. Save / Update in MongoDB (works flawlessly in serverless without filesystem errors)
    try {
      await AssignmentSubmission.findOneAndUpdate(
        {
          assignmentId: safeAsgId,
          studentEmail: new RegExp(`^${email.trim()}$`, 'i'),
        },
        newRecord,
        { upsert: true, new: true }
      );
    } catch (dbErr) {
      console.warn('MongoDB submission save warning:', dbErr.message);
    }

    // 2. Fallback: Save to local JSON file if running in writable environment
    try {
      let submissions = [];
      if (fs.existsSync(submissionsFile)) {
        try {
          submissions = JSON.parse(fs.readFileSync(submissionsFile, 'utf8'));
        } catch {}
      }

      const existingIndex = submissions.findIndex((s) => {
        const matchAsg = (s.assignmentId === safeAsgId || s.assignmentId === String(parseInt(safeAsgId, 10)));
        const matchEmail = s.studentEmail && email && (s.studentEmail.trim().toLowerCase() === email.trim().toLowerCase());
        const matchName = s.studentName && studentName && (s.studentName.trim().toLowerCase() === studentName.trim().toLowerCase());
        return matchAsg && (matchEmail || matchName);
      });

      if (existingIndex >= 0) {
        submissions[existingIndex] = { ...newRecord, submittedAt: new Date().toISOString() };
      } else {
        submissions.push({ ...newRecord, submittedAt: new Date().toISOString() });
      }

      fs.writeFileSync(submissionsFile, JSON.stringify(submissions, null, 2));
    } catch {
      // Ignored on read-only environments
    }

    return res.status(200).json({ success: true, message: 'Submission saved', record: newRecord });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

const getAdminAssignmentStats = async (req, res) => {
  try {
    let submissions = [];

    // 1. Try reading from MongoDB
    try {
      const dbSubmissions = await AssignmentSubmission.find().lean();
      if (dbSubmissions && dbSubmissions.length > 0) {
        submissions = dbSubmissions;
      }
    } catch (dbErr) {
      console.warn('MongoDB AssignmentSubmission query warning:', dbErr.message);
    }

    // 2. Fallback to JSON file if MongoDB was empty or unavailable
    if (submissions.length === 0 && fs.existsSync(submissionsFile)) {
      try {
        submissions = JSON.parse(fs.readFileSync(submissionsFile, 'utf8'));
      } catch {}
    }

    const stats = ['01', '02', '03', '04', '05'].map((asgId, index) => {
      const filtered = submissions.filter(
        (s) => s.assignmentId === asgId || s.assignmentId === String(index + 1)
      );
      const completedStudents = filtered.length;
      const totalMarks = filtered.reduce((acc, curr) => acc + (Number(curr.marks) || 0), 0);
      const avgMarks = completedStudents > 0 ? Math.round(totalMarks / completedStudents) : 0;

      return {
        id: index + 1,
        assignmentId: asgId,
        name: `Assignment ${index + 1}`,
        short: `Asg ${index + 1}`,
        avgMarks,
        completedStudents,
      };
    });

    return res.status(200).json({ success: true, stats });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

const getStudentSubmissions = async (req, res) => {
  try {
    const { studentName, studentEmail } = req.query;
    let submissions = [];

    // 1. Try reading from MongoDB
    try {
      let query = {};
      if (studentEmail && studentEmail.trim()) {
        query.studentEmail = new RegExp(`^${studentEmail.trim()}$`, 'i');
      } else if (studentName && studentName.trim() && studentName.trim().toLowerCase() !== 'student') {
        query.studentName = new RegExp(`^${studentName.trim()}$`, 'i');
      }

      if (Object.keys(query).length > 0) {
        submissions = await AssignmentSubmission.find(query).lean();
      }
    } catch (dbErr) {
      console.warn('MongoDB student submissions query warning:', dbErr.message);
    }

    // 2. Fallback to JSON file
    if (submissions.length === 0 && fs.existsSync(submissionsFile)) {
      try {
        const fileSubmissions = JSON.parse(fs.readFileSync(submissionsFile, 'utf8'));
        if (studentEmail && studentEmail.trim()) {
          const emailLower = studentEmail.trim().toLowerCase();
          submissions = fileSubmissions.filter(
            (s) => s.studentEmail && s.studentEmail.toLowerCase() === emailLower
          );
        } else if (studentName && studentName.trim() && studentName.trim().toLowerCase() !== 'student') {
          const nameLower = studentName.trim().toLowerCase();
          submissions = fileSubmissions.filter(
            (s) => s.studentName && s.studentName.trim().toLowerCase() === nameLower
          );
        }
      } catch {}
    }

    // Retrieve uploaded assignment IDs from MongoDB and local fallback
    let uploadedAssignmentIds = [];
    try {
      uploadedAssignmentIds = await Assignment.find().distinct('assignmentId');
    } catch {}

    if (!uploadedAssignmentIds || uploadedAssignmentIds.length === 0) {
      if (fs.existsSync(asgMetaFile)) {
        try {
          const meta = JSON.parse(fs.readFileSync(asgMetaFile, 'utf8'));
          uploadedAssignmentIds = Object.keys(meta);
        } catch {}
      }
    }

    return res.status(200).json({
      success: true,
      submissions,
      uploadedAssignmentIds,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
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
  submitAssignmentProgress,
  getAdminAssignmentStats,
  getStudentSubmissions,
};
