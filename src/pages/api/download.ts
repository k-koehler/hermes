import { downloadMovie } from "@/server/downloads";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { movieId, magnet } = req.body;
    await downloadMovie(movieId, magnet);
    return res.status(200).json({ ok: true });
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
