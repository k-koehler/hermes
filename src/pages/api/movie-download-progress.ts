import { downloadMovie, movieDownloadProgess } from "@/server/downloads";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { movieId } = req.query;
    return res.status(200).json(await movieDownloadProgess(Number(movieId)));
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
