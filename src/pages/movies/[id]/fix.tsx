import Page from "@/components/page";
import { Movie } from "@/defs";
import { getMovie } from "@/server/moviedb";
import { CircularProgress, Typography } from "@mui/material";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";

interface Props {
  movie: Movie;
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const { id } = context.params as { id: string };
  const movie = await getMovie(id);
  return { props: { movie } };
};

export default function Fix({ movie }: Props) {
  const [error, setError] = useState<string>();
  const [progress, setProgress] = useState<number>();

  useEffect(() => {
    async function fix() {
      try {
        const response = await fetch(`/api/fix?id=${movie.id}`, {
          method: "POST",
        });
        if (!response.ok) {
          setError("Failed to fix movie");
        } else {
          window.location.replace(`/movies/${movie.id}/play`);
        }
      } catch (e) {
        setError("Failed to fix movie");
      }
    }
    fix();
  }, [movie.id]);

  useEffect(() => {
    async function checkProgress() {
      const response = await fetch(
        `/api/get-conversion-percentage?id=${movie.id}`
      );
      if (response.ok) {
        const { percentage } = await response.json();
        setProgress(percentage);
      }
    }
    const interval = setInterval(checkProgress, 1000);
    return () => clearInterval(interval);
  }, [movie.id]);

  if (error) {
    return (
      <Page>
        <Typography variant="h4" align="center">
          {error}
        </Typography>
      </Page>
    );
  }

  return (
    <Page>
      <Typography variant="h4" align="center">
        Preparing movie for playback
      </Typography>
      {progress && (
        <Typography variant="h6" align="center">
          {progress.toFixed(2)}%
        </Typography>
      )}
      <CircularProgress
        sx={{
          display: "block",
          margin: "2rem auto",
        }}
      />
    </Page>
  );
}
