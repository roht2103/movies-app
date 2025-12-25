import { useEffect, useState } from "react";
import "./App.css";
import MovieCard from "./movieCard";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

// c6cf290f
const API_URL = "http://www.omdbapi.com?apikey=c6cf290f";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [sortBy, setSortBy] = useState("year");

  const searchMovies = async (title, page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}&s=${title}&page=${page}`);
      const data = await response.json();

      if (data.Response === "True") {
        let sortedMovies = data.Search || [];

        // Apply sorting
        if (sortBy === "year") {
          sortedMovies = sortedMovies.sort(
            (a, b) => parseInt(b.Year) - parseInt(a.Year)
          );
        } else if (sortBy === "title") {
          sortedMovies = sortedMovies.sort((a, b) =>
            a.Title.localeCompare(b.Title)
          );
        }

        setMovies(sortedMovies);
        setTotalResults(parseInt(data.totalResults) || 0);
        setCurrentPage(page);
      } else {
        setMovies([]);
        setTotalResults(0);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      setMovies([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchMovieDetails = async (id) => {
    try {
      const response = await fetch(`${API_URL}&i=${id}&plot=full`);
      const data = await response.json();
      if (data.Response === "True") {
        setSelectedMovie(data);
      }
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };
  const submitHandler = (e) => {
    e.preventDefault();
    searchMovies(searchTerm, 1);
  };

  useEffect(() => {
    searchMovies("2025", 1);
  }, []);

  useEffect(() => {
    if (movies.length > 0) {
      let sorted = [...movies];
      if (sortBy === "year") {
        sorted = sorted.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
      } else if (sortBy === "title") {
        sorted = sorted.sort((a, b) => a.Title.localeCompare(b.Title));
      }
      setMovies(sorted);
    }
  }, [sortBy]);

  const totalPages = Math.ceil(totalResults / 10);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-16 bg-[#f5f5f7]">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl sm:text-6xl font-bold mb-3 text-gray-900 font-roboto tracking-tight">
          Film Villa
        </h1>
        <p className="text-gray-600 text-base font-raleway font-light">
          Discover your next favorite movie
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-16">
        <form onSubmit={submitHandler} className="relative">
          <div className="relative flex items-center bg-white rounded-lg border border-gray-300 transition-all duration-200 hover:border-gray-400 focus-within:border-gray-500 shadow-sm">
            <input
              type="text"
              placeholder="Search for movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent px-5 py-3.5 text-gray-900 placeholder-gray-500 outline-none font-raleway text-base"
            />
            <button
              type="submit"
              className="px-5 py-3.5 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      {/* Filters & Sort */}
      {!loading && movies.length > 0 && (
        <div className="max-w-7xl mx-auto mb-8 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {totalResults} results found
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600 font-raleway">
              Sort by:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 font-raleway text-sm focus:outline-none focus:border-gray-500 transition-colors"
            >
              <option value="year">Latest First</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>
      )}

      {/* Movies Grid */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-[2/3] rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : movies.length ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {movies?.map((movie, key) => (
                <MovieCard
                  key={key}
                  movie={movie}
                  onClick={() => fetchMovieDetails(movie.imdbID)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-16">
                <button
                  onClick={() =>
                    searchMovies(searchTerm || "batman", currentPage - 1)
                  }
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 font-raleway font-medium rounded-md border border-gray-300 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-all duration-200 shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <span className="text-gray-600 font-raleway text-sm px-4">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    searchMovies(searchTerm || "batman", currentPage + 1)
                  }
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 font-raleway font-medium rounded-md border border-gray-300 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-all duration-200 shadow-sm"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="text-center">
              <h2 className="text-xl text-gray-700 font-raleway font-medium mb-2">
                No movies found
              </h2>
              <p className="text-gray-500 font-raleway text-sm">
                Try searching for something else
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Movie Details Modal */}
      {selectedMovie && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
          onClick={() => setSelectedMovie(null)}
        >
          <div
            className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              {/* Close Button */}
              <button
                onClick={() => setSelectedMovie(null)}
                className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white text-gray-700 rounded-full p-2 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Movie Poster */}
              <div className="relative h-64 bg-gray-900 overflow-hidden rounded-t-xl">
                <img
                  src={
                    selectedMovie.Poster !== "N/A"
                      ? selectedMovie.Poster
                      : "https://via.placeholder.com/400x600/e5e7eb/6b7280?text=No+Poster"
                  }
                  alt={selectedMovie.Title}
                  className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h2 className="text-3xl font-bold text-white font-roboto mb-2">
                    {selectedMovie.Title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-200">
                    <span>{selectedMovie.Year}</span>
                    <span>•</span>
                    <span>{selectedMovie.Runtime}</span>
                    <span>•</span>
                    <span>{selectedMovie.Rated}</span>
                  </div>
                </div>
              </div>

              {/* Movie Details */}
              <div className="p-6 space-y-6">
                {/* Rating & Genre */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {selectedMovie.Genre?.split(", ").map((genre, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-raleway font-medium rounded-full"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                  {selectedMovie.imdbRating !== "N/A" && (
                    <div className="flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded-lg">
                      <svg
                        className="w-5 h-5 text-yellow-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-bold text-gray-900">
                        {selectedMovie.imdbRating}
                      </span>
                    </div>
                  )}
                </div>

                {/* Plot */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 font-roboto mb-2">
                    Plot
                  </h3>
                  <p className="text-gray-600 font-raleway leading-relaxed">
                    {selectedMovie.Plot}
                  </p>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedMovie.Director !== "N/A" && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 font-raleway mb-1">
                        Director
                      </h4>
                      <p className="text-gray-600 font-raleway text-sm">
                        {selectedMovie.Director}
                      </p>
                    </div>
                  )}
                  {selectedMovie.Actors !== "N/A" && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 font-raleway mb-1">
                        Cast
                      </h4>
                      <p className="text-gray-600 font-raleway text-sm">
                        {selectedMovie.Actors}
                      </p>
                    </div>
                  )}
                  {selectedMovie.Language !== "N/A" && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 font-raleway mb-1">
                        Language
                      </h4>
                      <p className="text-gray-600 font-raleway text-sm">
                        {selectedMovie.Language}
                      </p>
                    </div>
                  )}
                  {selectedMovie.Country !== "N/A" && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 font-raleway mb-1">
                        Country
                      </h4>
                      <p className="text-gray-600 font-raleway text-sm">
                        {selectedMovie.Country}
                      </p>
                    </div>
                  )}
                </div>

                {/* Box Office */}
                {selectedMovie.BoxOffice !== "N/A" && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900 font-raleway">
                        Box Office
                      </span>
                      <span className="text-sm text-gray-600 font-raleway">
                        {selectedMovie.BoxOffice}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default App;
