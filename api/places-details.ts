import axios from "axios";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type,X-Goog-Api-Key,X-Goog-SessionToken,X-Goog-FieldMask"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { placeId, languageCode } = req.query;

  if (!placeId || typeof placeId !== "string") {
    return res.status(400).json({ error: "Missing or invalid placeId" });
  }

  const headers: Record<string, string> = {};

  if (req.headers["x-goog-api-key"])
    headers["X-Goog-Api-Key"] = req.headers["x-goog-api-key"] as string;
  if (req.headers["x-goog-sessiontoken"])
    headers["X-Goog-SessionToken"] = req.headers[
      "x-goog-sessiontoken"
    ] as string;
  if (req.headers["x-goog-fieldmask"])
    headers["X-Goog-FieldMask"] = req.headers["x-goog-fieldmask"] as string;

  let url = `https://places.googleapis.com/v1/places/${placeId}`;
  if (languageCode && typeof languageCode === "string") {
    url += `?languageCode=${encodeURIComponent(languageCode)}`;
  }

  try {
    const result = await axios.get(url, { headers });
    res.status(200).json(result.data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
