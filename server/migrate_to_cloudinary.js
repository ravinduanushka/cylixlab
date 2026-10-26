const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, 'server/.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function migrate() {
  const uploadDir = path.join(__dirname, 'server/uploads');
  const files = [
    { file: 'learning_path_01.pdf', folder: 'cylixlab/learning_paths', publicId: 'learning_path_01', type: 'lp', id: '01' },
    { file: 'learning_path_02.pdf', folder: 'cylixlab/learning_paths', publicId: 'learning_path_02', type: 'lp', id: '02' },
    { file: 'assignment_01.pdf', folder: 'cylixlab/assignments', publicId: 'assignment_01', type: 'asg', id: '01' },
    { file: 'assignment_02.pdf', folder: 'cylixlab/assignments', publicId: 'assignment_02', type: 'asg', id: '02' },
  ];

  const lpMetaPath = path.join(uploadDir, 'learning_paths_meta.json');
  const asgMetaPath = path.join(uploadDir, 'assignments_meta.json');

  let lpMeta = fs.existsSync(lpMetaPath) ? JSON.parse(fs.readFileSync(lpMetaPath, 'utf8')) : {};
  let asgMeta = fs.existsSync(asgMetaPath) ? JSON.parse(fs.readFileSync(asgMetaPath, 'utf8')) : {};

  for (const item of files) {
    const fullPath = path.join(uploadDir, item.file);
    if (!fs.existsSync(fullPath)) {
      console.log('File not found, skipping:', item.file);
      continue;
    }
    console.log(`Uploading ${item.file} to Cloudinary...`);
    try {
      const res = await cloudinary.uploader.upload(fullPath, {
        folder: item.folder,
        resource_type: 'raw',
        public_id: item.publicId,
        overwrite: true,
      });
      console.log(`Uploaded ${item.file} -> ${res.secure_url}`);

      if (item.type === 'lp') {
        if (!lpMeta[item.id]) lpMeta[item.id] = { pathId: item.id, fileName: item.file };
        lpMeta[item.id].url = res.secure_url;
      } else if (item.type === 'asg') {
        if (!asgMeta[item.id]) asgMeta[item.id] = { assignmentId: item.id, fileName: item.file };
        asgMeta[item.id].url = res.secure_url;
      }
    } catch (e) {
      console.error(`Failed to upload ${item.file}:`, e.message);
    }
  }

  fs.writeFileSync(lpMetaPath, JSON.stringify(lpMeta, null, 2));
  fs.writeFileSync(asgMetaPath, JSON.stringify(asgMeta, null, 2));
  console.log('Migration complete. Meta files updated with Cloudinary URLs!');
}

migrate();
