import { listOneInResultsPrefix } from "../services/s3List.js";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { s3 } from "../services/s3Client.js";

export default function routePings(app) {
  app.get("/s3/ping", async (req, res) => {
    try {
      const out = await listOneInResultsPrefix();
      return res.json({ ok: true, note: "S3 reachable", keyCount: out.KeyCount });
    } catch (e) {
      return res.status(500).json({
        ok: false,
        name: e?.name,
        message: e?.message,
        code: e?.code,
        $metadata: e?.$metadata
      });
    }
  });

  app.get("/s3/list", async (req, res) => {
    try {
      const out = await s3.send(
        new ListObjectsV2Command({
          Bucket: process.env.AWS_S3_BUCKET,
          Prefix: "results/",
          MaxKeys: 10,
        })
      );

      return res.json({
        ok: true,
        keys: (out.Contents || []).map(o => ({ key: o.Key, size: o.Size })),
      });
    } catch (e) {
      return res.status(500).json({ ok: false, error: String(e) });
    }
  });
}