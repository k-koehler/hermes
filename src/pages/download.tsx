import Page from "@/components/page";
import { downloadMovie, movieDownloadProgess } from "@/server/downloads";
import { Movie } from "@/defs";
import { ArrowDownward, ArrowUpward, CloudDownload } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  LinearProgress,
  Typography,
} from "@mui/material";
import bytes from "bytes";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Torrent } from "torrent-search-api";

interface Props {
  movie: Movie;
  torrent: Torrent;
  downloading: boolean;
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<{ props: Props }> {
  const { movie: movieRaw, torrent: torrentRaw } = context.query;
  const movie = JSON.parse(movieRaw as string) as Movie;
  const torrent = JSON.parse(torrentRaw as string) as Torrent;
  const downloading = !!(await movieDownloadProgess(movie.id));
  return {
    props: {
      movie,
      torrent,
      downloading,
    },
  };
}

export default function Download({
  movie,
  torrent,
  downloading: downloadingSsrProps,
}: Props) {
  const [downloading, setDownloading] = useState(downloadingSsrProps);
  const [progress, setProgress] = useState<
    Awaited<ReturnType<typeof movieDownloadProgess>> | undefined
  >(undefined);
  const done = progress?.progress === 100;
  const router = useRouter();

  useEffect(() => {
    if (!downloading) {
      return;
    }
    const interval = setInterval(async () => {
      setProgress(
        await (
          await fetch(`/api/movie-download-progress?movieId=${movie.id}`)
        ).json()
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [movie.id, downloading]);

  async function onClickDownload() {
    await fetch("/api/download", {
      method: "POST",
      body: JSON.stringify({
        movieId: movie.id,
        magnet: torrent.magnet,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setProgress(
      await (
        await fetch(`/api/movie-download-progress?movieId=${movie.id}`)
      ).json()
    );
    setDownloading(true);
  }

  useEffect(() => {
    if (done) {
      router.push(`/movies/${movie.id}`);
    }
  }, [done, movie.id, router]);

  return (
    <Page>
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h1" gutterBottom>
                Download: {movie.title}
              </Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography
                    variant="body2"
                    display="flex"
                    alignItems="center"
                  >
                    <ArrowUpward sx={{ mr: 1 }} /> Seeds: {torrent.seeds}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="body2"
                    display="flex"
                    alignItems="center"
                  >
                    <ArrowDownward sx={{ mr: 1 }} /> Leeches: {+torrent.peers}
                  </Typography>
                </Grid>
              </Grid>
              <Typography variant="body1" gutterBottom>
                File Size: {torrent.size} GB
              </Typography>
              {downloading && progress ? (
                <div>
                  <Typography variant="body1" gutterBottom>
                    Download Speed:{" "}
                    {bytes(progress.dlSpeedBitsSec / 8, { unitSeparator: " " })}
                    /s
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Upload Speed:
                    {bytes(progress.upspeedBitsSec / 8, { unitSeparator: " " })}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Progress: {progress.progress.toFixed(1)}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={progress?.progress}
                    sx={{ mt: 2 }}
                  />
                </div>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CloudDownload />}
                  fullWidth
                  sx={{ mt: 2 }}
                  disabled={downloading}
                  onClick={onClickDownload}
                >
                  Start Download
                </Button>
              )}
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Page>
  );
}
