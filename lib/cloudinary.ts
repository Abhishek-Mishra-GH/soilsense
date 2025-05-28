import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadToCloudinary(file: Buffer, filename: string): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "image",
          folder: "soil-analysis",
          public_id: filename,
          transformation: [{ width: 800, height: 600, crop: "limit" }, { quality: "auto" }, { format: "webp" }],
        },
        (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve(result?.secure_url || "")
          }
        },
      )
      .end(file)
  })
}

export default cloudinary
