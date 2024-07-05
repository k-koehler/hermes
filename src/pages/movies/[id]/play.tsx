import { MediaPlayback } from "@/components/media-playback";
import { Movie, movieToMedia } from "@/defs";
import { getMovie } from "@/server/moviedb";

interface Props {
  movie: Movie;
}

export async function getServerSideProps(context: { params: { id: string } }) {
  const movie = await getMovie(context.params.id);
  return { props: { movie } };
}

export default function MoviesIdPlay({ movie }: Props) {
  return <MediaPlayback media={movieToMedia(movie)} />;
}
