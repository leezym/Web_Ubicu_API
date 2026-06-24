import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { s3 } from "./s3Client.js";

export async function listOneInResultsPrefix() {
  const Bucket = process.env.AWS_S3_BUCKET;
  const cmd = new ListObjectsV2Command({
    Bucket,
    Prefix: "results/",
    MaxKeys: 1,
  });
  return await s3.send(cmd);
}