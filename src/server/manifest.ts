import { join } from "path";
import fsSync, { promises as fs } from "fs";

interface ManifestEntry {
  path?: string;
  conversionProgress?: number;
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

  static allKeys(): string[] {
    return Object.keys(this.get());
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

  static setMovieConversionProgress(movieId: number, progress: number): void {
    const manifest = this.get();
    manifest[movieId] ??= {};
    manifest[movieId].conversionProgress = progress;
    this.write(manifest);
  }
}
