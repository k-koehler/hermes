import { MediaPlayback } from "@/components/media-playback";
import { Movie, movieToMedia } from "@/defs";
import { getMovieDownloadPath } from "@/server/downloads";
import { getMovie } from "@/server/moviedb";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface Props {
  movie: Movie;
  ok: boolean;
}

export async function getServerSideProps(context: { params: { id: string } }) {
  const movie = await getMovie(context.params.id);
  const ok = await getMovieDownloadPath(+context.params.id);
  return { props: { movie, ok } };
}

export default function MoviesIdPlay({ movie, ok }: Props) {
  const router = useRouter();
  if (!ok) {
    // redirect to /movies/[id]/fix
    return router.push(`/movies/${movie.id}/fix`);
  }
  return <MediaPlayback media={movieToMedia(movie)} />;
}
