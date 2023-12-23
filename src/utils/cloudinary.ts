import { v2 as cloudinary, DeleteApiResponse } from "cloudinary";
import dotenv from "dotenv";
import util from "util";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const cloudinaryUpload = util.promisify(cloudinary.uploader.upload);

export const cloudinaryUploadImg = async (fileToUploads: string) => {
  try {
    const result: any = await cloudinaryUpload(fileToUploads);
    return {
      uploadResult: {
        url: result.secure_url,
      },
      options: {
        resource_type: "auto",
      },
    };
  } catch (error:any) {
    console.error("Error uploading to Cloudinary:", error.message);
    throw error;
  }
};


export const cloudinaryDeleteImg = async (
  fileToDelete: string
): Promise<DeleteApiResponse> => {
  return new Promise<DeleteApiResponse>((resolve) => {
    cloudinary.uploader.destroy(fileToDelete, (result: any) => {
      resolve(result);
    });
  });
};
