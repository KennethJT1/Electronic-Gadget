
import { v2 as cloudinary,UploadApiResponse, DeleteApiResponse } from "cloudinary";


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.SECRET_KEY,
});

export const cloudinaryUploadImg = async (
  fileToUploads: string
): Promise<UploadApiResponse> => {
  return new Promise<UploadApiResponse>((resolve) => {
    cloudinary.uploader.upload(fileToUploads, (result:any) => {
      resolve(result);
    });
  });
};

export const cloudinaryDeleteImg = async (
  fileToDelete: string
): Promise<DeleteApiResponse> => {
  return new Promise<DeleteApiResponse>((resolve) => {
    cloudinary.uploader.destroy(fileToDelete, (result:any) => {
      resolve(result);
    });
  });
};



// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY
//   ,
//   api_secret: process.env.CLOUDINARY_SECRET_KEY,
// });

// export const cloudinaryUploadImg = async (fileToUploads: string): Promise<UploadApiResponse> => {
//   return new Promise<UploadApiResponse>((resolve) => {
//     cloudinary.uploader.upload(fileToUploads, (result) => {
//       resolve(result:any);
//     });
//   });
// };

// export const cloudinaryDeleteImg = async (fileToDelete: string): Promise<DestroyApiResponse> => {
//   return new Promise<DestroyApiResponse>((resolve) => {
//     cloudinary.uploader.destroy(fileToDelete, (result) => {
//       resolve(result);
//     });
//   });
// };

