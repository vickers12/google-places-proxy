// api/places-details.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { placeId, languageCode } = req.query;

  if (!placeId || typeof placeId !== "string") {
    return res.status(400).json({ error: "Missing or invalid placeId" });
  }

  const headers: Record<string, string> = {};

  const allowedHeaders = [
    "x-goog-api-key",
    "x-goog-sessiontoken",
    "x-goog-fieldmask"
  ];

  allowedHeaders.forEach((key) => {
    const value = req.headers[key] as string;
    if (value) headers[key.replace(/^x/, "X")] = value; // capitalize to match Google spec
  });

  let url = `https://places.googleapis.com/v1/places/${placeId}`;
  if (languageCode && typeof languageCode === "string") {
    url += `?languageCode=${encodeURIComponent(languageCode)}`;
  }

  try {
    const response = await axios.get(url, { headers });
    res.status(200).json(response.data);
  } catch (error: any) {
    console.error("Google Places API error:", error.message);
    res.status(500).json({ error: error.message });
  }
}
