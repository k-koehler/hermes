import MediaCard from "@/components/media-card";
import MediaContainer from "@/components/media-container";
import Page from "@/components/page";
import { getTrendingMovies, getTrendingTvShows } from "@/server/moviedb";
import { Movie, TvShow, movieToMedia, tvShowToMedia } from "@/defs";
import { TextField, Typography } from "@mui/material";

interface Props {
  trendingMovies: Movie[];
  trendingTvShows: TvShow[];
}

export async function getServerSideProps() {
  const trendingMovies = await getTrendingMovies();
  return {
    props: {
      trendingMovies,
    },
  };
}

export default function Index({ trendingMovies }: Props) {
  return (
    <Page
      style={{
        gap: "1rem",
      }}
    >
      <form
        action="/search"
        method="get"
        style={{
          width: "100%",
        }}
      >
        <TextField label="Search" variant="outlined" name="q" fullWidth />
      </form>
      <Typography variant="h4">Trending Movies</Typography>
      <MediaContainer>
        {trendingMovies.map((movie) => (
          <MediaCard key={movie.id} media={movieToMedia(movie)} />
        ))}
      </MediaContainer>
      <Typography variant="h4">Trending TV Shows</Typography>
    </Page>
  );
}
