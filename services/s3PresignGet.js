import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "./s3Client.js";

export async function presignGet({ key, expiresInSeconds = 900 }) {
  const Bucket = process.env.AWS_S3_BUCKET;

  const cmd = new GetObjectCommand({
    Bucket,
    Key: key,
  });

  return await getSignedUrl(s3, cmd, { expiresIn: expiresInSeconds });
}
