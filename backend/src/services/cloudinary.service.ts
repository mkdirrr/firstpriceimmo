import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import fs from 'fs';
import path from 'path';

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

const isCloudinaryConfigured =
  CLOUDINARY_CLOUD_NAME &&
  CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
  CLOUDINARY_API_KEY &&
  CLOUDINARY_API_KEY !== 'your_api_key' &&
  CLOUDINARY_API_SECRET &&
  CLOUDINARY_API_SECRET !== 'your_api_secret';

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
}

export function uploadBufferToCloudinary(buffer: Buffer, filename: string): Promise<string | null> {
  if (!isCloudinaryConfigured) {
    console.warn('[Cloudinary] Credentials not configured — saving image locally instead.');
    try {
      const uploadsDir = path.join(__dirname, '../../uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const uniqueFilename = `${Date.now()}_${filename.replace(/\s+/g, '_')}`;
      const filePath = path.join(uploadsDir, uniqueFilename);
      fs.writeFileSync(filePath, buffer);
      
      const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 4000}`;
      return Promise.resolve(`${backendUrl}/uploads/${uniqueFilename}`);
    } catch (err) {
      console.error('[LocalStorage] Failed to save image locally:', err);
      return Promise.resolve(null);
    }
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'realestate/properties',
        public_id: `${Date.now()}_${filename.replace(/\.[^/.]+$/, '')}`,
        resource_type: 'image',
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error('Cloudinary upload failed'));
        }
        resolve(result.secure_url);
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}
