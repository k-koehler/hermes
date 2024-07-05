import Transmission from "transmission-promise";
import { join } from "path";
import { promises as fs } from "fs";

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

export async function getMovieDownloadPath(movieId: number) {
  const downloadPath = join(
    process.cwd(),
    "downloads/movies",
    movieId.toString()
  );
  const validExtensions = ["mp4", "mkv", "avi"];

  try {
    // Read the contents of the directory
    const dirFiles = await fs.readdir(downloadPath);

    // Find the first folder in the directory
    const folder = await Promise.all(
      dirFiles.map(async (file) => {
        const fullPath = join(downloadPath, file);
        const stats = await fs.stat(fullPath);
        return { name: file, isDirectory: stats.isDirectory() };
      })
    ).then((files) => files.find((file) => file.isDirectory));

    if (!folder) {
      throw new Error("No movie folder found");
    }

    const folderPath = join(downloadPath, folder.name);

    // Read the contents of the folder
    const files = await fs.readdir(folderPath);

    const fileStats = await Promise.all(
      files
        .filter((file) =>
          validExtensions.some((ext) => file.endsWith(`.${ext}`))
        )
        .map(async (file) => {
          const filePath = join(folderPath, file);
          const stats = await fs.stat(filePath);
          return { name: file, path: filePath, size: stats.size };
        })
    );

    const largestFile = fileStats.sort((a, b) => b.size - a.size)[0];

    console.log(`Largest file for movie ID ${movieId}:`, largestFile);

    if (largestFile) {
      return largestFile.path;
    } else {
      throw new Error("No valid video files found");
    }
  } catch (error) {
    console.error(`Error finding movie file for ID ${movieId}:`, error);
    throw error;
  }
}
