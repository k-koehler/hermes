import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { getMovieDownloadPath } from "@/server/downloads";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { type, id } = req.query;
  const videoPath = await getMovieDownloadPath(Number(id));
  if (!videoPath.ok) {
    return res.status(404).json({ message: "Movie not ready" });
  }
  const stat = fs.statSync(videoPath.path);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(videoPath.path, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(200, head);
    fs.createReadStream(videoPath.path).pipe(res);
  }
}
