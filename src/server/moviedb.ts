import { Movie, TvShow } from "@/defs";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkOTJjYTQ3OTNhYzAyOWM5OWE0MGEwNzc0NDM4NDBkZCIsIm5iZiI6MTcxOTgwMzgzMy45OTI4NDcsInN1YiI6IjY2ODIxZjE4ZGM5MjBkODNlNGRkNWI0NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.G8d9aVnYMEDAeNoHUswu24GUwyJWbRJzvfES_zQefRU",
  },
};

export async function searchMovie(title: string): Promise<Movie[]> {
  const url = `https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1&query=${title}&sort_by=popularity.desc`;
  // return (await fetch(url, options)).json();
  return (await (await fetch(url, options)).json()).results;
}

export async function searchTvShow(title: string): Promise<TvShow[]> {
  const url = `https://api.themoviedb.org/3/search/tv?include_adult=false&language=en-US&page=1&query=${title}&sort_by=popularity.desc`;
  return (await (await fetch(url, options)).json()).results;
}

export async function getMovie(id: string): Promise<Movie> {
  const url = `https://api.themoviedb.org/3/movie/${id}`;
  return (await fetch(url, options)).json();
}

export async function getTrendingMovies(): Promise<Movie[]> {
  const url = `https://api.themoviedb.org/3/trending/movie/day?language=en-US&page=1`;
  return (await (await fetch(url, options)).json()).results;
}

export async function getTrendingTvShows(): Promise<TvShow[]> {
  const url = `https://api.themoviedb.org/3/trending/tv/day?language=en-US&page=1`;
  return (await (await fetch(url, options)).json()).results;
}
