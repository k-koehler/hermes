import Transmission from "transmission-promise";
import { join } from "path";
import fsSync, { promises as fs } from "fs";
import ffmpeg from "ffmpeg";

interface ManifestEntry {
  path?: string;
  error?: string;
  progress?: {
    step: "downloading" | "prepare-manifest" | "convert-video";
    percentage?: number;
  };
}

interface ManifestData {
  [movieId: string]: ManifestEntry;
}

export class Manifest {
  private static path = join(process.cwd(), "downloads/manifest.json");

  static get(): ManifestData {
    if (!fsSync.existsSync(this.path)) {
      fsSync.writeFileSync(this.path, "{}");
    }
    return JSON.parse(fsSync.readFileSync(this.path, "utf-8"));
  }

  static write(data: ManifestData): void {
    fsSync.writeFileSync(this.path, JSON.stringify(data, null, 2));
  }

  static getMovie(movieId: number): ManifestEntry {
    const manifest = this.get();
    return manifest[movieId] || {};
  }

  static setMovie(movieId: number, data: ManifestEntry): void {
    const manifest = this.get();
    manifest[movieId] = data;
    this.write(manifest);
  }

  static setMovieProgress(
    movieId: number,
    step: "prepare-manifest" | "convert-video",
    percentage?: number
  ): void {
    const movie = this.getMovie(movieId);
    movie.progress = { step, percentage };
    this.setMovie(movieId, movie);
  }
}

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

class MovieDownloadPathError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MovieDownloadPathError";
  }
}

export async function getMovieDownloadPath(movieId: number): Promise<string> {
  const existingManifest = Manifest.getMovie(movieId);
  if (existingManifest.path) {
    return existingManifest.path;
  }
  Manifest.setMovieProgress(movieId, "prepare-manifest");
  const downloaded = await checkMovieDownloaded(movieId);
  if (!downloaded) {
    throw new MovieDownloadPathError("Movie not downloaded");
  }
  const path = await getTorrentMovieDownloadPath(movieId);
  const ext = path.split(".").pop();
  if (ext !== "mp4") {
    throw new MovieDownloadPathError("Invalid video format");
  }
  const newPath = join(process.cwd(), "downloads/movies", `${movieId}.mp4`);
  await fs.rename(path, newPath);
  Manifest.setMovie(movieId, { path: newPath });
  return newPath;
}

export async function movieIsOk(movieId: number) {
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
