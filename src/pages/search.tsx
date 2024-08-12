import MediaCard from "@/components/media-card";
import MediaContainer from "@/components/media-container";
import Page from "@/components/page";
import { movieToMedia } from "@/defs";
import { searchMovie } from "@/server/moviedb";
import { TextField, Typography } from "@mui/material";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const query = context.query.q;
  const movies = await searchMovie(query as string);
  return { props: { movies } };
}

export default function Search({
  movies,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Page>
      <form
        action="/search"
        method="get"
        style={{
          width: "100%",
        }}
      >
        <TextField label="Search" variant="outlined" name="q" fullWidth />
      </form>
      {movies.length ? (
        <>
          <Typography variant="h4">Movies</Typography>
          <MediaContainer>
            {movies.map((movie) => (
              <MediaCard key={movie.id} media={movieToMedia(movie)} />
            ))}
          </MediaContainer>
        </>
      ) : null}
    </Page>
  );
}
