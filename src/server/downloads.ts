import Transmission from "transmission-promise";
import { join } from "path";
import fsSync, { promises as fs } from "fs";
import ffmpeg from "fluent-ffmpeg";
import Manifest from "./manifest";

export async function downloadMovie(movieId: number, magnet: string) {
  const client = new Transmission();
  const downloadPath = join(
    process.cwd(),
    "downloads/movies",
    movieId.toString()
  );
  await client.addUrl(magnet, {
    "download-dir": downloadPath,
  });
}

export async function movieDownloadProgess(movieId: number): Promise<
  | {
      upspeedBitsSec: number;
      dlSpeedBitsSec: number;
      progress: number;
      eta: number;
    }
  | undefined
> {
  const client = new Transmission();
  const torrents = await client.get(undefined);
  const torrent = torrents.torrents.find((torrent: any) =>
    torrent.downloadDir.includes(`movies/${movieId}`)
  );
  if (!torrent) {
    return undefined;
  }
  return {
    upspeedBitsSec: torrent.rateUpload,
    dlSpeedBitsSec: torrent.rateDownload,
    progress: torrent.percentDone * 100,
    eta: torrent.eta,
  };
}

export async function checkMovieDownloaded(movieId: number) {
  const downloadPath = join(
    process.cwd(),
    "downloads/movies",
    movieId.toString()
  );
  try {
    await fs.access(downloadPath);
    return true;
  } catch (e) {
    return false;
  }
}

export async function getTorrentMovieDownloadPath(
  movieId: number
): Promise<string> {
  const downloadPath = join(
    process.cwd(),
    "downloads/movies",
    movieId.toString()
  );
  const validExtensions = ["mp4", "mkv", "avi"];

  async function findLargestMediaFile(
    dirPath: string
  ): Promise<{ path: string; size: number } | null> {
    const dirFiles = await fs.readdir(dirPath);
    let largestFile: { path: string; size: number } | null = null;

    for (const file of dirFiles) {
      const fullPath = join(dirPath, file);
      const stats = await fs.stat(fullPath);

      if (stats.isDirectory()) {
        const result = await findLargestMediaFile(fullPath);
        if (result && (!largestFile || result.size > largestFile.size)) {
          largestFile = result;
        }
      } else if (validExtensions.some((ext) => file.endsWith(`.${ext}`))) {
        if (!largestFile || stats.size > largestFile.size) {
          largestFile = { path: fullPath, size: stats.size };
        }
      }
    }
    return largestFile;
  }
  const result = await findLargestMediaFile(downloadPath);
  if (result) {
    return result.path;
  } else {
    throw new Error("No valid video files found");
  }
}

export class MovieDownloadPathError extends Error {
  public errorType: "NotDownloaded" | "InvalidFormat";
  constructor(message: string, errorType: "NotDownloaded" | "InvalidFormat") {
    super(message);
    this.name = "MovieDownloadPathError";
    this.errorType = errorType;
  }
}

export async function getMovieDownloadPath(movieId: number): Promise<string> {
  const existingManifest = Manifest.getMovie(movieId);
  if (existingManifest.path) {
    return existingManifest.path;
  }
  const downloaded = await checkMovieDownloaded(movieId);
  if (!downloaded) {
    throw new MovieDownloadPathError("Movie not downloaded", "NotDownloaded");
  }
  const path = await getTorrentMovieDownloadPath(movieId);
  const ext = path.split(".").pop();
  if (ext !== "mp4") {
    throw new MovieDownloadPathError("Invalid video format", "InvalidFormat");
  }
  const newPath = join(process.cwd(), "downloads/movies", `${movieId}.mp4`);
  await fs.rename(path, newPath);
  Manifest.setMovie(movieId, { path: newPath });
  return newPath;
}

export async function getMovieOk(movieId: number) {
  try {
    await getMovieDownloadPath(movieId);
    return true;
  } catch (e) {
    if (e instanceof MovieDownloadPathError) {
      return false;
    }
    throw e;
  }
}

export async function convertMovie(movieId: number) {
  const torrentPath = await getTorrentMovieDownloadPath(movieId);
  const newPath = torrentPath.replace(/\.\w+$/, ".mp4");
  return new Promise<void>((resolve, reject) => {
    ffmpeg(torrentPath)
      .outputOptions([
        "-c:v libx264",
        "-preset ultrafast",
        "-crf 23",
        "-c:a aac",
        "-b:a 128k",
      ])
      .output(newPath)
      .on("end", () => {
        fs.unlink(torrentPath);
        resolve();
      })
      .on("progress", (progress) => {
        Manifest.setMovieConversionProgress(movieId, progress.percent || 0);
      })
      .on("error", (err) => reject(err))
      .run();
  });
}

export const maxServerStorageGb = 250; // 250 GB
export const maxServerStorageBytes = maxServerStorageGb * 1024 ** 3;

export async function getServerStorageUsed() {
  const downloadPath = join(process.cwd(), "downloads");
  const stats = await fs.stat(downloadPath);
  return stats.size;
}
