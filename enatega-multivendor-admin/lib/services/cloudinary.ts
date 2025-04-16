import { IUploadImageToCloudinary } from '../utils/interfaces/services.interface';

export const uploadImageToCloudinary: IUploadImageToCloudinary = async (
  file,
  url,
  preset
) => {
  if (!file) return;

  const data = {
    file: file,
    upload_preset: preset,
    name: 'image_upload',
    unsigned: true,
  };

  try {
    const result = await fetch(url, {
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
    });
    const imageData = await result.json();
    const originalUrl = imageData.secure_url;
    const transformedUrl = originalUrl.replace(
      '/upload/',
      '/upload/q_70/f_auto/c_scale/'
    );
    console.log('transformedUrl', transformedUrl);

    return transformedUrl;
  } catch (e) {
    throw new Error('Error uploading image to Cloudinary');
  }
};
