export interface Movie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface TvShow {
  backdrop_path: string;
  first_air_date: string;
  genre_ids: number[];
  id: number;
  name: string;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;
}

export enum MediaType {
  Movie = "movies",
  TvShow = "tv",
}

export interface Media {
  id: number;
  title: string;
  description: string;
  releaseDate: string;
  rating0to10: number;
  popularity: number;
  posterPath: string;
  backdropPath: string;
  mediaType: MediaType;
}

export function movieToMedia(movie: Movie): Media {
  return {
    id: movie.id,
    title: movie.title,
    description: movie.overview,
    releaseDate: movie.release_date,
    rating0to10: movie.vote_average,
    popularity: movie.popularity,
    posterPath: movie.poster_path,
    backdropPath: movie.backdrop_path,
    mediaType: MediaType.Movie,
  };
}

export function tvShowToMedia(tvShow: TvShow): Media {
  return {
    id: tvShow.id,
    title: tvShow.name,
    description: tvShow.overview,
    releaseDate: tvShow.first_air_date,
    rating0to10: tvShow.vote_average,
    popularity: tvShow.popularity,
    posterPath: tvShow.poster_path,
    backdropPath: tvShow.backdrop_path,
    mediaType: MediaType.TvShow,
  };
}

export interface Download {
  id: number;
  state: "downloading" | "paused" | "completed";
  fname: string;
  magnet: string;
  progressBytes: number;
  totalBytes: number;
  downloadSpeed: number;
  uploadSpeed: number;
  peers: number;
  seeds: number;
  timeStarted: number;
  timeEnded: number | null;
}
