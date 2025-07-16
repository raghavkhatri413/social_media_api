import cloudinary from '../config/cloudinary.config.js';

export const uploadLocalImageToCloudinary = async (localFilePath) => {
    const result = await cloudinary.uploader.upload(localFilePath, {
        folder: 'automated_uploads'
    });
    return result.secure_url; 
};
