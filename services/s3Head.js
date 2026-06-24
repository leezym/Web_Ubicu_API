import { HeadObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "./s3Client.js";

export async function headObject({ key }) {
  const Bucket = process.env.AWS_S3_BUCKET;

  const cmd = new HeadObjectCommand({
    Bucket,
    Key: key,
  });

  return await s3.send(cmd);
}