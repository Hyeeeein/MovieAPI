export default async function getMovieInfo(id = "tt4154756") {
  const url = `https://omdbapi.com/?apikey=7035c60c&i=${id}&plot=full`;
  console.log(url);
  const res = await fetch(url);
  const json = await res.json();
  if (json.Response === "True") {
    return json;
  }
  return json.Error;
}
