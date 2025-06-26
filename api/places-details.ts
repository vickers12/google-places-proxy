import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // ✅ Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type,X-Goog-Api-Key,X-Goog-SessionToken,X-Goog-FieldMask"
  );

  // ✅ Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ✅ Support /places-details/:placeId (via rewritten route or query param)
  const placeId = req.query.placeId as string;
  const languageCode = req.query.languageCode as string | undefined;

  if (!placeId) {
    return res.status(400).json({ error: "Missing placeId" });
  }

  // ✅ Forward the headers
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
  if (languageCode) {
    url += `?languageCode=${encodeURIComponent(languageCode)}`;
  }

  try {
    const response = await axios.get(url, { headers });
    res.status(200).json(response.data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
