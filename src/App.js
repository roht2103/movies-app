import { useEffect, useState } from "react";
import "./App.css";

import MovieCard from "./movieCard";
import SearchIcon from "./search.svg";

// c6cf290f
const API_URL = "http://www.omdbapi.com?apikey=c6cf290f";

const movie1 = {
  Title: "Superman",
  Year: "1978",
  imdbID: "tt0078346",
  Type: "movie",
  Poster: "N/A",
};
const App = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const searchMovies = async (title) => {
    const response = await fetch(`${API_URL}&s=${title}`);
    const data = await response.json();
    setMovies(data.Search);
  };
  const submithandeler = (e) => {
    e.preventDefault();
    searchMovies(searchTerm);
  };

  useEffect(() => {
    searchMovies("superman");
  }, []);

  return (
    <div className="app">
      <h1>Film Villa</h1>

      <div className="search">
        <form onSubmit={submithandeler}>
          <input
            placeholder="Search for movies"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
          <img
            src={SearchIcon}
            alt="Search"
            type="submit"
            onClick={() => {
              searchMovies(searchTerm);
            }}
          />
        </form>
      </div>

      <div className="container">
        {movies.length > 0 ? (
          <div className="container">
            {movies.map((movie) => (
              <MovieCard movie={movie} />
            ))}
          </div>
        ) : (
          <div className="empty">
            <h2>No movies found</h2>
          </div>
        )}
        {/* <MovieCard movie1={movies[0]} /> */}
      </div>
    </div>
  );
};
export default App;
