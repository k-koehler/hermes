import MediaCard from "@/components/media-card";
import MediaContainer from "@/components/media-container";
import Page from "@/components/page";
import { searchMovie, searchTvShow } from "@/server/moviedb";
import { movieToMedia, tvShowToMedia } from "@/defs";
import styled from "@emotion/styled";
import { TextField, Typography } from "@mui/material";
import type {
  InferGetServerSidePropsType,
  GetServerSidePropsContext,
} from "next";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const query = context.query.q;
  const movies = await searchMovie(query as string);
  const tvShows = await searchTvShow(query as string);
  return { props: { movies, tvShows } };
}

export default function Search({
  movies,
  tvShows,
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
      {tvShows.length ? (
        <>
          <Typography variant="h4">TV Shows</Typography>
          <MediaContainer>
            {tvShows.map((tvShow) => (
              <MediaCard key={tvShow.id} media={tvShowToMedia(tvShow)} />
            ))}
          </MediaContainer>
        </>
      ) : null}
    </Page>
  );
}
