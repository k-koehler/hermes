import { join } from "path";
import fsSync, { promises as fs } from "fs";

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

export default class Manifest {
  private static path = join(process.cwd(), "downloads/manifest.json");

  static {
    if (!fsSync.existsSync(join(process.cwd(), "downloads/manifest.json"))) {
      fsSync.writeFileSync(this.path, "{}");
    }
  }

  static get(): ManifestData {
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
