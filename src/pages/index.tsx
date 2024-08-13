import MediaCard from "@/components/media-card";
import MediaContainer from "@/components/media-container";
import Page from "@/components/page";
import {
  getDownloadedMovies,
  getTrendingMovies,
  getTrendingTvShows,
} from "@/server/moviedb";
import { Movie, TvShow, movieToMedia, tvShowToMedia } from "@/defs";
import { TextField, Typography } from "@mui/material";
import { getServerStorageUsed } from "@/server/downloads";

interface Props {
  trendingMovies: Movie[];
  downloadedMovies: Movie[];
  bytesUsed: number;
}

export async function getServerSideProps() {
  const trendingMovies = await getTrendingMovies();
  const downloadedMovies = await getDownloadedMovies();
  const bytesUsed = await getServerStorageUsed();
  return {
    props: {
      trendingMovies,
      downloadedMovies,
    },
  };
}

export default function Index({ trendingMovies, downloadedMovies }: Props) {
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
      <Typography variant="h4">System Information</Typography>
      <Typography variant="h4">Downloaded Movies</Typography>
      <MediaContainer>
        {downloadedMovies.map((movie) => (
          <MediaCard key={movie.id} media={movieToMedia(movie)} />
        ))}
      </MediaContainer>
      <Typography variant="h4">Trending Movies</Typography>
      <MediaContainer>
        {trendingMovies.map((movie) => (
          <MediaCard key={movie.id} media={movieToMedia(movie)} />
        ))}
      </MediaContainer>
    </Page>
  );
}
