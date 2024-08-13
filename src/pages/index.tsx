import MediaCard from "@/components/media-card";
import MediaContainer from "@/components/media-container";
import Page from "@/components/page";
import { getDownloadedMovies, getTrendingMovies } from "@/server/moviedb";
import { Movie, maxServerStorageBytes, movieToMedia } from "@/defs";
import { Chip, TextField, Typography } from "@mui/material";
import { getServerStorageUsed } from "@/server/downloads";
import bytes from "bytes";

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
      bytesUsed,
    },
  };
}

export default function Index({
  trendingMovies,
  downloadedMovies,
  bytesUsed,
}: Props) {
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
      <MediaContainer>
        <Chip
          label={`Storage Used: ${bytes(bytesUsed)}`}
          color="primary"
          variant="outlined"
        />
        <Chip
          label={`Available: ${bytes(maxServerStorageBytes - bytesUsed)}`}
          color="primary"
          variant="outlined"
        />
      </MediaContainer>

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
