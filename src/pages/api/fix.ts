import {
  MovieDownloadPathError,
  convertMovie,
  getMovieDownloadPath,
} from "@/server/downloads";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  if (!req.query.id) {
    return res.status(400).json({ message: "Missing id query parameter" });
  }
  try {
    await getMovieDownloadPath(+req.query.id);
    return res.status(200).json({ ok: true });
  } catch (e) {
    if (e instanceof MovieDownloadPathError) {
      if (e.errorType === "InvalidFormat") {
        await convertMovie(+req.query.id);
        return res.status(200).json({ ok: true });
      } else {
        return res.status(404).json({ message: "Movie not downloaded" });
      }
    }
    throw e;
  }
}
