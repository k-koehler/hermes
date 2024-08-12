import { MediaPlayback } from "@/components/media-playback";
import { Movie, movieToMedia } from "@/defs";
import { getMovieOk } from "@/server/downloads";
import { getMovie } from "@/server/moviedb";
import { GetServerSideProps } from "next";

interface Props {
  movie: Movie;
  ok: boolean;
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const { id } = context.params as { id: string };
  const movie = await getMovie(id);
  const ok = await getMovieOk(+id);

  if (!ok) {
    return {
      redirect: {
        destination: `/movies/${id}/fix`,
        permanent: false,
        unstable_replace: true,
      },
    };
  }

  return { props: { movie, ok } };
};

export default function MoviesIdPlay({ movie }: Props) {
  return <MediaPlayback media={movieToMedia(movie)} />;
}
