import { getMovieDownloadPath } from "@/server/downloads";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const videoPath = await getMovieDownloadPath(Number(id));
  return res.status(200).json(videoPath);
}
