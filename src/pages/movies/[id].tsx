import Page from "@/components/page";
import { checkMovieDownloaded } from "@/server/downloads";
import { getMovie } from "@/server/moviedb";
import { searchMovietorrents } from "@/server/torrents";
import { Movie } from "@/defs";
import { Download, PlayArrow } from "@mui/icons-material";
import StarIcon from "@mui/icons-material/Star";
import {
  ButtonGroup,
  CardActions,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";

interface Props {
  movie: Movie;
  torrents: Awaited<ReturnType<typeof searchMovietorrents>>;
  downloaded: boolean;
}

export async function getServerSideProps(context: { params: { id: string } }) {
  const movie = await getMovie(context.params.id);
  const torrents = await searchMovietorrents(movie.title);
  const downloaded = await checkMovieDownloaded(movie.id);
  return { props: { movie, torrents, downloaded } };
}

export default function MovieId({ movie, torrents, downloaded }: Props) {
  return (
    <Page>
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Card
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            <Box sx={{ position: "relative" }}>
              <CardMedia
                component="img"
                sx={{
                  width: { xs: "100%", md: 300 },
                  height: { xs: 450, md: "auto" },
                }}
                image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
              />
              {downloaded && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <Link href={`/movies/${movie.id}/play`}>
                    <IconButton
                      sx={{
                        fontSize: "5rem",
                        color: "white",
                      }}
                    >
                      <PlayArrow fontSize="inherit" />
                    </IconButton>
                  </Link>
                </Box>
              )}
            </Box>
            <CardContent sx={{ flex: 1 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {movie.title}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                gutterBottom
              >
                {movie.release_date} · {movie.original_language.toUpperCase()}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Chip
                  icon={<StarIcon />}
                  label={movie.vote_average.toFixed(1)}
                  color="primary"
                />
                <Chip label={`${movie.vote_count} votes`} variant="outlined" />
              </Stack>
              <Typography variant="body1" paragraph>
                {movie.overview}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Popularity: {movie.popularity.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
      {!downloaded && (
        <Container>
          <List>
            {torrents.map((torrent) => (
              <ListItem key={torrent.magnet}>
                <ListItemText
                  primary={torrent.title}
                  secondary={
                    <div
                      style={{
                        padding: "1rem 0",
                        gap: "0.5rem",
                        display: "flex",
                      }}
                    >
                      <a href={torrent.desc}>
                        <Chip label={torrent.provider} />
                      </a>
                      <Chip label={torrent.size} />
                      <Chip label={`${torrent.seeds} seeds`} />
                      <Chip label={`${torrent.peers} peers`} />
                    </div>
                  }
                />
                <ListItemSecondaryAction>
                  <ButtonGroup>
                    <IconButton
                      color="primary"
                      href={torrent.magnet}
                      target="_blank"
                      disabled
                    >
                      <PlayArrow />
                    </IconButton>
                    <Link
                      href={`/download?movie=${encodeURIComponent(
                        JSON.stringify(movie)
                      )}&torrent=${encodeURIComponent(
                        JSON.stringify(torrent)
                      )}`}
                    >
                      <IconButton color="secondary">
                        <Download />
                      </IconButton>
                    </Link>
                  </ButtonGroup>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Container>
      )}
    </Page>
  );
}
