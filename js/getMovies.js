export default async function getMovies(
  search = "",
  type = "",
  year = "",
  page = 1
) {
  const url = `https://omdbapi.com/?apikey=7035c60c&s=${search}&type=${type}&y=${year}&page=${page}`;
  console.log(url);
  const res = await fetch(url);
  const { Search: movies, totalResults, Response } = await res.json();

  if (Response === "True") {
    return movies;
  }
  return Error;
}
