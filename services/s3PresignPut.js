import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "./s3Client.js";

export async function presignPut({ key, contentType, expiresInSeconds = 900 }) {
  const Bucket = process.env.AWS_S3_BUCKET;

  const command = new PutObjectCommand({
    Bucket,
    Key: key,
    ContentType: contentType || "application/octet-stream",
  });

  return await getSignedUrl(s3, command, { expiresIn: expiresInSeconds });
}
