import { MediaPlayback } from "@/components/media-playback";
import { Movie, movieToMedia } from "@/defs";
import { MovieDownloadPath, getMovieDownloadPath } from "@/server/downloads";
import { getMovie } from "@/server/moviedb";
import { useEffect, useState } from "react";

interface Props {
  movie: Movie;
  path: MovieDownloadPath;
}

export async function getServerSideProps(context: { params: { id: string } }) {
  const movie = await getMovie(context.params.id);
  const path = await getMovieDownloadPath(+context.params.id);
  return { props: { movie, path } };
}

function parseMessageFromPath(path: MovieDownloadPath) {
  if (path.ok) {
    return undefined;
  }
  if (path.error) {
    return path.error;
  }
  if (path.progress?.progress) {
    return `Downloading: ${path.progress.progress}%`;
  }
  if (path.progress?.step === "convert-video") {
    return "Converting video...";
  }
  if (path.progress?.step === "prepare-manifest") {
    return "Preparing manifest...";
  }
}

export default function MoviesIdPlay({ movie, path }: Props) {
  const [message, setMessage] = useState<string | undefined>("preparing");

  useEffect(() => {
    if (!path.ok) {
      const interval = setInterval(async () => {
        const res = await fetch(`/api/movie-download-path?id=${movie.id}`);
        const newPath = (await res.json()) as MovieDownloadPath;
        setMessage(parseMessageFromPath(newPath));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [movie.id, path.ok]);

  if (message) {
    return <div>{message}</div>;
  }

  return <MediaPlayback media={movieToMedia(movie)} />;
}
